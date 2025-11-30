"use strict";
(self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] = self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] || []).push([["lib_webparts_polRssGallery_components_shared_FeedItem_index_js"],{

/***/ 6651:
/*!**************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/ResponsiveImage.module.css ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".imageContainer_f06556ec{background-color:var(--neutralLighter,#f3f2f1);overflow:hidden;position:relative;width:100%}.hasAspectRatio_f06556ec{height:0}.hasAspectRatio_f06556ec .error_f06556ec,.hasAspectRatio_f06556ec .image_f06556ec,.hasAspectRatio_f06556ec .placeholderContent_f06556ec,.hasAspectRatio_f06556ec .skeleton_f06556ec{height:100%;left:0;position:absolute;top:0;width:100%}.image_f06556ec{display:block;height:100%;opacity:0;transition:opacity .3s ease-in-out;width:100%}.loaded_f06556ec{opacity:1}.fadeIn_f06556ec{animation:imageLoad_f06556ec .3s ease-out}@keyframes imageLoad_f06556ec{0%{opacity:0;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}.skeleton_f06556ec{animation:shimmer_f06556ec 1.5s infinite;background:linear-gradient(90deg,var(--neutralLight,#edebe9) 25%,var(--neutralLighter,#f3f2f1) 50%,var(--neutralLight,#edebe9) 75%);background-size:200% 100%}@keyframes shimmer_f06556ec{0%{background-position:-200% 0}to{background-position:200% 0}}.error_f06556ec{align-items:center;background-color:var(--neutralLighter,#f3f2f1);color:var(--neutralSecondary,#605e5c);display:flex;flex-direction:column;justify-content:center}.errorIcon_f06556ec{font-size:2rem;margin-bottom:.5rem;opacity:.6}.errorText_f06556ec{font-size:.875rem}.placeholder_f06556ec{background-color:var(--neutralLighter,#f3f2f1)}.placeholderContent_f06556ec{align-items:center;display:flex;justify-content:center}.placeholderIcon_f06556ec{font-size:2.5rem;opacity:.5}@media (prefers-reduced-motion:reduce){.image_f06556ec{transition:none}.fadeIn_f06556ec{animation:none}.skeleton_f06556ec{animation:none;background:var(--neutralLight,#edebe9)}}@media (forced-colors:active){.imageContainer_f06556ec{border:1px solid CanvasText}.error_f06556ec,.placeholder_f06556ec{background-color:Canvas;color:CanvasText}.skeleton_f06556ec{animation:none;background:ButtonFace}}@media print{.skeleton_f06556ec{display:none}.image_f06556ec{height:auto;max-width:100%;opacity:1}.error_f06556ec{border:1px solid #ccc}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9SZXNwb25zaXZlSW1hZ2UubW9kdWxlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EseUJBR0UsOENBQUEsQ0FEQSxlQUFBLENBREEsaUJBQUEsQ0FHQSxVQUFBLENBR0YseUJBQ0UsUUFBQSxDQUVBLG9MQVFFLFdBQUEsQ0FGQSxNQUFBLENBRkEsaUJBQUEsQ0FDQSxLQUFBLENBRUEsVUFDQSxDQUlKLGdCQUNFLGFBQUEsQ0FFQSxXQUFBLENBQ0EsU0FBQSxDQUNBLGtDQUFBLENBSEEsVUFHQSxDQUdGLGlCQUNFLFNBQUEsQ0FHRixpQkFDRSx5Q0FBQSxDQUdGLDhCQUNFLEdBQ0UsU0FBQSxDQUNBLHFCQUFBLENBRUYsR0FDRSxTQUFBLENBQ0Esa0JBQUEsQ0FBQSxDQUtKLG1CQVFFLHdDQUFBLENBUEEsbUlBQUEsQ0FNQSx5QkFDQSxDQUdGLDRCQUNFLEdBQ0UsMkJBQUEsQ0FFRixHQUNFLDBCQUFBLENBQUEsQ0FLSixnQkFHRSxrQkFBQSxDQUVBLDhDQUFBLENBQ0EscUNBQUEsQ0FMQSxZQUFBLENBQ0EscUJBQUEsQ0FFQSxzQkFFQSxDQUdGLG9CQUNFLGNBQUEsQ0FDQSxtQkFBQSxDQUNBLFVBQUEsQ0FHRixvQkFDRSxpQkFBQSxDQUlGLHNCQUNFLDhDQUFBLENBR0YsNkJBRUUsa0JBQUEsQ0FEQSxZQUFBLENBRUEsc0JBQUEsQ0FHRiwwQkFDRSxnQkFBQSxDQUNBLFVBQUEsQ0FJRix1Q0FDRSxnQkFDRSxlQUFBLENBR0YsaUJBQ0UsY0FBQSxDQUdGLG1CQUNFLGNBQUEsQ0FDQSxzQ0FBQSxDQUFBLENBS0osOEJBQ0UseUJBQ0UsMkJBQUEsQ0FHRixzQ0FFRSx1QkFBQSxDQUNBLGdCQUFBLENBR0YsbUJBRUUsY0FBQSxDQURBLHFCQUNBLENBQUEsQ0FLSixhQUNFLG1CQUNFLFlBQUEsQ0FHRixnQkFHRSxXQUFBLENBREEsY0FBQSxDQURBLFNBRUEsQ0FHRixnQkFDRSxxQkFBQSxDQUFBIiwiZmlsZSI6IlJlc3BvbnNpdmVJbWFnZS5tb2R1bGUuY3NzIn0= */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  imageContainer_f06556ec: "imageContainer_f06556ec",
  hasAspectRatio_f06556ec: "hasAspectRatio_f06556ec",
  error_f06556ec: "error_f06556ec",
  image_f06556ec: "image_f06556ec",
  placeholderContent_f06556ec: "placeholderContent_f06556ec",
  skeleton_f06556ec: "skeleton_f06556ec",
  loaded_f06556ec: "loaded_f06556ec",
  fadeIn_f06556ec: "fadeIn_f06556ec",
  imageLoad_f06556ec: "imageLoad_f06556ec",
  shimmer_f06556ec: "shimmer_f06556ec",
  errorIcon_f06556ec: "errorIcon_f06556ec",
  errorText_f06556ec: "errorText_f06556ec",
  placeholder_f06556ec: "placeholder_f06556ec",
  placeholderIcon_f06556ec: "placeholderIcon_f06556ec"
});


/***/ }),

