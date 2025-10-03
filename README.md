# NanoTensor Website

Static site for `nanotensor.eu` hosted on GitHub Pages.

## Local preview

Open `index.html` in a browser (no build step). For the animated background to render crisply, prefer a modern browser.

## Deploy to GitHub Pages

1. Create a public repo named `nanotensor.github.io` (or use an org repo and enable Pages from the `main` branch / `root`).
2. Commit and push all files in this folder to the repo root.
3. Add the custom domain in repo Settings → Pages: `nanotensor.eu`.
4. Ensure a `CNAME` file in the repo contains `nanotensor.eu` (already provided here).
5. Configure DNS at your domain provider:
   - A records → GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Optional `AAAA` for IPv6: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - CNAME for `www` → `nanotensor.github.io`
6. Wait for DNS to propagate and enforce HTTPS in Pages settings.

## Customization

- Replace `assets/social-card.png` with a 1200×630 branded image.
- Replace `assets/favicon.png` if you prefer a raster favicon.
- Update links in the Contact section.

## License

All rights reserved © NanoTensor s.r.o.
