"use strict";
(self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] = self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] || []).push([["layout-gallery"],{

/***/ 3443:
/*!**********************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/GalleryLayout/GalleryLayout.module.css ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(":root{--gap-xs:4px;--gap-sm:8px;--gap-md:16px;--gap-lg:24px;--gap-xl:32px;--padding-xs:8px;--padding-sm:12px;--padding-md:16px;--padding-lg:24px;--padding-xl:32px}@media (max-width:480px){:root{--gap-lg:20px;--gap-xl:24px;--padding-lg:20px;--padding-xl:24px}}@media print{:root{--gap-md:0.5rem;--gap-lg:0.75rem;--padding-md:0.5rem;--padding-lg:0.75rem;font-size:12pt}body{font-family:Georgia,Times New Roman,serif;line-height:1.5}h1,h2,h3,h4,h5,h6{page-break-after:avoid;page-break-inside:avoid}p{orphans:3;widows:3}}@media (forced-colors:active){a{text-decoration:underline}}:root{--transition-instant:50ms;--transition-fast:150ms;--transition-normal:250ms;--transition-slow:350ms;--transition-slower:500ms;--easing-standard:cubic-bezier(0.4,0,0.2,1);--easing-decelerate:cubic-bezier(0,0,0.2,1);--easing-accelerate:cubic-bezier(0.4,0,1,1);--easing-sharp:cubic-bezier(0.4,0,0.6,1);--easing-bounce:cubic-bezier(0.68,-0.55,0.265,1.55)}@keyframes fadeIn_be835b32{0%{opacity:0}to{opacity:1}}@keyframes fadeOut_be835b32{0%{opacity:1}to{opacity:0}}@keyframes slideUp_be835b32{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideDown_be835b32{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideLeft_be835b32{0%{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes slideRight_be835b32{0%{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}@keyframes scaleIn_be835b32{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}@keyframes scaleOut_be835b32{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.95)}}@keyframes pulse_be835b32{0%,to{opacity:1}50%{opacity:.5}}@keyframes spin_be835b32{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes bounce_be835b32{0%,20%,50%,80%,to{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}@keyframes shake_be835b32{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@keyframes ripple_be835b32{0%{opacity:.5;transform:scale(0)}to{opacity:0;transform:scale(2.5)}}.animate-fadeIn_be835b32{animation:fadeIn_be835b32 var(--transition-normal) var(--easing-decelerate) forwards}.animate-fadeOut_be835b32{animation:fadeOut_be835b32 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideUp_be835b32{animation:slideUp_be835b32 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideDown_be835b32{animation:slideDown_be835b32 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideLeft_be835b32{animation:slideLeft_be835b32 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideRight_be835b32{animation:slideRight_be835b32 var(--transition-normal) var(--easing-decelerate) forwards}.animate-scaleIn_be835b32{animation:scaleIn_be835b32 var(--transition-normal) var(--easing-decelerate) forwards}.animate-spin_be835b32{animation:spin_be835b32 1s linear infinite}.animate-pulse_be835b32{animation:pulse_be835b32 2s ease-in-out infinite}.animate-bounce_be835b32{animation:bounce_be835b32 1s ease infinite}.animate-shake_be835b32{animation:shake_be835b32 .5s ease-in-out}@media (prefers-reduced-motion:reduce){*,:after,:before{animation-duration:0s!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:0s!important}.animate-fadeIn_be835b32,.animate-fadeOut_be835b32{animation-duration:.1s!important}}@media print{*,:after,:before{animation:none!important;transition:none!important}}.sr-only-focusable_be835b32,.sr-only_be835b32{clip:rect(0,0,0,0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.sr-only-focusable_be835b32:focus,.sr-only-focusable_be835b32:focus-visible{clip:auto;height:auto;margin:0;overflow:visible;padding:0;position:static;white-space:normal;width:auto}.focus-visible_be835b32:focus{outline:0}.focus-visible_be835b32:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-target_be835b32{min-height:44px;min-width:44px}@media (prefers-reduced-motion:reduce){.reduced-motion_be835b32{animation-duration:0s!important;animation-iteration-count:1!important;transition-duration:0s!important}}@keyframes ripple-animation_be835b32{0%{opacity:.3;transform:scale(0)}to{opacity:0;transform:scale(4)}}.touch-action-manipulation_be835b32{touch-action:manipulation}.touch-action-pan-x_be835b32{touch-action:pan-x}.touch-action-pan-y_be835b32{touch-action:pan-y}.touch-action-none_be835b32{touch-action:none}.touch-interactive_be835b32{-webkit-tap-highlight-color:transparent;cursor:pointer;min-height:44px;min-width:44px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-interactive_be835b32:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-interactive_be835b32{transition:none}.touch-interactive_be835b32:active{opacity:.8;transform:none}}.touch-button_be835b32{-webkit-tap-highlight-color:transparent;align-items:center;cursor:pointer;display:inline-flex;justify-content:center;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-button_be835b32:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-button_be835b32{transition:none}.touch-button_be835b32:active{opacity:.8;transform:none}}.touch-button_be835b32:focus{outline:0}.touch-button_be835b32:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}@media (forced-colors:active){.touch-button_be835b32{background-color:ButtonFace;border:2px solid ButtonText;color:ButtonText}.touch-button_be835b32:hover{background-color:Highlight;border-color:Highlight;color:HighlightText}.touch-button_be835b32:focus-visible{outline:3px solid Highlight;outline-offset:2px}.touch-button_be835b32:disabled{border-color:GrayText;color:GrayText}}.touch-button_be835b32.pressed_be835b32,.touch-button_be835b32[data-pressed=true]{transform:scale(.98)}.touch-card_be835b32{-webkit-tap-highlight-color:transparent;cursor:pointer;touch-action:manipulation;transition:transform .15s ease}.touch-card_be835b32:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-card_be835b32{transition:none}.touch-card_be835b32:active{opacity:.8;transform:none}}.touch-card_be835b32:focus{outline:0}.touch-card_be835b32:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-card_be835b32.pressed_be835b32,.touch-card_be835b32[data-pressed=true]{box-shadow:0 2px 4px rgba(0,0,0,.15);transform:scale(.98)}@media (hover:hover){.touch-card_be835b32:hover:not(:active){box-shadow:0 4px 8px rgba(0,0,0,.15);transform:translateY(-2px)}}@media (prefers-reduced-motion:reduce){.touch-card_be835b32:hover:not(:active){transform:none}}.touch-link_be835b32{-webkit-tap-highlight-color:transparent;color:var(--themePrimary,#0078d4);position:relative;text-decoration:underline;touch-action:manipulation}.touch-link_be835b32:after{content:\"\";height:44px;left:50%;min-height:100%;min-width:100%;position:absolute;top:50%;transform:translate(-50%,-50%);width:44px}.touch-link_be835b32:focus{outline:0}.touch-link_be835b32:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-link_be835b32:focus,.touch-link_be835b32:hover{text-decoration:none}.touch-link_be835b32:active{opacity:.7}@media (prefers-reduced-motion:reduce){.touch-link_be835b32:active{opacity:.8}}.touch-list-item_be835b32{-webkit-tap-highlight-color:transparent;min-height:44px;padding:12px 16px;position:relative;touch-action:manipulation;transition:background-color .15s ease}.touch-list-item_be835b32:active{background-color:var(--neutralLighter)}@media (prefers-reduced-motion:reduce){.touch-list-item_be835b32{transition:none}}.touch-list-item_be835b32:focus{outline:0}.touch-list-item_be835b32:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-list-item_be835b32:not(:last-child):after{background-color:var(--neutralLight);bottom:0;content:\"\";height:1px;left:16px;position:absolute;right:16px}.touch-scroll_be835b32{-webkit-overflow-scrolling:touch;scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){.touch-scroll_be835b32{scroll-behavior:auto}}.touch-scroll-horizontal_be835b32{-webkit-overflow-scrolling:touch;-ms-overflow-style:none;display:flex;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;scrollbar-width:none;touch-action:pan-x}@media (prefers-reduced-motion:reduce){.touch-scroll-horizontal_be835b32{scroll-behavior:auto}}.touch-scroll-horizontal_be835b32::-webkit-scrollbar{display:none}.touch-scroll-item_be835b32{flex-shrink:0;scroll-snap-align:start}.touch-input_be835b32{-webkit-tap-highlight-color:transparent;font-size:16px;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation}.touch-input_be835b32:focus{outline:0}.touch-input_be835b32:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.ripple-container_be835b32{overflow:hidden;position:relative}.ripple_be835b32{animation:ripple-animation_be835b32 .6s ease-out forwards;background-color:var(--themePrimary);border-radius:50%;opacity:.3;pointer-events:none;position:absolute;transform:scale(0)}.is-pressed_be835b32{transform:scale(.98)!important}.no-tap-highlight_be835b32{-webkit-tap-highlight-color:transparent}.no-select_be835b32{-ms-user-select:none;user-select:none;-webkit-user-select:none}.gallery_be835b32{container-type:inline-size;display:grid;gap:var(--gallery-gap,16px);grid-template-columns:repeat(var(--gallery-columns,auto-fill),minmax(180px,1fr));width:100%}.columns-2_be835b32{grid-template-columns:repeat(2,1fr)}.columns-3_be835b32{grid-template-columns:repeat(3,1fr)}.columns-4_be835b32{grid-template-columns:repeat(4,1fr)}.galleryItem_be835b32{background:var(--neutralLighter,#f3f2f1);border-radius:8px;cursor:pointer;overflow:hidden;position:relative;transition:transform .2s ease,box-shadow .2s ease}.galleryItem_be835b32:focus-visible,.galleryItem_be835b32:hover{box-shadow:0 8px 24px rgba(0,0,0,.15);transform:translateY(-4px)}.galleryItem_be835b32:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.galleryItem_be835b32:active{transform:translateY(-2px)}.imageWrapper_be835b32{aspect-ratio:var(--aspect-ratio,4/3);background:var(--neutralLighter,#f3f2f1);overflow:hidden;position:relative}.image_be835b32{height:100%;object-fit:cover;transition:transform .3s ease;width:100%}.galleryItem_be835b32:focus-visible .image_be835b32,.galleryItem_be835b32:hover .image_be835b32{transform:scale(1.05)}.noImage_be835b32{align-items:center;background:var(--neutralLight,#edebe9);color:var(--neutralSecondary,#605e5c);display:flex;height:100%;justify-content:center;width:100%}.noImageIcon_be835b32{height:48px;opacity:.5;width:48px}.hoverOverlay_be835b32{background:linear-gradient(0deg,rgba(0,0,0,.85) 0,rgba(0,0,0,.5) 50%,transparent);display:flex;flex-direction:column;inset:0;justify-content:flex-end;opacity:0;padding:16px;position:absolute;transition:opacity .2s ease}.galleryItem_be835b32:focus-visible .hoverOverlay_be835b32,.galleryItem_be835b32:hover .hoverOverlay_be835b32{opacity:1}.hoverOverlay_be835b32 .title_be835b32{-webkit-line-clamp:2;-webkit-box-orient:vertical;color:#fff;display:-webkit-box;font-size:14px;font-weight:600;line-height:1.3;margin:0;overflow:hidden}.hoverOverlay_be835b32 .date_be835b32{color:hsla(0,0%,100%,.8);font-size:12px;margin-top:4px}.titleBelow_be835b32{padding:12px 4px}.titleBelow_be835b32 .title_be835b32{-webkit-line-clamp:2;-webkit-box-orient:vertical;color:var(--neutralPrimary,#323130);display:-webkit-box;font-size:14px;font-weight:600;line-height:1.3;margin:0;overflow:hidden}.title-hover_be835b32 .imageWrapper_be835b32,.title-none_be835b32 .imageWrapper_be835b32{border-radius:8px}.skeletonItem_be835b32{border-radius:8px;overflow:hidden}.skeletonImage_be835b32{aspect-ratio:var(--aspect-ratio,4/3)}.skeletonImage_be835b32,.skeletonTitle_be835b32{animation:shimmer_be835b32 1.5s infinite;background:linear-gradient(90deg,var(--neutralLighter,#f3f2f1) 25%,var(--neutralLight,#edebe9) 50%,var(--neutralLighter,#f3f2f1) 75%);background-size:200% 100%}.skeletonTitle_be835b32{animation-delay:.1s;border-radius:4px;height:16px;margin:12px 4px}@keyframes shimmer_be835b32{0%{background-position:200% 0}to{background-position:-200% 0}}@media (pointer:coarse){.galleryItem_be835b32:hover{box-shadow:none;transform:none}.galleryItem_be835b32:hover .image_be835b32{transform:none}.galleryItem_be835b32:active{transform:scale(.98)}.title-hover_be835b32 .hoverOverlay_be835b32{background:linear-gradient(0deg,rgba(0,0,0,.75) 0,rgba(0,0,0,.3) 40%,transparent 80%);opacity:1}}@media (prefers-reduced-motion:reduce){.galleryItem_be835b32,.hoverOverlay_be835b32,.image_be835b32{transition:none}.galleryItem_be835b32:hover .image_be835b32{transform:none}.skeletonImage_be835b32,.skeletonTitle_be835b32{animation:none;background:var(--neutralLight,#edebe9)}}@media (forced-colors:active){.galleryItem_be835b32{border:1px solid CanvasText}.galleryItem_be835b32:focus-visible{outline:2px solid Highlight}.hoverOverlay_be835b32{background:Canvas;border-top:1px solid CanvasText;opacity:1}.hoverOverlay_be835b32 .title_be835b32{color:CanvasText}.hoverOverlay_be835b32 .date_be835b32{color:GrayText}.titleBelow_be835b32 .title_be835b32{color:CanvasText}.noImage_be835b32{border:1px dashed GrayText}}@media print{.gallery_be835b32{display:grid;gap:8px;grid-template-columns:repeat(3,1fr)}.galleryItem_be835b32{border:1px solid #ccc;box-shadow:none;break-inside:avoid}.galleryItem_be835b32:hover{box-shadow:none;transform:none}.hoverOverlay_be835b32{display:none}.title-hover_be835b32 .titleBelow_be835b32,.title-none_be835b32 .titleBelow_be835b32{display:block}.image_be835b32:hover{transform:none}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19zcGFjaW5nLnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdHlwb2dyYXBoeS5zY3NzIiwiZmlsZTovLy9Vc2Vycy9wbG9mL0RvY3VtZW50cy9HaXRodWIvcG9sLXJzcy9zcmMvd2VicGFydHMvcG9sUnNzR2FsbGVyeS9zdHlsZXMvX2FuaW1hdGlvbnMuc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19hY2Nlc3NpYmlsaXR5LnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdG91Y2guc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9sYXlvdXRzL0dhbGxlcnlMYXlvdXQvR2FsbGVyeUxheW91dC5tb2R1bGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF1SkEsTUFFRSxZQUFBLENBQ0EsWUFBQSxDQUNBLGFBQUEsQ0FDQSxhQUFBLENBQ0EsYUFBQSxDQUdBLGdCQUFBLENBQ0EsaUJBQUEsQ0FDQSxpQkFBQSxDQUNBLGlCQUFBLENBQ0EsaUJBQUEsQ0FPRix5QkFDRSxNQUVFLGFBQUEsQ0FDQSxhQUFBLENBQ0EsaUJBQUEsQ0FDQSxpQkFBQSxDQUFBLENBUUosYUFDRSxNQUVFLGVBQUEsQ0FDQSxnQkFBQSxDQUNBLG1CQUFBLENBQ0Esb0JBQUEsQ0M4SEEsY0Q5SEEsQ0NpSUYsS0FDRSx5Q0FBQSxDQUNBLGVBQUEsQ0FHRixrQkFDRSxzQkFBQSxDQUNBLHVCQUFBLENBR0YsRUFDRSxTQUFBLENBQ0EsUUFBQSxDRDdJQSxDQ3FKSiw4QkFFRSxFQUNFLHlCQUFBLENBQUEsQ0NyVUosTUFFRSx5QkFBQSxDQUNBLHVCQUFBLENBQ0EseUJBQUEsQ0FDQSx1QkFBQSxDQUNBLHlCQUFBLENBR0EsMkNBQUEsQ0FDQSwyQ0FBQSxDQUNBLDJDQUFBLENBQ0Esd0NBQUEsQ0FDQSxtREFBQSxDQVFGLDJCQUNFLEdBQ0UsU0FBQSxDQUVGLEdBQ0UsU0FBQSxDQUFBLENBSUosNEJBQ0UsR0FDRSxTQUFBLENBRUYsR0FDRSxTQUFBLENBQUEsQ0FLSiw0QkFDRSxHQUVFLFNBQUEsQ0FEQSwwQkFDQSxDQUVGLEdBRUUsU0FBQSxDQURBLHVCQUNBLENBQUEsQ0FJSiw4QkFDRSxHQUVFLFNBQUEsQ0FEQSwyQkFDQSxDQUVGLEdBRUUsU0FBQSxDQURBLHVCQUNBLENBQUEsQ0FJSiw4QkFDRSxHQUVFLFNBQUEsQ0FEQSwwQkFDQSxDQUVGLEdBRUUsU0FBQSxDQURBLHVCQUNBLENBQUEsQ0FJSiwrQkFDRSxHQUVFLFNBQUEsQ0FEQSwyQkFDQSxDQUVGLEdBRUUsU0FBQSxDQURBLHVCQUNBLENBQUEsQ0FLSiw0QkFDRSxHQUVFLFNBQUEsQ0FEQSxvQkFDQSxDQUVGLEdBRUUsU0FBQSxDQURBLGtCQUNBLENBQUEsQ0FJSiw2QkFDRSxHQUVFLFNBQUEsQ0FEQSxrQkFDQSxDQUVGLEdBRUUsU0FBQSxDQURBLG9CQUNBLENBQUEsQ0FLSiwwQkFDRSxNQUNFLFNBQUEsQ0FFRixJQUNFLFVBQUEsQ0FBQSxDQWVKLHlCQUNFLEdBQ0UsbUJBQUEsQ0FFRixHQUNFLHVCQUFBLENBQUEsQ0FLSiwyQkFDRSxrQkFDRSx1QkFBQSxDQUVGLElBQ0UsMkJBQUEsQ0FFRixJQUNFLDBCQUFBLENBQUEsQ0FLSiwwQkFDRSxNQUNFLHVCQUFBLENBRUYsb0JBQ0UsMEJBQUEsQ0FFRixnQkFDRSx5QkFBQSxDQUFBLENBS0osMkJBQ0UsR0FFRSxVQUFBLENBREEsa0JBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSxvQkFDQSxDQUFBLENBbUpKLHlCQXpJRSxvRkFBQSxDQTZJRiwwQkE3SUUscUZBQUEsQ0FpSkYsMEJBakpFLHFGQUFBLENBcUpGLDRCQXJKRSx1RkFBQSxDQXlKRiw0QkF6SkUsdUZBQUEsQ0E2SkYsNkJBN0pFLHdGQUFBLENBaUtGLDBCQWpLRSxxRkFBQSxDQXFLRix1QkE3SEUsMENBQUEsQ0FpSUYsd0JBQ0UsZ0RBQUEsQ0FHRix5QkFDRSwwQ0FBQSxDQUdGLHdCQUNFLHdDQUFBLENBT0YsdUNBQ0UsaUJBR0UsK0JBQUEsQ0FDQSxxQ0FBQSxDQUVBLDhCQUFBLENBREEsZ0NBQ0EsQ0FJRixtREFFRSxnQ0FBQSxDQUFBLENBUUosYUFDRSxpQkFHRSx3QkFBQSxDQUNBLHlCQUFBLENBQUEsQ0NyRkosOENBNVJFLGtCQUFBLENBRUEsUUFBQSxDQU5BLFVBQUEsQ0FFQSxXQUFBLENBQ0EsZUFBQSxDQUZBLFNBQUEsQ0FIQSxpQkFBQSxDQU9BLGtCQUFBLENBTkEsU0FPQSxDQXVCQSw0RUFWQSxTQUFBLENBSkEsV0FBQSxDQUVBLFFBQUEsQ0FDQSxnQkFBQSxDQUZBLFNBQUEsQ0FIQSxlQUFBLENBT0Esa0JBQUEsQ0FOQSxVQU1BLENBd0JBLDhCQUNFLFNBQUEsQ0FHRixzQ0FDRSw2Q0FBQSxDQUNBLGtCQUFBLENBc1BKLHVCQWxNRSxlQUFBLENBREEsY0FDQSxDQXdEQSx1Q0E4SUYseUJBN0lJLCtCQUFBLENBQ0EscUNBQUEsQ0FDQSxnQ0FBQSxDQUFBLENDNkVKLHFDQUNFLEdBRUUsVUFBQSxDQURBLGtCQUNBLENBRUYsR0FFRSxTQUFBLENBREEsa0JBQ0EsQ0FBQSxDQXNHSixvQ0ExVkUseUJBQUEsQ0E4VkYsNkJBdlZFLGtCQUFBLENBMlZGLDZCQXBWRSxrQkFBQSxDQXdWRiw0QkFqVkUsaUJBQUEsQ0FxVkYsNEJBdlFFLHVDQUFBLENBUEEsY0FBQSxDRFNBLGVBQUEsQ0FEQSxjQUFBLENDcEdBLHlCQUFBLENBaUNBLDhCQUFBLENBOERBLG9CQUFBLENBQUEsZ0JBQUEsQ0FDQSx3QkFHQSxDQS9EQSxtQ0FDRSxvQkFBQSxDQUlGLHVDQWlVRiw0QkFoVUksZUFBQSxDQUVBLG1DQUVFLFVBQUEsQ0FEQSxjQUNBLENBQUEsQ0FnVU4sdUJBM1FFLHVDQUFBLENBYUEsa0JBQUEsQ0FwQkEsY0FBQSxDQW1CQSxtQkFBQSxDQUVBLHNCQUFBLENBSUEsZUFBQSxDRGpCQSxjQUFBLENDZ0JBLGlCQUFBLENBcEhBLHlCQUFBLENBaUNBLDhCQUFBLENBOERBLG9CQUFBLENBQUEsZ0JBQUEsQ0FDQSx3QkFxQkEsQ0FqRkEsOEJBQ0Usb0JBQUEsQ0FJRix1Q0FxVUYsdUJBcFVJLGVBQUEsQ0FFQSw4QkFFRSxVQUFBLENBREEsY0FDQSxDQUFBLENESEosNkJBQ0UsU0FBQSxDQUdGLHFDQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0FzTUYsOEJDdUhGLHVCRHJISSwyQkFBQSxDQURBLDJCQUFBLENBRUEsZ0JBQUEsQ0FFQSw2QkFDRSwwQkFBQSxDQUVBLHNCQUFBLENBREEsbUJBQ0EsQ0FHRixxQ0FDRSwyQkFBQSxDQUNBLGtCQUFBLENBR0YsZ0NBRUUscUJBQUEsQ0FEQSxjQUNBLENBQUEsQ0NqSkosa0ZBRUUsb0JBQUEsQ0F3UEoscUJBek9FLHVDQUFBLENBSEEsY0FBQSxDQXRJQSx5QkFBQSxDQWlDQSw4QkF3R0EsQ0FyR0EsNEJBQ0Usb0JBQUEsQ0FJRix1Q0F5VUYscUJBeFVJLGVBQUEsQ0FFQSw0QkFFRSxVQUFBLENBREEsY0FDQSxDQUFBLENESEosMkJBQ0UsU0FBQSxDQUdGLG1DQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0MyRkYsOEVBR0Usb0NBQUEsQ0FEQSxvQkFDQSxDQUlGLHFCQUNFLHdDQUVFLG9DQUFBLENBREEsMEJBQ0EsQ0FBQSxDQUlKLHVDQUNFLHdDQUNFLGNBQUEsQ0FBQSxDQTBOTixxQkEzTUUsdUNBQUEsQ0QvQkEsaUNBQUEsQ0FoQ0EsaUJBQUEsQ0FpQ0EseUJBQUEsQ0M3SUEseUJBMktBLENEN0RBLDJCQUNFLFVBQUEsQ0FNQSxXQUFBLENBSEEsUUFBQSxDQUtBLGVBQUEsQ0FEQSxjQUFBLENBTkEsaUJBQUEsQ0FDQSxPQUFBLENBRUEsOEJBQUEsQ0FDQSxVQUdBLENBNUVGLDJCQUNFLFNBQUEsQ0FHRixtQ0FDRSw2Q0FBQSxDQUNBLGtCQUFBLENBOEZGLHNEQUVFLG9CQUFBLENDNkJGLDRCQUNFLFVBQUEsQ0FHRix1Q0FDRSw0QkFDRSxVQUFBLENBQUEsQ0FzTU4sMEJBcExFLHVDQUFBLENBSkEsZUFBQSxDQUNBLGlCQUFBLENBRkEsaUJBQUEsQ0FqTUEseUJBQUEsQ0FzRUEscUNBZ0lBLENBOUhBLGlDQUNFLHNDQUFBLENBR0YsdUNBOFNGLDBCQTdTSSxlQUFBLENBQUEsQ0RsQ0YsZ0NBQ0UsU0FBQSxDQUdGLHdDQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0N3SkYsaURBT0Usb0NBQUEsQ0FKQSxRQUFBLENBRkEsVUFBQSxDQUtBLFVBQUEsQ0FGQSxTQUFBLENBRkEsaUJBQUEsQ0FHQSxVQUVBLENBOEtKLHVCQWxHRSxnQ0FBQSxDQUNBLHNCQUFBLENBRUEsdUNBK0ZGLHVCQTlGSSxvQkFBQSxDQUFBLENBa0dKLGtDQXRHRSxnQ0FBQSxDQXdCQSx1QkFBQSxDQVRBLFlBQUEsQ0FDQSxlQUFBLENBQ0EsaUJBQUEsQ0FoQkEsc0JBQUEsQ0FpQkEsZ0NBQUEsQ0FBQSw0QkFBQSxDQU9BLG9CQUFBLENBOVNBLGtCQThTQSxDQXRCQSx1Q0FtR0Ysa0NBbEdJLG9CQUFBLENBQUEsQ0FpQkYscURBQ0UsWUFBQSxDQW9GSiw0QkF6RUUsYUFBQSxDQURBLHVCQUNBLENBNkVGLHNCQXZERSx1Q0FBQSxDQU5BLGNBQUEsQ0R4T0EsZUFBQSxDQURBLGNBQUEsQ0M0T0EsaUJBQUEsQ0FoVkEseUJBbVZBLENEeFNBLDRCQUNFLFNBQUEsQ0FHRixvQ0FDRSw2Q0FBQSxDQUNBLGtCQUFBLENDOFZKLDJCQWxMRSxlQUFBLENBREEsaUJBQ0EsQ0FzTEYsaUJBMUtFLHlEQUFBLENBSEEsb0NBQUEsQ0FEQSxpQkFBQSxDQUVBLFVBQUEsQ0FHQSxtQkFBQSxDQU5BLGlCQUFBLENBSUEsa0JBRUEsQ0E4S0YscUJBQ0UsOEJBQUEsQ0FJRiwyQkFDRSx1Q0FBQSxDQUlGLG9CQUNFLG9CQUFBLENBQUEsZ0JBQUEsQ0FDQSx3QkFBQSxDQzdiRixrQkFPRSwwQkFBQSxDQU5BLFlBQUEsQ0FFQSwyQkFBQSxDQURBLGdGQUFBLENBRUEsVUFHQSxDQUlGLG9CQUNFLG1DQUFBLENBR0Ysb0JBQ0UsbUNBQUEsQ0FHRixvQkFDRSxtQ0FBQSxDQXVDRixzQkFLRSx3Q0FBQSxDQUZBLGlCQUFBLENBREEsY0FBQSxDQUVBLGVBQUEsQ0FIQSxpQkFBQSxDQUtBLGlEQUFBLENBRUEsZ0VBR0UscUNBQUEsQ0FEQSwwQkFDQSxDQUdGLG9DQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0FHRiw2QkFDRSwwQkFBQSxDQVFKLHVCQUVFLG9DQUFBLENBRUEsd0NBQUEsQ0FEQSxlQUFBLENBRkEsaUJBR0EsQ0FHRixnQkFFRSxXQUFBLENBQ0EsZ0JBQUEsQ0FDQSw2QkFBQSxDQUhBLFVBR0EsQ0FFQSxnR0FFRSxxQkFBQSxDQUtKLGtCQUVFLGtCQUFBLENBSUEsc0NBQUEsQ0FDQSxxQ0FBQSxDQU5BLFlBQUEsQ0FJQSxXQUFBLENBRkEsc0JBQUEsQ0FDQSxVQUdBLENBR0Ysc0JBRUUsV0FBQSxDQUNBLFVBQUEsQ0FGQSxVQUVBLENBT0YsdUJBR0UsaUZBQUEsQ0FNQSxZQUFBLENBQ0EscUJBQUEsQ0FSQSxPQUFBLENBU0Esd0JBQUEsQ0FFQSxTQUFBLENBREEsWUFBQSxDQVhBLGlCQUFBLENBYUEsMkJBQUEsQ0FFQSw4R0FFRSxTQUFBLENBR0YsdUNBT0Usb0JBQUEsQ0FDQSwyQkFBQSxDQVBBLFVBQUEsQ0FLQSxtQkFBQSxDQUpBLGNBQUEsQ0FDQSxlQUFBLENBRUEsZUFBQSxDQURBLFFBQUEsQ0FLQSxlQUFBLENBR0Ysc0NBQ0Usd0JBQUEsQ0FDQSxjQUFBLENBQ0EsY0FBQSxDQVFKLHFCQUNFLGdCQUFBLENBRUEscUNBT0Usb0JBQUEsQ0FDQSwyQkFBQSxDQUpBLG1DQUFBLENBRUEsbUJBQUEsQ0FMQSxjQUFBLENBQ0EsZUFBQSxDQUdBLGVBQUEsQ0FGQSxRQUFBLENBTUEsZUFBQSxDQVlGLHlGQUNFLGlCQUFBLENBUUosdUJBQ0UsaUJBQUEsQ0FDQSxlQUFBLENBR0Ysd0JBQ0Usb0NBUUEsQ0FHRixnREFIRSx3Q0FBQSxDQVBBLHFJQUFBLENBTUEseUJBZ0JBLENBWkYsd0JBWUUsbUJBQUEsQ0FUQSxpQkFBQSxDQUZBLFdBQUEsQ0FDQSxlQVVBLENBR0YsNEJBQ0UsR0FDRSwwQkFBQSxDQUVGLEdBQ0UsMkJBQUEsQ0FBQSxDQVFKLHdCQUVJLDRCQUVFLGVBQUEsQ0FEQSxjQUNBLENBR0YsNENBQ0UsY0FBQSxDQUdGLDZCQUNFLG9CQUFBLENBS0osNkNBRUUscUZBQUEsQ0FEQSxTQUNBLENBQUEsQ0FhSix1Q0FDRSw2REFHRSxlQUFBLENBR0YsNENBQ0UsY0FBQSxDQUdGLGdEQUVFLGNBQUEsQ0FDQSxzQ0FBQSxDQUFBLENBUUosOEJBQ0Usc0JBQ0UsMkJBQUEsQ0FFQSxvQ0FDRSwyQkFBQSxDQUlKLHVCQUNFLGlCQUFBLENBRUEsK0JBQUEsQ0FEQSxTQUNBLENBRUEsdUNBQ0UsZ0JBQUEsQ0FHRixzQ0FDRSxjQUFBLENBSUoscUNBQ0UsZ0JBQUEsQ0FHRixrQkFDRSwwQkFBQSxDQUFBLENBUUosYUFDRSxrQkFDRSxZQUFBLENBRUEsT0FBQSxDQURBLG1DQUNBLENBR0Ysc0JBR0UscUJBQUEsQ0FEQSxlQUFBLENBREEsa0JBRUEsQ0FFQSw0QkFFRSxlQUFBLENBREEsY0FDQSxDQUlKLHVCQUNFLFlBQUEsQ0FJRixxRkFFRSxhQUFBLENBSUEsc0JBQ0UsY0FBQSxDQUFBIiwiZmlsZSI6IkdhbGxlcnlMYXlvdXQubW9kdWxlLmNzcyJ9 */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "animate-fadeIn_be835b32": "animate-fadeIn_be835b32",
  fadeIn_be835b32: "fadeIn_be835b32",
  "animate-fadeOut_be835b32": "animate-fadeOut_be835b32",
  fadeOut_be835b32: "fadeOut_be835b32",
  "animate-slideUp_be835b32": "animate-slideUp_be835b32",
  slideUp_be835b32: "slideUp_be835b32",
  "animate-slideDown_be835b32": "animate-slideDown_be835b32",
  slideDown_be835b32: "slideDown_be835b32",
  "animate-slideLeft_be835b32": "animate-slideLeft_be835b32",
  slideLeft_be835b32: "slideLeft_be835b32",
  "animate-slideRight_be835b32": "animate-slideRight_be835b32",
  slideRight_be835b32: "slideRight_be835b32",
  "animate-scaleIn_be835b32": "animate-scaleIn_be835b32",
  scaleIn_be835b32: "scaleIn_be835b32",
  "animate-spin_be835b32": "animate-spin_be835b32",
  spin_be835b32: "spin_be835b32",
  "animate-pulse_be835b32": "animate-pulse_be835b32",
  pulse_be835b32: "pulse_be835b32",
  "animate-bounce_be835b32": "animate-bounce_be835b32",
  bounce_be835b32: "bounce_be835b32",
  "animate-shake_be835b32": "animate-shake_be835b32",
  shake_be835b32: "shake_be835b32",
  "sr-only_be835b32": "sr-only_be835b32",
  "sr-only-focusable_be835b32": "sr-only-focusable_be835b32",
  "focus-visible_be835b32": "focus-visible_be835b32",
  "touch-target_be835b32": "touch-target_be835b32",
  "reduced-motion_be835b32": "reduced-motion_be835b32",
  "touch-action-manipulation_be835b32": "touch-action-manipulation_be835b32",
  "touch-action-pan-x_be835b32": "touch-action-pan-x_be835b32",
  "touch-action-pan-y_be835b32": "touch-action-pan-y_be835b32",
  "touch-action-none_be835b32": "touch-action-none_be835b32",
  "touch-interactive_be835b32": "touch-interactive_be835b32",
  "touch-button_be835b32": "touch-button_be835b32",
  pressed_be835b32: "pressed_be835b32",
  "touch-card_be835b32": "touch-card_be835b32",
  "touch-link_be835b32": "touch-link_be835b32",
  "touch-list-item_be835b32": "touch-list-item_be835b32",
  "touch-scroll_be835b32": "touch-scroll_be835b32",
  "touch-scroll-horizontal_be835b32": "touch-scroll-horizontal_be835b32",
  "touch-scroll-item_be835b32": "touch-scroll-item_be835b32",
  "touch-input_be835b32": "touch-input_be835b32",
  "ripple-container_be835b32": "ripple-container_be835b32",
  ripple_be835b32: "ripple_be835b32",
  "ripple-animation_be835b32": "ripple-animation_be835b32",
  "is-pressed_be835b32": "is-pressed_be835b32",
  "no-tap-highlight_be835b32": "no-tap-highlight_be835b32",
  "no-select_be835b32": "no-select_be835b32",
  gallery_be835b32: "gallery_be835b32",
  "columns-2_be835b32": "columns-2_be835b32",
  "columns-3_be835b32": "columns-3_be835b32",
  "columns-4_be835b32": "columns-4_be835b32",
  galleryItem_be835b32: "galleryItem_be835b32",
  imageWrapper_be835b32: "imageWrapper_be835b32",
  image_be835b32: "image_be835b32",
  noImage_be835b32: "noImage_be835b32",
  noImageIcon_be835b32: "noImageIcon_be835b32",
  hoverOverlay_be835b32: "hoverOverlay_be835b32",
  title_be835b32: "title_be835b32",
  date_be835b32: "date_be835b32",
  titleBelow_be835b32: "titleBelow_be835b32",
  "title-none_be835b32": "title-none_be835b32",
  "title-hover_be835b32": "title-hover_be835b32",
  skeletonItem_be835b32: "skeletonItem_be835b32",
  skeletonImage_be835b32: "skeletonImage_be835b32",
  shimmer_be835b32: "shimmer_be835b32",
  skeletonTitle_be835b32: "skeletonTitle_be835b32",
  scaleOut_be835b32: "scaleOut_be835b32"
});


/***/ }),

