// Contact form → Web3Forms (https://docs.web3forms.com/). Free plan only:
// public access key, honeypot (`botcheck`) and Web3Forms' built-in spam filtering.
// Only the typed fields are sent; no files and no PDF data ever touch this code.
// Success is shown only when the API replies with { success: true }.

const API = 'https://api.web3forms.com/submit';
const TIMEOUT_MS = 20000;

const form = document.getElementById('contact-form') as HTMLFormElement | null;
if (form) init(form);

function init(form: HTMLFormElement): void {
  const key = form.dataset.key || '';
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const submit = $<HTMLButtonElement>('cf-submit');
  const label = $('cf-submit-label');
  const errorBox = $('contact-error');
  const wrap = $('contact-form-wrap');
  const success = $('contact-success');
  const counter = $('cf-message-count');
  const message = $<HTMLTextAreaElement>('cf-message');
  const fields = ['name', 'email', 'message', 'subject'] as const;
  let busy = false;

  const input = (n: string) => form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement;
  const setError = (n: string, text: string) => {
    const el = input(n);
    const out = $('cf-' + n + '-err');
    out.textContent = text;
    if (text) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  };
  const showBanner = (text: string) => {
    errorBox.textContent = text;
    errorBox.hidden = !text;
  };

  function validate(): string | null {
    let firstBad: string | null = null;
    const bad = (n: string, t: string) => {
      setError(n, t);
      firstBad ??= n;
    };
    const name = input('name').value.trim();
    const email = input('email').value.trim();
    const msg = input('message').value.trim();
    setError('subject', '');
    if (!name) bad('name', 'Please enter your name.');
    else setError('name', '');
    if (!email) bad('email', 'Please enter your email address so we can reply.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad('email', 'That email address doesn’t look right. Check it and try again.');
    else setError('email', '');
    if (!msg) bad('message', 'Please write a message.');
    else if (msg.length < 10) bad('message', 'Please add a little more detail (at least 10 characters).');
    else setError('message', '');
    return firstBad;
  }

  // Clear a field's error as soon as the person edits it.
  for (const n of fields) input(n).addEventListener('input', () => input(n).hasAttribute('aria-invalid') && setError(n, ''));
  message.addEventListener('input', () => (counter.textContent = `${message.value.length} / 5000`));

  function setBusy(on: boolean): void {
    busy = on;
    submit.disabled = on || !key;
    submit.setAttribute('aria-busy', String(on));
    label.textContent = on ? 'Sending…' : 'Send message';
    for (const n of fields) input(n).disabled = on;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return; // prevents duplicate submissions
    showBanner('');
    if (!key) {
      showBanner('The contact form is not set up yet, so your message could not be sent.');
      return;
    }
    const firstBad = validate();
    if (firstBad) {
      input(firstBad).focus();
      return;
    }
    if (!navigator.onLine) {
      showBanner('You appear to be offline. Reconnect to the internet and try again.');
      return;
    }
    setBusy(true);
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const subject = input('subject').value.trim();
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          name: input('name').value.trim(),
          email: input('email').value.trim(),
          subject: subject || 'New message from the Qpdf.ca contact form',
          from_name: 'Qpdf.ca contact form',
          message: input('message').value.trim(),
          botcheck: (form.elements.namedItem('botcheck') as HTMLInputElement).checked,
        }),
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        signal: ctrl.signal,
      });
      let data: { success?: boolean; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON reply */
      }
      if (res.ok && data.success === true) {
        form.reset();
        counter.textContent = '0 / 5000';
        wrap.hidden = true;
        success.hidden = false;
        success.focus();
      } else {
        showBanner(
          res.status === 429
            ? 'Too many messages were sent recently. Please wait a few minutes and try again.'
            : 'Your message could not be sent. Please check your details and try again in a moment.'
        );
      }
    } catch (err) {
      showBanner(
        (err as Error).name === 'AbortError'
          ? 'The request took too long. Please check your connection and try again.'
          : 'Could not reach the message service. Check your connection and try again.'
      );
    } finally {
      window.clearTimeout(timer);
      setBusy(false);
    }
  });

  $('cf-again').addEventListener('click', () => {
    success.hidden = true;
    wrap.hidden = false;
    for (const n of fields) setError(n, '');
    input('name').focus();
  });
}
