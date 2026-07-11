# Private visual editor setup

The site can use Decap CMS, a free editor that writes publishing changes directly to this GitHub repository. The editor will live at `ameetbabbar.com/admin/` and require a GitHub login. Only accounts with write access to `bbarch/ab` can publish.

## One-time account setup needed

GitHub requires an OAuth application to handle secure login. The credential secret must stay in your account and must never be placed in this repository.

1. Create a Worker named `ameet-cms-auth` in a free Cloudflare account. Its URL is `https://ameet-cms-auth.twg2674cjd.workers.dev`.
2. In GitHub, open the OAuth app and change its callback URL to `https://ameet-cms-auth.twg2674cjd.workers.dev/callback`.
3. Paste `workers/cms-auth.js` into the Worker editor and deploy it.
4. In **Worker → Settings → Variables and Secrets**, add:
   - `GITHUB_CLIENT_ID` as plain text: `0v231iPU9Ygjuh0tPd1f`
   - `GITHUB_CLIENT_SECRET` as a **Secret**: generate it in GitHub and paste it only into Cloudflare
5. Deploy the variables. Visit `https://ameetbabbar.com/admin/` and log in through GitHub.

The editor creates commits in the `main` branch, which GitHub Pages then deploys. The worker and CMS configuration never expose the client secret in GitHub.