/***/ 973:
/*!***************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/EmptyState/EmptyState.module.css ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".emptyState_027a20e8{align-items:center;display:flex;flex-direction:column;justify-content:center;min-height:200px;padding:32px 16px;text-align:center}.sm_027a20e8{min-height:150px;padding:16px}.sm_027a20e8 .iconEmoji_027a20e8,.sm_027a20e8 .iconWrapper_027a20e8{font-size:32px;margin-bottom:12px}.sm_027a20e8 .title_027a20e8{font-size:1rem;margin-bottom:4px}.sm_027a20e8 .description_027a20e8{font-size:.8125rem}.md_027a20e8{min-height:200px;padding:32px 16px}.md_027a20e8 .iconEmoji_027a20e8,.md_027a20e8 .iconWrapper_027a20e8{font-size:48px;margin-bottom:16px}.md_027a20e8 .title_027a20e8{font-size:1.25rem;margin-bottom:8px}.md_027a20e8 .description_027a20e8{font-size:.875rem}.lg_027a20e8{min-height:300px;padding:48px 24px}.lg_027a20e8 .iconEmoji_027a20e8,.lg_027a20e8 .iconWrapper_027a20e8{font-size:64px;margin-bottom:24px}.lg_027a20e8 .title_027a20e8{font-size:1.5rem;margin-bottom:12px}.lg_027a20e8 .description_027a20e8{font-size:1rem}.iconWrapper_027a20e8{align-items:center;color:var(--neutralSecondary,#666);display:flex;justify-content:center}.iconEmoji_027a20e8{display:block;line-height:1}.title_027a20e8{color:var(--neutralPrimary,#333);font-weight:var(--font-weight-semibold,600);line-height:1.3;margin:0}.description_027a20e8{color:var(--neutralSecondary,#666);line-height:1.5;margin:0;max-width:400px}.actions_027a20e8{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:24px}.actionButton_027a20e8{min-width:120px}@media (forced-colors:active){.emptyState_027a20e8{border:1px solid CanvasText;border-radius:4px}.description_027a20e8,.title_027a20e8{color:CanvasText}}@media print{.emptyState_027a20e8{background:0 0;border:1px solid #ccc}.actions_027a20e8{display:none}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9zaGFyZWQvRW1wdHlTdGF0ZS9FbXB0eVN0YXRlLm1vZHVsZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLHFCQUdFLGtCQUFBLENBRkEsWUFBQSxDQUNBLHFCQUFBLENBRUEsc0JBQUEsQ0FHQSxnQkFBQSxDQURBLGlCQUFBLENBREEsaUJBRUEsQ0FPRixhQUVFLGdCQUFBLENBREEsWUFDQSxDQUVBLG9FQUVFLGNBQUEsQ0FDQSxrQkFBQSxDQUdGLDZCQUNFLGNBQUEsQ0FDQSxpQkFBQSxDQUdGLG1DQUNFLGtCQUFBLENBSUosYUFFRSxnQkFBQSxDQURBLGlCQUNBLENBRUEsb0VBRUUsY0FBQSxDQUNBLGtCQUFBLENBR0YsNkJBQ0UsaUJBQUEsQ0FDQSxpQkFBQSxDQUdGLG1DQUNFLGlCQUFBLENBSUosYUFFRSxnQkFBQSxDQURBLGlCQUNBLENBRUEsb0VBRUUsY0FBQSxDQUNBLGtCQUFBLENBR0YsNkJBQ0UsZ0JBQUEsQ0FDQSxrQkFBQSxDQUdGLG1DQUNFLGNBQUEsQ0FRSixzQkFFRSxrQkFBQSxDQUVBLGtDQUFBLENBSEEsWUFBQSxDQUVBLHNCQUNBLENBR0Ysb0JBQ0UsYUFBQSxDQUNBLGFBQUEsQ0FPRixnQkFHRSxnQ0FBQSxDQURBLDJDQUFBLENBRUEsZUFBQSxDQUhBLFFBR0EsQ0FPRixzQkFFRSxrQ0FBQSxDQUNBLGVBQUEsQ0FGQSxRQUFBLENBR0EsZUFBQSxDQU9GLGtCQUNFLFlBQUEsQ0FHQSxjQUFBLENBRkEsUUFBQSxDQUdBLHNCQUFBLENBRkEsZUFFQSxDQUdGLHVCQUNFLGVBQUEsQ0FRRiw4QkFDRSxxQkFDRSwyQkFBQSxDQUNBLGlCQUFBLENBR0Ysc0NBRUUsZ0JBQUEsQ0FBQSxDQVVKLGFBQ0UscUJBRUUsY0FBQSxDQURBLHFCQUNBLENBR0Ysa0JBQ0UsWUFBQSxDQUFBIiwiZmlsZSI6IkVtcHR5U3RhdGUubW9kdWxlLmNzcyJ9 */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  emptyState_027a20e8: "emptyState_027a20e8",
  sm_027a20e8: "sm_027a20e8",
  iconEmoji_027a20e8: "iconEmoji_027a20e8",
  iconWrapper_027a20e8: "iconWrapper_027a20e8",
  title_027a20e8: "title_027a20e8",
  description_027a20e8: "description_027a20e8",
  md_027a20e8: "md_027a20e8",
  lg_027a20e8: "lg_027a20e8",
  actions_027a20e8: "actions_027a20e8",
  actionButton_027a20e8: "actionButton_027a20e8"
});


