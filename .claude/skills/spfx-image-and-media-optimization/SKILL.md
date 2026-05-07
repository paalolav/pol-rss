---
name: spfx-image-and-media-optimization
description: SPFx image and media optimization patterns for responsive and performance-aware experiences.
---

# SPFx Image and Media Optimization

## Use for

1. Image-heavy web parts or dashboard cards.
2. Responsive media handling and display performance.
3. Integration with SPFx image helper guidance.

## Do not use for

1. Non-media feature work.
2. Pure build pipeline tuning.

## Trigger conditions

1. New image rendering requirements.
2. Slow image loading or layout shift issues.

## Enterprise guardrails

1. Optimize for page performance and perceived load speed.
2. Avoid oversized assets in default views.
3. Preserve accessibility metadata for images.

## Output expectations

1. Faster image rendering paths.
2. Better responsive behavior across viewport sizes.

## Typical target paths (any SPFx project)

1. `src/webparts/**/assets`
2. `src/webparts/**/components`

