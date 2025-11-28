"use strict";
(self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] = self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] || []).push([["layout-card"],{

/***/ 1152:
/*!*************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/ResponsiveGrid.module.css ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(":root{--gap-xs:4px;--gap-sm:8px;--gap-md:16px;--gap-lg:24px;--gap-xl:32px}.responsiveGrid_44aad4a0{display:grid;gap:var(--grid-gap,16px);grid-template-columns:repeat(auto-fit,minmax(min(100%,var(--min-item-width,280px)),1fr));width:100%}@supports (container-type:inline-size){.responsiveGrid_44aad4a0{container-type:inline-size}}.responsiveGrid_44aad4a0>*{animation:fadeIn_44aad4a0 .2s ease-out}.centered_44aad4a0{justify-content:center}.gridItem_44aad4a0{min-width:0;width:100%}@keyframes fadeIn_44aad4a0{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}@media (max-width:480px){.responsiveGrid_44aad4a0{--gap-md:12px;--gap-lg:16px;--gap-xl:20px}}@media print{.responsiveGrid_44aad4a0{display:block!important}.responsiveGrid_44aad4a0>*{break-inside:avoid;margin-bottom:1rem;page-break-inside:avoid}}@media (forced-colors:active){.responsiveGrid_44aad4a0{gap:2px}.gridItem_44aad4a0{border:1px solid CanvasText}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9SZXNwb25zaXZlR3JpZC5tb2R1bGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUNFLFlBQUEsQ0FDQSxZQUFBLENBQ0EsYUFBQSxDQUNBLGFBQUEsQ0FDQSxhQUFBLENBR0YseUJBQ0UsWUFBQSxDQVVBLHdCQUFBLENBTEEsd0ZBQUEsQ0FKQSxVQVNBLENBSUEsdUNBZkYseUJBZ0JJLDBCQUFBLENBQUEsQ0FJRiwyQkFDRSxzQ0FBQSxDQUtKLG1CQUNFLHNCQUFBLENBSUYsbUJBQ0UsV0FBQSxDQUNBLFVBQUEsQ0FJRiwyQkFDRSxHQUNFLFNBQUEsQ0FDQSx5QkFBQSxDQUVGLEdBQ0UsU0FBQSxDQUNBLHVCQUFBLENBQUEsQ0FLSix5QkFDRSx5QkFDRSxhQUFBLENBQ0EsYUFBQSxDQUNBLGFBQUEsQ0FBQSxDQUtKLGFBQ0UseUJBQ0UsdUJBQUEsQ0FFQSwyQkFFRSxrQkFBQSxDQURBLGtCQUFBLENBRUEsdUJBQUEsQ0FBQSxDQU1OLDhCQUNFLHlCQUNFLE9BQUEsQ0FHRixtQkFDRSwyQkFBQSxDQUFBIiwiZmlsZSI6IlJlc3BvbnNpdmVHcmlkLm1vZHVsZS5jc3MifQ== */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  responsiveGrid_44aad4a0: "responsiveGrid_44aad4a0",
  fadeIn_44aad4a0: "fadeIn_44aad4a0",
  centered_44aad4a0: "centered_44aad4a0",
  gridItem_44aad4a0: "gridItem_44aad4a0"
});


/***/ }),