/***/ }),

/***/ 5354:
/*!************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/GalleryLayout/GalleryItem.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GalleryItem: () => (/* binding */ GalleryItem),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GalleryLayout.module.scss */ 31);
/**
 * GalleryItem Component
 *
 * Individual gallery item with image, hover effects, and title display options.
 * Designed for image-first display with minimal text.
 *
 * Features:
 * - Configurable title display (hover, below, none)
 * - Smooth hover animations
 * - Keyboard accessible
 * - Touch-friendly
 */



/**
 * Aspect ratio CSS values
 */
const aspectRatioValues = {
    '1:1': '1/1',
    '4:3': '4/3',
    '16:9': '16/9'
};
/**
 * Title position CSS class mapping
 */
const titlePositionClasses = {
    hover: 'title-hover',
    below: 'title-below',
    none: 'title-none'
};
/**
 * Format date for display
 */
const formatDate = (dateString) => {
    if (!dateString)
        return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return '';
        return date.toLocaleDateString('nb-NO', {
            day: 'numeric',
            month: 'short'
        });
    }
    catch (_a) {
        return '';
    }
};
/**
 * GalleryItem component
 */
const GalleryItem = ({ item, showTitle, aspectRatio, fallbackImageUrl, forceFallback = false, onClick, className = '', testId = 'gallery-item' }) => {
    // Get image URL with fallback - if forceFallback is true, use fallbackImageUrl
    const imageUrl = forceFallback && fallbackImageUrl
        ? fallbackImageUrl
        : (item.imageUrl || fallbackImageUrl);
    // Handle click
    const handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        if (onClick) {
            onClick(item);
        }
        else if (item.link) {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        }
    }, [item, onClick]);
    // Handle keyboard navigation
    const handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    }, [handleClick]);
    // Build class names - use type assertion to satisfy TypeScript
    const titleClass = titlePositionClasses[showTitle];
    const itemClasses = [
        _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].galleryItem,
        _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"][titleClass],
        className
    ].filter(Boolean).join(' ');
    // CSS custom properties for aspect ratio
    const imageWrapperStyle = {
        '--aspect-ratio': aspectRatioValues[aspectRatio]
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { className: itemClasses, onClick: handleClick, onKeyDown: handleKeyDown, tabIndex: 0, role: "link", "aria-label": item.title, "data-testid": testId },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].imageWrapper, style: imageWrapperStyle },
            imageUrl ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", { src: imageUrl, alt: item.title, loading: "lazy", className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].image, "data-testid": `${testId}-image` })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].noImage, "aria-hidden": "true", "data-testid": `${testId}-no-image` },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1", className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].noImageIcon },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("polyline", { points: "21 15 16 10 5 21" })))),
            showTitle === 'hover' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].hoverOverlay, "data-testid": `${testId}-hover-overlay` },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].title }, item.title),
                item.pubDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("time", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].date, dateTime: item.pubDate }, formatDate(item.pubDate)))))),
        showTitle === 'below' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].titleBelow, "data-testid": `${testId}-title-below` },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].title }, item.title)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GalleryItem);


