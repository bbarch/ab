/* Paste this code into the ameet-cms-auth Cloudflare Worker.
   Keep GITHUB_CLIENT_SECRET in Cloudflare as a Secret; never commit it. */
const cookieValue = (request, name) => {
  const cookie = request.headers.get('Cookie') || '';
  return cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
};

const html = (status, content) => `<!doctype html><meta charset="utf-8"><title>Signing in…</title><script>
  const send = event => {
    if (event.origin !== ${JSON.stringify('https://ameetbabbar.com')}) return;
    window.opener.postMessage('authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(content))}, event.origin);
    window.removeEventListener('message', send);
    window.close();
  };
  window.addEventListener('message', send);
  window.opener.postMessage('authorizing:github', '*');
</script><p>Signing you in…</p>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = url.origin;

    if (url.pathname === '/auth') {
      const state = crypto.randomUUID();
      const authorize = new URL('https://github.com/login/oauth/authorize');
      authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorize.searchParams.set('redirect_uri', `${origin}/callback`);
      authorize.searchParams.set('scope', 'repo');
      authorize.searchParams.set('state', state);
      return new Response(null, { status: 302, headers: { Location: authorize.toString(), 'Set-Cookie': `cms_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=600` } });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code || !state || state !== cookieValue(request, 'cms_oauth_state')) return new Response('Invalid login request.', { status: 400 });
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${origin}/callback` })
      });
      const result = await tokenResponse.json();
      if (!result.access_token) return new Response(html('error', result), { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      return new Response(html('success', { token: result.access_token, provider: 'github' }), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': 'cms_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=0' } });
    }

    return new Response('Ameet Babbar CMS authentication service.', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
};