/***/ 4597:
/*!****************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/CardLayout/CardLayout.module.css ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(":root{--gap-xs:4px;--gap-sm:8px;--gap-md:16px;--gap-lg:24px;--gap-xl:32px;--padding-xs:8px;--padding-sm:12px;--padding-md:16px;--padding-lg:24px;--padding-xl:32px}@media (max-width:480px){:root{--gap-lg:20px;--gap-xl:24px;--padding-lg:20px;--padding-xl:24px}}@media print{:root{--gap-md:0.5rem;--gap-lg:0.75rem;--padding-md:0.5rem;--padding-lg:0.75rem;font-size:12pt}body{font-family:Georgia,Times New Roman,serif;line-height:1.5}h1,h2,h3,h4,h5,h6{page-break-after:avoid;page-break-inside:avoid}p{orphans:3;widows:3}}@media (forced-colors:active){a{text-decoration:underline}}:root{--transition-instant:50ms;--transition-fast:150ms;--transition-normal:250ms;--transition-slow:350ms;--transition-slower:500ms;--easing-standard:cubic-bezier(0.4,0,0.2,1);--easing-decelerate:cubic-bezier(0,0,0.2,1);--easing-accelerate:cubic-bezier(0.4,0,1,1);--easing-sharp:cubic-bezier(0.4,0,0.6,1);--easing-bounce:cubic-bezier(0.68,-0.55,0.265,1.55)}@keyframes fadeIn_2d08f4bc{0%{opacity:0}to{opacity:1}}@keyframes fadeOut_2d08f4bc{0%{opacity:1}to{opacity:0}}@keyframes slideUp_2d08f4bc{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideDown_2d08f4bc{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideLeft_2d08f4bc{0%{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes slideRight_2d08f4bc{0%{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}@keyframes scaleIn_2d08f4bc{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}@keyframes scaleOut_2d08f4bc{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.95)}}@keyframes pulse_2d08f4bc{0%,to{opacity:1}50%{opacity:.5}}@keyframes shimmer_2d08f4bc{0%{background-position:-200% 0}to{background-position:200% 0}}@keyframes spin_2d08f4bc{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes bounce_2d08f4bc{0%,20%,50%,80%,to{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}@keyframes shake_2d08f4bc{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@keyframes ripple_2d08f4bc{0%{opacity:.5;transform:scale(0)}to{opacity:0;transform:scale(2.5)}}.animate-fadeIn_2d08f4bc{animation:fadeIn_2d08f4bc var(--transition-normal) var(--easing-decelerate) forwards}.animate-fadeOut_2d08f4bc{animation:fadeOut_2d08f4bc var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideUp_2d08f4bc{animation:slideUp_2d08f4bc var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideDown_2d08f4bc{animation:slideDown_2d08f4bc var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideLeft_2d08f4bc{animation:slideLeft_2d08f4bc var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideRight_2d08f4bc{animation:slideRight_2d08f4bc var(--transition-normal) var(--easing-decelerate) forwards}.animate-scaleIn_2d08f4bc{animation:scaleIn_2d08f4bc var(--transition-normal) var(--easing-decelerate) forwards}.animate-spin_2d08f4bc{animation:spin_2d08f4bc 1s linear infinite}.animate-pulse_2d08f4bc{animation:pulse_2d08f4bc 2s ease-in-out infinite}.animate-bounce_2d08f4bc{animation:bounce_2d08f4bc 1s ease infinite}.animate-shake_2d08f4bc{animation:shake_2d08f4bc .5s ease-in-out}@media (prefers-reduced-motion:reduce){*,:after,:before{animation-duration:0s!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:0s!important}.animate-fadeIn_2d08f4bc,.animate-fadeOut_2d08f4bc{animation-duration:.1s!important}}@media print{*,:after,:before{animation:none!important;transition:none!important}}.sr-only-focusable_2d08f4bc,.sr-only_2d08f4bc{clip:rect(0,0,0,0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.sr-only-focusable_2d08f4bc:focus,.sr-only-focusable_2d08f4bc:focus-visible{clip:auto;height:auto;margin:0;overflow:visible;padding:0;position:static;white-space:normal;width:auto}.focus-visible_2d08f4bc:focus{outline:0}.focus-visible_2d08f4bc:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-target_2d08f4bc{min-height:44px;min-width:44px}@media (prefers-reduced-motion:reduce){.reduced-motion_2d08f4bc{animation-duration:0s!important;animation-iteration-count:1!important;transition-duration:0s!important}}@keyframes ripple-animation_2d08f4bc{0%{opacity:.3;transform:scale(0)}to{opacity:0;transform:scale(4)}}.touch-action-manipulation_2d08f4bc{touch-action:manipulation}.touch-action-pan-x_2d08f4bc{touch-action:pan-x}.touch-action-pan-y_2d08f4bc{touch-action:pan-y}.touch-action-none_2d08f4bc{touch-action:none}.touch-interactive_2d08f4bc{-webkit-tap-highlight-color:transparent;cursor:pointer;min-height:44px;min-width:44px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-interactive_2d08f4bc:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-interactive_2d08f4bc{transition:none}.touch-interactive_2d08f4bc:active{opacity:.8;transform:none}}.touch-button_2d08f4bc{-webkit-tap-highlight-color:transparent;align-items:center;cursor:pointer;display:inline-flex;justify-content:center;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-button_2d08f4bc:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-button_2d08f4bc{transition:none}.touch-button_2d08f4bc:active{opacity:.8;transform:none}}.touch-button_2d08f4bc:focus{outline:0}.touch-button_2d08f4bc:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}@media (forced-colors:active){.touch-button_2d08f4bc{background-color:ButtonFace;border:2px solid ButtonText;color:ButtonText}.touch-button_2d08f4bc:hover{background-color:Highlight;border-color:Highlight;color:HighlightText}.touch-button_2d08f4bc:focus-visible{outline:3px solid Highlight;outline-offset:2px}.touch-button_2d08f4bc:disabled{border-color:GrayText;color:GrayText}}.touch-button_2d08f4bc.pressed_2d08f4bc,.touch-button_2d08f4bc[data-pressed=true]{transform:scale(.98)}.touch-card_2d08f4bc{-webkit-tap-highlight-color:transparent;cursor:pointer;touch-action:manipulation;transition:transform .15s ease}.touch-card_2d08f4bc:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-card_2d08f4bc{transition:none}.touch-card_2d08f4bc:active{opacity:.8;transform:none}}.touch-card_2d08f4bc:focus{outline:0}.touch-card_2d08f4bc:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-card_2d08f4bc.pressed_2d08f4bc,.touch-card_2d08f4bc[data-pressed=true]{box-shadow:0 2px 4px rgba(0,0,0,.15);transform:scale(.98)}@media (hover:hover){.touch-card_2d08f4bc:hover:not(:active){box-shadow:0 4px 8px rgba(0,0,0,.15);transform:translateY(-2px)}}@media (prefers-reduced-motion:reduce){.touch-card_2d08f4bc:hover:not(:active){transform:none}}.touch-link_2d08f4bc{-webkit-tap-highlight-color:transparent;color:var(--themePrimary,#0078d4);position:relative;text-decoration:underline;touch-action:manipulation}.touch-link_2d08f4bc:after{content:\"\";height:44px;left:50%;min-height:100%;min-width:100%;position:absolute;top:50%;transform:translate(-50%,-50%);width:44px}.touch-link_2d08f4bc:focus{outline:0}.touch-link_2d08f4bc:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-link_2d08f4bc:focus,.touch-link_2d08f4bc:hover{text-decoration:none}.touch-link_2d08f4bc:active{opacity:.7}@media (prefers-reduced-motion:reduce){.touch-link_2d08f4bc:active{opacity:.8}}.touch-list-item_2d08f4bc{-webkit-tap-highlight-color:transparent;min-height:44px;padding:12px 16px;position:relative;touch-action:manipulation;transition:background-color .15s ease}.touch-list-item_2d08f4bc:active{background-color:var(--neutralLighter)}@media (prefers-reduced-motion:reduce){.touch-list-item_2d08f4bc{transition:none}}.touch-list-item_2d08f4bc:focus{outline:0}.touch-list-item_2d08f4bc:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-list-item_2d08f4bc:not(:last-child):after{background-color:var(--neutralLight);bottom:0;content:\"\";height:1px;left:16px;position:absolute;right:16px}.touch-scroll_2d08f4bc{-webkit-overflow-scrolling:touch;scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){.touch-scroll_2d08f4bc{scroll-behavior:auto}}.touch-scroll-horizontal_2d08f4bc{-webkit-overflow-scrolling:touch;-ms-overflow-style:none;display:flex;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;scrollbar-width:none;touch-action:pan-x}@media (prefers-reduced-motion:reduce){.touch-scroll-horizontal_2d08f4bc{scroll-behavior:auto}}.touch-scroll-horizontal_2d08f4bc::-webkit-scrollbar{display:none}.touch-scroll-item_2d08f4bc{flex-shrink:0;scroll-snap-align:start}.touch-input_2d08f4bc{-webkit-tap-highlight-color:transparent;font-size:16px;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation}.touch-input_2d08f4bc:focus{outline:0}.touch-input_2d08f4bc:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.ripple-container_2d08f4bc{overflow:hidden;position:relative}.ripple_2d08f4bc{animation:ripple-animation_2d08f4bc .6s ease-out forwards;background-color:var(--themePrimary);border-radius:50%;opacity:.3;pointer-events:none;position:absolute;transform:scale(0)}.is-pressed_2d08f4bc{transform:scale(.98)!important}.no-tap-highlight_2d08f4bc{-webkit-tap-highlight-color:transparent}.no-select_2d08f4bc{-ms-user-select:none;user-select:none;-webkit-user-select:none}.cardLayout_2d08f4bc{width:100%}.card_2d08f4bc{display:flex;flex-direction:column;height:100%;transition:transform .15s ease,box-shadow .15s ease}.card_2d08f4bc:hover{box-shadow:0 8px 24px rgba(0,0,0,.15);transform:translateY(-4px)}.card_2d08f4bc:active{transform:translateY(-2px)}@media (pointer:coarse){.card_2d08f4bc:hover{box-shadow:0 1px 3px rgba(0,0,0,.1);transform:none}.card_2d08f4bc:active{box-shadow:0 1px 2px rgba(0,0,0,.1);transform:scale(.98)}}@media (prefers-reduced-motion:reduce){.card_2d08f4bc{transition:none}.card_2d08f4bc:active,.card_2d08f4bc:hover{transform:none}}@media (forced-colors:active){.card_2d08f4bc{border:1px solid CanvasText}.card_2d08f4bc:focus-within,.card_2d08f4bc:hover{outline:2px solid Highlight}}@media print{.cardLayout_2d08f4bc{display:block}.card_2d08f4bc{border:1px solid #ccc;box-shadow:none;break-inside:avoid;margin-bottom:16px}.card_2d08f4bc:hover{box-shadow:none;transform:none}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19zcGFjaW5nLnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdHlwb2dyYXBoeS5zY3NzIiwiZmlsZTovLy9Vc2Vycy9wbG9mL0RvY3VtZW50cy9HaXRodWIvcG9sLXJzcy9zcmMvd2VicGFydHMvcG9sUnNzR2FsbGVyeS9zdHlsZXMvX2FuaW1hdGlvbnMuc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19hY2Nlc3NpYmlsaXR5LnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdG91Y2guc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9sYXlvdXRzL0NhcmRMYXlvdXQvQ2FyZExheW91dC5tb2R1bGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF1SkEsTUFFRSxZQUFBLENBQ0EsWUFBQSxDQUNBLGFBQUEsQ0FDQSxhQUFBLENBQ0EsYUFBQSxDQUdBLGdCQUFBLENBQ0EsaUJBQUEsQ0FDQSxpQkFBQSxDQUNBLGlCQUFBLENBQ0EsaUJBQUEsQ0FPRix5QkFDRSxNQUVFLGFBQUEsQ0FDQSxhQUFBLENBQ0EsaUJBQUEsQ0FDQSxpQkFBQSxDQUFBLENBUUosYUFDRSxNQUVFLGVBQUEsQ0FDQSxnQkFBQSxDQUNBLG1CQUFBLENBQ0Esb0JBQUEsQ0M4SEEsY0Q5SEEsQ0NpSUYsS0FDRSx5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 */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "animate-fadeIn_2d08f4bc": "animate-fadeIn_2d08f4bc",
  fadeIn_2d08f4bc: "fadeIn_2d08f4bc",
  "animate-fadeOut_2d08f4bc": "animate-fadeOut_2d08f4bc",
  fadeOut_2d08f4bc: "fadeOut_2d08f4bc",
  "animate-slideUp_2d08f4bc": "animate-slideUp_2d08f4bc",
  slideUp_2d08f4bc: "slideUp_2d08f4bc",
  "animate-slideDown_2d08f4bc": "animate-slideDown_2d08f4bc",
  slideDown_2d08f4bc: "slideDown_2d08f4bc",
  "animate-slideLeft_2d08f4bc": "animate-slideLeft_2d08f4bc",
  slideLeft_2d08f4bc: "slideLeft_2d08f4bc",
  "animate-slideRight_2d08f4bc": "animate-slideRight_2d08f4bc",
  slideRight_2d08f4bc: "slideRight_2d08f4bc",
  "animate-scaleIn_2d08f4bc": "animate-scaleIn_2d08f4bc",
  scaleIn_2d08f4bc: "scaleIn_2d08f4bc",
  "animate-spin_2d08f4bc": "animate-spin_2d08f4bc",
  spin_2d08f4bc: "spin_2d08f4bc",
  "animate-pulse_2d08f4bc": "animate-pulse_2d08f4bc",
  pulse_2d08f4bc: "pulse_2d08f4bc",
  "animate-bounce_2d08f4bc": "animate-bounce_2d08f4bc",
  bounce_2d08f4bc: "bounce_2d08f4bc",
  "animate-shake_2d08f4bc": "animate-shake_2d08f4bc",
  shake_2d08f4bc: "shake_2d08f4bc",
  "sr-only_2d08f4bc": "sr-only_2d08f4bc",
  "sr-only-focusable_2d08f4bc": "sr-only-focusable_2d08f4bc",
  "focus-visible_2d08f4bc": "focus-visible_2d08f4bc",
  "touch-target_2d08f4bc": "touch-target_2d08f4bc",
  "reduced-motion_2d08f4bc": "reduced-motion_2d08f4bc",
  "touch-action-manipulation_2d08f4bc": "touch-action-manipulation_2d08f4bc",
  "touch-action-pan-x_2d08f4bc": "touch-action-pan-x_2d08f4bc",
  "touch-action-pan-y_2d08f4bc": "touch-action-pan-y_2d08f4bc",
  "touch-action-none_2d08f4bc": "touch-action-none_2d08f4bc",
  "touch-interactive_2d08f4bc": "touch-interactive_2d08f4bc",
  "touch-button_2d08f4bc": "touch-button_2d08f4bc",
  pressed_2d08f4bc: "pressed_2d08f4bc",
  "touch-card_2d08f4bc": "touch-card_2d08f4bc",
  "touch-link_2d08f4bc": "touch-link_2d08f4bc",
  "touch-list-item_2d08f4bc": "touch-list-item_2d08f4bc",
  "touch-scroll_2d08f4bc": "touch-scroll_2d08f4bc",
  "touch-scroll-horizontal_2d08f4bc": "touch-scroll-horizontal_2d08f4bc",
  "touch-scroll-item_2d08f4bc": "touch-scroll-item_2d08f4bc",
  "touch-input_2d08f4bc": "touch-input_2d08f4bc",
  "ripple-container_2d08f4bc": "ripple-container_2d08f4bc",
  ripple_2d08f4bc: "ripple_2d08f4bc",
  "ripple-animation_2d08f4bc": "ripple-animation_2d08f4bc",
  "is-pressed_2d08f4bc": "is-pressed_2d08f4bc",
  "no-tap-highlight_2d08f4bc": "no-tap-highlight_2d08f4bc",
  "no-select_2d08f4bc": "no-select_2d08f4bc",
  cardLayout_2d08f4bc: "cardLayout_2d08f4bc",
  card_2d08f4bc: "card_2d08f4bc",
  scaleOut_2d08f4bc: "scaleOut_2d08f4bc",
  shimmer_2d08f4bc: "shimmer_2d08f4bc"
});


