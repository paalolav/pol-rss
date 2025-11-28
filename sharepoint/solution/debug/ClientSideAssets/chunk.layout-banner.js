"use strict";
(self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] = self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] || []).push([["layout-banner"],{

/***/ 3529:
/*!************************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/BannerCarousel/BannerCarousel.module.css ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(":root{--gap-xs:4px;--gap-sm:8px;--gap-md:16px;--gap-lg:24px;--gap-xl:32px;--padding-xs:8px;--padding-sm:12px;--padding-md:16px;--padding-lg:24px;--padding-xl:32px}@media (max-width:480px){:root{--gap-lg:20px;--gap-xl:24px;--padding-lg:20px;--padding-xl:24px}}@media print{:root{--gap-md:0.5rem;--gap-lg:0.75rem;--padding-md:0.5rem;--padding-lg:0.75rem;font-size:12pt}body{font-family:Georgia,Times New Roman,serif;line-height:1.5}h1,h2,h3,h4,h5,h6{page-break-after:avoid;page-break-inside:avoid}p{orphans:3;widows:3}}@media (forced-colors:active){a{text-decoration:underline}}:root{--transition-instant:50ms;--transition-fast:150ms;--transition-normal:250ms;--transition-slow:350ms;--transition-slower:500ms;--easing-standard:cubic-bezier(0.4,0,0.2,1);--easing-decelerate:cubic-bezier(0,0,0.2,1);--easing-accelerate:cubic-bezier(0.4,0,1,1);--easing-sharp:cubic-bezier(0.4,0,0.6,1);--easing-bounce:cubic-bezier(0.68,-0.55,0.265,1.55)}@keyframes fadeOut_0f0a0507{0%{opacity:1}to{opacity:0}}@keyframes slideUp_0f0a0507{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideDown_0f0a0507{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideLeft_0f0a0507{0%{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes slideRight_0f0a0507{0%{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}@keyframes scaleIn_0f0a0507{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}@keyframes scaleOut_0f0a0507{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.95)}}@keyframes pulse_0f0a0507{0%,to{opacity:1}50%{opacity:.5}}@keyframes shimmer_0f0a0507{0%{background-position:-200% 0}to{background-position:200% 0}}@keyframes spin_0f0a0507{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes bounce_0f0a0507{0%,20%,50%,80%,to{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}@keyframes shake_0f0a0507{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@keyframes ripple_0f0a0507{0%{opacity:.5;transform:scale(0)}to{opacity:0;transform:scale(2.5)}}.animate-fadeIn_0f0a0507{animation:fadeIn_0f0a0507 var(--transition-normal) var(--easing-decelerate) forwards}.animate-fadeOut_0f0a0507{animation:fadeOut_0f0a0507 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideUp_0f0a0507{animation:slideUp_0f0a0507 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideDown_0f0a0507{animation:slideDown_0f0a0507 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideLeft_0f0a0507{animation:slideLeft_0f0a0507 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideRight_0f0a0507{animation:slideRight_0f0a0507 var(--transition-normal) var(--easing-decelerate) forwards}.animate-scaleIn_0f0a0507{animation:scaleIn_0f0a0507 var(--transition-normal) var(--easing-decelerate) forwards}.animate-spin_0f0a0507{animation:spin_0f0a0507 1s linear infinite}.animate-pulse_0f0a0507{animation:pulse_0f0a0507 2s ease-in-out infinite}.animate-bounce_0f0a0507{animation:bounce_0f0a0507 1s ease infinite}.animate-shake_0f0a0507{animation:shake_0f0a0507 .5s ease-in-out}@media (prefers-reduced-motion:reduce){*,:after,:before{animation-duration:0s!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:0s!important}.animate-fadeIn_0f0a0507,.animate-fadeOut_0f0a0507{animation-duration:.1s!important}}@media print{*,:after,:before{animation:none!important;transition:none!important}}.sr-only-focusable_0f0a0507,.sr-only_0f0a0507{clip:rect(0,0,0,0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.sr-only-focusable_0f0a0507:focus,.sr-only-focusable_0f0a0507:focus-visible{clip:auto;height:auto;margin:0;overflow:visible;padding:0;position:static;white-space:normal;width:auto}.focus-visible_0f0a0507:focus{outline:0}.focus-visible_0f0a0507:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-target_0f0a0507{min-height:44px;min-width:44px}@media (prefers-reduced-motion:reduce){.reduced-motion_0f0a0507{animation-duration:0s!important;animation-iteration-count:1!important;transition-duration:0s!important}}@keyframes ripple-animation_0f0a0507{0%{opacity:.3;transform:scale(0)}to{opacity:0;transform:scale(4)}}.touch-action-manipulation_0f0a0507{touch-action:manipulation}.touch-action-pan-x_0f0a0507{touch-action:pan-x}.touch-action-pan-y_0f0a0507{touch-action:pan-y}.touch-action-none_0f0a0507{touch-action:none}.touch-interactive_0f0a0507{-webkit-tap-highlight-color:transparent;cursor:pointer;min-height:44px;min-width:44px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-interactive_0f0a0507:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-interactive_0f0a0507{transition:none}.touch-interactive_0f0a0507:active{opacity:.8;transform:none}}.touch-button_0f0a0507{-webkit-tap-highlight-color:transparent;align-items:center;cursor:pointer;display:inline-flex;justify-content:center;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-button_0f0a0507:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-button_0f0a0507{transition:none}.touch-button_0f0a0507:active{opacity:.8;transform:none}}.touch-button_0f0a0507:focus{outline:0}.touch-button_0f0a0507:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}@media (forced-colors:active){.touch-button_0f0a0507{background-color:ButtonFace;border:2px solid ButtonText;color:ButtonText}.touch-button_0f0a0507:hover{background-color:Highlight;border-color:Highlight;color:HighlightText}.touch-button_0f0a0507:focus-visible{outline:3px solid Highlight;outline-offset:2px}.touch-button_0f0a0507:disabled{border-color:GrayText;color:GrayText}}.touch-button_0f0a0507.pressed_0f0a0507,.touch-button_0f0a0507[data-pressed=true]{transform:scale(.98)}.touch-card_0f0a0507{-webkit-tap-highlight-color:transparent;cursor:pointer;touch-action:manipulation;transition:transform .15s ease}.touch-card_0f0a0507:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-card_0f0a0507{transition:none}.touch-card_0f0a0507:active{opacity:.8;transform:none}}.touch-card_0f0a0507:focus{outline:0}.touch-card_0f0a0507:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-card_0f0a0507.pressed_0f0a0507,.touch-card_0f0a0507[data-pressed=true]{box-shadow:0 2px 4px rgba(0,0,0,.15);transform:scale(.98)}@media (hover:hover){.touch-card_0f0a0507:hover:not(:active){box-shadow:0 4px 8px rgba(0,0,0,.15);transform:translateY(-2px)}}@media (prefers-reduced-motion:reduce){.touch-card_0f0a0507:hover:not(:active){transform:none}}.touch-link_0f0a0507{-webkit-tap-highlight-color:transparent;color:var(--themePrimary,#0078d4);position:relative;text-decoration:underline;touch-action:manipulation}.touch-link_0f0a0507:after{content:\"\";height:44px;left:50%;min-height:100%;min-width:100%;position:absolute;top:50%;transform:translate(-50%,-50%);width:44px}.touch-link_0f0a0507:focus{outline:0}.touch-link_0f0a0507:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-link_0f0a0507:focus,.touch-link_0f0a0507:hover{text-decoration:none}.touch-link_0f0a0507:active{opacity:.7}@media (prefers-reduced-motion:reduce){.touch-link_0f0a0507:active{opacity:.8}}.touch-list-item_0f0a0507{-webkit-tap-highlight-color:transparent;min-height:44px;padding:12px 16px;position:relative;touch-action:manipulation;transition:background-color .15s ease}.touch-list-item_0f0a0507:active{background-color:var(--neutralLighter)}@media (prefers-reduced-motion:reduce){.touch-list-item_0f0a0507{transition:none}}.touch-list-item_0f0a0507:focus{outline:0}.touch-list-item_0f0a0507:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-list-item_0f0a0507:not(:last-child):after{background-color:var(--neutralLight);bottom:0;content:\"\";height:1px;left:16px;position:absolute;right:16px}.touch-scroll_0f0a0507{-webkit-overflow-scrolling:touch;scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){.touch-scroll_0f0a0507{scroll-behavior:auto}}.touch-scroll-horizontal_0f0a0507{-webkit-overflow-scrolling:touch;-ms-overflow-style:none;display:flex;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;scrollbar-width:none;touch-action:pan-x}@media (prefers-reduced-motion:reduce){.touch-scroll-horizontal_0f0a0507{scroll-behavior:auto}}.touch-scroll-horizontal_0f0a0507::-webkit-scrollbar{display:none}.touch-scroll-item_0f0a0507{flex-shrink:0;scroll-snap-align:start}.touch-input_0f0a0507{-webkit-tap-highlight-color:transparent;font-size:16px;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation}.touch-input_0f0a0507:focus{outline:0}.touch-input_0f0a0507:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.ripple-container_0f0a0507{overflow:hidden;position:relative}.ripple_0f0a0507{animation:ripple-animation_0f0a0507 .6s ease-out forwards;background-color:var(--themePrimary);border-radius:50%;opacity:.3;pointer-events:none;position:absolute;transform:scale(0)}.is-pressed_0f0a0507{transform:scale(.98)!important}.no-tap-highlight_0f0a0507{-webkit-tap-highlight-color:transparent}.no-select_0f0a0507{-ms-user-select:none;user-select:none;-webkit-user-select:none}.bannerCarousel_0f0a0507{aspect-ratio:21/9;background-color:transparent;border-radius:var(--borderRadius,4px);max-height:var(--banner-height,500px);overflow:hidden;position:relative;width:100%}@media (max-width:768px){.bannerCarousel_0f0a0507{aspect-ratio:16/9}}@media (max-width:480px){.bannerCarousel_0f0a0507{aspect-ratio:4/3;max-height:350px}}.swiper_0f0a0507{height:100%;width:100%}.swiper_0f0a0507 .swiper-pagination-horizontal{background:0 0!important;bottom:auto!important;left:auto!important;position:static!important;width:auto!important}.swiper_0f0a0507 .swiper-progressbar,.swiper_0f0a0507 .swiper-scrollbar{display:none!important}.slide_0f0a0507{height:100%;width:100%}.navButton_0f0a0507{align-items:center;background-color:hsla(0,0%,100%,.9);border:none;border-radius:50%;color:var(--neutralPrimary,#333);cursor:pointer;display:flex;height:44px;justify-content:center;opacity:0;padding:0;position:absolute;top:50%;transform:translateY(-50%);transition:background-color .15s ease,transform .15s ease,opacity .15s ease;width:44px;z-index:10}.navButton_0f0a0507:hover{background-color:#fff;transform:translateY(-50%) scale(1.05)}.navButton_0f0a0507:focus-visible{opacity:1;outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.navButton_0f0a0507:active{transform:translateY(-50%) scale(.95)}.navButton_0f0a0507.swiper-button-disabled_0f0a0507{cursor:not-allowed;opacity:.3;pointer-events:none}.navButton_0f0a0507 span{font-size:16px;font-weight:700}.navPrev_0f0a0507{left:16px}.navNext_0f0a0507{right:16px}.bannerCarousel_0f0a0507:focus-within .navButton_0f0a0507,.bannerCarousel_0f0a0507:hover .navButton_0f0a0507{opacity:1}.pagination_0f0a0507{align-items:center!important;background-color:rgba(0,0,0,.5);border-radius:16px;bottom:16px!important;display:flex!important;gap:8px;justify-content:center!important;left:50%!important;padding:8px 12px;position:absolute!important;right:auto!important;transform:translateX(-50%)!important;width:auto!important;z-index:10}.pagination_0f0a0507 .swiper-pagination-bullet{background-color:hsla(0,0%,100%,.5);border-radius:50%;cursor:pointer;height:8px;margin:0!important;opacity:1;transition:background-color .15s ease,transform .15s ease;width:8px}.pagination_0f0a0507 .swiper-pagination-bullet:hover{background-color:hsla(0,0%,100%,.8)}.pagination_0f0a0507 .swiper-pagination-bullet:focus-visible{outline:2px solid #fff;outline-offset:2px}.pagination_0f0a0507 .swiper-pagination-bullet-active{background-color:#fff;transform:scale(1.2)}.pauseIndicator_0f0a0507{align-items:center;animation:fadeIn_0f0a0507 .2s ease;background-color:rgba(0,0,0,.5);border-radius:50%;color:#fff;display:flex;font-size:14px;height:32px;justify-content:center;pointer-events:none;position:absolute;right:16px;top:16px;width:32px;z-index:10}@keyframes fadeIn_0f0a0507{0%{opacity:0}to{opacity:1}}.srOnly_0f0a0507{clip:rect(0,0,0,0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}@media (pointer:coarse){.navButton_0f0a0507{height:48px;opacity:1;width:48px}.navPrev_0f0a0507{left:8px}.navNext_0f0a0507{right:8px}}@media (max-width:600px){.navButton_0f0a0507{height:36px;width:36px}.pagination_0f0a0507{padding:6px 10px}.pagination_0f0a0507 .swiper-pagination-bullet{height:6px;width:6px}}@media (forced-colors:active){.bannerCarousel_0f0a0507{border:1px solid CanvasText}.navButton_0f0a0507{background-color:ButtonFace;border:1px solid ButtonText;color:ButtonText;opacity:1}.pagination_0f0a0507,.pagination_0f0a0507 .swiper-pagination-bullet{background-color:Canvas;border:1px solid CanvasText}.pagination_0f0a0507 .swiper-pagination-bullet-active{background-color:CanvasText}}@media (prefers-reduced-motion:reduce){.navButton_0f0a0507,.pagination_0f0a0507 .swiper-pagination-bullet{transition:none}.pauseIndicator_0f0a0507{animation:none}.swiper_0f0a0507 .swiper-wrapper{transition-duration:0s!important}}@media print{.bannerCarousel_0f0a0507{height:auto;max-height:300px}.navButton_0f0a0507,.pagination_0f0a0507,.pauseIndicator_0f0a0507,.slide_0f0a0507{display:none}.slide_0f0a0507:first-child{display:block}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19zcGFjaW5nLnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdHlwb2dyYXBoeS5zY3NzIiwiZmlsZTovLy9Vc2Vycy9wbG9mL0RvY3VtZW50cy9HaXRodWIvcG9sLXJzcy9zcmMvd2VicGFydHMvcG9sUnNzR2FsbGVyeS9zdHlsZXMvX2FuaW1hdGlvbnMuc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19hY2Nlc3NpYmlsaXR5LnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdG91Y2guc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9sYXlvdXRzL0Jhbm5lckNhcm91c2VsL0Jhbm5lckNhcm91c2VsLm1vZHVsZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXVKQSxNQUVFLFlBQUEsQ0FDQSxZQUFBLENBQ0EsYUFBQSxDQUNBLGFBQUEsQ0FDQSxhQUFBLENBR0EsZ0JBQUEsQ0FDQSxpQkFBQSxDQUNBLGlCQUFBLENBQ0EsaUJBQUEsQ0FDQSxpQkFBQSxDQU9GLHlCQUNFLE1BRUUsYUFBQSxDQUNBLGFBQUEsQ0FDQSxpQkFBQSxDQUNBLGlCQUFBLENBQUEsQ0FRSixhQUNFLE1BRUUsZUFBQSxDQUNBLGdCQUFBLENBQ0EsbUJBQUEsQ0FDQSxvQkFBQSxDQzhIQSxjRDlIQSxDQ2lJ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 */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "animate-fadeIn_0f0a0507": "animate-fadeIn_0f0a0507",
  fadeIn_0f0a0507: "fadeIn_0f0a0507",
  "animate-fadeOut_0f0a0507": "animate-fadeOut_0f0a0507",
  fadeOut_0f0a0507: "fadeOut_0f0a0507",
  "animate-slideUp_0f0a0507": "animate-slideUp_0f0a0507",
  slideUp_0f0a0507: "slideUp_0f0a0507",
  "animate-slideDown_0f0a0507": "animate-slideDown_0f0a0507",
  slideDown_0f0a0507: "slideDown_0f0a0507",
  "animate-slideLeft_0f0a0507": "animate-slideLeft_0f0a0507",
  slideLeft_0f0a0507: "slideLeft_0f0a0507",
  "animate-slideRight_0f0a0507": "animate-slideRight_0f0a0507",
  slideRight_0f0a0507: "slideRight_0f0a0507",
  "animate-scaleIn_0f0a0507": "animate-scaleIn_0f0a0507",
  scaleIn_0f0a0507: "scaleIn_0f0a0507",
  "animate-spin_0f0a0507": "animate-spin_0f0a0507",
  spin_0f0a0507: "spin_0f0a0507",
  "animate-pulse_0f0a0507": "animate-pulse_0f0a0507",
  pulse_0f0a0507: "pulse_0f0a0507",
  "animate-bounce_0f0a0507": "animate-bounce_0f0a0507",
  bounce_0f0a0507: "bounce_0f0a0507",
  "animate-shake_0f0a0507": "animate-shake_0f0a0507",
  shake_0f0a0507: "shake_0f0a0507",
  "sr-only_0f0a0507": "sr-only_0f0a0507",
  "sr-only-focusable_0f0a0507": "sr-only-focusable_0f0a0507",
  "focus-visible_0f0a0507": "focus-visible_0f0a0507",
  "touch-target_0f0a0507": "touch-target_0f0a0507",
  "reduced-motion_0f0a0507": "reduced-motion_0f0a0507",
  "touch-action-manipulation_0f0a0507": "touch-action-manipulation_0f0a0507",
  "touch-action-pan-x_0f0a0507": "touch-action-pan-x_0f0a0507",
  "touch-action-pan-y_0f0a0507": "touch-action-pan-y_0f0a0507",
  "touch-action-none_0f0a0507": "touch-action-none_0f0a0507",
  "touch-interactive_0f0a0507": "touch-interactive_0f0a0507",
  "touch-button_0f0a0507": "touch-button_0f0a0507",
  pressed_0f0a0507: "pressed_0f0a0507",
  "touch-card_0f0a0507": "touch-card_0f0a0507",
  "touch-link_0f0a0507": "touch-link_0f0a0507",
  "touch-list-item_0f0a0507": "touch-list-item_0f0a0507",
  "touch-scroll_0f0a0507": "touch-scroll_0f0a0507",
  "touch-scroll-horizontal_0f0a0507": "touch-scroll-horizontal_0f0a0507",
  "touch-scroll-item_0f0a0507": "touch-scroll-item_0f0a0507",
  "touch-input_0f0a0507": "touch-input_0f0a0507",
  "ripple-container_0f0a0507": "ripple-container_0f0a0507",
  ripple_0f0a0507: "ripple_0f0a0507",
  "ripple-animation_0f0a0507": "ripple-animation_0f0a0507",
  "is-pressed_0f0a0507": "is-pressed_0f0a0507",
  "no-tap-highlight_0f0a0507": "no-tap-highlight_0f0a0507",
  "no-select_0f0a0507": "no-select_0f0a0507",
  bannerCarousel_0f0a0507: "bannerCarousel_0f0a0507",
  swiper_0f0a0507: "swiper_0f0a0507",
  "swiper-pagination-horizontal": "swiper-pagination-horizontal",
  "swiper-progressbar": "swiper-progressbar",
  "swiper-scrollbar": "swiper-scrollbar",
  slide_0f0a0507: "slide_0f0a0507",
  navButton_0f0a0507: "navButton_0f0a0507",
  "swiper-button-disabled_0f0a0507": "swiper-button-disabled_0f0a0507",
  navPrev_0f0a0507: "navPrev_0f0a0507",
  navNext_0f0a0507: "navNext_0f0a0507",
  pagination_0f0a0507: "pagination_0f0a0507",
  "swiper-pagination-bullet": "swiper-pagination-bullet",
  "swiper-pagination-bullet-active": "swiper-pagination-bullet-active",
  pauseIndicator_0f0a0507: "pauseIndicator_0f0a0507",
  srOnly_0f0a0507: "srOnly_0f0a0507",
  "swiper-wrapper": "swiper-wrapper",
  scaleOut_0f0a0507: "scaleOut_0f0a0507",
  shimmer_0f0a0507: "shimmer_0f0a0507"
});


/***/ }),

