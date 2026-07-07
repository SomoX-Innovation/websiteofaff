"use client";

import { useEffect } from "react";
import { initAdminPage } from "../admin/init.js";

export default function AdminApp() {
  useEffect(() => {
    const cleanup = initAdminPage();
    return cleanup;
  }, []);

  return (
    <>
      <header className="site-header admin-header">
        <div className="wrap site-header__inner">
          <a href="/" className="logo">
            ← View site
          </a>
          <div className="admin-header__actions">
            <span id="admin-email" className="admin-header__email" hidden />
            <button type="button" className="btn btn--ghost btn--sm" id="btn-logout" hidden>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="wrap admin-main">
        <div id="panel-config" className="admin-banner" hidden>
          <strong>Supabase not configured.</strong> Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then restart <code>npm run dev</code>.
        </div>

        <div id="panel-auth" className="admin-card admin-card--auth" hidden>
          <h1 className="admin-card__title">Admin sign in</h1>
          <form id="form-login" className="admin-form">
            <label className="field">
              <span className="field__label">Email</span>
              <input type="email" name="email" className="field__input" required autoComplete="username" />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input type="password" name="password" className="field__input" required autoComplete="current-password" />
            </label>
            <button type="submit" className="btn btn--primary" id="btn-login">
              Sign in with password
            </button>
          </form>
          <p id="auth-msg" className="admin-msg" role="status" hidden />
        </div>

        <div id="panel-denied" className="admin-card admin-card--warn" hidden>
          <h1 className="admin-card__title">Not authorized</h1>
          <p>
            This account is not in <code>site_admins</code>. In Supabase SQL Editor run (use your user id from
            Authentication → Users):
          </p>
          <pre className="admin-code">insert into public.site_admins (user_id) values (&apos;YOUR-USER-UUID&apos;);</pre>
          <button type="button" className="btn btn--ghost" id="btn-denied-out">
            Sign out
          </button>
        </div>

        <div id="panel-app" hidden>
          <h1 className="admin-page-title">Site &amp; videos</h1>

          <p id="app-msg" className="admin-msg" role="status" hidden />

          <section className="admin-section">
            <h2 className="admin-section__title">Site &amp; hero</h2>
            <form id="form-settings" className="admin-grid-form">
              <label className="field">
                <span className="field__label">Site name</span>
                <input type="text" name="site_name" className="field__input" data-setting-key="site_name" />
              </label>
              <label className="field field--full">
                <span className="field__label">Hero title</span>
                <input type="text" name="hero_title" className="field__input" data-setting-key="hero_title" />
              </label>
              <label className="field field--full">
                <span className="field__label">Hero lead</span>
                <textarea
                  name="hero_lead"
                  className="field__input field__input--area"
                  rows={3}
                  data-setting-key="hero_lead"
                />
              </label>
              <label className="field field--full">
                <span className="field__label">Primary CTA URL</span>
                <input
                  type="text"
                  name="primary_cta"
                  className="field__input"
                  data-setting-key="primary_cta"
                  placeholder="https://…"
                />
              </label>
              <label className="field">
                <span className="field__label">Primary button label</span>
                <input type="text" name="primary_cta_label" className="field__input" data-setting-key="primary_cta_label" />
              </label>
              <label className="field field--full">
                <span className="field__label">Secondary CTA URL</span>
                <input
                  type="text"
                  name="secondary_cta"
                  className="field__input"
                  data-setting-key="secondary_cta"
                  placeholder="https://…"
                />
              </label>
              <label className="field">
                <span className="field__label">Secondary button label</span>
                <input
                  type="text"
                  name="secondary_cta_label"
                  className="field__input"
                  data-setting-key="secondary_cta_label"
                />
              </label>
              <div className="admin-form-actions field--full">
                <button type="submit" className="btn btn--primary">
                  Save site settings
                </button>
              </div>
            </form>
          </section>

          <section className="admin-section">
            <div className="admin-section__head">
              <h2 className="admin-section__title">Videos (public grid)</h2>
              <button type="button" className="btn btn--primary btn--sm" id="btn-offer-new">
                Add video
              </button>
            </div>
            <p className="admin-section__hint">
              The homepage only shows rows that are <strong>Active</strong> and have a <strong>Video URL</strong>.
              Use <strong>Slug</strong> and meta fields for cleaner watch URLs and better search snippets (run{" "}
              <code>supabase/migrations/005_offer_seo.sql</code> if those columns are missing).
            </p>
            <div className="admin-table-wrap">
              <table className="admin-table" id="table-offers">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Video</th>
                    <th>Link</th>
                    <th>Order</th>
                    <th>Active</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="tbody-offers" />
              </table>
            </div>
          </section>

          <section className="admin-section">
            <div className="admin-section__head">
              <h2 className="admin-section__title">PDF stories (/stories)</h2>
              <button type="button" className="btn btn--primary btn--sm" id="btn-story-new">
                Add story
              </button>
            </div>
            <p className="admin-section__hint">
              Episodic PDF comics/stories. Paste full <strong>https://…</strong> URLs for the PDF and cover image.
              Rows need <strong>Active</strong> + a <strong>PDF URL</strong> to appear on <code>/stories</code> (run{" "}
              <code>supabase/migrations/009_stories.sql</code> if the table is missing).
            </p>
            <div className="admin-table-wrap">
              <table className="admin-table" id="table-stories">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Series</th>
                    <th>Ep.</th>
                    <th>PDF</th>
                    <th>Order</th>
                    <th>Active</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="tbody-stories" />
              </table>
            </div>
          </section>

          <section className="admin-section">
            <h2 className="admin-section__title">Contact messages</h2>
            <div className="admin-table-wrap">
              <table className="admin-table admin-table--contacts" id="table-contacts">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody id="tbody-contacts" />
              </table>
            </div>
          </section>
        </div>
      </main>

      <dialog id="dlg-offer" className="admin-dialog admin-dialog--wide">
        <form id="form-offer" className="admin-dialog__inner">
          <h3 className="admin-dialog__title" id="dlg-offer-title">
            Video
          </h3>
          <input type="hidden" name="id" id="offer-id" />
          <label className="field">
            <span className="field__label">Title</span>
            <input type="text" name="title" className="field__input" required maxLength={200} id="offer-title" />
          </label>
          <label className="field">
            <span className="field__label">Description</span>
            <textarea
              name="description"
              className="field__input field__input--area"
              rows={3}
              maxLength={2000}
              id="offer-desc"
            />
          </label>
          <fieldset className="admin-fieldset">
            <legend className="admin-fieldset__legend">SEO (optional)</legend>
            <label className="field">
              <span className="field__label">URL slug</span>
              <div className="field__row">
                <input
                  type="text"
                  name="slug"
                  className="field__input"
                  maxLength={120}
                  id="offer-slug"
                  placeholder="my-video-title"
                  autoComplete="off"
                />
                <button type="button" className="btn btn--ghost btn--sm" id="offer-slug-gen">
                  From title
                </button>
              </div>
              <span className="field__hint">
                Lowercase letters, numbers, hyphens only. Must be unique. Watch link becomes{" "}
                <code>/watch/&lt;slug&gt;</code> instead of an id-based URL.
              </span>
            </label>
            <label className="field">
              <span className="field__label">Meta title</span>
              <input
                type="text"
                name="meta_title"
                className="field__input"
                maxLength={200}
                id="offer-meta-title"
                placeholder="Override <title> / Open Graph title"
              />
            </label>
            <label className="field">
              <span className="field__label">Meta description</span>
              <textarea
                name="meta_description"
                className="field__input field__input--area"
                rows={2}
                maxLength={500}
                id="offer-meta-desc"
                placeholder="Search snippet & og:description"
              />
            </label>
            <div className="field field--full">
              <span className="field__label">Video categories</span>
              <p className="field__hint">
                Check any tags that apply (no limit). Use <strong>Grouped</strong>, <strong>A–Z</strong>, or{" "}
                <strong>Frequently used</strong>; each group has <strong>Select all</strong>. Add{" "}
                <strong>custom SEO keywords</strong> below the list. Saved together as comma-separated{" "}
                <code>tags</code> for search snippets and the watch page. Extend the preset list in{" "}
                <code>src/lib/offer-taxonomy.js</code>.
              </p>
              <div id="offer-taxonomy-host" className="offer-taxonomy-host" />
            </div>
          </fieldset>
          <label className="field">
            <span className="field__label">Video URL</span>
            <input
              type="text"
              name="video_url"
              className="field__input"
              maxLength={2000}
              id="offer-video"
              placeholder="MP4/WebM, YouTube, Vimeo, or Google Drive share link"
            />
            <span className="field__hint">
              Google Drive: use the normal file link (<code>drive.google.com/file/d/…/view</code> or{" "}
              <code>…/open?id=…</code>). The file must allow playback for people with the link.
            </span>
          </label>
          <label className="field">
            <span className="field__label">Poster image (optional)</span>
            <div className="field__row">
              <input type="file" name="poster_file" className="field__input" id="offer-poster-file" accept="image/*" />
              <button type="button" className="btn btn--ghost btn--sm" id="offer-poster-upload">
                Upload to Supabase
              </button>
            </div>
            <span className="field__hint">
              Recommended: Upload your own cover image to Supabase Storage. Auto-detection works for YouTube (no
              upload needed).
            </span>
          </label>
          <label className="field">
            <span className="field__label">Or paste image URL manually</span>
            <input type="text" name="poster_url" className="field__input" maxLength={2000} id="offer-poster" placeholder="https://…" />
            <span className="field__hint">
              Works with: Direct image URLs, YouTube stills (auto-generated), uploaded images. Google Drive
              thumbnails may fail due to permissions.
            </span>
          </label>
          <label className="field">
            <span className="field__label">External link under player (optional)</span>
            <input type="text" name="href" className="field__input" maxLength={2000} id="offer-href" placeholder="https://…" />
          </label>
          <label className="field">
            <span className="field__label">Sort order</span>
            <input type="number" name="sort_order" className="field__input" defaultValue={0} id="offer-sort" />
          </label>
          <label className="field field--row">
            <input type="checkbox" name="is_active" id="offer-active" defaultChecked />
            <span className="field__label field__label--inline">Visible on public site</span>
          </label>
          <div className="admin-dialog__actions">
            <button type="button" className="btn btn--ghost" id="offer-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" value="save">
              Save
            </button>
          </div>
        </form>
      </dialog>

      <dialog id="dlg-story" className="admin-dialog admin-dialog--wide">
        <form id="form-story" className="admin-dialog__inner">
          <h3 className="admin-dialog__title" id="dlg-story-title">
            Story
          </h3>
          <input type="hidden" name="id" id="story-id" />
          <label className="field">
            <span className="field__label">Title</span>
            <input type="text" name="title" className="field__input" required maxLength={200} id="story-title-input" />
          </label>
          <label className="field">
            <span className="field__label">Description</span>
            <textarea
              name="description"
              className="field__input field__input--area"
              rows={3}
              maxLength={2000}
              id="story-desc"
            />
          </label>
          <label className="field">
            <span className="field__label">PDF URL (required)</span>
            <input
              type="url"
              name="pdf_url"
              className="field__input"
              required
              maxLength={2000}
              id="story-pdf"
              placeholder="https://…/my-story-episode-1.pdf"
            />
            <span className="field__hint">
              Must be a direct link that opens the PDF in the browser (not an HTML download page).
            </span>
          </label>
          <label className="field">
            <span className="field__label">Cover image URL (optional)</span>
            <input
              type="url"
              name="cover_url"
              className="field__input"
              maxLength={2000}
              id="story-cover"
              placeholder="https://…/cover.jpg"
            />
          </label>
          <div className="field__row">
            <label className="field">
              <span className="field__label">Series name</span>
              <input
                type="text"
                name="series"
                className="field__input"
                maxLength={120}
                id="story-series"
                placeholder="e.g. My Comic Series"
              />
            </label>
            <label className="field">
              <span className="field__label">Episode #</span>
              <input type="number" name="episode" className="field__input" id="story-episode" min={0} />
            </label>
            <label className="field">
              <span className="field__label">Pages</span>
              <input type="number" name="pages" className="field__input" id="story-pages" min={0} />
            </label>
          </div>
          <fieldset className="admin-fieldset">
            <legend className="admin-fieldset__legend">SEO (optional)</legend>
            <label className="field">
              <span className="field__label">URL slug</span>
              <div className="field__row">
                <input
                  type="text"
                  name="slug"
                  className="field__input"
                  maxLength={120}
                  id="story-slug"
                  placeholder="my-series-episode-1"
                  autoComplete="off"
                />
                <button type="button" className="btn btn--ghost btn--sm" id="story-slug-gen">
                  From title
                </button>
              </div>
              <span className="field__hint">
                Story page becomes <code>/stories/&lt;slug&gt;</code>. Must be unique.
              </span>
            </label>
            <label className="field">
              <span className="field__label">Meta title</span>
              <input type="text" name="meta_title" className="field__input" maxLength={200} id="story-meta-title" />
            </label>
            <label className="field">
              <span className="field__label">Meta description</span>
              <textarea
                name="meta_description"
                className="field__input field__input--area"
                rows={2}
                maxLength={500}
                id="story-meta-desc"
              />
            </label>
            <label className="field">
              <span className="field__label">Tags (comma-separated)</span>
              <input
                type="text"
                name="tags"
                className="field__input"
                maxLength={500}
                id="story-tags"
                placeholder="comic, milf, series"
              />
            </label>
          </fieldset>
          <label className="field">
            <span className="field__label">Sort order</span>
            <input type="number" name="sort_order" className="field__input" defaultValue={0} id="story-sort" />
          </label>
          <label className="field field--row">
            <input type="checkbox" name="is_active" id="story-active" defaultChecked />
            <span className="field__label field__label--inline">Visible on public site</span>
          </label>
          <div className="admin-dialog__actions">
            <button type="button" className="btn btn--ghost" id="story-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" value="save">
              Save
            </button>
          </div>
        </form>
      </dialog>

      <footer className="site-footer">
        <div className="wrap site-footer__inner">
          <p className="site-footer__muted">
            Keep this URL private: <code>/admin</code>
          </p>
        </div>
      </footer>
    </>
  );
}
