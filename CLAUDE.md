# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal brand / CV website for Yuriy Lazaryev, a senior software engineer specializing in Haskell, PureScript, and the Cardano blockchain ecosystem. Currently based in Berlin, Germany.

## Hosting & Deployment

- Hosted on **GitHub Pages** from the `main` branch of `unisay.github.io`
- Custom domain: **cv.functional.work** (configured via `CNAME` file in `docs/`)
- GitHub Pages source: `main` branch, `/docs` folder
- Deployment is automatic: push to `main` and GitHub Pages serves the updated site

## Architecture

The site is built from a **Nix flake pipeline** with `resume.yaml` as the single source of truth.

| File | Purpose |
|------|---------|
| `resume.yaml` | Source of truth — JSON Resume schema in YAML |
| `flake.nix` | Nix build pipeline (HTML, PDF, site derivations) |
| `scripts/render-html.sh` | `yq | resumed export` wrapper (dev use) |
| `scripts/render-pdf.sh` | `chromium --headless` PDF wrapper (dev use) |
| `overlays/humanized.yaml` | Humanizer overlay (merge over resume.yaml) |
| `docs/` | Build output served by GitHub Pages |
| `docs/CNAME` | Custom domain config |

## Build Commands

```bash
# Enter dev shell (provides yq, resumed, chromium, nodejs)
nix develop

# Build full site to result/
nix build .#site

# Populate docs/ for deploy
cp result/index.html docs/
cp result/resume.pdf docs/
# CNAME already in docs/

# Manual render (inside nix develop)
./scripts/render-html.sh resume.yaml docs/index.html
```

## Editing Content

Edit `resume.yaml` — it follows the [JSON Resume schema](https://jsonresume.org/schema/).

To apply humanizer overlay:
```bash
yq eval-all 'select(fileIndex==0) * select(fileIndex==1)' resume.yaml overlays/humanized.yaml > /tmp/merged.yaml
./scripts/render-html.sh /tmp/merged.yaml docs/index.html
```

## GitHub Pages Configuration

In repo Settings → Pages: source must be set to **`main` branch / `/docs` folder**.