/***/ 1621:
/*!****************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/BannerCarousel/BannerCarousel.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BannerCarousel: () => (/* binding */ BannerCarousel),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var swiper_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! swiper/react */ 4563);
/* harmony import */ var swiper_modules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! swiper/modules */ 5189);
/* harmony import */ var swiper_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! swiper/css */ 8445);
/* harmony import */ var swiper_css_autoplay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! swiper/css/autoplay */ 8380);
/* harmony import */ var swiper_css_navigation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! swiper/css/navigation */ 5657);
/* harmony import */ var swiper_css_pagination__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! swiper/css/pagination */ 7739);
/* harmony import */ var _shared_FeedItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/FeedItem */ 8278);
/* harmony import */ var _shared_Skeleton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shared/Skeleton */ 990);
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/EmptyState */ 7323);
/* harmony import */ var _BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./BannerCarousel.module.scss */ 1285);
/**
 * BannerCarousel Component
 *
 * A carousel/banner layout for displaying RSS feed items as slides.
 * Uses Swiper for carousel functionality with enhanced accessibility.
 *
 * Features:
 * - Keyboard navigation
 * - Screen reader support with live region
 * - Pause on hover/focus
 * - Touch swipe gestures
 * - Configurable autoplay
 * - Custom navigation controls
 */












