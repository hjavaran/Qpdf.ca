# Activating the contact form (Web3Forms, free plan)

The `/contact/` page sends messages with [Web3Forms](https://web3forms.com/). It
works without a server or database. Until you add an access key the page shows
"The contact form is not set up yet" and the Send button is disabled.

## Setup (about 2 minutes)

1. Go to https://web3forms.com/ and enter **your email address** under
   "Create your Access Key" (free plan, 250 submissions/month). Messages will be
   delivered to that address; it is stored at Web3Forms and is **not** placed in
   this repository or on the website.
2. Open the confirmation email from Web3Forms and copy the **Access Key**
   (a UUID like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). It is designed to be
   public in client-side code, but keep it out of the repository anyway.
3. In Cloudflare: **Workers & Pages → qpdf → Settings → Environment variables
   → Production → Add** `WEB3FORMS_ACCESS_KEY` = your key. Save.
4. **Deployments → Retry deployment** (or push any commit). The build log shows
   `Contact form CONFIGURED`; the build then adds only `https://api.web3forms.com`
   to the Content Security Policy.
5. Send yourself a test message on https://qpdf.ca/contact/ and check your inbox.

## Optional (dashboard) settings
- In the Web3Forms dashboard, restrict the key to the domain `qpdf.ca`.
- Spam: the form already includes a honeypot field and Web3Forms' built-in
  filtering. If you still get spam, turn on Web3Forms' **free hCaptcha** option;
  note it requires adding hCaptcha's script to the page (a third-party script and
  CSP change) — ask for that change rather than editing it by hand. The paid
  Cloudflare Turnstile integration is intentionally not used.

## Local development
`WEB3FORMS_ACCESS_KEY=<key> npm run build && npm run serve:dist`

## Troubleshooting: "The contact form is not set up yet"
The key is read **at build time**, so check the deployment's build log for the line
`Contact form …`:
- `CONFIGURED` → hard-refresh the page (Ctrl/Cmd+Shift+R); the form is live.
- `… is not set in this build's environment variables` → the variable is missing for
  that build. The name must be exactly `WEB3FORMS_ACCESS_KEY`, added under
  **Production** (not only Preview), with type **Text** (not an encrypted secret), and
  you must **redeploy** afterwards — saving a variable does not change an existing build.
- `… is set but is not a valid key` → the value is not a Web3Forms key (a UUID such as
  `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). Copy it again from the Web3Forms email.
  Surrounding spaces or quotes are ignored.
