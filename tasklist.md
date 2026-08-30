# Tasklist — Dependabot, Sonar, arkitektur

Dato: 2026-08-30
Status:
- Tryggleiksoppdatering 2026-08-30: branch `chore/security-hardening-spfx-1.23`
  oppgraderer til SPFx 1.23.2, fjernar ubrukt parser/Adaptive Card-avhengnad og gir 0
  produksjonssårbarheiter i `npm audit --omit=dev`. Fem applikasjonstestar, tre
  repository-tryggleikstestar, lint, Heft-bygg og pakking passerer på Node 22 og i
  GitHub Actions. PR #20 leverer endringa; tenant-røyktest står att før deploy.
- Security-baseline frå `main` (issue #17) er fletta inn: pinna CI-actions,
  gitleaks-regresjonstest, artefaktopprydding og produksjonsaudit er vidareførte.
- Dependabot på `main` blir reindeksert først etter at 1.23.2-branchen er merga.
- SonarQube: 0 bugs, 0 vulnerabilities, 0 hotspots, 0 code smells — rein.
- SPFx-versjon: 1.21.1 på `main`; 1.23.2/Heft på kampanjebranchen.

## Action 0 — gjort 2026-05-07/08

### Sonar cleanup (07.05)
- `4b966e1` — herda to ReDoS-merka regex i `rssUtils.ts` (cleanDescription truncation, findImage binary-URL match).
- `ed5367c` — 6 code smells (readonly, React-keys, imports, String.raw, RegExp.exec).
- `0458840` — gitignore lib/ + tests/**/.auth/ (SharePoint-cookies må aldri commitast). 63 build-artefaktar avregistrerte.

### A11y, ytelse, polish (07.05)
- `9667aca` — batch 1 (img loading=lazy, decoding=async, autoplay pause-on-hover, ikkje-reaktiv property pane, aria-live på error/empty, carousel landmarks).
- `be0f8e8` — batch 2 (React.lazy BannerCarousel, cacheService in-flight dedup, abort fetch on unmount, shared layout-helpers, theme via CSS custom props).
- `8d5f9cd` — DOMPurify-sanitering av RSS-description (XSS).
- `bbb571f` — scheme allow-list på item.link (XSS).
- `446d72c` — banner caption forced-colors (HC-mode).
- `c3e8856` — friendly localized error messages.
- `4b42d42` — polish (SR-only "opens in new window", invalid-date guard, banner CLS hints, interval slider default).

### Dep-bumps (07.05)
- `3fb7b40` — Swiper 11 → 12.1.4 (lukkar critical GHSA-hmx5-qpq5-p643 prototype pollution).
- DOMPurify 3.4.2 ny direkte dep (sanitering).

### SPFx 1.22 upgrade (07–08.05)
- Branch `spfx-1.22-upgrade`, commit `6489e6f`. Gulp → heft, 7 sp-* pakkar til 1.22.2, TypeScript 5.8, css-loader 7. Verifisert end-to-end: `heft test --clean --production && heft package-solution --production` passerer. `.sppkg` genererast.
- npm audit-vulns: 135 → 58.
- Står att: tenant-workbench-røyktest før merge til main.

Re-scan: `sonar-scanner` i prosjektrot. Token i `~/Docker/.env` som `SONAR_TOKEN_POL_RSS`. Dashboard: http://192.168.1.133:9100/dashboard?id=pol-rss.

## Historisk bakgrunn — ikkje operativ sjekkliste

Avsnitta Action 1–4 under dokumenterer utgangspunktet før SPFx 1.23.2-kampanjen.
Pakke-, advisory- og audit-tala er historiske og skal ikkje brukast som noverande
arbeidsinstruks. Ikkje køyr `npm audit fix` eller `--force`; bruk låst, vurdert
oppgradering og produksjonsaudit-kontrakten frå PR #20.

Etter `chore(deps): bump fast-xml-parser` (PR #1) blei `fast-xml-parser` promotert frå transitiv til top-level dep. Det utløyste full Dependabot-reindeksering av lockfila, og 51 alerts som tidlegare ikkje var rapportert dukka opp. Tala speglar reell tilstand i `package-lock.json` — ikkje ei forverring etter bumpen.

Mange av alertene er klassiske SPFx-tooling-lockings (gulp/heft/api-extractor) der pakker er pinned i `@microsoft/sp-*`, `@rushstack/*` eller `@pnp/*` og ikkje kan oppgraderast utan å forlate SPFx 1.21.1 (eller vente på upstream-patch frå Microsoft). Andre er fixable med direkte bump.

## Historisk Action 1 — direkte/aksesserbare pakker

| Pakke | Sev | Patched | Notat |
|---|---|---|---|
| `swiper` | critical | 12.1.2+ | Direkte dep i `package.json` (^11.2.6). Test om 12.x er kompatibelt. Eller bruk `overrides` i package.json til 12.1.2 (sjå pol-gallery PR #1 for mønster). |
| `dompurify` | (sjekk) | (sjekk) | Direkte dep. Sjå `npm ls dompurify`. |
| `html-react-parser` | (sjekk) | (sjekk) | Direkte dep. |

Kommando for å sjå alle alerts i detalj:
```bash
gh api /repos/paalolav/pol-rss/dependabot/alerts?state=open --jq '.[] | {pkg: .dependency.package.name, sev: .security_advisory.severity, summary: .security_advisory.summary, patched: .security_vulnerability.first_patched_version.identifier, manifest: .dependency.manifest_path, html_url}' | jq -s '.'
```

## Historisk Action 2 — transitive funn

Den gamle planen vurderte automatisk `npm audit fix`. Dette er erstatta av eksplisitte
direkte oppgraderingar, fjerning av ubrukt kode, kontrollert låsefil og manuell
rekkeviddeanalyse. Produksjonsaudit er no 0; ikkje køyr automatisk eller tvungen rewrite.

## Historisk Action 3 — SPFx-ecosystem-låste funn

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

## Historisk Action 4 — SPFx 1.22-vurdering

Dei fleste låste vulns over er i SPFx 1.21.1 sin gamle gulp-stack. SPFx 1.22 brukar heft (ikkje gulp) og har mindre overflate. Oppgradering vil ikkje gi 0 alerts (Microsoft har framleis transitive vulns), men reduserer omfanget. Sjå pol-embeddbutikk og pol-geoapi sin SPFx 1.22-upgrade i `/Volumes/Documents/GitHub/docs/superpowers/plans/2026-05-07-dependabot-spfx-cleanup.md`.

Estimat: ~1 dagsverk per repo med PnP CLI sin `m365 spfx project upgrade`.

## Action 5 — RSS-proxy / Metapol-tjeneste (open vurdering)

### Bakgrunn

Webdelen fetchar RSS direkte frå klient (SharePoint origin → feed-URL). Kjende problem:
- **CORS** slår inn på dei fleste offentlege feeds (få har `Access-Control-Allow-Origin: *`).
- **Defekte/trege endepunkt** synast direkte i UI utan buffer.
- **Duplisert arbeid** — 1000 brukarar lastar same feed 1000× kvar dag. Ingen sentral cache.
- **Sanitering på klient** kan omgåast om html-react-parser har CVE.
- **Auth-keys** for premium feeds må ligge sentralt, ikkje i klient.

### Arkitekturval

| | Cloudflare Worker | Azure Function per kunde | Metapol-hosta proxy |
|---|---|---|---|
| Sovereignty (norsk offentleg) | svak (US/global) | sterk (kunde eig) | sterk (norsk drift) |
| Driftslast for Metapol | minimal | låg per kunde, høg ved skalering (10× ops) | medium (du eig SPOF) |
| Kostnad | $5/mnd flat | gratis per kunde, time-fee for setup | €5–10/mnd VPS, dekkjer 10+ kundar |
| Skalerer til 10 kundar | ja | tungt | ja |
| GDPR/anskaffelse-friksjon | DPA-diskusjon kvar gong | minimal (kunden eig) | éin DPA per kunde |

### Anbefaling

**Metapol-hosta multi-tenant proxy, norsk drift** — Hetzner Helsinki CX22 (€4,51/mnd) eller eksisterande Metapol-VPS. Argument "drive i Norge, GDPR-rein, EHF-faktura" slår teknisk-overlegen edge i denne marknaden.

### Smart trekk: RSS → JSON-normalisering på edge

Webdelen har ~150 LOC i `cleanDescription`, `findImage`, `resolveImageUrl` for å handtere RSS/Atom/RDF/iTunes-kaos. Flytt denne logikken til proxy:
- DOMPurify, image-extraction, dedup → éin stad
- Webdelen blir tynn visningskomponent
- Bug-fix éin stad, alle kundar får det

### Pris-utkast (offentleg sektor, "utan å vere for grisk")

| Tier | Pris/mnd | Inkludert |
|---|---|---|
| Setup | 1500 kr eingong | API-key, første feed-konfigurasjon |
| Standard | 250 kr | Inntil 5 feeds, 5-min cache, sanitering |
| Pluss | 500 kr | Ubegrensa feeds, 1-min cache, custom transform |

6 kundar = 1500–3000 kr/mnd. Dekkjer VPS, monitoring, og time-løn for vedlikehald.

### Compute-budsjett — Ålesund-skala (~1000 brukarar/dag, intranett-frontside)

Sjå utgreiing under tasklist. Kort versjon: trivielt for ein €5/mnd VPS. Bandbreidd ~150 MB/dag ut til klientar, ~10 MB/dag inn frå feed-kjelder. Hetzner Helsinki har 20 TB/mnd inkludert — 1000× hovudrom. Bottleneck er drift, ikkje compute.

### Første steg (lågrisiko) — sjå Task #1 nedanfor

## Open tasks

### Task #1 — proxy-design (separat produktavgjerd)

**Mål**: Avklar om kunden treng ein autentisert, allowlista RSS-proxy for CORS,
sentral cache og normalisering. Dette er ikkje del av tryggleikskampanjen.

Ein API-nøkkel må ikkje lagrast i SPFx-eigenskapar eller anna klientkode; `password`-felt
gjer berre verdien visuelt skjult. Bruk Entra-basert brukar-/appautorisasjon eller ein
annan serverkontrollert modell. Proxyen må ha per-kunde feed-allowlist, SSRF-vern,
respons-/tidsgrenser, logging utan credentials og fail-closed autorisasjon.

**Definisjon av "ferdig"**:
- [ ] arkitektur, driftseigar, databehandlaransvar og autentiseringsmodell er godkjende;
- [ ] SSRF-, CORS-, cache-, rate-limit- og feed-allowlist-testar passerer;
- [ ] webdelen inneheld ingen hemmelegheit og fungerer uendra utan proxy;
- [ ] tenanttest med normal og avgrensa brukar passerer.

**Avhengigheiter**: SPFx 1.23.2-baseline frå PR #20. Krev produkt- og kundebeslutning.

---

### Task #2 — Proxy-tjenesta (når Task #1 er på plass og første kunde signaliserer interesse)

**Stack-skisse**:
- Hetzner Helsinki CX22 (€4,51/mnd, 2 vCPU, 4 GB RAM)
- Caddy for HTTPS + auto-LE
- Node.js + Fastify (eller Bun + Hono om du vil ha mindre kald-start)
- In-memory cache per feed (5 min stale, 60 min max). Redis først når > 5 kundar eller > 1 instans.
- DOMPurify (server-side, via JSDOM) for sanitering
- RSS/Atom/RDF-parsing via `fast-xml-parser` (allereie kjend)
- Per-kunde API-nøkkel + per-kunde feed-allowlist (unngå open relay)
- Output: normalisert JSON (`{title, link, pubDate, description, imageUrl}[]`) som webdelen direkte kan rendre — fjernar ~150 LOC frå webdelen.

**Estimat**: 2–3 dagar for første versjon med admin-UI + Stripe/EHF-fakturering. Kan kuttast ned til 1 dag viss du startar med statisk konfig (JSON-fil per kunde).

**Pricing-utkast**: sjå Action 5 over.


## Action 6 — gjort 2026-08-21 (issue #17, sikkerheitsbaseline)

- Triagerte 44 historiske Gitleaks-funn utan å eksponere verdiar. Dei kollapsar til tre
  distinkte verdiar: to finst berre i genererte bundle/prompt-kopiar, og éin er ein
  deterministisk test-fixture. TruffleHog verifiserte null credentials; rotasjon var ikkje
  nødvendig.
- Fjerna `ppllm.prompt.txt`, SharePoint debug-output og `.sppkg` frå indeksen. Eksakte
  `.gitignore`-reglar hindrar at dei kjem tilbake.
- `.gitleaksignore` inneheld berre dei 44 eksakte commit/path/rule/line-fingerprintane. Ein
  regresjonstest avviser breie path- eller regelunntak.
- La til least-privilege GitHub Actions med SHA-pinna actions, full-history checkout,
  differensiell Gitleaks, låst install, sikkerheitskontrakt, produksjonsaudit, lint og build.
- Fjerna den ubrukte `@microsoft/sp-adaptive-card-extension-base`-avhengigheita og dermed den
  sårbare Swiper 8-kjeda. Oppdaterte DOMPurify og støtta transitive versjonar. Både
  `scan-repo` og produksjonsaudit er reine.
- Offentleg historikk blei ikkje omskriven. Dei eksakte false-positive fingerprintane bevarer
  sporbarheit og gjer at nye lekkasjar framleis stoppar CI.

## Action 7 — ferdig og erstatta av SPFx 1.23.2

Den gamle 1.22-branchen blei ikkje merga blindt. Nyaste `main` og tryggleiksbaseline er
samla i PR #20 på SPFx 1.23.2/Heft. Produksjonsaudit er 0, testane og pakken er grøne,
og berre kunde-/tenantkvalifisering står att før deploy.
## Notat

- `spfx-1.22-upgrade` er historisk og skal ikkje mergast; PR #20 erstattar han.
- Codex (background subagent) hangande på SPFx-upgrade-oppgåva ein time inn — eg plukka opp og fullførte manuelt. Læring: codex er bra på avgrensa kodefiksar, mindre på multi-step iterativ pipeline-debugging.
- 35 ucommitterte lokale commits blei pusha av cleanup-subagentane på fleire pol-* / Lye / ask-llm / Synoptik / Tonsofrock repo. Ingenting gått tapt — pusha vidareført.
