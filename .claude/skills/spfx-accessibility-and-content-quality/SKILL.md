---
name: spfx-accessibility-and-content-quality
description: Accessibility and UX text quality guidance for enterprise SPFx experiences.
---

# SPFx Accessibility and Content Quality

## Use for

1. Keyboard, focus, and screen-reader validation.
2. Placeholder/fallback/empty/error state quality.
3. UI text clarity, tone, and actionability.

## Do not use for

1. Build pipeline changes.
2. Back-end/service-only updates with no UI impact.

## Trigger conditions

1. New command surfaces or interaction flows.
2. Any user-visible text or state model changes.

## Enterprise guardrails

1. Ensure non-mouse operation parity.
2. Avoid ambiguous microcopy.
3. Provide clear recovery paths from error and empty states.

## Output expectations

1. Accessible and understandable UI.
2. Reduced support burden from unclear interactions.

## Typical target paths (any SPFx project)

1. `src/webparts/**/components`
2. `src/shared/components`
3. `src/shared/licensing-ui`

