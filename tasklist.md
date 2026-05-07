# Sikkerheits-tasklist (Dependabot)

Dato: 2026-05-07
Status: 52 opne Dependabot-alerts (2 critical, 23 high, 19 medium, 8 low)

## Bakgrunn

Etter `chore(deps): bump fast-xml-parser` (PR #1) blei `fast-xml-parser` promotert frå transitiv til top-level dep. Det utløyste full Dependabot-reindeksering av lockfila, og 51 alerts som tidlegare ikkje var rapportert dukka opp. Tala speglar reell tilstand i `package-lock.json` — ikkje ei forverring etter bumpen.

Mange av alertene er klassiske SPFx-tooling-lockings (gulp/heft/api-extractor) der pakker er pinned i `@microsoft/sp-*`, `@rushstack/*` eller `@pnp/*` og ikkje kan oppgraderast utan å forlate SPFx 1.21.1 (eller vente på upstream-patch frå Microsoft). Andre er fixable med direkte bump.

## Action 1 — Bumpe direkte/aksesserbare pakker

| Pakke | Sev | Patched | Notat |
|---|---|---|---|
| `swiper` | critical | 12.1.2+ | Direkte dep i `package.json` (^11.2.6). Test om 12.x er kompatibelt. Eller bruk `overrides` i package.json til 12.1.2 (sjå pol-gallery PR #1 for mønster). |
| `dompurify` | (sjekk) | (sjekk) | Direkte dep. Sjå `npm ls dompurify`. |
| `html-react-parser` | (sjekk) | (sjekk) | Direkte dep. |

Kommando for å sjå alle alerts i detalj:
```bash
gh api /repos/paalolav/pol-rss/dependabot/alerts?state=open --jq '.[] | {pkg: .dependency.package.name, sev: .security_advisory.severity, summary: .security_advisory.summary, patched: .security_vulnerability.first_patched_version.identifier, manifest: .dependency.manifest_path, html_url}' | jq -s '.'
```

## Action 2 — Sjekkbare via `npm audit fix` (transitive)

Køyr:
```bash
npm audit fix
git diff package-lock.json
```

Forventa fixar: nokre av webpack 5.104.x, qs 6.14.x, postcss 8.4.31, body-parser 1.20.3, express 4.20.0, send 0.19.0, serve-static 1.16.0, cookie 0.7.0, tmp 0.2.4 — om foreldrepakkane tillèt det.

## Action 3 — SPFx-ecosystem-låste (vent på Microsoft)

Desse pakkene er pinned inni Microsoft/PnP-tooling og kan ikkje oppgraderast utan å forlate SPFx 1.21.1. Ingen actionable fix tilgjengeleg lokalt — vent på upstream-patch.

| Pakke | Antal | Sev | Truleg foreldre |
|---|---|---|---|
| `tar` | 6 | high | `@microsoft/sp-build-web`, `@microsoft/rush-stack-compiler-*` |
| `node-forge` | 5 | 4 high, 1 med | `@microsoft/sp-build-web`, `@pnp/spfx-controls-react` |
| `minimatch` | 3 | high | `@microsoft/*`, `@rushstack/*` |
| `lodash` | 3 | 1 high, 2 med | `@pnp/spfx-controls-react`, diverse @microsoft |
| `webpack` | 3 | 1 med, 2 low | `@microsoft/sp-build-web` |
| `validator` | 2 | 1 high, 1 med | indirekte via SPFx/typing |
| `serialize-javascript` | 2 | 1 high, 1 med | `@rushstack/module-minifier`, terser |
| `jws` | 2 | high | `jsonwebtoken`-kjede via SPFx |
| `js-yaml` | 2 | med | `@microsoft/api-extractor`, gulp |
| `postcss` | 2 | med | `@microsoft/sp-build-web` (gulp-pipeline) |
| `qs` | 2 | low + med | `express` via gulp-livereload |
| `form-data` | 1 | critical | `request` via `@microsoft/api-extractor` (build-time) |
| `body-parser` | 1 | high | gulp dev-server |
| `braces` | 1 | high | gulp/anymatch |
| `flatted` | 1 | high | eslint cache-format |
| `immutable` | 1 | high | webpack/postcss-internal |
| `svgo` | 1 | high | `@rushstack/heft` (om brukt) |
| `ajv` | 1 | med | `@microsoft/sp-module-interfaces` |
| `got` | 1 | med | gulp-livereload |
| `node-notifier` | 1 | med | gulp-error-reporting |
| `picomatch` | 1 | med | gulp/anymatch |
| `request` | 1 | med | `no fix available` — pakka deprecated, vent på vekkfjerning |
| `tough-cookie` | 1 | med | `request` (deprecated) |
| `yargs-parser` | 1 | med | gulp-cli |
| `cookie`, `express`, `send`, `serve-static`, `tmp` | 5 | low | gulp dev-server |

## Action 4 — Vurder SPFx 1.22-oppgradering

Dei fleste låste vulns over er i SPFx 1.21.1 sin gamle gulp-stack. SPFx 1.22 brukar heft (ikkje gulp) og har mindre overflate. Oppgradering vil ikkje gi 0 alerts (Microsoft har framleis transitive vulns), men reduserer omfanget. Sjå pol-embeddbutikk og pol-geoapi sin SPFx 1.22-upgrade i `/Volumes/Documents/GitHub/docs/superpowers/plans/2026-05-07-dependabot-spfx-cleanup.md`.

Estimat: ~1 dagsverk per repo med PnP CLI sin `m365 spfx project upgrade`.

## Notat

- 35 ucommitterte lokale commits blei pusha av cleanup-subagentane på fleire pol-* / Lye / ask-llm / Synoptik / Tonsofrock repo. Ingenting gått tapt — pusha vidareført. Sjekk `git log origin/main..main` om du har vidare ukommitert eller ulastet arbeid.