/**
 * Max height presets in pixels (container uses aspect-ratio for dynamic sizing)
 */
const heightPresets = {
    sm: '350px',
    md: '500px',
    lg: '600px',
    auto: 'none'
};
/**
 * BannerCarousel component
 */
const BannerCarousel = ({ items, autoplay = true, interval = 5, showNavigation = true, showPagination = true, pauseOnHover = true, height = 'md', fallbackImageUrl, forceFallback = false, hideImages = false, showPubDate = true, showDescription = true, isLoading = false, onItemClick, className = '', testId = 'banner-carousel' }) => {
    const [swiperInstance, setSwiperInstance] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
    const [isPaused, setIsPaused] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    // Key for forcing re-render when forceFallback changes
    const [carouselKey, setCarouselKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setCarouselKey(prev => prev + 1);
    }, [forceFallback]);
    // Handle slide change
    const handleSlideChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((swiper) => {
        setCurrentSlide(swiper.realIndex + 1);
    }, []);
    // Pause autoplay on focus/hover
    const handlePause = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        if (pauseOnHover && (swiperInstance === null || swiperInstance === void 0 ? void 0 : swiperInstance.autoplay)) {
            swiperInstance.autoplay.stop();
            setIsPaused(true);
        }
    }, [pauseOnHover, swiperInstance]);
    const handleResume = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        if (pauseOnHover && (swiperInstance === null || swiperInstance === void 0 ? void 0 : swiperInstance.autoplay) && autoplay) {
            swiperInstance.autoplay.start();
            setIsPaused(false);
        }
    }, [pauseOnHover, swiperInstance, autoplay]);
    // Handle item click
    const handleItemClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((item, event) => {
        event.preventDefault();
        if (onItemClick) {
            onItemClick(item);
        }
        else {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        }
    }, [onItemClick]);
    // Container styles
    const containerStyle = {
        '--banner-height': heightPresets[height],
        '--banner-content-padding-bottom': showPagination && items.length > 1 ? '48px' : '24px'
    };
    // Container classes
    const containerClasses = [
        _BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].bannerCarousel,
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, style: containerStyle, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_Skeleton__WEBPACK_IMPORTED_MODULE_8__.BannerSkeleton, { height: heightPresets[height], showDescription: showDescription })));
    }
    // Empty state
    if (!items || items.length === 0) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, style: containerStyle, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_9__.NoItemsEmptyState, null)));
    }
    const delayMs = interval * 1000;
    const totalSlides = items.length;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { ref: containerRef, className: containerClasses, style: containerStyle, "data-testid": testId, onMouseEnter: handlePause, onMouseLeave: handleResume, onFocus: handlePause, onBlur: handleResume, role: "region", "aria-roledescription": "karusell", "aria-label": `Nyhetskarusell, ${totalSlides} lysbilder` },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_1__.Swiper, { key: carouselKey, modules: [swiper_modules__WEBPACK_IMPORTED_MODULE_2__.Autoplay, swiper_modules__WEBPACK_IMPORTED_MODULE_2__.Navigation, swiper_modules__WEBPACK_IMPORTED_MODULE_2__.Pagination, swiper_modules__WEBPACK_IMPORTED_MODULE_2__.Keyboard, swiper_modules__WEBPACK_IMPORTED_MODULE_2__.A11y], onSwiper: setSwiperInstance, onSlideChange: handleSlideChange, slidesPerView: 1, spaceBetween: 0, loop: items.length > 1, autoplay: autoplay && items.length > 1 ? {
                delay: delayMs,
                disableOnInteraction: false,
                pauseOnMouseEnter: pauseOnHover
            } : false, navigation: showNavigation && items.length > 1 ? {
                nextEl: `.${_BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].navNext}`,
                prevEl: `.${_BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].navPrev}`
            } : false, pagination: showPagination && items.length > 1 ? {
                clickable: true,
                el: `.${_BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].pagination}`
            } : false, keyboard: {
                enabled: true,
                onlyInViewport: true
            }, a11y: {
                enabled: true,
                prevSlideMessage: 'Forrige lysbilde',
                nextSlideMessage: 'Neste lysbilde',
                firstSlideMessage: 'Dette er første lysbilde',
                lastSlideMessage: 'Dette er siste lysbilde',
                paginationBulletMessage: 'Gå til lysbilde {{index}}'
            }, className: _BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].swiper }, items.map((item, index) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(swiper_react__WEBPACK_IMPORTED_MODULE_1__.SwiperSlide, { key: `${item.link}-${index}`, className: _BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].slide, role: "group", "aria-roledescription": "lysbilde", "aria-label": `${index + 1} av ${totalSlides}: ${item.title}` },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_FeedItem__WEBPACK_IMPORTED_MODULE_7__.FeedItem, { item: item, variant: "banner", showImage: !hideImages, showDescription: showDescription, showDate: showPubDate, fallbackImageUrl: fallbackImageUrl, forceFallback: forceFallback, onItemClick: handleItemClick, descriptionTruncation: { maxLines: 2, maxChars: 150 }, imageAspectRatio: "auto", testId: `${testId}-item-${index}` }))))),
        showNavigation && items.length > 1 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: `${_BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].navButton} ${_BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].navPrev}`, "aria-label": "Forrige lysbilde", "data-testid": `${testId}-prev` },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: `${_BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].navButton} ${_BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].navNext}`, "aria-label": "Neste lysbilde", "data-testid": `${testId}-next` },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })))),
        showPagination && items.length > 1 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].pagination, "data-testid": `${testId}-pagination` })),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { "aria-live": "polite", "aria-atomic": "true", className: _BannerCarousel_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].srOnly },
            "Lysbilde ",
            currentSlide,
            " av ",
            totalSlides,
            isPaused && ' (pauset)')));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (react__WEBPACK_IMPORTED_MODULE_0__.memo(BannerCarousel));


