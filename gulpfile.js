'use strict';

const build = require('@microsoft/sp-build-web');

// Suppress SASS camelCase warnings for CSS class naming conventions
// These are valid class names used for accessibility, animation, and touch utilities
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Accessibility utilities
build.addSuppression(`Warning - [sass] The local CSS class 'sr-only' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'sr-only-focusable' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'focus-visible' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'reduced-motion' is not camelCase and will not be type-safe.`);

// Animation utilities
build.addSuppression(`Warning - [sass] The local CSS class 'animate-fadeIn' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-fadeOut' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-slideUp' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-slideDown' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-slideLeft' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-slideRight' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-scaleIn' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-spin' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-pulse' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-bounce' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'animate-shake' is not camelCase and will not be type-safe.`);

// Touch utilities
build.addSuppression(`Warning - [sass] The local CSS class 'touch-target' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-action-manipulation' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-action-pan-x' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-action-pan-y' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-action-none' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-interactive' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-button' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-card' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-link' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-list-item' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-scroll' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-scroll-horizontal' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-scroll-item' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'touch-input' is not camelCase and will not be type-safe.`);

// Interaction utilities
build.addSuppression(`Warning - [sass] The local CSS class 'ripple-container' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'ripple-animation' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'is-pressed' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'no-tap-highlight' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'no-select' is not camelCase and will not be type-safe.`);

// Third-party library classes (Swiper)
build.addSuppression(`Warning - [sass] The local CSS class 'swiper-button-disabled' is not camelCase and will not be type-safe.`);

// Gallery layout classes
build.addSuppression(`Warning - [sass] The local CSS class 'columns-2' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'columns-3' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'columns-4' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'title-none' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'title-hover' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'title-below' is not camelCase and will not be type-safe.`);

// Suppress console.log warnings for debug/logging utilities (expected behavior)
build.addSuppression(/Warning - lint - .+errorLogger\.ts.+ error no-console/);
build.addSuppression(/Warning - lint - .+performanceMonitor\.ts.+ error no-console/);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));
