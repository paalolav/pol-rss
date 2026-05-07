---
name: spfx-enterprise-code-and-performance
description: Coding, performance, and best-practice guidance for SPFx web parts and extensions, including data access (REST, Graph, PnPjs), recommended npm packages, and sample patterns.
---

# SPFx Enterprise Code & Performance Guidance

Use this skill whenever you are **writing or reviewing SPFx code**, not just UX:

- Choosing data access approach (SP REST, Microsoft Graph, PnPjs).
- Structuring services, hooks, and components.
- Applying performance best practices (bundle size, network calls, rendering).
- Selecting commonly accepted npm packages for SPFx.

This skill is **code-focused**; pair it with:
- `spfx-enterprise-design-core` + `spfx-accessibility-and-content-quality` for UX.
- `spfx-theme-and-brand-integration` + `spfx-css-and-styling-governance` for theming and styling.

---

## 1. Overall architectural patterns

1. **Separation of concerns**
   - Web parts and extensions should be **thin shells**; move logic into:
     - `services/` (data access, domain logic)
     - `components/` (pure React views + small view-model logic)
     - `hooks/` (reusable state/data hooks)

2. **Typed contracts everywhere**
   - Define interfaces for all external data:
```ts
export interface ISiteRiskSummary {
  siteId: string;
  title: string;
  url: string;
  riskScore: number;
  externalUsersCount: number;
}
```

3. **Avoid static singletons bound to web part instances**
   - Pass context or service instances via props or React context.

---

## 2. Data access: REST, Graph, and PnPjs

### 2.1 Recommended stack

- **SharePoint REST** or **PnPjs (`@pnp/sp`)** for SharePoint data.
- **Microsoft Graph** or **PnPjs `@pnp/graph`** for cross-service data.
- Prefer **PnPjs** for:
  - Cleaner, fluent APIs.
  - Built-in support for batching, caching, and error handling.

Install (example):
```bash
npm install @pnp/sp @pnp/graph @pnp/logging @pnp/common @pnp/odata --save
```

Initialize PnPjs once per web part/extension in `onInit`:

```ts
import { sp } from '@pnp/sp';
import { SPFx } from '@pnp/spfx';

protected async onInit(): Promise<void> {
  await super.onInit();

  sp.setup({
    spfxContext: this.context
  });
}
```

### 2.2 Sample data service with PnPjs

```ts
// services/SiteRiskService.ts
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import { ISiteRiskSummary } from '../models/ISiteRiskSummary';

export class SiteRiskService {
  public async getTopRiskSites(take: number = 20): Promise<ISiteRiskSummary[]> {
    const items = await sp.web.lists.getByTitle('SiteRisk').items
      .select('Id,Title,SiteUrl,RiskScore,ExternalUsersCount')
      .orderBy('RiskScore', false)
      .top(take)();

    return items.map(i => ({
      siteId: i.Id.toString(),
      title: i.Title,
      url: i.SiteUrl,
      riskScore: i.RiskScore,
      externalUsersCount: i.ExternalUsersCount
    }));
  }
}
```

Guidelines:
- Keep REST calls in service classes; **never spread raw REST URLs across components**.
- Use `select`/`expand` to retrieve only necessary fields.
- Prefer `top()` + paging over fetching entire lists.

---

## 3. Performance best practices

### 3.1 Bundle size

1. **Use SPFx/SharePoint provided frameworks**
   - Don’t bundle your own React/Fluent UI when SPFx already provides them.

2. **Avoid large general-purpose libraries**
   - Prefer small, focused utilities (e.g., `date-fns` over `moment`).

3. **Use dynamic imports for heavy, low-frequency features**

```ts
const LazyDetailsPanel = React.lazy(() =>
  import(/* webpackChunkName: 'details-panel' */ './DetailsPanel')
);
```

### 3.2 Network performance

1. **Batching** (PnPjs):
```ts
import { sp } from '@pnp/sp';

const [batchedSP, execute] = sp.batched();

const sitesPromise = batchedSP.web.lists.getByTitle('Sites').items.top(100)();
const policiesPromise = batchedSP.web.lists.getByTitle('Policies').items.top(100)();

await execute();

const [sites, policies] = await Promise.all([sitesPromise, policiesPromise]);
```

2. **Caching** frequently used reference data (PnPjs `caching`).

3. **Avoid chatty patterns**
   - No 1 REST call per row; use filter, aggregation, or batched reads.

### 3.3 Rendering performance

1. Use **React memoization** for heavy child components:
```ts
export const RiskTile = React.memo((props: IRiskTileProps) => {
  // render
});
```

2. Use **windowing/virtualization** for large lists (e.g., `@fluentui/react` `DetailsList` with `onRenderMissingItem` or third-party virtual list control, where appropriate and allowed).

3. Avoid heavy computation in `render`; pre-compute in hooks or services.

---

## 4. Recommended npm packages (baseline)

When allowed by your governance, consider:

- **`@pnp/sp`, `@pnp/graph`** – Fluent, typed access to SharePoint and Graph.
- **`@fluentui/react`** – Microsoft design-system components, already aligned with M365.
- **`date-fns`** – Lightweight date utilities.
- **`lodash-es` (cherry-picked)** – Utility helpers; ensure tree-shaken imports (`import debounce from 'lodash-es/debounce'`).

Avoid:
- Very large UI frameworks that duplicate Fluent UI.
- Runtime styling frameworks that don’t align with SPFx theming unless explicitly approved.

---

## 5. Error handling & logging

1. Centralize error handling in services:
```ts
public async getData(): Promise<IData[]> {
  try {
    return await sp.web.lists.getByTitle('Data').items();
  } catch (error) {
    // Optionally log to App Insights or console in dev
    console.error('Failed to load data', error);
    throw error; // Let UI decide how to present the failure
  }
}
```

2. UI components **translate errors into friendly messages**; never leak raw error objects.

3. For production monitoring, integrate **Application Insights** where allowed.

---

## 6. How AI editors should use this skill

When generating or reviewing SPFx code:

1. **Pick data access style**: Prefer PnPjs for SharePoint/Graph; keep calls in services.
2. **Enforce typing**: Define interfaces for all external data and props.
3. **Apply performance patterns**: batching, caching, lazy loading, memoization, tree shaking.
4. **Recommend safe npm packages**: Refer to the list above and avoid unnecessary heavy dependencies.
5. **Ensure maintainability**: Thin web part/extension classes, clear services, and reusable hooks/components.

Use this alongside the design, theming, and toolchain skills to produce **enterprise-grade SPFx solutions** that are fast, maintainable, and aligned with Microsoft’s guidance.