/***/ }),

/***/ 1580:
/*!*****************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/ResponsiveGrid.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GridItem: () => (/* binding */ GridItem),
/* harmony export */   ResponsiveGrid: () => (/* binding */ ResponsiveGrid),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks_useContainerSize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hooks/useContainerSize */ 4581);
/* harmony import */ var _ResponsiveGrid_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ResponsiveGrid.module.scss */ 8052);
/**
 * ResponsiveGrid Component
 *
 * A responsive grid layout that automatically adapts to container width.
 * Uses CSS Grid with auto-fit for flexible column counts.
 *
 * Features:
 * - Auto-fit columns with minimum item width
 * - Configurable max columns
 * - Responsive gap sizing
 * - Container-based responsiveness (not viewport)
 */




/**
 * Gap size to CSS variable mapping
 */
const gapSizes = {
    none: '0',
    xs: 'var(--gap-xs, 4px)',
    sm: 'var(--gap-sm, 8px)',
    md: 'var(--gap-md, 16px)',
    lg: 'var(--gap-lg, 24px)',
    xl: 'var(--gap-xl, 32px)'
};
/**
 * ResponsiveGrid component that creates a CSS Grid layout with auto-fit columns.
 * Automatically adapts to the container width rather than viewport width.
 */
const ResponsiveGrid = ({ children, minItemWidth = 280, maxColumns = 4, gap = 'md', className = '', centerItems = false, onColumnsChange, testId = 'responsive-grid' }) => {
    const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const { width, columns } = (0,_hooks_useContainerSize__WEBPACK_IMPORTED_MODULE_1__.useContainerSize)(containerRef, { minItemWidth });
    // Notify parent of column changes
    const previousColumns = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(columns);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        if (columns !== previousColumns.current) {
            previousColumns.current = columns;
            onColumnsChange === null || onColumnsChange === void 0 ? void 0 : onColumnsChange(columns);
        }
    }, [columns, onColumnsChange]);
    // Calculate effective max columns (can't exceed what container allows)
    const effectiveMaxColumns = Math.min(maxColumns, columns || 1);
    const gridStyle = {
        '--min-item-width': `${minItemWidth}px`,
        '--max-columns': effectiveMaxColumns,
        '--grid-gap': gapSizes[gap]
    };
    const containerClasses = [
        _ResponsiveGrid_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].responsiveGrid,
        centerItems ? _ResponsiveGrid_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].centered : '',
        className
    ].filter(Boolean).join(' ');
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { ref: containerRef, className: containerClasses, style: gridStyle, "data-testid": testId, "data-columns": effectiveMaxColumns, "data-width": width }, children));
};
/**
 * GridItem component for items that need special spanning behavior
 */