/***/ }),

/***/ 4691:
/*!**************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/GalleryLayout/GalleryLayout.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GalleryLayout: () => (/* binding */ GalleryLayout),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/EmptyState */ 7323);
/* harmony import */ var _GalleryItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GalleryItem */ 5354);
/* harmony import */ var _GallerySkeleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GallerySkeleton */ 6090);
/* harmony import */ var _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GalleryLayout.module.scss */ 31);
/**
 * GalleryLayout Component
 *
 * A masonry-style image grid layout for RSS feed items.
 * Images are the hero - titles shown on hover or below.
 *
 * Features:
 * - Responsive grid with configurable columns
 * - Container query-based responsiveness
 * - Hover effects with title overlay
 * - Lazy loading images
 * - Skeleton loading state
 * - Empty state for items without images
 */






/**
 * Gap size CSS values
 */
const gapValues = {
    sm: '8px',
    md: '16px',
    lg: '24px'
};
/**
 * GalleryLayout component
 */
const GalleryLayout = ({ items, columns = 'auto', gap = 'md', showTitles = 'below', aspectRatio = '4:3', fallbackImageUrl, forceFallback = false, filterNoImages = true, isLoading = false, skeletonCount = 8, onItemClick, className = '', testId = 'gallery-layout' }) => {
    // Key for forcing re-render when forceFallback changes
    const [layoutKey, setLayoutKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setLayoutKey(prev => prev + 1);
    }, [forceFallback]);
    // Filter items - either filter out those without images, or include all
    const displayItems = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        if (!items)
            return [];
        // If force fallback is on or we have a fallback URL, show all items
        if (forceFallback || !filterNoImages) {
            return items;
        }
        // Otherwise filter to only items with images or fallback available
        return items.filter(item => item.imageUrl || fallbackImageUrl);
    }, [items, forceFallback, filterNoImages, fallbackImageUrl]);
    // Handle item click
    const handleItemClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((item) => {
        if (onItemClick) {
            onItemClick(item);
        }
    }, [onItemClick]);
    // CSS custom properties for grid
    const gridStyle = {
        '--gallery-columns': columns === 'auto' ? 'auto-fill' : columns,
        '--gallery-gap': gapValues[gap]
    };
    // Container classes
    const containerClasses = [
        _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].gallery,
        columns !== 'auto' ? _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"][`columns-${columns}`] : '',
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, style: gridStyle, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GallerySkeleton__WEBPACK_IMPORTED_MODULE_3__.GallerySkeleton, { count: skeletonCount, aspectRatio: aspectRatio, showTitles: showTitles, testId: `${testId}-skeleton` })));
    }
    // Empty state
    if (!displayItems || displayItems.length === 0) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: className, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_1__.NoItemsEmptyState, null)));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, style: gridStyle, "data-testid": testId, key: layoutKey }, displayItems.map((item, index) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GalleryItem__WEBPACK_IMPORTED_MODULE_2__.GalleryItem, { key: `${item.link}-${index}`, item: item, showTitle: showTitles, aspectRatio: aspectRatio, fallbackImageUrl: fallbackImageUrl, forceFallback: forceFallback, onClick: onItemClick ? handleItemClick : undefined, testId: `${testId}-item-${index}` })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (react__WEBPACK_IMPORTED_MODULE_0__.memo(GalleryLayout));


