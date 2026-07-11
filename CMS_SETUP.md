# Private visual editor setup

The site can use Decap CMS, a free editor that writes publishing changes directly to this GitHub repository. The editor will live at `ameetbabbar.com/admin/` and require a GitHub login. Only accounts with write access to `bbarch/ab` can publish.

## One-time account setup needed

GitHub requires an OAuth application to handle secure login. The credential secret must stay in your account and must never be placed in this repository.

1. Create a free Cloudflare account, if you do not have one.
2. In GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**.
3. Use these values:
   - Application name: `Ameet Babbar CMS`
   - Homepage URL: `https://ameetbabbar.com`
   - Authorization callback URL: `https://cms-auth.ameetbabbar.com/callback`
4. Do not share the generated client secret. Add it only as a secret in Cloudflare when creating the auth worker.

Once the OAuth app exists, the site can be upgraded with the private editor, image uploads, drafts, and article pages. The worker and CMS configuration will be added without exposing any secret in GitHub.