const GridItem = ({ children, span = 1, className = '' }) => {
    const itemStyle = span > 1 ? {
        gridColumn: `span ${span}`
    } : {};
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_ResponsiveGrid_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].gridItem} ${className}`, style: itemStyle }, children));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ResponsiveGrid);


/***/ }),

/***/ 8052:
/*!*****************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/ResponsiveGrid.module.scss.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./ResponsiveGrid.module.css */ 1152);
const styles = {
    responsiveGrid: 'responsiveGrid_44aad4a0',
    fadeIn: 'fadeIn_44aad4a0',
    centered: 'centered_44aad4a0',
    gridItem: 'gridItem_44aad4a0'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 5113:
/*!********************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/CardLayout/CardLayout.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CardLayout: () => (/* binding */ CardLayout),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ResponsiveGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ResponsiveGrid */ 1580);
/* harmony import */ var _shared_FeedItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/FeedItem */ 8278);
/* harmony import */ var _shared_Skeleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/Skeleton */ 990);
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/EmptyState */ 7323);
/* harmony import */ var _CardLayout_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CardLayout.module.scss */ 969);
/**
 * CardLayout Component
 *
 * A responsive grid layout for displaying RSS feed items as cards.
 * Uses ResponsiveGrid for container-based responsive behavior.
 *
 * Features:
 * - Responsive grid layout
 * - Configurable columns and gap
 * - Card hover effects
 * - Lazy loading images
 * - Skeleton loading state
 */







/**
 * Card size to minimum width mapping
 */
const cardSizeToMinWidth = {
    sm: 220,
    md: 280,
    lg: 340
};
/**
 * CardLayout component
 */
const CardLayout = ({ items, columns = 'auto', cardSize = 'md', gap = 'md', fallbackImageUrl, forceFallback = false, hideImages = false, showPubDate = true, showDescription = true, showSource = false, truncateDescription = 150, imageAspectRatio = '16:9', isLoading = false, skeletonCount = 6, onItemClick, className = '', testId = 'card-layout' }) => {
    // Key for forcing re-render when forceFallback changes
    const [layoutKey, setLayoutKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setLayoutKey(prev => prev + 1);
    }, [forceFallback]);
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
    // Calculate max columns
    const maxColumns = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        if (columns === 'auto') {
            return 4;
        }
        return columns;
    }, [columns]);
    // Get min item width
    const minItemWidth = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        return cardSizeToMinWidth[cardSize];
    }, [cardSize]);
    // Container classes
    const containerClasses = [
        _CardLayout_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].cardLayout,
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_Skeleton__WEBPACK_IMPORTED_MODULE_3__.SkeletonGrid, { count: skeletonCount, type: "card", itemProps: {
                    showDescription
                }, testId: `${testId}-skeleton` })));
    }
    // Empty state
    if (!items || items.length === 0) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_4__.NoItemsEmptyState, null)));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, "data-testid": testId, key: layoutKey },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ResponsiveGrid__WEBPACK_IMPORTED_MODULE_1__.ResponsiveGrid, { minItemWidth: minItemWidth, maxColumns: maxColumns, gap: gap, testId: `${testId}-grid` }, items.map((item, index) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_FeedItem__WEBPACK_IMPORTED_MODULE_2__.FeedItem, { key: `${item.link}-${index}`, item: item, variant: "card", showImage: !hideImages, showDescription: showDescription, showDate: showPubDate, showSource: showSource, imageAspectRatio: imageAspectRatio, fallbackImageUrl: fallbackImageUrl, forceFallback: forceFallback, onItemClick: handleItemClick, descriptionTruncation: {
                maxChars: truncateDescription,
                maxLines: 3
            }, className: _CardLayout_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].card, testId: `${testId}-item-${index}` }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (react__WEBPACK_IMPORTED_MODULE_0__.memo(CardLayout));


/***/ }),

/***/ 969:
/*!********************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/CardLayout/CardLayout.module.scss.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./CardLayout.module.css */ 4597);
const styles = {
    'animate-fadeIn': 'animate-fadeIn_2d08f4bc',
    fadeIn: 'fadeIn_2d08f4bc',
    'animate-fadeOut': 'animate-fadeOut_2d08f4bc',
    fadeOut: 'fadeOut_2d08f4bc',
    'animate-slideUp': 'animate-slideUp_2d08f4bc',
    slideUp: 'slideUp_2d08f4bc',
    'animate-slideDown': 'animate-slideDown_2d08f4bc',
    slideDown: 'slideDown_2d08f4bc',
    'animate-slideLeft': 'animate-slideLeft_2d08f4bc',
    slideLeft: 'slideLeft_2d08f4bc',
    'animate-slideRight': 'animate-slideRight_2d08f4bc',
    slideRight: 'slideRight_2d08f4bc',
    'animate-scaleIn': 'animate-scaleIn_2d08f4bc',
    scaleIn: 'scaleIn_2d08f4bc',
    'animate-spin': 'animate-spin_2d08f4bc',
    spin: 'spin_2d08f4bc',
    'animate-pulse': 'animate-pulse_2d08f4bc',
    pulse: 'pulse_2d08f4bc',
    'animate-bounce': 'animate-bounce_2d08f4bc',
    bounce: 'bounce_2d08f4bc',
    'animate-shake': 'animate-shake_2d08f4bc',
    shake: 'shake_2d08f4bc',
    'sr-only': 'sr-only_2d08f4bc',
    'sr-only-focusable': 'sr-only-focusable_2d08f4bc',
    'focus-visible': 'focus-visible_2d08f4bc',
    'touch-target': 'touch-target_2d08f4bc',
    'reduced-motion': 'reduced-motion_2d08f4bc',
    'touch-action-manipulation': 'touch-action-manipulation_2d08f4bc',
    'touch-action-pan-x': 'touch-action-pan-x_2d08f4bc',
    'touch-action-pan-y': 'touch-action-pan-y_2d08f4bc',
    'touch-action-none': 'touch-action-none_2d08f4bc',
    'touch-interactive': 'touch-interactive_2d08f4bc',
    'touch-button': 'touch-button_2d08f4bc',
    pressed: 'pressed_2d08f4bc',
    'touch-card': 'touch-card_2d08f4bc',
    'touch-link': 'touch-link_2d08f4bc',
    'touch-list-item': 'touch-list-item_2d08f4bc',
    'touch-scroll': 'touch-scroll_2d08f4bc',
    'touch-scroll-horizontal': 'touch-scroll-horizontal_2d08f4bc',
    'touch-scroll-item': 'touch-scroll-item_2d08f4bc',
    'touch-input': 'touch-input_2d08f4bc',
    'ripple-container': 'ripple-container_2d08f4bc',
    ripple: 'ripple_2d08f4bc',
    'ripple-animation': 'ripple-animation_2d08f4bc',
    'is-pressed': 'is-pressed_2d08f4bc',
    'no-tap-highlight': 'no-tap-highlight_2d08f4bc',
    'no-select': 'no-select_2d08f4bc',
    cardLayout: 'cardLayout_2d08f4bc',
    card: 'card_2d08f4bc',
    scaleOut: 'scaleOut_2d08f4bc',
    shimmer: 'shimmer_2d08f4bc'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 4489:
/*!***************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/CardLayout/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CardLayout: () => (/* reexport safe */ _CardLayout__WEBPACK_IMPORTED_MODULE_0__.CardLayout),
/* harmony export */   "default": () => (/* reexport safe */ _CardLayout__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _CardLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CardLayout */ 5113);
/**
 * CardLayout Component Exports
 */



/***/ }),

/***/ 4581:
/*!**************************************************************!*\
  !*** ./lib/webparts/polRssGallery/hooks/useContainerSize.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useBreakpoint: () => (/* binding */ useBreakpoint),
/* harmony export */   useColumns: () => (/* binding */ useColumns),
/* harmony export */   useContainerSize: () => (/* binding */ useContainerSize),
/* harmony export */   useIsAtBreakpoint: () => (/* binding */ useIsAtBreakpoint)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_breakpoints__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/breakpoints */ 9981);
/**
 * useContainerSize Hook
 *
 * A React hook that observes and returns the size of a container element.
 * Uses ResizeObserver for efficient, frame-rate-limited size updates.
 *
 * This hook is essential for container-query-like behavior in React,
 * allowing components to adapt based on their container size rather
 * than the viewport size - critical for SharePoint webparts that can
 * appear in different column layouts.
 */


const defaultOptions = {
    minItemWidth: 280,
    debounceMs: 0,
    defaultWidth: 0,
    defaultHeight: 0
};
/**
 * Hook to observe and react to container size changes
 *
 * @param containerRef - React ref to the container element to observe
 * @param options - Configuration options
 * @returns ContainerSize object with current dimensions and breakpoint info
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { width, breakpoint, columns, isNarrow } = useContainerSize(containerRef);
 *
 * return (
 *   <div ref={containerRef}>
 *     <div className={isNarrow ? styles.compact : styles.wide}>
 *       <Grid columns={columns}>
 *         {items.map(item => <Item key={item.id} {...item} />)}
 *       </Grid>
 *     </div>
 *   </div>
 * );
 * ```
 */
