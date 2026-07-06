/**
 * Auth Modal — Sign Up & Login
 * Uses Supabase auth. Extra fields (username, phone) stored in public.profiles.
 */
import { getSupabase, isSupabaseConfigured } from "./supabase.js";

// ─── helpers ───────────────────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function showMsg(el, text, isError = true) {
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? "#e50914" : "#4caf50";
  el.style.display = text ? "block" : "none";
}

// ─── header state ──────────────────────────────────────────────────────────

async function refreshHeaderAuth() {
  const supabase = getSupabase();
  const signupBtns = document.querySelectorAll(".tube-auth__signup");
  const loginBtns  = document.querySelectorAll(".tube-auth__login");
  const userBtns   = document.querySelectorAll(".tube-auth__user");

  if (!supabase) return;

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // Fetch username
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", session.user.id)
      .single();

    const username = profile?.username || session.user.email.split("@")[0];

    signupBtns.forEach(el => { el.style.display = "none"; });
    loginBtns.forEach(el => { el.style.display = "none"; });
    userBtns.forEach(el => {
      el.style.display = "inline-flex";
      el.textContent = username;
    });
  } else {
    signupBtns.forEach(el => { el.style.display = ""; });
    loginBtns.forEach(el => { el.style.display = ""; });
    userBtns.forEach(el => { el.style.display = "none"; });
  }
}

// ─── modal HTML ────────────────────────────────────────────────────────────