/***/ }),

/***/ 31:
/*!**************************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/GalleryLayout/GalleryLayout.module.scss.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./GalleryLayout.module.css */ 3443);
const styles = {
    'animate-fadeIn': 'animate-fadeIn_be835b32',
    fadeIn: 'fadeIn_be835b32',
    'animate-fadeOut': 'animate-fadeOut_be835b32',
    fadeOut: 'fadeOut_be835b32',
    'animate-slideUp': 'animate-slideUp_be835b32',
    slideUp: 'slideUp_be835b32',
    'animate-slideDown': 'animate-slideDown_be835b32',
    slideDown: 'slideDown_be835b32',
    'animate-slideLeft': 'animate-slideLeft_be835b32',
    slideLeft: 'slideLeft_be835b32',
    'animate-slideRight': 'animate-slideRight_be835b32',
    slideRight: 'slideRight_be835b32',
    'animate-scaleIn': 'animate-scaleIn_be835b32',
    scaleIn: 'scaleIn_be835b32',
    'animate-spin': 'animate-spin_be835b32',
    spin: 'spin_be835b32',
    'animate-pulse': 'animate-pulse_be835b32',
    pulse: 'pulse_be835b32',
    'animate-bounce': 'animate-bounce_be835b32',
    bounce: 'bounce_be835b32',
    'animate-shake': 'animate-shake_be835b32',
    shake: 'shake_be835b32',
    'sr-only': 'sr-only_be835b32',
    'sr-only-focusable': 'sr-only-focusable_be835b32',
    'focus-visible': 'focus-visible_be835b32',
    'touch-target': 'touch-target_be835b32',
    'reduced-motion': 'reduced-motion_be835b32',
    'touch-action-manipulation': 'touch-action-manipulation_be835b32',
    'touch-action-pan-x': 'touch-action-pan-x_be835b32',
    'touch-action-pan-y': 'touch-action-pan-y_be835b32',
    'touch-action-none': 'touch-action-none_be835b32',
    'touch-interactive': 'touch-interactive_be835b32',
    'touch-button': 'touch-button_be835b32',
    pressed: 'pressed_be835b32',
    'touch-card': 'touch-card_be835b32',
    'touch-link': 'touch-link_be835b32',
    'touch-list-item': 'touch-list-item_be835b32',
    'touch-scroll': 'touch-scroll_be835b32',
    'touch-scroll-horizontal': 'touch-scroll-horizontal_be835b32',
    'touch-scroll-item': 'touch-scroll-item_be835b32',
    'touch-input': 'touch-input_be835b32',
    'ripple-container': 'ripple-container_be835b32',
    ripple: 'ripple_be835b32',
    'ripple-animation': 'ripple-animation_be835b32',
    'is-pressed': 'is-pressed_be835b32',
    'no-tap-highlight': 'no-tap-highlight_be835b32',
    'no-select': 'no-select_be835b32',
    gallery: 'gallery_be835b32',
    'columns-2': 'columns-2_be835b32',
    'columns-3': 'columns-3_be835b32',
    'columns-4': 'columns-4_be835b32',
    galleryItem: 'galleryItem_be835b32',
    imageWrapper: 'imageWrapper_be835b32',
    image: 'image_be835b32',
    noImage: 'noImage_be835b32',
    noImageIcon: 'noImageIcon_be835b32',
    hoverOverlay: 'hoverOverlay_be835b32',
    title: 'title_be835b32',
    date: 'date_be835b32',
    titleBelow: 'titleBelow_be835b32',
    'title-none': 'title-none_be835b32',
    'title-hover': 'title-hover_be835b32',
    skeletonItem: 'skeletonItem_be835b32',
    skeletonImage: 'skeletonImage_be835b32',
    shimmer: 'shimmer_be835b32',
    skeletonTitle: 'skeletonTitle_be835b32',
    scaleOut: 'scaleOut_be835b32'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 6090:
/*!****************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/GalleryLayout/GallerySkeleton.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GallerySkeleton: () => (/* binding */ GallerySkeleton),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GalleryLayout.module.scss */ 31);
/**
 * GallerySkeleton Component
 *
 * Skeleton loading state for the gallery layout.
 * Matches the gallery grid structure with animated placeholders.
 */