function useContainerSize(containerRef, options = {}) {
    const opts = { ...defaultOptions, ...options };
    const calculateSize = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((width, height) => {
        return {
            width,
            height,
            breakpoint: (0,_utils_breakpoints__WEBPACK_IMPORTED_MODULE_1__.getBreakpoint)(width),
            containerBreakpoint: (0,_utils_breakpoints__WEBPACK_IMPORTED_MODULE_1__.getContainerBreakpoint)(width),
            columns: (0,_utils_breakpoints__WEBPACK_IMPORTED_MODULE_1__.getRecommendedColumns)(width, opts.minItemWidth),
            isNarrow: width < 480,
            isInitialized: true
        };
    }, [opts.minItemWidth]);
    const [size, setSize] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => calculateSize(opts.defaultWidth, opts.defaultHeight));
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const element = containerRef.current;
        if (!element)
            return;
        // Initial measurement
        const rect = element.getBoundingClientRect();
        setSize(calculateSize(rect.width, rect.height));
        // Set up ResizeObserver
        let timeoutId = null;
        const handleResize = (entries) => {
            const entry = entries[0];
            if (!entry)
                return;
            const { width, height } = entry.contentRect;
            if (opts.debounceMs > 0) {
                if (timeoutId)
                    clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    setSize(calculateSize(width, height));
                }, opts.debounceMs);
            }
            else {
                setSize(calculateSize(width, height));
            }
        };
        const observer = new ResizeObserver(handleResize);
        observer.observe(element);
        return () => {
            observer.disconnect();
            if (timeoutId)
                clearTimeout(timeoutId);
        };
    }, [containerRef, calculateSize, opts.debounceMs]);
    return size;
}
/**
 * Simplified hook that returns just the current breakpoint
 *
 * @param containerRef - React ref to the container element
 * @returns Current breakpoint name
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const breakpoint = useBreakpoint(containerRef);
 *
 * return (
 *   <div ref={containerRef} className={styles[breakpoint]}>
 *     Content that styles differently per breakpoint
 *   </div>
 * );
 * ```
 */
