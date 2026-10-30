import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { getDb, getFirebaseAuth, getFirebaseStorage, isFirebaseConfigured } from "../lib/firebase.js";
import { slugifyOfferText } from "../lib/site-data.js";
import { mountOfferTaxonomy } from "../lib/offer-taxonomy.js";

const SETTING_KEYS = [
  "site_name",
  "hero_title",
  "hero_lead",
  "primary_cta",
  "secondary_cta",
  "primary_cta_label",
  "secondary_cta_label",
];

const el = (id) => document.getElementById(id);

function show(node, on) {
  if (!node) return;
  node.hidden = !on;
}

function flash(msg, ok = true) {
  const box = el("app-msg");
  if (!box) return;
  box.hidden = !msg;
  box.textContent = msg || "";
  box.className = `admin-msg admin-msg--${ok ? "ok" : "err"}`;
}

function flashAuth(msg, ok = true) {
  const box = el("auth-msg");
  if (!box) return;
  box.hidden = !msg;
  box.textContent = msg || "";
  box.className = `admin-msg admin-msg--${ok ? "ok" : "err"}`;
}

/** Map Firebase Auth errors to clearer copy. */
function formatAuthError(err) {
  const code = String(err?.code || "");
  if (
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password" ||
    code === "auth/user-not-found" ||
    code === "auth/invalid-email"
  ) {
    return "Invalid email or password. Check that the Email/Password provider is enabled in Firebase → Authentication → Sign-in method.";
  }
  if (code === "auth/too-many-requests") return "Too many attempts. Please try again later.";
  return String(err?.message || err || "Sign-in failed.").trim();
}

function setPanels({ config, auth, denied, app }) {
  show(el("panel-config"), config);
  show(el("panel-auth"), auth);
  show(el("panel-denied"), denied);
  show(el("panel-app"), app);
}

async function checkAdmin(user) {
  try {
    const snap = await getDoc(doc(getDb(), "site_admins", user.uid));
    return snap.exists();
  } catch (error) {
    console.error(error);
    return false;
  }
}

function fillSettings(rows) {
  const map = {};
  for (const r of rows || []) map[r.key] = r.value;
  for (const key of SETTING_KEYS) {
    const input = document.querySelector(`[data-setting-key="${key}"]`);
    if (input) input.value = map[key] ?? "";
  }
}

function collectSettings() {
  return SETTING_KEYS.map((key) => {
    const input = document.querySelector(`[data-setting-key="${key}"]`);
    return { key, value: input ? String(input.value || "").trim() : "" };
  });
}

/** @type {ReturnType<typeof mountOfferTaxonomy> | null} */
let offerTaxonomyUi = null;

function ensureOfferTaxonomy() {
  const host = el("offer-taxonomy-host");
  if (!host || offerTaxonomyUi) return offerTaxonomyUi;
  offerTaxonomyUi = mountOfferTaxonomy(host, {});
  return offerTaxonomyUi;
}

