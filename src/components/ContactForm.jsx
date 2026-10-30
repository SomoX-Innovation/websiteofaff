"use client";

import { useState } from "react";
import { submitContactMessage } from "../../app/contact/actions.js";

export default function ContactForm() {
  const [status, setStatus] = useState(null); // { kind: "success" | "error", text }
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const message = String(fd.get("message") || "").trim();

    if (!message) {
      setStatus({ kind: "error", text: "Please enter a message." });
      return;
    }

    setPending(true);
    setStatus(null);
    const result = await submitContactMessage({
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      message,
    });
    setPending(false);

    if (!result.ok) {
      setStatus({ kind: "error", text: result.error || "Could not send your message. Please try again later." });
      return;
    }

    setStatus({ kind: "success", text: "Thanks — your message was sent." });
    form.reset();
  }

  return (
    <>
      {status ? (
        <div className={`alert alert--${status.kind}`} role="status">
          {status.text}
        </div>
      ) : null}

      <form className="form-card" noValidate onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Name (optional)</span>
          <input type="text" name="name" className="field__input" autoComplete="name" maxLength={120} />
        </label>
        <label className="field">
          <span className="field__label">Email (optional)</span>
          <input type="email" name="email" className="field__input" autoComplete="email" maxLength={200} />
        </label>
        <label className="field">
          <span className="field__label">Message</span>
          <textarea name="message" className="field__input field__input--area" required rows={5} maxLength={4000} />
        </label>
        <button type="submit" className="btn btn--primary" disabled={pending}>
          Send
        </button>
      </form>
    </>
  );
}