function useBreakpoint(containerRef) {
    const { breakpoint } = useContainerSize(containerRef);
    return breakpoint;
}
/**
 * Hook that returns whether we're at or above a specific breakpoint
 *
 * @param containerRef - React ref to the container element
 * @param targetBreakpoint - The breakpoint to check against
 * @returns True if container width is at or above the target breakpoint
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const isDesktop = useIsAtBreakpoint(containerRef, 'lg');
 *
 * return (
 *   <div ref={containerRef}>
 *     {isDesktop ? <DesktopLayout /> : <MobileLayout />}
 *   </div>
 * );
 * ```
 */
function useIsAtBreakpoint(containerRef, targetBreakpoint) {
    const { breakpoint, isInitialized } = useContainerSize(containerRef);
    if (!isInitialized)
        return false;
    const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = breakpointOrder.indexOf(breakpoint);
    const targetIndex = breakpointOrder.indexOf(targetBreakpoint);
    return currentIndex >= targetIndex;
}
/**
 * Hook that returns the number of columns for a grid layout
 *
 * @param containerRef - React ref to the container element
 * @param minItemWidth - Minimum width per item (default: 280)
 * @returns Recommended number of columns (1-4)
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const columns = useColumns(containerRef, 300);
 *
 * return (
 *   <div ref={containerRef}>
 *     <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
 *       {items.map(item => <Card key={item.id} {...item} />)}
 *     </div>
 *   </div>
 * );
 * ```
 */