/***/ 2255:
/*!***********************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/FeedItem/FeedItem.module.css ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(":root{--gap-xs:4px;--gap-sm:8px;--gap-md:16px;--gap-lg:24px;--gap-xl:32px;--padding-xs:8px;--padding-sm:12px;--padding-md:16px;--padding-lg:24px;--padding-xl:32px}@media (max-width:480px){:root{--gap-lg:20px;--gap-xl:24px;--padding-lg:20px;--padding-xl:24px}}@media print{:root{--gap-md:0.5rem;--gap-lg:0.75rem;--padding-md:0.5rem;--padding-lg:0.75rem;font-size:12pt}body{font-family:Georgia,Times New Roman,serif;line-height:1.5}h1,h2,h3,h4,h5,h6{page-break-after:avoid;page-break-inside:avoid}p{orphans:3;widows:3}}@media (forced-colors:active){a{text-decoration:underline}}:root{--transition-instant:50ms;--transition-fast:150ms;--transition-normal:250ms;--transition-slow:350ms;--transition-slower:500ms;--easing-standard:cubic-bezier(0.4,0,0.2,1);--easing-decelerate:cubic-bezier(0,0,0.2,1);--easing-accelerate:cubic-bezier(0.4,0,1,1);--easing-sharp:cubic-bezier(0.4,0,0.6,1);--easing-bounce:cubic-bezier(0.68,-0.55,0.265,1.55)}@keyframes fadeIn_3a430fae{0%{opacity:0}to{opacity:1}}@keyframes fadeOut_3a430fae{0%{opacity:1}to{opacity:0}}@keyframes slideUp_3a430fae{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideDown_3a430fae{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideLeft_3a430fae{0%{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes slideRight_3a430fae{0%{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}@keyframes scaleIn_3a430fae{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}@keyframes scaleOut_3a430fae{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.95)}}@keyframes pulse_3a430fae{0%,to{opacity:1}50%{opacity:.5}}@keyframes shimmer_3a430fae{0%{background-position:-200% 0}to{background-position:200% 0}}@keyframes spin_3a430fae{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes bounce_3a430fae{0%,20%,50%,80%,to{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}@keyframes shake_3a430fae{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@keyframes ripple_3a430fae{0%{opacity:.5;transform:scale(0)}to{opacity:0;transform:scale(2.5)}}.animate-fadeIn_3a430fae{animation:fadeIn_3a430fae var(--transition-normal) var(--easing-decelerate) forwards}.animate-fadeOut_3a430fae{animation:fadeOut_3a430fae var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideUp_3a430fae{animation:slideUp_3a430fae var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideDown_3a430fae{animation:slideDown_3a430fae var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideLeft_3a430fae{animation:slideLeft_3a430fae var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideRight_3a430fae{animation:slideRight_3a430fae var(--transition-normal) var(--easing-decelerate) forwards}.animate-scaleIn_3a430fae{animation:scaleIn_3a430fae var(--transition-normal) var(--easing-decelerate) forwards}.animate-spin_3a430fae{animation:spin_3a430fae 1s linear infinite}.animate-pulse_3a430fae{animation:pulse_3a430fae 2s ease-in-out infinite}.animate-bounce_3a430fae{animation:bounce_3a430fae 1s ease infinite}.animate-shake_3a430fae{animation:shake_3a430fae .5s ease-in-out}@media (prefers-reduced-motion:reduce){*,:after,:before{animation-duration:0s!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:0s!important}.animate-fadeIn_3a430fae,.animate-fadeOut_3a430fae{animation-duration:.1s!important}}@media print{*,:after,:before{animation:none!important;transition:none!important}}.sr-only-focusable_3a430fae,.sr-only_3a430fae{clip:rect(0,0,0,0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.sr-only-focusable_3a430fae:focus,.sr-only-focusable_3a430fae:focus-visible{clip:auto;height:auto;margin:0;overflow:visible;padding:0;position:static;white-space:normal;width:auto}.focus-visible_3a430fae:focus{outline:0}.focus-visible_3a430fae:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-target_3a430fae{min-height:44px;min-width:44px}@media (prefers-reduced-motion:reduce){.reduced-motion_3a430fae{animation-duration:0s!important;animation-iteration-count:1!important;transition-duration:0s!important}}@keyframes ripple-animation_3a430fae{0%{opacity:.3;transform:scale(0)}to{opacity:0;transform:scale(4)}}.touch-action-manipulation_3a430fae{touch-action:manipulation}.touch-action-pan-x_3a430fae{touch-action:pan-x}.touch-action-pan-y_3a430fae{touch-action:pan-y}.touch-action-none_3a430fae{touch-action:none}.touch-interactive_3a430fae{-webkit-tap-highlight-color:transparent;cursor:pointer;min-height:44px;min-width:44px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-interactive_3a430fae:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-interactive_3a430fae{transition:none}.touch-interactive_3a430fae:active{opacity:.8;transform:none}}.touch-button_3a430fae{-webkit-tap-highlight-color:transparent;align-items:center;cursor:pointer;display:inline-flex;justify-content:center;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation;transition:transform .15s ease;-ms-user-select:none;user-select:none;-webkit-user-select:none}.touch-button_3a430fae:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-button_3a430fae{transition:none}.touch-button_3a430fae:active{opacity:.8;transform:none}}.touch-button_3a430fae:focus{outline:0}.touch-button_3a430fae:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}@media (forced-colors:active){.touch-button_3a430fae{background-color:ButtonFace;border:2px solid ButtonText;color:ButtonText}.touch-button_3a430fae:hover{background-color:Highlight;border-color:Highlight;color:HighlightText}.touch-button_3a430fae:focus-visible{outline:3px solid Highlight;outline-offset:2px}.touch-button_3a430fae:disabled{border-color:GrayText;color:GrayText}}.touch-button_3a430fae.pressed_3a430fae,.touch-button_3a430fae[data-pressed=true]{transform:scale(.98)}.touch-card_3a430fae{-webkit-tap-highlight-color:transparent;cursor:pointer;touch-action:manipulation;transition:transform .15s ease}.touch-card_3a430fae:active{transform:scale(.98)}@media (prefers-reduced-motion:reduce){.touch-card_3a430fae{transition:none}.touch-card_3a430fae:active{opacity:.8;transform:none}}.touch-card_3a430fae:focus{outline:0}.touch-card_3a430fae:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-card_3a430fae.pressed_3a430fae,.touch-card_3a430fae[data-pressed=true]{box-shadow:0 2px 4px rgba(0,0,0,.15);transform:scale(.98)}@media (hover:hover){.touch-card_3a430fae:hover:not(:active){box-shadow:0 4px 8px rgba(0,0,0,.15);transform:translateY(-2px)}}@media (prefers-reduced-motion:reduce){.touch-card_3a430fae:hover:not(:active){transform:none}}.touch-link_3a430fae{-webkit-tap-highlight-color:transparent;color:var(--themePrimary,#0078d4);position:relative;text-decoration:underline;touch-action:manipulation}.touch-link_3a430fae:after{content:\"\";height:44px;left:50%;min-height:100%;min-width:100%;position:absolute;top:50%;transform:translate(-50%,-50%);width:44px}.touch-link_3a430fae:focus{outline:0}.touch-link_3a430fae:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-link_3a430fae:focus,.touch-link_3a430fae:hover{text-decoration:none}.touch-link_3a430fae:active{opacity:.7}@media (prefers-reduced-motion:reduce){.touch-link_3a430fae:active{opacity:.8}}.touch-list-item_3a430fae{-webkit-tap-highlight-color:transparent;min-height:44px;padding:12px 16px;position:relative;touch-action:manipulation;transition:background-color .15s ease}.touch-list-item_3a430fae:active{background-color:var(--neutralLighter)}@media (prefers-reduced-motion:reduce){.touch-list-item_3a430fae{transition:none}}.touch-list-item_3a430fae:focus{outline:0}.touch-list-item_3a430fae:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-list-item_3a430fae:not(:last-child):after{background-color:var(--neutralLight);bottom:0;content:\"\";height:1px;left:16px;position:absolute;right:16px}.touch-scroll_3a430fae{-webkit-overflow-scrolling:touch;scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){.touch-scroll_3a430fae{scroll-behavior:auto}}.touch-scroll-horizontal_3a430fae{-webkit-overflow-scrolling:touch;-ms-overflow-style:none;display:flex;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;scrollbar-width:none;touch-action:pan-x}@media (prefers-reduced-motion:reduce){.touch-scroll-horizontal_3a430fae{scroll-behavior:auto}}.touch-scroll-horizontal_3a430fae::-webkit-scrollbar{display:none}.touch-scroll-item_3a430fae{flex-shrink:0;scroll-snap-align:start}.touch-input_3a430fae{-webkit-tap-highlight-color:transparent;font-size:16px;min-height:44px;min-width:44px;padding:12px 16px;touch-action:manipulation}.touch-input_3a430fae:focus{outline:0}.touch-input_3a430fae:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.ripple-container_3a430fae{overflow:hidden;position:relative}.ripple_3a430fae{animation:ripple-animation_3a430fae .6s ease-out forwards;background-color:var(--themePrimary);border-radius:50%;opacity:.3;pointer-events:none;position:absolute;transform:scale(0)}.is-pressed_3a430fae{transform:scale(.98)!important}.no-tap-highlight_3a430fae{-webkit-tap-highlight-color:transparent}.no-select_3a430fae{-ms-user-select:none;user-select:none;-webkit-user-select:none}.feedItem_3a430fae{background-color:var(--backgroundColor,#fff);border-radius:var(--borderRadius,4px);overflow:hidden;position:relative;transition:transform .15s cubic-bezier(.4,0,.2,1),box-shadow .15s cubic-bezier(.4,0,.2,1)}.feedItem_3a430fae:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.feedItem_3a430fae[role=button]{cursor:pointer}.feedItem_3a430fae[role=button]:hover{box-shadow:0 4px 12px rgba(0,0,0,.15);transform:translateY(-2px)}.feedItem_3a430fae[role=button]:active{transform:translateY(0)}.imageLink_3a430fae,.imageWrapper_3a430fae{display:block;overflow:hidden;position:relative}.image_3a430fae{height:auto;transition:transform .25s cubic-bezier(.4,0,.2,1);width:100%}.feedItem_3a430fae:hover .image_3a430fae{transform:scale(1.02)}.content_3a430fae{display:flex;flex-direction:column;gap:var(--spacing-xs,8px);padding:var(--spacing-md,16px)}.title_3a430fae{font-size:var(--font-size-lg,1.125rem);font-weight:var(--font-weight-semibold,600);line-height:var(--line-height-tight,1.3);margin:0}.titleLink_3a430fae{color:var(--textColor,#333);text-decoration:none;transition:color .15s cubic-bezier(.4,0,.2,1)}.titleLink_3a430fae:hover{color:var(--themePrimary,#0078d4);text-decoration:underline}.titleLink_3a430fae:focus-visible{border-radius:2px;outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.meta_3a430fae{align-items:center;color:var(--neutralSecondary,#666);display:flex;flex-wrap:wrap;font-size:var(--font-size-sm,.875rem);gap:var(--spacing-xs,8px)}.date_3a430fae,.source_3a430fae{align-items:center;display:inline-flex}.source_3a430fae:before{content:\"\\2022\";margin-right:var(--spacing-xs,8px)}.description_3a430fae{color:var(--neutralPrimary,#333);font-size:var(--font-size-body,1rem);line-height:var(--line-height-relaxed,1.6);margin:0}.categories_3a430fae{display:flex;flex-wrap:wrap;gap:var(--spacing-xs,8px);margin-top:auto}.category_3a430fae{align-items:center;background-color:var(--themeLighter,#deecf9);border-radius:12px;color:var(--themePrimary,#0078d4);display:inline-flex;font-size:var(--font-size-xs,.75rem);font-weight:var(--font-weight-medium,500);padding:4px 12px;transition:background-color .15s cubic-bezier(.4,0,.2,1)}.category_3a430fae:hover{background-color:var(--themeLight,#c7e0f4)}@media (pointer:coarse){.category_3a430fae{min-height:32px;padding:6px 14px}}.inverted_3a430fae.card_3a430fae{background-color:transparent;border-color:hsla(0,0%,100%,.2);box-shadow:none}.inverted_3a430fae.list_3a430fae{border-color:hsla(0,0%,100%,.2)}.inverted_3a430fae.card_3a430fae .titleLink_3a430fae,.inverted_3a430fae.list_3a430fae .titleLink_3a430fae{color:#fff}.inverted_3a430fae.card_3a430fae .titleLink_3a430fae:hover,.inverted_3a430fae.list_3a430fae .titleLink_3a430fae:hover{color:hsla(0,0%,100%,.9)}.inverted_3a430fae.card_3a430fae .date_3a430fae,.inverted_3a430fae.card_3a430fae .meta_3a430fae,.inverted_3a430fae.card_3a430fae .source_3a430fae,.inverted_3a430fae.list_3a430fae .date_3a430fae,.inverted_3a430fae.list_3a430fae .meta_3a430fae,.inverted_3a430fae.list_3a430fae .source_3a430fae{color:hsla(0,0%,100%,.85)}.inverted_3a430fae.card_3a430fae .description_3a430fae,.inverted_3a430fae.list_3a430fae .description_3a430fae{color:hsla(0,0%,100%,.9)}.inverted_3a430fae.card_3a430fae .category_3a430fae,.inverted_3a430fae.list_3a430fae .category_3a430fae{background-color:hsla(0,0%,100%,.2);color:#fff}.inverted_3a430fae.card_3a430fae .category_3a430fae:hover,.inverted_3a430fae.list_3a430fae .category_3a430fae:hover{background-color:hsla(0,0%,100%,.3)}.card_3a430fae{border:1px solid var(--neutralLight,#edebe9);box-shadow:0 1px 3px rgba(0,0,0,.1);display:flex;flex-direction:column;height:100%}.card_3a430fae .imageLink_3a430fae,.card_3a430fae .imageWrapper_3a430fae{flex-shrink:0}.card_3a430fae .content_3a430fae{display:flex;flex:1;flex-direction:column}.card_3a430fae .description_3a430fae{flex:1}.list_3a430fae{align-items:flex-start;background:0 0;border-bottom:1px solid var(--neutralLight,#edebe9);border-radius:0;display:flex;flex-direction:row;gap:var(--spacing-md,16px);padding:var(--spacing-md,16px)}.list_3a430fae:last-child{border-bottom:none}.list_3a430fae .imageLink_3a430fae,.list_3a430fae .imageWrapper_3a430fae{border-radius:var(--borderRadius,4px);flex-shrink:0;overflow:hidden;width:120px}.list_3a430fae .content_3a430fae{flex:1;min-width:0;padding:0}.list_3a430fae .title_3a430fae{font-size:var(--font-size-body,1rem)}.list_3a430fae .description_3a430fae{font-size:var(--font-size-sm,.875rem)}@media (pointer:coarse){.list_3a430fae{padding:var(--spacing-lg,24px) var(--spacing-md,16px)}.list_3a430fae .imageLink_3a430fae,.list_3a430fae .imageWrapper_3a430fae{width:100px}}.banner_3a430fae{background:0 0;border:none;box-shadow:none;display:flex;flex-direction:column;height:100%;position:relative}.banner_3a430fae .imageLink_3a430fae,.banner_3a430fae .imageWrapper_3a430fae{inset:0;position:absolute;z-index:0}.banner_3a430fae .imageLink_3a430fae:after,.banner_3a430fae .imageWrapper_3a430fae:after{background:linear-gradient(0deg,rgba(0,0,0,.8) 0,rgba(0,0,0,.4) 40%,transparent);content:\"\";inset:0;position:absolute}.banner_3a430fae .image_3a430fae{height:100%}.banner_3a430fae .content_3a430fae{color:#fff;margin-top:auto;padding:var(--spacing-lg,24px);padding-bottom:var(--banner-content-padding-bottom,48px);position:relative;z-index:1}.banner_3a430fae .title_3a430fae{color:#fff;font-size:var(--font-size-xl,1.5rem);text-shadow:0 1px 2px rgba(0,0,0,.5)}.banner_3a430fae .titleLink_3a430fae,.banner_3a430fae .titleLink_3a430fae:hover{color:#fff}.banner_3a430fae .meta_3a430fae{color:hsla(0,0%,100%,.9)}.banner_3a430fae .description_3a430fae{color:hsla(0,0%,100%,.95);text-shadow:0 1px 2px rgba(0,0,0,.3)}.banner_3a430fae .category_3a430fae{backdrop-filter:blur(4px);background-color:hsla(0,0%,100%,.2);color:#fff}.banner_3a430fae .category_3a430fae:hover{background-color:hsla(0,0%,100%,.3)}@media (forced-colors:active){.feedItem_3a430fae{border:1px solid CanvasText}.titleLink_3a430fae{text-decoration:underline}.category_3a430fae{border:1px solid CanvasText}.banner_3a430fae .imageLink_3a430fae:after,.banner_3a430fae .imageWrapper_3a430fae:after{background:0 0}.banner_3a430fae .content_3a430fae{background:Canvas;color:CanvasText}}@media (prefers-reduced-motion:reduce){.category_3a430fae,.feedItem_3a430fae,.image_3a430fae,.titleLink_3a430fae{transition:none}.feedItem_3a430fae:hover .image_3a430fae,.feedItem_3a430fae[role=button]:hover{transform:none}}@media print{.feedItem_3a430fae{border:1px solid #ccc;box-shadow:none;break-inside:avoid}.banner_3a430fae{min-height:auto}.banner_3a430fae .imageLink_3a430fae:after,.banner_3a430fae .imageWrapper_3a430fae:after{display:none}.banner_3a430fae .content_3a430fae{color:#000;position:static}.banner_3a430fae .description_3a430fae,.banner_3a430fae .titleLink_3a430fae,.banner_3a430fae .title_3a430fae{color:#000;text-shadow:none}.imageLink_3a430fae,.imageWrapper_3a430fae{max-height:200px}.category_3a430fae{background:0 0;border:1px solid #ccc}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19zcGFjaW5nLnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdHlwb2dyYXBoeS5zY3NzIiwiZmlsZTovLy9Vc2Vycy9wbG9mL0RvY3VtZW50cy9HaXRodWIvcG9sLXJzcy9zcmMvd2VicGFydHMvcG9sUnNzR2FsbGVyeS9zdHlsZXMvX2FuaW1hdGlvbnMuc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19hY2Nlc3NpYmlsaXR5LnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdG91Y2guc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9zaGFyZWQvRmVlZEl0ZW0vRmVlZEl0ZW0ubW9kdWxlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUpBLE1BRUUsWUFBQSxDQUNBLFlBQUEsQ0FDQSxhQUFBLENBQ0EsYUFBQSxDQUNBLGFBQUEsQ0FHQSxnQkFBQSxDQUNBLGlCQUFBLENBQ0EsaUJBQUEsQ0FDQSxpQkFBQSxDQUNBLGlCQUFBLENBT0YseUJBQ0UsTUFFRSxhQUFBLENBQ0EsYUFBQSxDQUNBLGlCQUFBLENBQ0EsaUJBQUEsQ0FBQSxDQVFKLGFBQ0UsTUFFRSxlQUFBLENBQ0EsZ0JBQUEsQ0FDQSxtQkFBQSxDQUNBLG9CQUFBLENDOEhBLGNEOUhBLENDaUlGLEtBQ0UseUNBQUEsQ0FDQSxlQUFBLENBR0Ysa0JBQ0Usc0JBQUEsQ0FDQSx1QkFBQSxDQUdGLEVBQ0UsU0FBQSxDQUNBLFFBQUEsQ0Q3SUEsQ0NxSkosOEJBRUUsRUFDRSx5QkFBQSxDQUFBLENDclVKLE1BRUUseUJBQUEsQ0FDQSx1QkFBQSxDQUNBLHlCQUFBLENBQ0EsdUJBQUEsQ0FDQSx5QkFBQSxDQUdBLDJDQUFBLENBQ0EsMkNBQUEsQ0FDQSwyQ0FBQSxDQUNBLHdDQUFBLENBQ0EsbURBQUEsQ0FRRiwyQkFDRSxHQUNFLFNBQUEsQ0FFRixHQUNFLFNBQUEsQ0FBQSxDQUlKLDRCQUNFLEdBQ0UsU0FBQSxDQUVGLEdBQ0UsU0FBQSxDQUFBLENBS0osNEJBQ0UsR0FFRSxTQUFBLENBREEsMEJBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSx1QkFDQSxDQUFBLENBSUosOEJBQ0UsR0FFRSxTQUFBLENBREEsMkJBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSx1QkFDQSxDQUFBLENBSUosOEJBQ0UsR0FFRSxTQUFBLENBREEsMEJBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSx1QkFDQSxDQUFBLENBSUosK0JBQ0UsR0FFRSxTQUFBLENBREEsMkJBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSx1QkFDQSxDQUFBLENBS0osNEJBQ0UsR0FFRSxTQUFBLENBREEsb0JBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSxrQkFDQSxDQUFBLENBSUosNkJBQ0UsR0FFRSxTQUFBLENBREEsa0JBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSxvQkFDQSxDQUFBLENBS0osMEJBQ0UsTUFDRSxTQUFBLENBRUYsSUFDRSxVQUFBLENBQUEsQ0FLSiw0QkFDRSxHQUNFLDJCQUFBLENBRUYsR0FDRSwwQkFBQSxDQUFBLENBS0oseUJBQ0UsR0FDRSxtQkFBQSxDQUVGLEdBQ0UsdUJBQUEsQ0FBQSxDQUtKLDJCQUNFLGtCQUNFLHVCQUFBLENBRUYsSUFDRSwyQkFBQSxDQUVGLElBQ0UsMEJBQUEsQ0FBQSxDQUtKLDBCQUNFLE1BQ0UsdUJBQUEsQ0FFRixvQkFDRSwwQkFBQSxDQUVGLGdCQUNFLHlCQUFBLENBQUEsQ0FLSiwyQkFDRSxHQUVFLFVBQUEsQ0FEQSxrQkFDQSxDQUVGLEdBRUUsU0FBQSxDQURBLG9CQUNBLENBQUEsQ0FtSkoseUJBeklFLG9GQUFBLENBNklGLDBCQTdJRSxxRkFBQSxDQWlKRiwwQkFqSkUscUZBQUEsQ0FxSkYsNEJBckpFLHVGQUFBLENBeUpGLDRCQXpKRSx1RkFBQSxDQTZKRiw2QkE3SkUsd0ZBQUEsQ0FpS0YsMEJBaktFLHFGQUFBLENBcUtGLHVCQTdIRSwwQ0FBQSxDQWlJRix3QkFDRSxnREFBQSxDQUdGLHlCQUNFLDBDQUFBLENBR0Ysd0JBQ0Usd0NBQUEsQ0FPRix1Q0FDRSxpQkFHRSwrQkFBQSxDQUNBLHFDQUFBLENBRUEsOEJBQUEsQ0FEQSxnQ0FDQSxDQUlGLG1EQUVFLGdDQUFBLENBQUEsQ0FRSixhQUNFLGlCQUdFLHdCQUFBLENBQ0EseUJBQUEsQ0FBQSxDQ3JGSiw4Q0E1UkUsa0JBQUEsQ0FFQSxRQUFBLENBTkEsVUFBQSxDQUVBLFdBQUEsQ0FDQSxlQUFBLENBRkEsU0FBQSxDQUhBLGlCQUFBLENBT0Esa0JBQUEsQ0FOQSxTQU9BLENBdUJBLDRFQVZBLFNBQUEsQ0FKQSxXQUFBLENBRUEsUUFBQSxDQUNBLGdCQUFBLENBRkEsU0FBQSxDQUhBLGVBQUEsQ0FPQSxrQkFBQSxDQU5BLFVBTUEsQ0F3QkEsOEJBQ0UsU0FBQSxDQUdGLHNDQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0FzUEosdUJBbE1FLGVBQUEsQ0FEQSxjQUNBLENBd0RBLHVDQThJRix5QkE3SUksK0JBQUEsQ0FDQSxxQ0FBQSxDQUNBLGdDQUFBLENBQUEsQ0M2RUoscUNBQ0UsR0FFRSxVQUFBLENBREEsa0JBQ0EsQ0FFRixHQUVFLFNBQUEsQ0FEQSxrQkFDQSxDQUFBLENBc0dKLG9DQTFWRSx5QkFBQSxDQThWRiw2QkF2VkUsa0JBQUEsQ0EyVkYsNkJBcFZFLGtCQUFBLENBd1ZGLDRCQWpWRSxpQkFBQSxDQXFWRiw0QkF2UUUsdUNBQUEsQ0FQQSxjQUFBLENEU0EsZUFBQSxDQURBLGNBQUEsQ0NwR0EseUJBQUEsQ0FpQ0EsOEJBQUEsQ0E4REEsb0JBQUEsQ0FBQSxnQkFBQSxDQUNBLHdCQUdBLENBL0RBLG1DQUNFLG9CQUFBLENBSUYsdUNBaVVGLDRCQWhVSSxlQUFBLENBRUEsbUNBRUUsVUFBQSxDQURBLGNBQ0EsQ0FBQSxDQWdVTix1QkEzUUUsdUNBQUEsQ0FhQSxrQkFBQSxDQXBCQSxjQUFBLENBbUJBLG1CQUFBLENBRUEsc0JBQUEsQ0FJQSxlQUFBLENEakJBLGNBQUEsQ0NnQkEsaUJBQUEsQ0FwSEEseUJBQUEsQ0FpQ0EsOEJBQUEsQ0E4REEsb0JBQUEsQ0FBQSxnQkFBQSxDQUNBLHdCQXFCQSxDQWpGQSw4QkFDRSxvQkFBQSxDQUlGLHVDQXFVRix1QkFwVUksZUFBQSxDQUVBLDhCQUVFLFVBQUEsQ0FEQSxjQUNBLENBQUEsQ0RISiw2QkFDRSxTQUFBLENBR0YscUNBQ0UsNkNBQUEsQ0FDQSxrQkFBQSxDQXNNRiw4QkN1SEYsdUJEckhJLDJCQUFBLENBREEsMkJBQUEsQ0FFQSxnQkFBQSxDQUVBLDZCQUNFLDBCQUFBLENBRUEsc0JBQUEsQ0FEQSxtQkFDQSxDQUdGLHFDQUNFLDJCQUFBLENBQ0Esa0JBQUEsQ0FHRixnQ0FFRSxxQkFBQSxDQURBLGNBQ0EsQ0FBQSxDQ2pKSixrRkFFRSxvQkFBQSxDQXdQSixxQkF6T0UsdUNBQUEsQ0FIQSxjQUFBLENBdElBLHlCQUFBLENBaUNBLDhCQXdHQSxDQXJHQSw0QkFDRSxvQkFBQSxDQUlGLHVDQXlVRixxQkF4VUksZUFBQSxDQUVBLDRCQUVFLFVBQUEsQ0FEQSxjQUNBLENBQUEsQ0RISiwyQkFDRSxTQUFBLENBR0YsbUNBQ0UsNkNBQUEsQ0FDQSxrQkFBQSxDQzJGRiw4RUFHRSxvQ0FBQSxDQURBLG9CQUNBLENBSUYscUJBQ0Usd0NBRUUsb0NBQUEsQ0FEQSwwQkFDQSxDQUFBLENBSUosdUNBQ0Usd0NBQ0UsY0FBQSxDQUFBLENBME5OLHFCQTNNRSx1Q0FBQSxDRC9CQSxpQ0FBQSxDQWhDQSxpQkFBQSxDQWlDQSx5QkFBQSxDQzdJQSx5QkEyS0EsQ0Q3REEsMkJBQ0UsVUFBQSxDQU1BLFdBQUEsQ0FIQSxRQUFBLENBS0EsZUFBQSxDQURBLGNBQUEsQ0FOQSxpQkFBQSxDQUNBLE9BQUEsQ0FFQSw4QkFBQSxDQUNBLFVBR0EsQ0E1RUYsMkJBQ0UsU0FBQSxDQUdGLG1DQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0E4RkYsc0RBRUUsb0JBQUEsQ0M2QkYsNEJBQ0UsVUFBQSxDQUdGLHVDQUNFLDRCQUNFLFVBQUEsQ0FBQSxDQXNNTiwwQkFwTEUsdUNBQUEsQ0FKQSxlQUFBLENBQ0EsaUJBQUEsQ0FGQSxpQkFBQSxDQWpNQSx5QkFBQSxDQXNFQSxxQ0FnSUEsQ0E5SEEsaUNBQ0Usc0NBQUEsQ0FHRix1Q0E4U0YsMEJBN1NJLGVBQUEsQ0FBQSxDRGxDRixnQ0FDRSxTQUFBLENBR0Ysd0NBQ0UsNkNBQUEsQ0FDQSxrQkFBQSxDQ3dKRixpREFPRSxvQ0FBQSxDQUpBLFFBQUEsQ0FGQSxVQUFBLENBS0EsVUFBQSxDQUZBLFNBQUEsQ0FGQSxpQkFBQSxDQUdBLFVBRUEsQ0E4S0osdUJBbEdFLGdDQUFBLENBQ0Esc0JBQUEsQ0FFQSx1Q0ErRkYsdUJBOUZJLG9CQUFBLENBQUEsQ0FrR0osa0NBdEdFLGdDQUFBLENBd0JBLHVCQUFBLENBVEEsWUFBQSxDQUNBLGVBQUEsQ0FDQSxpQkFBQSxDQWhCQSxzQkFBQSxDQWlCQSxnQ0FBQSxDQUFBLDRCQUFBLENBT0Esb0JBQUEsQ0E5U0Esa0JBOFNBLENBdEJBLHVDQW1HRixrQ0FsR0ksb0JBQUEsQ0FBQSxDQWlCRixxREFDRSxZQUFBLENBb0ZKLDRCQXpFRSxhQUFBLENBREEsdUJBQ0EsQ0E2RUYsc0JBdkRFLHVDQUFBLENBTkEsY0FBQSxDRHhPQSxlQUFBLENBREEsY0FBQSxDQzRPQSxpQkFBQSxDQWhWQSx5QkFtVkEsQ0R4U0EsNEJBQ0UsU0FBQSxDQUdGLG9DQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0M4VkosMkJBbExFLGVBQUEsQ0FEQSxpQkFDQSxDQXNMRixpQkExS0UseURBQUEsQ0FIQSxvQ0FBQSxDQURBLGlCQUFBLENBRUEsVUFBQSxDQUdBLG1CQUFBLENBTkEsaUJBQUEsQ0FJQSxrQkFFQSxDQThLRixxQkFDRSw4QkFBQSxDQUlGLDJCQUNFLHVDQUFBLENBSUYsb0JBQ0Usb0JBQUEsQ0FBQSxnQkFBQSxDQUNBLHdCQUFBLENDeGJGLG1CQUVFLDRDQUFBLENBQ0EscUNBQUEsQ0FDQSxlQUFBLENBSEEsaUJBQUEsQ0FJQSx5RkFBQSxDQUdBLGlDQUNFLDZDQUFBLENBQ0Esa0JBQUEsQ0FJRixnQ0FDRSxjQUFBLENBRUEsc0NBRUUscUNBQUEsQ0FEQSwwQkFDQSxDQUdGLHVDQUNFLHVCQUFBLENBU04sMkNBRUUsYUFBQSxDQUVBLGVBQUEsQ0FEQSxpQkFDQSxDQUdGLGdCQUVFLFdBQUEsQ0FDQSxpREFBQSxDQUZBLFVBRUEsQ0FHRix5Q0FDRSxxQkFBQSxDQU9GLGtCQUVFLFlBQUEsQ0FDQSxxQkFBQSxDQUNBLHlCQUFBLENBSEEsOEJBR0EsQ0FPRixnQkFFRSxzQ0FBQSxDQUNBLDJDQUFBLENBQ0Esd0NBQUEsQ0FIQSxRQUdBLENBR0Ysb0JBQ0UsMkJBQUEsQ0FDQSxvQkFBQSxDQUNBLDZDQUFBLENBRUEsMEJBQ0UsaUNBQUEsQ0FDQSx5QkFBQSxDQUdGLGtDQUdFLGlCQUFBLENBRkEsNkNBQUEsQ0FDQSxrQkFDQSxDQVFKLGVBSUUsa0JBQUEsQ0FFQSxrQ0FBQSxDQUxBLFlBQUEsQ0FDQSxjQUFBLENBR0EscUNBQUEsQ0FGQSx5QkFHQSxDQVFGLGdDQUhFLGtCQUFBLENBREEsbUJBTUEsQ0FFQSx3QkFDRSxlQUFBLENBQ0Esa0NBQUEsQ0FRSixzQkFJRSxnQ0FBQSxDQUZBLG9DQUFBLENBQ0EsMENBQUEsQ0FGQSxRQUdBLENBT0YscUJBQ0UsWUFBQSxDQUNBLGNBQUEsQ0FDQSx5QkFBQSxDQUNBLGVBQUEsQ0FHRixtQkFFRSxrQkFBQSxDQUtBLDRDQUFBLENBQ0Esa0JBQUEsQ0FGQSxpQ0FBQSxDQUxBLG1CQUFBLENBR0Esb0NBQUEsQ0FDQSx5Q0FBQSxDQUZBLGdCQUFBLENBTUEsd0RBQUEsQ0FFQSx5QkFDRSwwQ0FBQSxDQUlGLHdCQWhCRixtQkFpQkksZUFBQSxDQUNBLGdCQUFBLENBQUEsQ0FVRixpQ0FDRSw0QkFBQSxDQUNBLCtCQUFBLENBQ0EsZUFBQSxDQUlGLGlDQUNFLCtCQUFBLENBTUEsMEdBQ0UsVUFBQSxDQUVBLHNIQUNFLHdCQUFBLENBWUosb1NBQ0UseUJBQUEsQ0FHRiw4R0FDRSx3QkFBQSxDQUdGLHdHQUVFLG1DQUFBLENBREEsVUFDQSxDQUVBLG9IQUNFLG1DQUFBLENBVVIsZUFJRSw0Q0FBQSxDQUNBLG1DQUFBLENBSkEsWUFBQSxDQUNBLHFCQUFBLENBQ0EsV0FFQSxDQUVBLHlFQUVFLGFBQUEsQ0FHRixpQ0FFRSxZQUFBLENBREEsTUFBQSxDQUVBLHFCQUFBLENBR0YscUNBQ0UsTUFBQSxDQVFKLGVBR0Usc0JBQUEsQ0FJQSxjQUFBLENBREEsbURBQUEsQ0FFQSxlQUFBLENBUEEsWUFBQSxDQUNBLGtCQUFBLENBRUEsMEJBQUEsQ0FDQSw4QkFHQSxDQUVBLDBCQUNFLGtCQUFBLENBR0YseUVBSUUscUNBQUEsQ0FGQSxhQUFBLENBR0EsZUFBQSxDQUZBLFdBRUEsQ0FHRixpQ0FDRSxNQUFBLENBRUEsV0FBQSxDQURBLFNBQ0EsQ0FHRiwrQkFDRSxvQ0FBQSxDQUdGLHFDQUNFLHFDQUFBLENBSUYsd0JBckNGLGVBc0NJLHFEQUFBLENBRUEseUVBRUUsV0FBQSxDQUFBLENBU04saUJBS0UsY0FBQSxDQUNBLFdBQUEsQ0FDQSxlQUFBLENBTEEsWUFBQSxDQUNBLHFCQUFBLENBQ0EsV0FBQSxDQUhBLGlCQU1BLENBRUEsNkVBR0UsT0FBQSxDQURBLGlCQUFBLENBRUEsU0FBQSxDQUVBLHlGQUlFLGdGQUFBLENBSEEsVUFBQSxDQUVBLE9BQUEsQ0FEQSxpQkFFQSxDQVdKLGlDQUNFLFdBQUEsQ0FHRixtQ0FNRSxVQUFBLENBSEEsZUFBQSxDQUNBLDhCQUFBLENBQ0Esd0RBQUEsQ0FKQSxpQkFBQSxDQUNBLFNBSUEsQ0FHRixpQ0FFRSxVQUFBLENBREEsb0NBQUEsQ0FFQSxvQ0FBQSxDQU1BLGdGQUNFLFVBQUEsQ0FJSixnQ0FDRSx3QkFBQSxDQUdGLHVDQUNFLHlCQUFBLENBQ0Esb0NBQUEsQ0FHRixvQ0FHRSx5QkFBQSxDQUZBLG1DQUFBLENBQ0EsVUFDQSxDQUVBLDBDQUNFLG1DQUFBLENBVU4sOEJBQ0UsbUJBQ0UsMkJBQUEsQ0FHRixvQkFDRSx5QkFBQSxDQUdGLG1CQUNFLDJCQUFBLENBSUEseUZBRUUsY0FBQSxDQUdGLG1DQUNFLGlCQUFBLENBQ0EsZ0JBQUEsQ0FBQSxDQU1OLHVDQUNFLDBFQUlFLGVBQUEsQ0FPRiwrRUFDRSxjQUFBLENBQUEsQ0FRSixhQUNFLG1CQUVFLHFCQUFBLENBQ0EsZUFBQSxDQUZBLGtCQUVBLENBR0YsaUJBQ0UsZUFBQSxDQUVBLHlGQUVFLFlBQUEsQ0FHRixtQ0FFRSxVQUFBLENBREEsZUFDQSxDQUdGLDZHQUdFLFVBQUEsQ0FDQSxnQkFBQSxDQUlKLDJDQUVFLGdCQUFBLENBR0YsbUJBRUUsY0FBQSxDQURBLHFCQUNBLENBQUEiLCJmaWxlIjoiRmVlZEl0ZW0ubW9kdWxlLmNzcyJ9 */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "animate-fadeIn_3a430fae": "animate-fadeIn_3a430fae",
  fadeIn_3a430fae: "fadeIn_3a430fae",
  "animate-fadeOut_3a430fae": "animate-fadeOut_3a430fae",
  fadeOut_3a430fae: "fadeOut_3a430fae",
  "animate-slideUp_3a430fae": "animate-slideUp_3a430fae",
  slideUp_3a430fae: "slideUp_3a430fae",
  "animate-slideDown_3a430fae": "animate-slideDown_3a430fae",
  slideDown_3a430fae: "slideDown_3a430fae",
  "animate-slideLeft_3a430fae": "animate-slideLeft_3a430fae",
  slideLeft_3a430fae: "slideLeft_3a430fae",
  "animate-slideRight_3a430fae": "animate-slideRight_3a430fae",
  slideRight_3a430fae: "slideRight_3a430fae",
  "animate-scaleIn_3a430fae": "animate-scaleIn_3a430fae",
  scaleIn_3a430fae: "scaleIn_3a430fae",
  "animate-spin_3a430fae": "animate-spin_3a430fae",
  spin_3a430fae: "spin_3a430fae",
  "animate-pulse_3a430fae": "animate-pulse_3a430fae",
  pulse_3a430fae: "pulse_3a430fae",
  "animate-bounce_3a430fae": "animate-bounce_3a430fae",
  bounce_3a430fae: "bounce_3a430fae",
  "animate-shake_3a430fae": "animate-shake_3a430fae",
  shake_3a430fae: "shake_3a430fae",
  "sr-only_3a430fae": "sr-only_3a430fae",
  "sr-only-focusable_3a430fae": "sr-only-focusable_3a430fae",
  "focus-visible_3a430fae": "focus-visible_3a430fae",
  "touch-target_3a430fae": "touch-target_3a430fae",
  "reduced-motion_3a430fae": "reduced-motion_3a430fae",
  "touch-action-manipulation_3a430fae": "touch-action-manipulation_3a430fae",
  "touch-action-pan-x_3a430fae": "touch-action-pan-x_3a430fae",
  "touch-action-pan-y_3a430fae": "touch-action-pan-y_3a430fae",
  "touch-action-none_3a430fae": "touch-action-none_3a430fae",
  "touch-interactive_3a430fae": "touch-interactive_3a430fae",
  "touch-button_3a430fae": "touch-button_3a430fae",
  pressed_3a430fae: "pressed_3a430fae",
  "touch-card_3a430fae": "touch-card_3a430fae",
  "touch-link_3a430fae": "touch-link_3a430fae",
  "touch-list-item_3a430fae": "touch-list-item_3a430fae",
  "touch-scroll_3a430fae": "touch-scroll_3a430fae",
  "touch-scroll-horizontal_3a430fae": "touch-scroll-horizontal_3a430fae",
  "touch-scroll-item_3a430fae": "touch-scroll-item_3a430fae",
  "touch-input_3a430fae": "touch-input_3a430fae",
  "ripple-container_3a430fae": "ripple-container_3a430fae",
  ripple_3a430fae: "ripple_3a430fae",
  "ripple-animation_3a430fae": "ripple-animation_3a430fae",
  "is-pressed_3a430fae": "is-pressed_3a430fae",
  "no-tap-highlight_3a430fae": "no-tap-highlight_3a430fae",
  "no-select_3a430fae": "no-select_3a430fae",
  feedItem_3a430fae: "feedItem_3a430fae",
  imageLink_3a430fae: "imageLink_3a430fae",
  imageWrapper_3a430fae: "imageWrapper_3a430fae",
  image_3a430fae: "image_3a430fae",
  content_3a430fae: "content_3a430fae",
  title_3a430fae: "title_3a430fae",
  titleLink_3a430fae: "titleLink_3a430fae",
  meta_3a430fae: "meta_3a430fae",
  date_3a430fae: "date_3a430fae",
  source_3a430fae: "source_3a430fae",
  description_3a430fae: "description_3a430fae",
  categories_3a430fae: "categories_3a430fae",
  category_3a430fae: "category_3a430fae",
  inverted_3a430fae: "inverted_3a430fae",
  card_3a430fae: "card_3a430fae",
  list_3a430fae: "list_3a430fae",
  banner_3a430fae: "banner_3a430fae",
  scaleOut_3a430fae: "scaleOut_3a430fae",
  shimmer_3a430fae: "shimmer_3a430fae"
});