/**
 * Aspect ratio CSS values
 */
const aspectRatioValues = {
    '1:1': '1/1',
    '4:3': '4/3',
    '16:9': '16/9'
};
/**
 * GallerySkeleton component
 */
const GallerySkeleton = ({ count = 8, aspectRatio = '4:3', showTitles = 'below', testId = 'gallery-skeleton' }) => {
    const items = Array.from({ length: count }, (_, i) => i);
    const imageStyle = {
        '--aspect-ratio': aspectRatioValues[aspectRatio]
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, items.map((index) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: index, className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].skeletonItem, "aria-hidden": "true", "data-testid": `${testId}-item-${index}` },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].skeletonImage, style: imageStyle }),
        showTitles === 'below' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _GalleryLayout_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].skeletonTitle })))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GallerySkeleton);


/***/ }),

/***/ 3615:
/*!******************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/GalleryLayout/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GalleryItem: () => (/* reexport safe */ _GalleryItem__WEBPACK_IMPORTED_MODULE_1__.GalleryItem),
/* harmony export */   GalleryLayout: () => (/* reexport safe */ _GalleryLayout__WEBPACK_IMPORTED_MODULE_0__.GalleryLayout),
/* harmony export */   GallerySkeleton: () => (/* reexport safe */ _GallerySkeleton__WEBPACK_IMPORTED_MODULE_2__.GallerySkeleton),
/* harmony export */   "default": () => (/* reexport safe */ _GalleryLayout__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _GalleryLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GalleryLayout */ 4691);
/* harmony import */ var _GalleryItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GalleryItem */ 5354);
/* harmony import */ var _GallerySkeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GallerySkeleton */ 6090);
/**
 * GalleryLayout Index
 *
 * Re-exports all GalleryLayout components and types.
 */






