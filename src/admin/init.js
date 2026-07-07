import { getSupabase, isSupabaseConfigured } from "../lib/supabase.js";
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

/** Map Supabase Auth API errors to clearer copy (password grant often returns 400). */
function formatAuthError(err) {
  if (!err) return "Sign-in failed.";
  const m = String(err.message || err).trim();
  const lower = m.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return `${m} Check email/password, confirm the account if email confirmation is required, and ensure Email provider is enabled in Supabase.`;
  }
  if (lower.includes("email not confirmed")) {
    return `${m} Open the confirmation link from your inbox, or disable “Confirm email” for testing (Authentication → Providers → Email).`;
  }
  return m;
}

function setPanels({ config, auth, denied, app }) {
  show(el("panel-config"), config);
  show(el("panel-auth"), auth);
  show(el("panel-denied"), denied);
  show(el("panel-app"), app);
}

async function checkAdmin(supabase) {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) {
    console.error(error);
    return false;
  }
  return Boolean(data);
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

function renderOffers(rows, supabase, refreshData) {
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
      const { error } = await supabase.from("offers").delete().eq("id", o.id);
      if (error) {
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

function renderStories(rows, supabase, refreshData) {
  const tbody = el("tbody-stories");
  if (!tbody) return;
  tbody.replaceChildren();

  const sorted = [...(rows || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  if (sorted.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" class="admin-table__empty">No stories yet — click “Add story”.</td>`;
    tbody.appendChild(tr);
    return;
  }

  function clip(s, n) {
    const t = String(s || "").trim();
    if (!t) return "—";
    return t.length > n ? `${t.slice(0, n - 1)}…` : t;
  }

  for (const s of sorted) {
    const tr = document.createElement("tr");
    if (!s.is_active) tr.classList.add("admin-table__row--muted");
    tr.innerHTML = `
      <td class="admin-table__cell-title"></td>
      <td class="admin-table__mono"></td>
      <td class="admin-table__num admin-table__num--ep"></td>
      <td class="admin-table__mono admin-table__mono--pdf"></td>
      <td class="admin-table__num"></td>
      <td class="admin-table__bool"></td>
      <td class="admin-table__actions"></td>
    `;
    tr.querySelector(".admin-table__cell-title").textContent = s.title;
    tr.querySelector(".admin-table__mono").textContent = clip(s.series, 24);
    tr.querySelector(".admin-table__num--ep").textContent = s.episode != null ? String(s.episode) : "—";
    const pdfCell = tr.querySelector(".admin-table__mono--pdf");
    const pdf = String(s.pdf_url || "").trim();
    if (pdf) {
      const a = document.createElement("a");
      a.className = "admin-table__link";
      a.href = pdf;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = clip(pdf, 36);
      pdfCell.replaceChildren(a);
    } else {
      pdfCell.textContent = "—";
    }
    tr.querySelectorAll(".admin-table__num")[1].textContent = String(s.sort_order ?? 0);
    tr.querySelector(".admin-table__bool").textContent = s.is_active ? "Yes" : "No";

    const actions = tr.querySelector(".admin-table__actions");
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn--ghost btn--sm";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => openStoryDialog(s));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn--ghost btn--sm admin-btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", async () => {
      if (!confirm(`Delete story “${s.title}”?`)) return;
      const { error } = await supabase.from("stories").delete().eq("id", s.id);
      if (error) {
        flash(error.message, false);
        return;
      }
      flash("Story deleted.");
      await refreshData();
    });

    actions.append(editBtn, delBtn);
    tbody.appendChild(tr);
  }
}

function openStoryDialog(row) {
  const d = el("dlg-story");
  if (!d) return;
  el("dlg-story-title").textContent = row ? "Edit story" : "New story";
  el("story-id").value = row?.id || "";
  el("story-title-input").value = row?.title || "";
  el("story-desc").value = row?.description || "";
  el("story-pdf").value = row?.pdf_url || "";
  el("story-cover").value = row?.cover_url || "";
  el("story-series").value = row?.series || "";
  el("story-episode").value = row?.episode != null ? String(row.episode) : "";
  el("story-pages").value = row?.pages != null ? String(row.pages) : "";
  el("story-slug").value = row?.slug || "";
  el("story-meta-title").value = row?.meta_title || "";
  el("story-meta-desc").value = row?.meta_description || "";
  el("story-tags").value = row?.tags || "";
  el("story-sort").value = row != null ? String(row.sort_order ?? 0) : "0";
  el("story-active").checked = row ? Boolean(row.is_active) : true;
  d.showModal();
}

function closeStoryDialog() {
  el("dlg-story")?.close();
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

  async function refreshData(supabase) {
    const [settingsRes, offersRes, storiesRes, contactsRes] = await Promise.all([
      supabase.from("site_settings").select("key, value"),
      supabase
        .from("offers")
        .select(
          "id, title, description, href, video_url, poster_url, slug, meta_title, meta_description, tags, category, sort_order, is_active"
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("stories")
        .select(
          "id, title, slug, description, series, episode, cover_url, pdf_url, pages, tags, category, meta_title, meta_description, sort_order, is_active"
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    if (settingsRes.error) flash(settingsRes.error.message, false);
    else fillSettings(settingsRes.data);

    if (offersRes.error) flash(offersRes.error.message, false);
    else renderOffers(offersRes.data, supabase, () => refreshData(supabase));

    if (storiesRes.error) {
      const tbody = el("tbody-stories");
      const hint = storiesRes.error.message?.includes("stories")
        ? `${storiesRes.error.message} — run supabase/migrations/009_stories.sql in the SQL Editor.`
        : storiesRes.error.message;
      if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="admin-table__empty"></td></tr>`;
      const cell = tbody?.querySelector(".admin-table__empty");
      if (cell) cell.textContent = hint;
    } else {
      renderStories(storiesRes.data, supabase, () => refreshData(supabase));
    }

    if (contactsRes.error) {
      const tbody = el("tbody-contacts");
      if (tbody) tbody.innerHTML = `<tr><td colspan="3" class="admin-table__empty">${contactsRes.error.message}</td></tr>`;
    } else renderContacts(contactsRes.data);
  }

  async function routeUi(supabase) {
    const emailSpan = el("admin-email");
    const btnOut = el("btn-logout");

    if (!isSupabaseConfigured()) {
      setPanels({ config: true, auth: false, denied: false, app: false });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setPanels({ config: false, auth: true, denied: false, app: false });
      show(emailSpan, false);
      show(btnOut, false);
      return;
    }

    emailSpan.textContent = session.user.email || session.user.id;
    show(emailSpan, true);
    show(btnOut, true);

    const admin = await checkAdmin(supabase);
    if (!admin) {
      setPanels({ config: false, auth: false, denied: true, app: false });
      return;
    }

    setPanels({ config: false, auth: false, denied: false, app: true });
    flash("");
    await refreshData(supabase);
  }

  if (!isSupabaseConfigured()) {
    setPanels({ config: true, auth: false, denied: false, app: false });
    return () => controller.abort();
  }

  const supabase = getSupabase();

  supabase.auth.onAuthStateChange(() => {
    routeUi(supabase);
  });

  el("form-login")?.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email") || "").trim();
      const password = String(fd.get("password") || "");
      flashAuth("");
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) flashAuth(formatAuthError(error), false);
      else flashAuth("Signed in.");
      await routeUi(supabase);
    },
    { signal }
  );

  el("btn-logout")?.addEventListener(
    "click",
    async () => {
      await supabase.auth.signOut();
      flashAuth("");
      await routeUi(supabase);
    },
    { signal }
  );

  el("btn-denied-out")?.addEventListener(
    "click",
    async () => {
      await supabase.auth.signOut();
      await routeUi(supabase);
    },
    { signal }
  );

  el("form-settings")?.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const rows = collectSettings();
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) {
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

        const { data, error } = await supabase.storage
          .from("cover-images")
          .upload(filename, file, { upsert: false, contentType: file.type });

        if (error) {
          console.error("Upload error:", error);
          let msg = error.message;
          if (error.message?.includes("404")) {
            msg =
              "Storage bucket 'cover-images' not found. Create it in Supabase → Storage → New Bucket (name: cover-images, make public).";
          } else if (error.message?.includes("403")) {
            msg = "Permission denied. Check Storage RLS policies.";
          } else if (error.message?.includes("400")) {
            msg = "Bad request. Check bucket exists and is public.";
          }
          flash(msg, false);
          return;
        }

        const { data: publicData } = supabase.storage.from("cover-images").getPublicUrl(data.path);

        if (publicData?.publicUrl) {
          el("offer-poster").value = publicData.publicUrl;
          flash("Image uploaded successfully!");
        } else {
          flash("Upload succeeded but could not generate public URL.", false);
        }
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

      let error;
      if (id) {
        const res = await supabase.from("offers").update(payload).eq("id", id);
        error = res.error;
      } else {
        const res = await supabase.from("offers").insert(payload);
        error = res.error;
      }

      if (error) {
        flash(error.message, false);
        return;
      }
      closeOfferDialog();
      flash(id ? "Video updated." : "Video added.");
      await refreshData(supabase);
    },
    { signal }
  );

  el("btn-story-new")?.addEventListener("click", () => openStoryDialog(null), { signal });

  el("story-slug-gen")?.addEventListener(
    "click",
    () => {
      const t = el("story-title-input")?.value || "";
      el("story-slug").value = slugifyOfferText(t);
    },
    { signal }
  );

  el("story-cancel")?.addEventListener("click", () => closeStoryDialog(), { signal });

  el("form-story")?.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      const id = el("story-id").value.trim();
      const slugRaw = el("story-slug").value.trim().toLowerCase();
      const slug = slugRaw ? slugifyOfferText(slugRaw) : null;
      const episodeRaw = el("story-episode").value.trim();
      const pagesRaw = el("story-pages").value.trim();
      const payload = {
        title: el("story-title-input").value.trim(),
        description: el("story-desc").value.trim() || null,
        pdf_url: el("story-pdf").value.trim(),
        cover_url: el("story-cover").value.trim() || null,
        series: el("story-series").value.trim() || null,
        episode: episodeRaw ? Number(episodeRaw) : null,
        pages: pagesRaw ? Number(pagesRaw) : null,
        slug,
        meta_title: el("story-meta-title").value.trim() || null,
        meta_description: el("story-meta-desc").value.trim() || null,
        tags: el("story-tags").value.trim() || null,
        sort_order: Number(el("story-sort").value) || 0,
        is_active: el("story-active").checked,
      };

      let error;
      if (id) {
        const res = await supabase.from("stories").update(payload).eq("id", id);
        error = res.error;
      } else {
        const res = await supabase.from("stories").insert(payload);
        error = res.error;
      }

      if (error) {
        flash(error.message, false);
        return;
      }
      closeStoryDialog();
      flash(id ? "Story updated." : "Story added.");
      await refreshData(supabase);
    },
    { signal }
  );

  routeUi(supabase);

  return () => controller.abort();
}
