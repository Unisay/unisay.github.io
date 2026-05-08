# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal brand / CV website for Yuriy Lazaryev, a senior software engineer specializing in Haskell, PureScript, and the Cardano blockchain ecosystem. Currently based in Berlin, Germany.

## Hosting & Deployment

- Hosted on **GitHub Pages** at **cv.functional.work** (CNAME emitted into `result/` by the `site` derivation)
- Built and deployed via GitHub Actions: `.github/workflows/deploy.yml` runs `nix build .#site` on every push to `main` and uploads `result/` through `actions/deploy-pages`
- GitHub Pages source: **GitHub Actions** (not a branch/folder)
- The local `docs/` directory is gitignored — it's a convenience for previewing builds, not the deploy source

## Architecture

The site is built from a **Nix flake pipeline** with `resume.yaml` as the single source of truth.

| File | Purpose |
|------|---------|
| `resume.yaml` | Source of truth — JSON Resume schema in YAML |
| `flake.nix` | Nix build pipeline (HTML, PDF, site derivations) |
| `scripts/render-html.sh` | `yq | resumed export` wrapper (dev use) |
| `scripts/render-pdf.sh` | `chromium --headless` PDF wrapper (dev use) |
| `.github/workflows/deploy.yml` | CI build + Pages deploy |
| `docs/` | Local-only preview output (gitignored) |

## Build Commands

```bash
# Enter dev shell (provides yq, resumed, chromium, nodejs)
nix develop

# Build full site to result/ (HTML + PDF + CNAME)
nix build .#site

# Optional: refresh local preview in docs/ (not deployed — Actions builds from source)
command cp -f result/index.html result/resume.pdf docs/

# Manual render (inside nix develop)
./scripts/render-html.sh resume.yaml docs/index.html
```

## Editing Content

Edit `resume.yaml` — it follows the [JSON Resume schema](https://jsonresume.org/schema/).

## GitHub Pages Configuration

In repo Settings → Pages: source must be set to **GitHub Actions**. The `deploy.yml` workflow handles upload via `actions/upload-pages-artifact` + `actions/deploy-pages`.
