# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.start-up-dingxi.click)
- [My simon](https://simon.start-up-dingxi.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

Interesting things I have learned about AWS

- Deployed Simon HTML to my production EC2 instance using the course's
  `deployFiles.sh` script (`./deployFiles.sh -k <pem> -h start-up-dingxi.click -s simon`).
- My Route 53 hosted zone only had an A record for the `startup` subdomain, not
  for the root domain. This caused SSH/SCP to fail with "Could not resolve
  hostname" during deployment. Fixed it by adding an A record for the root
  domain and a wildcard (`*`) A record, both pointing to the EC2 instance's
  public IP, so future subdomains resolve automatically.
- The first SSH connection to a new hostname prompts for host key
  confirmation. Since `deployFiles.sh` runs SSH non-interactively (via
  heredoc), this prompt can hang the script. Fixed by manually SSHing in once
  to accept the host key before running the deploy script.
- After macOS resolved the new DNS record via `dig`, the system resolver
  (used by `ssh`/`scp`) still had a stale negative cache. Flushed it with
  `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`.

## HTML

Interesting things I have learned about HTML

- `deployFiles.sh` only copies files to the server (into
  `~/services/<service>/public`) — it does NOT configure Caddy for you. Each
  new subdomain needs its own site block manually added to
  `/etc/caddy/Caddyfile`, e.g.:
    simon.start-up-dingxi.click {
        root * /home/ubuntu/services/simon/public
        file_server
    }
  followed by `sudo systemctl reload caddy`.
- Even with the correct Caddyfile block, the site returned a 403 error
  because `/home/ubuntu` was not traversable by the Caddy process (which
  doesn't run as the `ubuntu` user). Fixed with:
  `chmod o+x /home/ubuntu` and `chmod -R o+rX /home/ubuntu/services`.
- Simon's structure uses a duplicated header/nav/footer on every page
  (index/play/scores/about) so navigation is consistent — this is the same
  pattern I need to follow for my own startup's HTML deliverable, along with
  placeholders for auth, database data, 3rd-party API calls, and WebSocket
  data.

## React

Interesting things I have learned about React

## Service

Interesting things I have learned about building the service

- The frontend and backend are separate processes in development: Vite serves
  the React app on 5173 and proxies `/api` to Express on 4000
  (`server.proxy` in `vite.config.js`). In production there is only one
  process — Express serves the built `dist` files from `public` with
  `express.static` and also answers `/api`.
- The SPA fallback (`res.sendFile('index.html', { root: 'public' })`) has to be
  the last middleware, otherwise deep links like `/leaderboard` return 404
  after a page refresh. `express.static('public')` is relative to the working
  directory the service is started from, not to `index.js`.
- Never store plain passwords: `bcrypt.hash(password, 10)` stores a salted
  hash, and `bcrypt.compare` checks a login attempt against it.
- The auth token lives in an `httpOnly`, `secure`, `sameSite: 'strict'` cookie,
  so page JavaScript can't read it and the browser sends it automatically on
  every `fetch` to the same origin. Logging out has to remove the token on the
  server too — just clearing the cookie would leave the old token valid.
- An Express middleware like `verifyAuth` can protect any route by being
  listed before the handler (`apiRouter.get('/scores', verifyAuth, ...)`), and
  can attach the user to `req` so handlers can store per-user data.
- Every `fetch` needs both checks: `response.ok` / the status code (a 401 or
  409 does not throw) and a `.catch` for network failures.
- A third-party API can be called straight from the browser only if it sends
  CORS headers — MyGene.info returns `access-control-allow-origin: *`.
- In-memory arrays are fine for this deliverable, but everything is lost when
  the service restarts; that is what the database deliverable fixes.