function useColumns(containerRef, minItemWidth = 280) {
    const { columns } = useContainerSize(containerRef, { minItemWidth });
    return columns;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useContainerSize);


/***/ }),

/***/ 9981:
/*!*********************************************************!*\
  !*** ./lib/webparts/polRssGallery/utils/breakpoints.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   betweenWidths: () => (/* binding */ betweenWidths),
/* harmony export */   breakpointNames: () => (/* binding */ breakpointNames),
/* harmony export */   breakpoints: () => (/* binding */ breakpoints),
/* harmony export */   containerBreakpoints: () => (/* binding */ containerBreakpoints),
/* harmony export */   getBreakpoint: () => (/* binding */ getBreakpoint),
/* harmony export */   getContainerBreakpoint: () => (/* binding */ getContainerBreakpoint),
/* harmony export */   getRecommendedColumns: () => (/* binding */ getRecommendedColumns),
/* harmony export */   getResponsiveValue: () => (/* binding */ getResponsiveValue),
/* harmony export */   isAtBreakpoint: () => (/* binding */ isAtBreakpoint),
/* harmony export */   isBelowBreakpoint: () => (/* binding */ isBelowBreakpoint),
/* harmony export */   isBetweenBreakpoints: () => (/* binding */ isBetweenBreakpoints),
/* harmony export */   isDesktopLayout: () => (/* binding */ isDesktopLayout),
/* harmony export */   isMobileLayout: () => (/* binding */ isMobileLayout),
/* harmony export */   isTabletLayout: () => (/* binding */ isTabletLayout),
/* harmony export */   maxWidth: () => (/* binding */ maxWidth),
/* harmony export */   minWidth: () => (/* binding */ minWidth)
/* harmony export */ });
/**
 * Responsive Breakpoints System
 *
 * Provides consistent breakpoint constants and utilities for responsive design.
 * Aligned with SharePoint's responsive grid and common device sizes.
 *
 * SharePoint Layout Context:
 * - Full-width section: 100% container width
 * - 1-column section: ~768px max
 * - 2-column section: ~384px per column
 * - 3-column section: ~256px per column
 */