/***/ }),

/***/ 7615:
/*!******************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/ResponsiveImage.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImagePlaceholder: () => (/* binding */ ImagePlaceholder),
/* harmony export */   ResponsiveImage: () => (/* binding */ ResponsiveImage),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResponsiveImage.module.scss */ 8491);
/**
 * ResponsiveImage Component
 *
 * A responsive image component with:
 * - Native lazy loading
 * - Aspect ratio preservation
 * - Loading skeleton
 * - Error fallback
 * - Alt text requirements
 */



/**
 * Aspect ratio to padding-bottom percentage mapping
 */
const aspectRatioToPadding = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '3:2': '66.67%',
    '21:9': '42.86%'
};
/**
 * ResponsiveImage component with lazy loading and fallbacks
 */
const ResponsiveImage = ({ src, alt, aspectRatio = '16:9', loading = 'lazy', fallbackSrc, objectFit = 'cover', className = '', width, height, onLoad, onError, testId = 'responsive-image', showSkeleton = true, fadeIn = true }) => {
    const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('loading');
    const [currentSrc, setCurrentSrc] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(src);
    const imgRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    // Reset state when src changes
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setState('loading');
        setCurrentSrc(src);
    }, [src]);
    const handleLoad = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        setState('loaded');
        onLoad === null || onLoad === void 0 ? void 0 : onLoad();
    }, [onLoad]);
    const handleError = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
            // Try fallback image
            setCurrentSrc(fallbackSrc);
            setState('loading');
        }
        else {
            setState('error');
            onError === null || onError === void 0 ? void 0 : onError(new Error(`Failed to load image: ${src}`));
        }
    }, [fallbackSrc, currentSrc, src, onError]);
    // Check if image is already cached
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            handleLoad();
        }
    }, [handleLoad]);
    const containerStyle = aspectRatio !== 'auto' ? {
        paddingBottom: aspectRatioToPadding[aspectRatio]
    } : {};
    const imageStyle = {
        objectFit
    };
    const containerClasses = [
        _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].imageContainer,
        aspectRatio !== 'auto' ? _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].hasAspectRatio : '',
        className
    ].filter(Boolean).join(' ');
    const imageClasses = [
        _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].image,
        state === 'loaded' && fadeIn ? _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].fadeIn : '',
        state === 'loaded' ? _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].loaded : ''
    ].filter(Boolean).join(' ');
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, style: containerStyle, "data-testid": testId, "data-state": state, "data-aspect": aspectRatio },
        showSkeleton && state === 'loading' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].skeleton, "data-testid": `${testId}-skeleton`, "aria-hidden": "true" })),
        state === 'error' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].error, "data-testid": `${testId}-error`, role: "img", "aria-label": alt },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].errorIcon, "aria-hidden": "true" }, "\uD83D\uDCF7"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].errorText }, "Image unavailable"))),
        state !== 'error' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", { ref: imgRef, src: currentSrc, alt: alt, loading: loading, width: width, height: height, style: imageStyle, className: imageClasses, onLoad: handleLoad, onError: handleError, "data-testid": `${testId}-img` }))));
};
/**
 * Placeholder component for missing images
 */
