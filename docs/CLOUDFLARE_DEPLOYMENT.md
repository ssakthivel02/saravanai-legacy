# Cloudflare Pages and DNS Setup

Target domain: `sakthiai.omsaravanabhava.org`

## 1. Create the Pages project

1. Open Cloudflare Dashboard.
2. Go to **Workers & Pages**.
3. Select **Create application** → **Pages** → **Connect to Git**.
4. Authorise GitHub access to `ssakthivel02/sakthiai`.
5. Choose repository `sakthiai`.
6. Use:
   - Project name: `sakthiai`
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave blank
7. Add `NODE_VERSION=22` only when the dashboard/build image requires an explicit version.
8. Select **Save and Deploy**.

Do not enter AI provider keys during Release 001.

## 2. Validate the Pages preview

Confirm the generated `*.pages.dev` URL:

- Loads the overview
- Opens every navigation view
- Works at mobile width
- Runs the task routing simulation
- Has no browser-console errors
- Returns the offline page after the service worker has cached the shell and the network is disabled

## 3. Add the custom domain

1. In the Pages project, open **Custom domains**.
2. Select **Set up a custom domain**.
3. Enter `sakthiai.omsaravanabhava.org`.
4. Select **Continue** → **Activate domain**.
5. Because the parent zone is already on Cloudflare, Cloudflare normally creates the required proxied CNAME automatically.

Expected DNS record:

```text
Type: CNAME
Name: sakthiai
Target: sakthiai.pages.dev
Proxy status: Proxied
TTL: Auto
```

Use the actual `*.pages.dev` hostname shown by the Pages project if it differs.

## 4. SSL/TLS checks

1. Go to **SSL/TLS** → **Overview**.
2. Keep encryption mode at **Full (strict)** when all existing origins support it.
3. Confirm the custom hostname shows an active certificate in Pages.
4. Test `https://sakthiai.omsaravanabhava.org`.

Do not weaken the whole domain to Flexible mode merely to solve one hostname problem.

## 5. Recommended private-test protection

Before provider APIs or personal data are added, place the application behind Cloudflare Access:

1. Go to **Zero Trust** → **Access** → **Applications**.
2. Add a self-hosted application for `sakthiai.omsaravanabhava.org`.
3. Create an allow policy for only your verified email address.
4. Test in a private browser window.

## 6. Branch workflow

- `release/*` branches: Cloudflare preview deployments
- Pull request: review preview and GitHub Quality Gate
- `main`: production deployment
- Do not connect production deployment directly to an unreviewed feature branch

## 7. DNS verification from Windows

```powershell
Resolve-DnsName sakthiai.omsaravanabhava.org
curl.exe -I https://sakthiai.omsaravanabhava.org
```

Expected result: the hostname resolves through Cloudflare and HTTPS returns a successful response with the configured security headers.
