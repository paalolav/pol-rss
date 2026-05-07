---
name: spfx-property-pane-reactivity
description: Decision framework for reactive vs non-reactive property pane behavior in SPFx.
---

# SPFx Property Pane Reactivity

## Use for

1. Selecting reactive or non-reactive property pane behavior.
2. Reducing noisy rerender behavior from property edits.

## Do not use for

1. Business logic unrelated to property pane experience.
2. Styling-only tasks.

## Trigger conditions

1. New or updated property pane fields.
2. Performance or UX issues while editing web part properties.

## Enterprise guardrails

1. Prefer reactive for lightweight immediate feedback.
2. Prefer non-reactive for expensive operations or external calls.
3. Clearly signal apply behavior to users.

## Output expectations

1. Predictable property-edit experience.
2. Reduced edit-time performance regressions.

## Typical target paths (any SPFx project)

1. `src/webparts/**/**WebPart.ts`