/***/ }),

/***/ 1285:
/*!****************************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/BannerCarousel/BannerCarousel.module.scss.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./BannerCarousel.module.css */ 3529);
const styles = {
    'animate-fadeIn': 'animate-fadeIn_0f0a0507',
    fadeIn: 'fadeIn_0f0a0507',
    'animate-fadeOut': 'animate-fadeOut_0f0a0507',
    fadeOut: 'fadeOut_0f0a0507',
    'animate-slideUp': 'animate-slideUp_0f0a0507',
    slideUp: 'slideUp_0f0a0507',
    'animate-slideDown': 'animate-slideDown_0f0a0507',
    slideDown: 'slideDown_0f0a0507',
    'animate-slideLeft': 'animate-slideLeft_0f0a0507',
    slideLeft: 'slideLeft_0f0a0507',
    'animate-slideRight': 'animate-slideRight_0f0a0507',
    slideRight: 'slideRight_0f0a0507',
    'animate-scaleIn': 'animate-scaleIn_0f0a0507',
    scaleIn: 'scaleIn_0f0a0507',
    'animate-spin': 'animate-spin_0f0a0507',
    spin: 'spin_0f0a0507',
    'animate-pulse': 'animate-pulse_0f0a0507',
    pulse: 'pulse_0f0a0507',
    'animate-bounce': 'animate-bounce_0f0a0507',
    bounce: 'bounce_0f0a0507',
    'animate-shake': 'animate-shake_0f0a0507',
    shake: 'shake_0f0a0507',
    'sr-only': 'sr-only_0f0a0507',
    'sr-only-focusable': 'sr-only-focusable_0f0a0507',
    'focus-visible': 'focus-visible_0f0a0507',
    'touch-target': 'touch-target_0f0a0507',
    'reduced-motion': 'reduced-motion_0f0a0507',
    'touch-action-manipulation': 'touch-action-manipulation_0f0a0507',
    'touch-action-pan-x': 'touch-action-pan-x_0f0a0507',
    'touch-action-pan-y': 'touch-action-pan-y_0f0a0507',
    'touch-action-none': 'touch-action-none_0f0a0507',
    'touch-interactive': 'touch-interactive_0f0a0507',
    'touch-button': 'touch-button_0f0a0507',
    pressed: 'pressed_0f0a0507',
    'touch-card': 'touch-card_0f0a0507',
    'touch-link': 'touch-link_0f0a0507',
    'touch-list-item': 'touch-list-item_0f0a0507',
    'touch-scroll': 'touch-scroll_0f0a0507',
    'touch-scroll-horizontal': 'touch-scroll-horizontal_0f0a0507',
    'touch-scroll-item': 'touch-scroll-item_0f0a0507',
    'touch-input': 'touch-input_0f0a0507',
    'ripple-container': 'ripple-container_0f0a0507',
    ripple: 'ripple_0f0a0507',
    'ripple-animation': 'ripple-animation_0f0a0507',
    'is-pressed': 'is-pressed_0f0a0507',
    'no-tap-highlight': 'no-tap-highlight_0f0a0507',
    'no-select': 'no-select_0f0a0507',
    bannerCarousel: 'bannerCarousel_0f0a0507',
    swiper: 'swiper_0f0a0507',
    slide: 'slide_0f0a0507',
    navButton: 'navButton_0f0a0507',
    'swiper-button-disabled': 'swiper-button-disabled_0f0a0507',
    navPrev: 'navPrev_0f0a0507',
    navNext: 'navNext_0f0a0507',
    pagination: 'pagination_0f0a0507',
    pauseIndicator: 'pauseIndicator_0f0a0507',
    srOnly: 'srOnly_0f0a0507',
    scaleOut: 'scaleOut_0f0a0507',
    shimmer: 'shimmer_0f0a0507'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 7641:
/*!*******************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/BannerCarousel/index.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BannerCarousel: () => (/* reexport safe */ _BannerCarousel__WEBPACK_IMPORTED_MODULE_0__.BannerCarousel),
/* harmony export */   "default": () => (/* reexport safe */ _BannerCarousel__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _BannerCarousel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BannerCarousel */ 1621);
/**
 * BannerCarousel Component Exports
 */



/***/ })

}]);
//# sourceMappingURL=chunk.layout-banner.js.map