/**
 * Breakpoint values in pixels
 */
const breakpoints = {
    xs: 320, // Small phones
    sm: 480, // Phones
    md: 768, // Tablets / SharePoint 1-column max
    lg: 1024, // Small laptops
    xl: 1280, // Desktops
    xxl: 1440 // Large desktops
};
/**
 * Array of breakpoint names in ascending order
 */
const breakpointNames = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
/**
 * Get the current breakpoint name based on width
 * @param width - Width in pixels
 * @returns The current breakpoint name
 */
function getBreakpoint(width) {
    if (width < breakpoints.sm)
        return 'xs';
    if (width < breakpoints.md)
        return 'sm';
    if (width < breakpoints.lg)
        return 'md';
    if (width < breakpoints.xl)
        return 'lg';
    if (width < breakpoints.xxl)
        return 'xl';
    return 'xxl';
}
/**
 * Check if the current width is at or above a breakpoint
 * @param width - Width in pixels
 * @param breakpoint - Breakpoint name to check against
 * @returns True if width is at or above the breakpoint
 */
function isAtBreakpoint(width, breakpoint) {
    return width >= breakpoints[breakpoint];
}
/**
 * Check if the current width is below a breakpoint
 * @param width - Width in pixels
 * @param breakpoint - Breakpoint name to check against
 * @returns True if width is below the breakpoint
 */
function isBelowBreakpoint(width, breakpoint) {
    return width < breakpoints[breakpoint];
}
/**
 * Check if the current width is between two breakpoints (inclusive start, exclusive end)
 * @param width - Width in pixels
 * @param start - Start breakpoint (inclusive)
 * @param end - End breakpoint (exclusive)
 * @returns True if width is between the breakpoints
 */
function isBetweenBreakpoints(width, start, end) {
    return width >= breakpoints[start] && width < breakpoints[end];
}
/**
 * Get the media query string for a minimum width breakpoint
 * @param breakpoint - Breakpoint name
 * @returns CSS media query string
 */
function minWidth(breakpoint) {
    return `(min-width: ${breakpoints[breakpoint]}px)`;
}
/**
 * Get the media query string for a maximum width breakpoint
 * @param breakpoint - Breakpoint name
 * @returns CSS media query string
 */
function maxWidth(breakpoint) {
    return `(max-width: ${breakpoints[breakpoint] - 1}px)`;
}
/**
 * Get the media query string for a width range between breakpoints
 * @param start - Start breakpoint (inclusive)
 * @param end - End breakpoint (exclusive)
 * @returns CSS media query string
 */
function betweenWidths(start, end) {
    return `(min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end] - 1}px)`;
}
/**
 * Get the appropriate value for the current width from a responsive value object
 * @param width - Width in pixels
 * @param values - Responsive value object with breakpoint-specific values
 * @returns The value for the current breakpoint
 */
function getResponsiveValue(width, values) {
    // Start from the highest breakpoint and work down
    const orderedBreakpoints = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
    for (const bp of orderedBreakpoints) {
        if (width >= breakpoints[bp] && values[bp] !== undefined) {
            return values[bp];
        }
    }
    return values.base;
}
/**
 * Container breakpoints for SharePoint column layouts
 * These are the approximate widths available in different section layouts
 */
const containerBreakpoints = {
    narrow: 256, // 3-column section
    compact: 384, // 2-column section
    standard: 768, // 1-column section
    wide: 1200, // Full-width (not max)
    fullWidth: 1440 // Full-width section on large screens
};
/**
 * Get the container breakpoint name based on width
 * Useful for adapting layout based on the webpart container size, not viewport
 * @param width - Container width in pixels
 * @returns The container breakpoint name
 */
function getContainerBreakpoint(width) {
    if (width < containerBreakpoints.compact)
        return 'narrow';
    if (width < containerBreakpoints.standard)
        return 'compact';
    if (width < containerBreakpoints.wide)
        return 'standard';
    if (width < containerBreakpoints.fullWidth)
        return 'wide';
    return 'fullWidth';
}
/**
 * Recommended number of columns for card layouts based on container width
 * @param width - Container width in pixels
 * @param minItemWidth - Minimum item width (default: 280px)
 * @returns Recommended number of columns
 */
function getRecommendedColumns(width, minItemWidth = 280) {
    const maxColumns = Math.floor(width / minItemWidth);
    return Math.max(1, Math.min(maxColumns, 4));
}
/**
 * Check if the layout should be considered "mobile" based on container width
 * @param width - Container width in pixels
 * @returns True if mobile layout should be used
 */
function isMobileLayout(width) {
    return width < breakpoints.sm;
}
/**
 * Check if the layout should be considered "tablet" based on container width
 * @param width - Container width in pixels
 * @returns True if tablet layout should be used
 */
function isTabletLayout(width) {
    return width >= breakpoints.sm && width < breakpoints.lg;
}
/**
 * Check if the layout should be considered "desktop" based on container width
 * @param width - Container width in pixels
 * @returns True if desktop layout should be used
 */
function isDesktopLayout(width) {
    return width >= breakpoints.lg;
}


/***/ })

}]);
//# sourceMappingURL=chunk.layout-card.js.map