/***/ }),

/***/ 4093:
/*!*******************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/EmptyState/EmptyState.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmptyState: () => (/* binding */ EmptyState),
/* harmony export */   FilteredEmptyState: () => (/* binding */ FilteredEmptyState),
/* harmony export */   NoFeedConfiguredEmptyState: () => (/* binding */ NoFeedConfiguredEmptyState),
/* harmony export */   NoItemsEmptyState: () => (/* binding */ NoItemsEmptyState),
/* harmony export */   OfflineEmptyState: () => (/* binding */ OfflineEmptyState),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react/lib/Button */ 9425);
/* harmony import */ var _fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react/lib/Button */ 5613);
/* harmony import */ var _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmptyState.module.scss */ 6845);
/**
 * EmptyState Component
 *
 * A component for displaying empty states when no content is available.
 * Provides clear messaging and optional action buttons.
 *
 * Features:
 * - Customizable icon
 * - Title and description
 * - Optional action button
 * - Multiple size variants
 * - Accessible design
 */



/**
 * Default icon component
 */
const DefaultIcon = () => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "ms-Icon ms-Icon--Feed", "aria-hidden": "true" }));
/**
 * EmptyState component
 */
const EmptyState = ({ icon, title, description, action, secondaryAction, size = 'md', className = '', testId = 'empty-state' }) => {
    const containerClasses = [
        _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].emptyState,
        _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"][size],
        className
    ].filter(Boolean).join(' ');
    // Render icon
    const renderIcon = () => {
        if (icon === null)
            return null;
        const iconContent = icon !== null && icon !== void 0 ? icon : react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultIcon, null);
        // Check if it's a string (emoji)
        if (typeof iconContent === 'string') {
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].iconEmoji, "aria-hidden": "true" }, iconContent));
        }
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].iconWrapper, "aria-hidden": "true" }, iconContent));
    };
    // Render action button
    const renderAction = (actionConfig, isPrimary = true) => {
        const ButtonComponent = isPrimary ? _fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_2__.PrimaryButton : _fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_3__.DefaultButton;
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonComponent, { onClick: actionConfig.onClick, className: _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].actionButton, "data-testid": `${testId}-action${isPrimary ? '' : '-secondary'}` }, actionConfig.label));
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, "data-testid": testId, role: "status", "aria-label": title },
        renderIcon(),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { className: _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].title }, title),
        description && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { className: _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].description }, description)),
        (action || secondaryAction) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _EmptyState_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].actions },
            action && renderAction(action, action.primary !== false),
            secondaryAction && renderAction(secondaryAction, secondaryAction.primary === true)))));
};
const NoItemsEmptyState = ({ onRefresh, message, testId = 'no-items-empty-state' }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EmptyState, { icon: "\uD83D\uDCF0", title: message || 'Ingen elementer', description: "Feeden er tom eller alle elementer er filtrert bort.", action: onRefresh ? { label: 'Oppdater', onClick: onRefresh } : undefined, testId: testId }));
const NoFeedConfiguredEmptyState = ({ onOpenSettings, testId = 'no-feed-configured-empty-state' }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EmptyState, { icon: "\u2699\uFE0F", title: "Ingen feed konfigurert", description: "Konfigurer en RSS-feed URL i webdelens innstillinger for \u00E5 vise innhold.", action: onOpenSettings ? { label: 'Åpne innstillinger', onClick: onOpenSettings } : undefined, testId: testId }));
const FilteredEmptyState = ({ onClearFilters, filterValue, testId = 'filtered-empty-state' }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EmptyState, { icon: "\uD83D\uDD0D", title: "Ingen treff", description: filterValue
        ? `Ingen elementer matcher "${filterValue}". Prøv et annet søk.`
        : 'Ingen elementer matcher de valgte filtrene.', action: onClearFilters ? { label: 'Nullstill filtre', onClick: onClearFilters } : undefined, testId: testId }));