const ImagePlaceholder = ({ alt, aspectRatio = '16:9', icon = '📰', className = '', testId = 'image-placeholder' }) => {
    const containerStyle = aspectRatio !== 'auto' ? {
        paddingBottom: aspectRatioToPadding[aspectRatio]
    } : {};
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].imageContainer} ${_ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].placeholder} ${className}`, style: containerStyle, "data-testid": testId, role: "img", "aria-label": alt },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].placeholderContent },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _ResponsiveImage_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].placeholderIcon, "aria-hidden": "true" }, icon))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ResponsiveImage);


/***/ }),

/***/ 8491:
/*!******************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/ResponsiveImage.module.scss.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./ResponsiveImage.module.css */ 6651);
const styles = {
    imageContainer: 'imageContainer_f06556ec',
    hasAspectRatio: 'hasAspectRatio_f06556ec',
    image: 'image_f06556ec',
    skeleton: 'skeleton_f06556ec',
    error: 'error_f06556ec',
    placeholderContent: 'placeholderContent_f06556ec',
    loaded: 'loaded_f06556ec',
    fadeIn: 'fadeIn_f06556ec',
    imageLoad: 'imageLoad_f06556ec',
    shimmer: 'shimmer_f06556ec',
    errorIcon: 'errorIcon_f06556ec',
    errorText: 'errorText_f06556ec',
    placeholder: 'placeholder_f06556ec',
    placeholderIcon: 'placeholderIcon_f06556ec'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 3915:
/*!***************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/FeedItem/FeedItem.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeedItem: () => (/* binding */ FeedItem),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ResponsiveImage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ResponsiveImage */ 7615);
/* harmony import */ var _services_contentSanitizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../services/contentSanitizer */ 3594);
/* harmony import */ var _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FeedItem.module.scss */ 343);
/**
 * FeedItem Component
 *
 * A shared component used by all layout types (card, list, banner).
 * Provides consistent rendering of RSS feed items with configurable display options.
 *
 * Features:
 * - Multiple variant styles (card, list, banner)
 * - Configurable visibility for each element
 * - Accessible markup with proper semantics
 * - Hover/focus states
 * - Integration with ResponsiveImage for lazy loading
 */





/**
 * Format a date string to a localized format
 */
const formatDate = (dateString, locale = 'nb-NO') => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    catch (_a) {
        return dateString;
    }
};
/**
 * Truncate text to a maximum number of characters
 */
const truncateText = (text, maxChars) => {
    if (!maxChars || text.length <= maxChars) {
        return text;
    }
    return text.slice(0, maxChars).trim() + '…';
};
/**
 * Strip HTML tags from text
 */
const stripHtml = (html) => {
    // Use sanitizer to clean HTML first, then strip tags
    const cleaned = _services_contentSanitizer__WEBPACK_IMPORTED_MODULE_2__.sanitizer.sanitize(html);
    const temp = document.createElement('div');
    temp.innerHTML = cleaned;
    return temp.textContent || temp.innerText || '';
};
/**
 * FeedItem component for rendering RSS feed items
 */
const FeedItem = ({ item, variant, showImage = true, showDescription = true, showDate = true, showCategories = false, showSource = false, imageAspectRatio = '16:9', fallbackImageUrl, forceFallback = false, onItemClick, descriptionTruncation, titleTruncation, className = '', testId = 'feed-item', locale = 'nb-NO', imageAsLink = true, isInverted = false }) => {
    const handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((event) => {
        if (onItemClick) {
            onItemClick(item, event);
        }
    }, [item, onItemClick]);
    const handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onItemClick) {
                onItemClick(item, event);
            }
            else {
                window.open(item.link, '_blank', 'noopener,noreferrer');
            }
        }
    }, [item, onItemClick]);
    // Process description
    const processedDescription = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        if (!item.description)
            return '';
        const plainText = stripHtml(item.description);
        return truncateText(plainText, descriptionTruncation === null || descriptionTruncation === void 0 ? void 0 : descriptionTruncation.maxChars);
    }, [item.description, descriptionTruncation === null || descriptionTruncation === void 0 ? void 0 : descriptionTruncation.maxChars]);
    // Process title
    const processedTitle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        return truncateText(item.title, titleTruncation === null || titleTruncation === void 0 ? void 0 : titleTruncation.maxChars);
    }, [item.title, titleTruncation === null || titleTruncation === void 0 ? void 0 : titleTruncation.maxChars]);
    // Format date
    const formattedDate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        return item.pubDate ? formatDate(item.pubDate, locale) : '';
    }, [item.pubDate, locale]);
    // Generate unique key for categories
    const getCategoryKey = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((category, index) => {
        return `${item.link}-category-${index}`;
    }, [item.link]);
    // Container classes
    const containerClasses = [
        _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].feedItem,
        _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"][variant],
        isInverted ? _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].inverted : '',
        className
    ].filter(Boolean).join(' ');
    // Description style for line clamping
    const descriptionStyle = (descriptionTruncation === null || descriptionTruncation === void 0 ? void 0 : descriptionTruncation.maxLines) ? {
        WebkitLineClamp: descriptionTruncation.maxLines,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    } : {};
    // Title style for line clamping
    const titleStyle = (titleTruncation === null || titleTruncation === void 0 ? void 0 : titleTruncation.maxLines) ? {
        WebkitLineClamp: titleTruncation.maxLines,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    } : {};
    // Render image section
    const renderImage = () => {
        if (!showImage)
            return null;
        // Determine which image to use
        const useForced = forceFallback && fallbackImageUrl;
        const imageSrc = useForced ? fallbackImageUrl : item.imageUrl;
        const imageContent = imageSrc ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ResponsiveImage__WEBPACK_IMPORTED_MODULE_1__.ResponsiveImage, { src: imageSrc, alt: item.title, aspectRatio: imageAspectRatio, fallbackSrc: fallbackImageUrl, className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].image, testId: `${testId}-image` })) : fallbackImageUrl ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ResponsiveImage__WEBPACK_IMPORTED_MODULE_1__.ResponsiveImage, { src: fallbackImageUrl, alt: item.title, aspectRatio: imageAspectRatio, className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].image, testId: `${testId}-image` })) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ResponsiveImage__WEBPACK_IMPORTED_MODULE_1__.ImagePlaceholder, { alt: item.title, aspectRatio: imageAspectRatio, icon: react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "ms-Icon ms-Icon--Photo2", "aria-hidden": "true" }), testId: `${testId}-placeholder` }));
        if (imageAsLink) {
            return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { href: item.link, className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].imageLink, target: "_blank", rel: "noopener noreferrer", tabIndex: -1, "aria-hidden": "true" }, imageContent));
        }
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].imageWrapper }, imageContent));
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { className: containerClasses, "data-testid": testId, "data-variant": variant, onClick: onItemClick ? handleClick : undefined, onKeyDown: onItemClick ? handleKeyDown : undefined, tabIndex: onItemClick ? 0 : undefined, role: onItemClick ? 'button' : undefined },
        renderImage(),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].content },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].title, style: titleStyle },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { href: item.link, className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].titleLink, target: "_blank", rel: "noopener noreferrer" }, processedTitle)),
            (showDate || showSource) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].meta },
                showDate && formattedDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("time", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].date, dateTime: item.pubDate }, formattedDate)),
                showSource && item.author && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].source }, item.author)))),
            showDescription && processedDescription && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].description, style: descriptionStyle }, processedDescription)),
            showCategories && item.categories && item.categories.length > 0 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].categories }, item.categories.map((category, index) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: getCategoryKey(category, index), className: _FeedItem_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].category }, category))))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (react__WEBPACK_IMPORTED_MODULE_0__.memo(FeedItem));


/***/ }),

/***/ 343:
/*!***************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/FeedItem/FeedItem.module.scss.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./FeedItem.module.css */ 2255);
const styles = {
    'animate-fadeIn': 'animate-fadeIn_3a430fae',
    fadeIn: 'fadeIn_3a430fae',
    'animate-fadeOut': 'animate-fadeOut_3a430fae',
    fadeOut: 'fadeOut_3a430fae',
    'animate-slideUp': 'animate-slideUp_3a430fae',
    slideUp: 'slideUp_3a430fae',
    'animate-slideDown': 'animate-slideDown_3a430fae',
    slideDown: 'slideDown_3a430fae',
    'animate-slideLeft': 'animate-slideLeft_3a430fae',
    slideLeft: 'slideLeft_3a430fae',
    'animate-slideRight': 'animate-slideRight_3a430fae',
    slideRight: 'slideRight_3a430fae',
    'animate-scaleIn': 'animate-scaleIn_3a430fae',
    scaleIn: 'scaleIn_3a430fae',
    'animate-spin': 'animate-spin_3a430fae',
    spin: 'spin_3a430fae',
    'animate-pulse': 'animate-pulse_3a430fae',
    pulse: 'pulse_3a430fae',
    'animate-bounce': 'animate-bounce_3a430fae',
    bounce: 'bounce_3a430fae',
    'animate-shake': 'animate-shake_3a430fae',
    shake: 'shake_3a430fae',
    'sr-only': 'sr-only_3a430fae',
    'sr-only-focusable': 'sr-only-focusable_3a430fae',
    'focus-visible': 'focus-visible_3a430fae',
    'touch-target': 'touch-target_3a430fae',
    'reduced-motion': 'reduced-motion_3a430fae',
    'touch-action-manipulation': 'touch-action-manipulation_3a430fae',
    'touch-action-pan-x': 'touch-action-pan-x_3a430fae',
    'touch-action-pan-y': 'touch-action-pan-y_3a430fae',
    'touch-action-none': 'touch-action-none_3a430fae',
    'touch-interactive': 'touch-interactive_3a430fae',
    'touch-button': 'touch-button_3a430fae',
    pressed: 'pressed_3a430fae',
    'touch-card': 'touch-card_3a430fae',
    'touch-link': 'touch-link_3a430fae',
    'touch-list-item': 'touch-list-item_3a430fae',
    'touch-scroll': 'touch-scroll_3a430fae',
    'touch-scroll-horizontal': 'touch-scroll-horizontal_3a430fae',
    'touch-scroll-item': 'touch-scroll-item_3a430fae',
    'touch-input': 'touch-input_3a430fae',
    'ripple-container': 'ripple-container_3a430fae',
    ripple: 'ripple_3a430fae',
    'ripple-animation': 'ripple-animation_3a430fae',
    'is-pressed': 'is-pressed_3a430fae',
    'no-tap-highlight': 'no-tap-highlight_3a430fae',
    'no-select': 'no-select_3a430fae',
    feedItem: 'feedItem_3a430fae',
    imageLink: 'imageLink_3a430fae',
    imageWrapper: 'imageWrapper_3a430fae',
    image: 'image_3a430fae',
    content: 'content_3a430fae',
    title: 'title_3a430fae',
    titleLink: 'titleLink_3a430fae',
    meta: 'meta_3a430fae',
    date: 'date_3a430fae',
    source: 'source_3a430fae',
    description: 'description_3a430fae',
    categories: 'categories_3a430fae',
    category: 'category_3a430fae',
    inverted: 'inverted_3a430fae',
    card: 'card_3a430fae',
    list: 'list_3a430fae',
    banner: 'banner_3a430fae',
    scaleOut: 'scaleOut_3a430fae',
    shimmer: 'shimmer_3a430fae'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 8278:
/*!************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/FeedItem/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeedItem: () => (/* reexport safe */ _FeedItem__WEBPACK_IMPORTED_MODULE_0__.FeedItem),
/* harmony export */   "default": () => (/* reexport safe */ _FeedItem__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _FeedItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FeedItem */ 3915);
/**
 * FeedItem Component Exports
 */



/***/ }),

/***/ 3594:
/*!*****************************************************************!*\
  !*** ./lib/webparts/polRssGallery/services/contentSanitizer.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentSanitizer: () => (/* binding */ ContentSanitizer),
/* harmony export */   sanitizer: () => (/* binding */ sanitizer)
/* harmony export */ });
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dompurify */ 9418);
/**
 * Content Sanitizer Service
 *
 * Provides XSS protection for RSS feed content using DOMPurify.
 * All HTML content from external RSS feeds MUST be sanitized before rendering.
 *
 * @see REF-012-SECURITY-HARDENING.md for security requirements
 */

/**
 * Default allowed HTML tags - safe for RSS content display
 */
const DEFAULT_ALLOWED_TAGS = [
    // Text formatting
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'span',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Lists
    'ul', 'ol', 'li',
    // Block elements
    'blockquote', 'pre', 'code', 'div',
    // Links and media
    'a', 'img', 'figure', 'figcaption',
    // Tables
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
];
/**
 * Default allowed attributes - safe for RSS content
 */
const DEFAULT_ALLOWED_ATTR = [
    'href', 'src', 'alt', 'title', 'width', 'height',
    'target', 'rel', 'class',
];
/**
 * Explicitly forbidden tags - never allow these even if configured
 */
const FORBIDDEN_TAGS = [
    'script', 'style', 'iframe', 'object', 'embed', 'form',
    'input', 'button', 'textarea', 'select', 'option',
    'meta', 'link', 'base', 'noscript', 'template',
];
/**
 * Explicitly forbidden attributes - event handlers and dangerous patterns
 */
const FORBIDDEN_ATTR = [
    // Event handlers
    'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout',
    'onmouseenter', 'onmouseleave', 'onfocus', 'onblur', 'onsubmit',
    'onchange', 'oninput', 'onkeydown', 'onkeyup', 'onkeypress',
    'ondblclick', 'oncontextmenu', 'onwheel', 'ondrag', 'ondrop',
    'onanimationstart', 'onanimationend', 'ontransitionend',
    // Dangerous attributes
    'formaction', 'action', 'method', 'srcdoc', 'xlink:href',
];
/**
 * Content Sanitizer class
 *
 * Provides methods to sanitize HTML content from RSS feeds to prevent XSS attacks.
 * Uses DOMPurify under the hood with strict configuration.
 */
class ContentSanitizer {
    /**
     * Creates a new ContentSanitizer instance
     * @param config Optional configuration to customize sanitization behavior
     */
    constructor(config) {
        this.config = config || {};
    }
    /**
     * Gets a singleton instance of the sanitizer with default configuration
     */
    static getInstance() {
        if (!ContentSanitizer.instance) {
            ContentSanitizer.instance = new ContentSanitizer();
        }
        return ContentSanitizer.instance;
    }
    /**
     * Sanitizes HTML content from RSS feeds
     *
     * Removes dangerous elements, event handlers, and javascript: URLs.
     * Preserves safe formatting tags and links.
     *
     * @param html The HTML string to sanitize
     * @returns Sanitized HTML string safe for rendering
     *
     * @example
     * ```typescript
     * const sanitizer = ContentSanitizer.getInstance();
     * const safeHtml = sanitizer.sanitize('<p onclick="alert(1)">Hello</p>');
     * // Returns: '<p>Hello</p>'
     * ```
     */
    sanitize(html) {
        if (!html || typeof html !== 'string') {
            return '';
        }
        const allowedTags = this.config.allowedTags || DEFAULT_ALLOWED_TAGS;
        const allowedAttr = this.config.allowedAttributes || DEFAULT_ALLOWED_ATTR;
        // Build URI safe list - only http and https by default
        const allowedUriSchemes = ['http', 'https', 'mailto'];
        if (this.config.allowDataUrls) {
            allowedUriSchemes.push('data');
        }
        // Configure DOMPurify
        const purifyConfig = {
            ALLOWED_TAGS: allowedTags,
            ALLOWED_ATTR: allowedAttr,
            ALLOW_DATA_ATTR: false,
            FORBID_TAGS: FORBIDDEN_TAGS,
            FORBID_ATTR: FORBIDDEN_ATTR,
            // Add target="_blank" and rel="noopener noreferrer" to links for security
            ADD_ATTR: ['target', 'rel'],
            // Only allow safe URI schemes
            ALLOWED_URI_REGEXP: new RegExp(`^(?:(?:${allowedUriSchemes.join('|')}):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))`, 'i'),
        };
        // Disable styles unless explicitly allowed (for CSP compliance)
        if (!this.config.allowStyles) {
            purifyConfig.FORBID_ATTR = [...FORBIDDEN_ATTR, 'style'];
        }
        // Sanitize the HTML
        let sanitized = dompurify__WEBPACK_IMPORTED_MODULE_0__["default"].sanitize(html, purifyConfig);
        // Post-process: ensure all links open in new tab with noopener
        sanitized = this.secureLinks(sanitized);
        return sanitized;
    }
    /**
     * Sanitizes plain text by escaping HTML entities
     *
     * Use this for content that should never contain HTML,
     * such as titles or metadata.
     *
     * @param text The plain text to escape
     * @returns HTML-escaped string
     *
     * @example
     * ```typescript
     * const sanitizer = ContentSanitizer.getInstance();
     * const safe = sanitizer.sanitizeText('<script>alert(1)</script>');
     * // Returns: '&lt;script&gt;alert(1)&lt;/script&gt;'
     * ```
     */
    sanitizeText(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        // Escape HTML entities
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    /**
     * Validates and sanitizes a URL
     *
     * Ensures URLs use safe protocols (http/https) and don't contain
     * javascript: or data: schemes that could be used for XSS.
     *
     * @param url The URL to validate
     * @returns The sanitized URL or empty string if invalid
     *
     * @example
     * ```typescript
     * const sanitizer = ContentSanitizer.getInstance();
     * sanitizer.sanitizeUrl('javascript:alert(1)'); // Returns: ''
     * sanitizer.sanitizeUrl('https://example.com'); // Returns: 'https://example.com'
     * ```
     */
    sanitizeUrl(url) {
        if (!url || typeof url !== 'string') {
            return '';
        }
        const trimmed = url.trim().toLowerCase();
        // Block dangerous protocols
        const dangerousProtocols = [
            'javascript:',
            'vbscript:',
            'data:text/html',
            'data:application/x-javascript',
        ];
        for (const protocol of dangerousProtocols) {
            if (trimmed.startsWith(protocol)) {
                return '';
            }
        }
        // Allow http, https, and relative URLs
        try {
            // Check if it's a valid URL
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
                const parsed = new URL(url, 'https://placeholder.com');
                if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                    return url;
                }
            }
            else if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
                // Relative URLs are allowed
                return url;
            }
            else if (!url.includes(':')) {
                // No protocol specified - treat as relative
                return url;
            }
        }
        catch (_a) {
            // Invalid URL
            return '';
        }
        return '';
    }
    /**
     * Ensures all anchor tags have secure attributes
     * @param html The HTML to process
     * @returns HTML with secured links
     */
    secureLinks(html) {
        if (!html)
            return '';
        // Add target="_blank" and rel="noopener noreferrer" to external links
        // This is done via regex for performance (DOMPurify already parsed)
        return html.replace(/<a\s+([^>]*?)>/gi, (match, attrs) => {
            // Check if href exists and is external
            const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
            if (!hrefMatch)
                return match;
            const href = hrefMatch[1];
            const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
            if (!isExternal)
                return match;
            // Add target="_blank" if not present
            let newAttrs = attrs;
            if (!/target\s*=/i.test(attrs)) {
                newAttrs += ' target="_blank"';
            }
            // Add rel="noopener noreferrer" if not present
            if (!/rel\s*=/i.test(attrs)) {
                newAttrs += ' rel="noopener noreferrer"';
            }
            else {
                // Ensure noopener and noreferrer are in the rel attribute
                newAttrs = newAttrs.replace(/rel\s*=\s*["']([^"']*)["']/i, (_relMatch, relValue) => {
                    let newRel = relValue;
                    if (!relValue.includes('noopener')) {
                        newRel += ' noopener';
                    }
                    if (!relValue.includes('noreferrer')) {
                        newRel += ' noreferrer';
                    }
                    return `rel="${newRel.trim()}"`;
                });
            }
            return `<a ${newAttrs.trim()}>`;
        });
    }
    /**
     * Strips all HTML tags and returns plain text
     *
     * Use this when you need just the text content without any HTML.
     *
     * @param html The HTML to strip
     * @returns Plain text without any HTML tags
     */
    stripHtml(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        // First sanitize to remove dangerous content, then strip tags
        const sanitized = dompurify__WEBPACK_IMPORTED_MODULE_0__["default"].sanitize(text, { ALLOWED_TAGS: [] });
        // Decode HTML entities
        const textArea = document.createElement('textarea');
        textArea.innerHTML = sanitized;
        return textArea.value;
    }
}
ContentSanitizer.instance = null;
// Export a default instance for convenience
const sanitizer = ContentSanitizer.getInstance();


/***/ })

}]);
//# sourceMappingURL=chunk.lib_webparts_polRssGallery_components_shared_FeedItem_index_js.js.map