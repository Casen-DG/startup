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