const OfflineEmptyState = ({ onRetry, testId = 'offline-empty-state' }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(EmptyState, { icon: "\uD83D\uDCE1", title: "Frakoblet", description: "Du er frakoblet internett. Koble til igjen for \u00E5 laste inn innhold.", action: onRetry ? { label: 'Prøv igjen', onClick: onRetry } : undefined, testId: testId }));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmptyState);


/***/ }),

/***/ 6845:
/*!*******************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/EmptyState/EmptyState.module.scss.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./EmptyState.module.css */ 973);
const styles = {
    emptyState: 'emptyState_027a20e8',
    sm: 'sm_027a20e8',
    iconWrapper: 'iconWrapper_027a20e8',
    iconEmoji: 'iconEmoji_027a20e8',
    title: 'title_027a20e8',
    description: 'description_027a20e8',
    md: 'md_027a20e8',
    lg: 'lg_027a20e8',
    actions: 'actions_027a20e8',
    actionButton: 'actionButton_027a20e8'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 7323:
/*!**************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/EmptyState/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmptyState: () => (/* reexport safe */ _EmptyState__WEBPACK_IMPORTED_MODULE_0__.EmptyState),
/* harmony export */   FilteredEmptyState: () => (/* reexport safe */ _EmptyState__WEBPACK_IMPORTED_MODULE_0__.FilteredEmptyState),
/* harmony export */   NoFeedConfiguredEmptyState: () => (/* reexport safe */ _EmptyState__WEBPACK_IMPORTED_MODULE_0__.NoFeedConfiguredEmptyState),
/* harmony export */   NoItemsEmptyState: () => (/* reexport safe */ _EmptyState__WEBPACK_IMPORTED_MODULE_0__.NoItemsEmptyState),
/* harmony export */   OfflineEmptyState: () => (/* reexport safe */ _EmptyState__WEBPACK_IMPORTED_MODULE_0__.OfflineEmptyState),
/* harmony export */   "default": () => (/* reexport safe */ _EmptyState__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _EmptyState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EmptyState */ 4093);
/**
 * EmptyState Component Exports
 */



/***/ }),

/***/ 9425:
/*!*******************************************************************************************!*\
  !*** ./node_modules/@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PrimaryButton: () => (/* binding */ PrimaryButton)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 196);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Utilities */ 2727);
/* harmony import */ var _Utilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../Utilities */ 5004);
/* harmony import */ var _DefaultButton_DefaultButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DefaultButton/DefaultButton */ 5613);




/**
 * {@docCategory Button}
 */
var PrimaryButton = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__extends)(PrimaryButton, _super);
    function PrimaryButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrimaryButton.prototype.render = function () {
        return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_DefaultButton_DefaultButton__WEBPACK_IMPORTED_MODULE_2__.DefaultButton, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, this.props, { primary: true, onRenderDescription: _Utilities__WEBPACK_IMPORTED_MODULE_3__.nullRender }));
    };
    PrimaryButton = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
        (0,_Utilities__WEBPACK_IMPORTED_MODULE_4__.customizable)('PrimaryButton', ['theme', 'styles'], true)
    ], PrimaryButton);
    return PrimaryButton;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component));



/***/ })

}]);
//# sourceMappingURL=chunk.layout-gallery.js.map