function renderOffers(rows, refreshData) {
  const tbody = el("tbody-offers");
  if (!tbody) return;
  tbody.replaceChildren();

  const sorted = [...(rows || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  if (sorted.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" class="admin-table__empty">No rows yet — click “Add video”.</td>`;
    tbody.appendChild(tr);
    return;
  }

  function clip(s, n) {
    const t = String(s || "").trim();
    if (!t) return "—";
    return t.length > n ? `${t.slice(0, n - 1)}…` : t;
  }

  for (const o of sorted) {
    const tr = document.createElement("tr");
    if (!o.is_active) tr.classList.add("admin-table__row--muted");
    tr.innerHTML = `
      <td class="admin-table__cell-title"></td>
      <td class="admin-table__mono"></td>
      <td class="admin-table__mono"></td>
      <td class="admin-table__num"></td>
      <td class="admin-table__bool"></td>
      <td class="admin-table__actions"></td>
    `;
    tr.querySelector(".admin-table__cell-title").textContent = o.title;
    const cells = tr.querySelectorAll(".admin-table__mono");
    cells[0].textContent = clip(o.video_url, 40);
    const href = String(o.href || "").trim();
    if (href) {
      const a = document.createElement("a");
      a.className = "admin-table__link";
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = clip(href, 36);
      cells[1].replaceChildren(a);
    } else {
      cells[1].textContent = "—";
    }
    tr.querySelector(".admin-table__num").textContent = String(o.sort_order ?? 0);
    tr.querySelector(".admin-table__bool").textContent = o.is_active ? "Yes" : "No";

    const actions = tr.querySelector(".admin-table__actions");
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn--ghost btn--sm";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openOfferDialog(o));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn--ghost btn--sm admin-btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", async () => {
      if (!confirm(`Delete video “${o.title}”?`)) return;
      try {
        await deleteDoc(doc(getDb(), "offers", o.id));
      } catch (error) {
        flash(error.message, false);
        return;
      }
      flash("Video deleted.");
      await refreshData();
    });

    actions.append(editBtn, delBtn);
    tbody.appendChild(tr);
  }
}

function renderContacts(rows) {
  const tbody = el("tbody-contacts");
  if (!tbody) return;
  tbody.replaceChildren();
  const list = [...(rows || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 100);

  for (const c of list) {
    const tr = document.createElement("tr");
    const when = c.created_at ? new Date(c.created_at).toLocaleString() : "";
    const from = [c.name, c.email].filter(Boolean).join(" · ") || "—";
    tr.innerHTML = `
      <td class="admin-table__date"></td>
      <td class="admin-table__from"></td>
      <td class="admin-table__msg"></td>
    `;
    tr.querySelector(".admin-table__date").textContent = when;
    tr.querySelector(".admin-table__from").textContent = from;
    tr.querySelector(".admin-table__msg").textContent = c.message || "";
    tbody.appendChild(tr);
  }
}

function openOfferDialog(row) {
  const d = el("dlg-offer");
  if (!d) return;
  const tax = ensureOfferTaxonomy();
  el("dlg-offer-title").textContent = row ? "Edit video" : "New video";
  el("offer-id").value = row?.id || "";
  el("offer-title").value = row?.title || "";
  el("offer-desc").value = row?.description || "";
  el("offer-video").value = row?.video_url || "";
  el("offer-poster").value = row?.poster_url || "";
  el("offer-href").value = row?.href || "";
  el("offer-sort").value = row != null ? String(row.sort_order ?? 0) : "0";
  el("offer-active").checked = row ? Boolean(row.is_active) : true;
  el("offer-slug").value = row?.slug || "";
  el("offer-meta-title").value = row?.meta_title || "";
  el("offer-meta-desc").value = row?.meta_description || "";
  if (tax) {
    if (row) {
      const legacy = [row.category, row.tags]
        .map((s) => String(s || "").trim())
        .filter(Boolean)
        .join(", ");
      tax.setFromCsv(legacy);
    } else {
      tax.clear();
    }
  }
  d.showModal();
}

function closeOfferDialog() {
  el("dlg-offer")?.close();
}

/** Mounts the admin dashboard's imperative logic against the already-rendered DOM. Returns a cleanup fn. */
export function initAdminPage() {
  const controller = new AbortController();
  const { signal } = controller;

  async function refreshData() {
    const db = getDb();
    const [settingsRes, offersRes, contactsRes] = await Promise.allSettled([
      getDocs(collection(db, "site_settings")),
      getDocs(query(collection(db, "offers"), orderBy("sort_order", "asc"))),
      getDocs(query(collection(db, "contact_messages"), orderBy("created_at", "desc"), limit(100))),
    ]);

    if (settingsRes.status === "rejected") flash(settingsRes.reason.message, false);
    else fillSettings(settingsRes.value.docs.map((d) => ({ key: d.id, value: d.data().value })));

    if (offersRes.status === "rejected") flash(offersRes.reason.message, false);
    else renderOffers(offersRes.value.docs.map((d) => ({ id: d.id, ...d.data() })), refreshData);

    if (contactsRes.status === "rejected") {
      const tbody = el("tbody-contacts");
      if (tbody) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.className = "admin-table__empty";
        td.textContent = contactsRes.reason.message;
        tr.appendChild(td);
        tbody.replaceChildren(tr);
      }
    } else renderContacts(contactsRes.value.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function routeUi(user) {
    const emailSpan = el("admin-email");
    const btnOut = el("btn-logout");

    if (!user) {
      setPanels({ config: false, auth: true, denied: false, app: false });
      show(emailSpan, false);
      show(btnOut, false);
      return;
    }

    emailSpan.textContent = user.email || user.uid;
    show(emailSpan, true);
    show(btnOut, true);

    const admin = await checkAdmin(user);
    if (!admin) {
      const uidEl = el("denied-uid");
      if (uidEl) uidEl.textContent = user.uid;
      setPanels({ config: false, auth: false, denied: true, app: false });
      return;
    }

    setPanels({ config: false, auth: false, denied: false, app: true });
    flash("");
    await refreshData();
  }

  const auth = getFirebaseAuth();
  if (!isFirebaseConfigured() || !auth) {
    setPanels({ config: true, auth: false, denied: false, app: false });
    return () => controller.abort();
  }

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    routeUi(user);
  });

  el("form-login")?.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email") || "").trim();
      const password = String(fd.get("password") || "");
      flashAuth("");
      try {
        await signInWithEmailAndPassword(auth, email, password);
        flashAuth("Signed in.");
      } catch (error) {
        flashAuth(formatAuthError(error), false);
      }
    },
    { signal }
  );

  el("btn-logout")?.addEventListener(
    "click",
    async () => {
      await signOut(auth);
      flashAuth("");
    },
    { signal }
  );

  el("btn-denied-out")?.addEventListener(
    "click",
    async () => {
      await signOut(auth);
    },
    { signal }
  );

  el("form-settings")?.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const rows = collectSettings();
      try {
        const batch = writeBatch(getDb());
        for (const r of rows) batch.set(doc(getDb(), "site_settings", r.key), { value: r.value });
        await batch.commit();
      } catch (error) {
        flash(error.message, false);
        return;
      }
      flash("Site settings saved.");
    },
    { signal }
  );

  el("btn-offer-new")?.addEventListener("click", () => openOfferDialog(null), { signal });

  el("offer-slug-gen")?.addEventListener(
    "click",
    () => {
      const t = el("offer-title")?.value || "";
      el("offer-slug").value = slugifyOfferText(t);
    },
    { signal }
  );

  el("offer-cancel")?.addEventListener("click", () => closeOfferDialog(), { signal });

  el("offer-poster-upload")?.addEventListener(
    "click",
    async () => {
      const fileInput = el("offer-poster-file");
      const file = fileInput?.files?.[0];
      if (!file) {
        flash("Please select an image file.", false);
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        flash("Image must be smaller than 5 MB.", false);
        return;
      }

      const uploadBtn = el("offer-poster-upload");
      uploadBtn.disabled = true;
      uploadBtn.textContent = "Uploading...";
      flash("Uploading image...");

      try {
        const timestamp = Date.now();
        const sanitized = file.name.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
        const filename = `posters/${timestamp}-${sanitized}`;

        const fileRef = storageRef(getFirebaseStorage(), filename);
        await uploadBytes(fileRef, file, { contentType: file.type });
        el("offer-poster").value = await getDownloadURL(fileRef);
        flash("Image uploaded successfully!");
      } catch (err) {
        console.error("Upload exception:", err);
        flash(`Upload error: ${err.message}`, false);
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload";
        fileInput.value = "";
      }
    },
    { signal }
  );

  el("form-offer")?.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const tax = ensureOfferTaxonomy();
      const id = el("offer-id").value.trim();
      const slugRaw = el("offer-slug").value.trim().toLowerCase();
      const slug = slugRaw ? slugifyOfferText(slugRaw) : null;
      const tagsCsv = tax?.getCsv() || "";
      const payload = {
        title: el("offer-title").value.trim(),
        description: el("offer-desc").value.trim() || null,
        video_url: el("offer-video").value.trim() || null,
        poster_url: el("offer-poster").value.trim() || null,
        href: el("offer-href").value.trim() || null,
        slug,
        meta_title: el("offer-meta-title").value.trim() || null,
        meta_description: el("offer-meta-desc").value.trim() || null,
        category: null,
        tags: tagsCsv || null,
        sort_order: Number(el("offer-sort").value) || 0,
        is_active: el("offer-active").checked,
      };

      try {
        if (id) await updateDoc(doc(getDb(), "offers", id), payload);
        else await addDoc(collection(getDb(), "offers"), payload);
      } catch (error) {
        flash(error.message, false);
        return;
      }
      closeOfferDialog();
      flash(id ? "Video updated." : "Video added.");
      await refreshData();
    },
    { signal }
  );

  return () => {
    unsubscribeAuth();
    controller.abort();
  };
}