function createModal() {
  if ($("auth-modal")) return;

  const modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "auth-modal-title");
  modal.innerHTML = `
    <div class="auth-modal__backdrop" id="auth-modal-backdrop"></div>
    <div class="auth-modal__card">
      <button class="auth-modal__close" id="auth-modal-close" aria-label="Close">&times;</button>

      <div class="auth-modal__tabs">
        <button class="auth-modal__tab auth-modal__tab--active" data-tab="login" id="auth-tab-login">Login</button>
        <button class="auth-modal__tab" data-tab="signup" id="auth-tab-signup">Sign Up</button>
      </div>

      <!-- LOGIN FORM -->
      <form class="auth-modal__form" id="auth-form-login" novalidate>
        <h2 class="auth-modal__title" id="auth-modal-title">Welcome back</h2>

        <div class="auth-modal__field">
          <label for="auth-login-email">Email</label>
          <input id="auth-login-email" type="email" autocomplete="email" placeholder="you@example.com" required />
        </div>
        <div class="auth-modal__field">
          <label for="auth-login-password">Password</label>
          <input id="auth-login-password" type="password" autocomplete="current-password" placeholder="Password" required />
        </div>
        <p class="auth-modal__msg" id="auth-login-msg"></p>
        <button type="submit" class="auth-modal__btn" id="auth-login-submit">Login</button>
        <p class="auth-modal__switch">
          No account? <a href="#" id="auth-switch-to-signup">Sign up</a>
        </p>
      </form>

      <!-- SIGNUP FORM -->
      <form class="auth-modal__form auth-modal__form--hidden" id="auth-form-signup" novalidate>
        <h2 class="auth-modal__title">Create account</h2>

        <div class="auth-modal__field">
          <label for="auth-signup-username">Username</label>
          <input id="auth-signup-username" type="text" autocomplete="username" placeholder="Choose a username" required />
        </div>
        <div class="auth-modal__field">
          <label for="auth-signup-email">Email</label>
          <input id="auth-signup-email" type="email" autocomplete="email" placeholder="you@example.com" required />
        </div>
        <div class="auth-modal__field">
          <label for="auth-signup-phone">Phone number</label>
          <input id="auth-signup-phone" type="tel" autocomplete="tel" placeholder="+1 555 000 0000" />
        </div>
        <div class="auth-modal__field">
          <label for="auth-signup-password">Password</label>
          <input id="auth-signup-password" type="password" autocomplete="new-password" placeholder="Min 8 characters" required />
        </div>
        <div class="auth-modal__field">
          <label for="auth-signup-confirm">Confirm password</label>
          <input id="auth-signup-confirm" type="password" autocomplete="new-password" placeholder="Repeat password" required />
        </div>
        <p class="auth-modal__msg" id="auth-signup-msg"></p>
        <button type="submit" class="auth-modal__btn" id="auth-signup-submit">Create Account</button>
        <p class="auth-modal__switch">
          Already have an account? <a href="#" id="auth-switch-to-login">Login</a>
        </p>
      </form>

      <!-- LOGGED IN STATE -->
      <div class="auth-modal__loggedin auth-modal__form--hidden" id="auth-loggedin-panel">
        <h2 class="auth-modal__title">You're logged in</h2>
        <p class="auth-modal__welcome" id="auth-welcome-name"></p>
        <button class="auth-modal__btn auth-modal__btn--outline" id="auth-logout-btn">Logout</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ─── modal open/close ──────────────────────────────────────────────────────

export function openAuthModal(tab = "login") {
  createModal();
  switchTab(tab);
  $("auth-modal").classList.add("auth-modal--open");
  document.body.style.overflow = "hidden";
}

function closeAuthModal() {
  const m = $("auth-modal");
  if (m) m.classList.remove("auth-modal--open");
  document.body.style.overflow = "";
}

function switchTab(tab) {
  const loginForm  = $("auth-form-login");
  const signupForm = $("auth-form-signup");
  const loggedIn   = $("auth-loggedin-panel");
  const tabLogin   = $("auth-tab-login");
  const tabSignup  = $("auth-tab-signup");

  [loginForm, signupForm, loggedIn].forEach(el => el?.classList.add("auth-modal__form--hidden"));
  [tabLogin, tabSignup].forEach(el => el?.classList.remove("auth-modal__tab--active"));

  if (tab === "signup") {
    signupForm?.classList.remove("auth-modal__form--hidden");
    tabSignup?.classList.add("auth-modal__tab--active");
  } else if (tab === "loggedin") {
    loggedIn?.classList.remove("auth-modal__form--hidden");
  } else {
    loginForm?.classList.remove("auth-modal__form--hidden");
    tabLogin?.classList.add("auth-modal__tab--active");
  }
}

// ─── form logic ────────────────────────────────────────────────────────────

async function handleLogin(e) {
  e.preventDefault();
  const supabase = getSupabase();
  if (!supabase) return showMsg($("auth-login-msg"), "Auth not configured.");

  const email    = $("auth-login-email").value.trim();
  const password = $("auth-login-password").value;
  const btn      = $("auth-login-submit");

  if (!email || !password) return showMsg($("auth-login-msg"), "Please fill in all fields.");

  btn.disabled = true;
  btn.textContent = "Logging in…";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  btn.disabled = false;
  btn.textContent = "Login";

  if (error) return showMsg($("auth-login-msg"), error.message);

  showMsg($("auth-login-msg"), "Logged in!", false);
  setTimeout(() => {
    closeAuthModal();
    refreshHeaderAuth();
  }, 700);
}

async function handleSignup(e) {
  e.preventDefault();
  const supabase = getSupabase();
  if (!supabase) return showMsg($("auth-signup-msg"), "Auth not configured.");

  const username  = $("auth-signup-username").value.trim();
  const email     = $("auth-signup-email").value.trim();
  const phone     = $("auth-signup-phone").value.trim();
  const password  = $("auth-signup-password").value;
  const confirm   = $("auth-signup-confirm").value;
  const btn       = $("auth-signup-submit");
  const msgEl     = $("auth-signup-msg");

  if (!username) return showMsg(msgEl, "Username is required.");
  if (!email)    return showMsg(msgEl, "Email is required.");
  if (password.length < 8) return showMsg(msgEl, "Password must be at least 8 characters.");
  if (password !== confirm) return showMsg(msgEl, "Passwords do not match.");

  btn.disabled = true;
  btn.textContent = "Creating account…";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, phone },
    },
  });

  if (error) {
    btn.disabled = false;
    btn.textContent = "Create Account";
    return showMsg(msgEl, error.message);
  }

  // Also upsert into profiles table directly (in case trigger isn't set up yet)
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      username,
      phone: phone || null,
    });
  }

  btn.disabled = false;
  btn.textContent = "Create Account";

  const needsConfirm = !data.session;
  if (needsConfirm) {
    showMsg(msgEl, "Account created! Check your email to confirm.", false);
  } else {
    showMsg(msgEl, "Account created! Welcome.", false);
    setTimeout(() => {
      closeAuthModal();
      refreshHeaderAuth();
    }, 900);
  }
}

// ─── init ──────────────────────────────────────────────────────────────────

export function initAuthModal() {
  if (!isSupabaseConfigured()) return;

  // Inject user button into every .tube-auth block (shown when logged in)
  document.querySelectorAll(".tube-auth").forEach(bar => {
    if (bar.querySelector(".tube-auth__user")) return;
    const userBtn = document.createElement("button");
    userBtn.className = "tube-auth__user";
    userBtn.style.display = "none";
    userBtn.addEventListener("click", () => {
      createModal();
      // Show logged-in panel
      getSupabase().from("profiles").select("username").eq("id", "_").single(); // warm up
      getSupabase().auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        getSupabase().from("profiles").select("username").eq("id", session.user.id).single()
          .then(({ data: profile }) => {
            const uname = profile?.username || session.user.email.split("@")[0];
            if ($("auth-welcome-name")) $("auth-welcome-name").textContent = `Hi, ${uname}!`;
            switchTab("loggedin");
            $("auth-modal").classList.add("auth-modal--open");
            document.body.style.overflow = "hidden";
          });
      });
    });
    bar.prepend(userBtn);
  });

  // Wire signup/login header buttons to open modal instead of navigating
  document.querySelectorAll(".tube-auth__signup").forEach(el => {
    el.addEventListener("click", (e) => { e.preventDefault(); openAuthModal("signup"); });
  });
  document.querySelectorAll(".tube-auth__login").forEach(el => {
    el.addEventListener("click", (e) => { e.preventDefault(); openAuthModal("login"); });
  });

  // Build modal and wire up events (lazy — first open creates DOM)
  // But attach close/tab/form handlers after first creation
  document.addEventListener("click", (e) => {
    const modal = $("auth-modal");
    if (!modal) return;

    if (e.target.id === "auth-modal-backdrop" || e.target.id === "auth-modal-close") {
      closeAuthModal();
    }
    if (e.target.id === "auth-switch-to-signup") { e.preventDefault(); switchTab("signup"); }
    if (e.target.id === "auth-switch-to-login")  { e.preventDefault(); switchTab("login");  }
    if (e.target.id === "auth-tab-login")  switchTab("login");
    if (e.target.id === "auth-tab-signup") switchTab("signup");
    if (e.target.id === "auth-logout-btn") {
      getSupabase().auth.signOut().then(() => {
        closeAuthModal();
        refreshHeaderAuth();
      });
    }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.id === "auth-form-login")  handleLogin(e);
    if (e.target.id === "auth-form-signup") handleSignup(e);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAuthModal();
  });

  // Set initial header state
  refreshHeaderAuth();

  // Keep header in sync on auth change
  getSupabase().auth.onAuthStateChange(() => refreshHeaderAuth());
}
