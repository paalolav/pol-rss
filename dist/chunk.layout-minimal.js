"use strict";
(self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] = self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] || []).push([["layout-minimal"],{

/***/ 3083:
/*!**********************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/MinimalLayout/MinimalLayout.module.css ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(":root{--gap-xs:4px;--gap-sm:8px;--gap-md:16px;--gap-lg:24px;--gap-xl:32px;--padding-xs:8px;--padding-sm:12px;--padding-md:16px;--padding-lg:24px;--padding-xl:32px}@media (max-width:480px){:root{--gap-lg:20px;--gap-xl:24px;--padding-lg:20px;--padding-xl:24px}}@media print{:root{--gap-md:0.5rem;--gap-lg:0.75rem;--padding-md:0.5rem;--padding-lg:0.75rem;font-size:12pt}body{font-family:Georgia,Times New Roman,serif;line-height:1.5}h1,h2,h3,h4,h5,h6{page-break-after:avoid;page-break-inside:avoid}p{orphans:3;widows:3}}@media (forced-colors:active){a{text-decoration:underline}}:root{--transition-instant:50ms;--transition-fast:150ms;--transition-normal:250ms;--transition-slow:350ms;--transition-slower:500ms;--easing-standard:cubic-bezier(0.4,0,0.2,1);--easing-decelerate:cubic-bezier(0,0,0.2,1);--easing-accelerate:cubic-bezier(0.4,0,1,1);--easing-sharp:cubic-bezier(0.4,0,0.6,1);--easing-bounce:cubic-bezier(0.68,-0.55,0.265,1.55)}@keyframes fadeIn_9a6532d7{0%{opacity:0}to{opacity:1}}@keyframes fadeOut_9a6532d7{0%{opacity:1}to{opacity:0}}@keyframes slideUp_9a6532d7{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideDown_9a6532d7{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideLeft_9a6532d7{0%{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes slideRight_9a6532d7{0%{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}@keyframes scaleIn_9a6532d7{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}@keyframes scaleOut_9a6532d7{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.95)}}@keyframes pulse_9a6532d7{0%,to{opacity:1}50%{opacity:.5}}@keyframes shimmer_9a6532d7{0%{background-position:-200% 0}to{background-position:200% 0}}@keyframes spin_9a6532d7{0%{transform:rotate(0)}to{transform:rotate(1turn)}}@keyframes bounce_9a6532d7{0%,20%,50%,80%,to{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}@keyframes shake_9a6532d7{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@keyframes ripple_9a6532d7{0%{opacity:.5;transform:scale(0)}to{opacity:0;transform:scale(2.5)}}.animate-fadeIn_9a6532d7{animation:fadeIn_9a6532d7 var(--transition-normal) var(--easing-decelerate) forwards}.animate-fadeOut_9a6532d7{animation:fadeOut_9a6532d7 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideUp_9a6532d7{animation:slideUp_9a6532d7 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideDown_9a6532d7{animation:slideDown_9a6532d7 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideLeft_9a6532d7{animation:slideLeft_9a6532d7 var(--transition-normal) var(--easing-decelerate) forwards}.animate-slideRight_9a6532d7{animation:slideRight_9a6532d7 var(--transition-normal) var(--easing-decelerate) forwards}.animate-scaleIn_9a6532d7{animation:scaleIn_9a6532d7 var(--transition-normal) var(--easing-decelerate) forwards}.animate-spin_9a6532d7{animation:spin_9a6532d7 1s linear infinite}.animate-pulse_9a6532d7{animation:pulse_9a6532d7 2s ease-in-out infinite}.animate-bounce_9a6532d7{animation:bounce_9a6532d7 1s ease infinite}.animate-shake_9a6532d7{animation:shake_9a6532d7 .5s ease-in-out}@media (prefers-reduced-motion:reduce){*,:after,:before{animation-duration:0s!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:0s!important}.animate-fadeIn_9a6532d7,.animate-fadeOut_9a6532d7{animation-duration:.1s!important}}@media print{*,:after,:before{animation:none!important;transition:none!important}}.sr-only-focusable_9a6532d7,.sr-only_9a6532d7{clip:rect(0,0,0,0);border:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.sr-only-focusable_9a6532d7:focus,.sr-only-focusable_9a6532d7:focus-visible{clip:auto;height:auto;margin:0;overflow:visible;padding:0;position:static;white-space:normal;width:auto}.focus-visible_9a6532d7:focus{outline:0}.focus-visible_9a6532d7:focus-visible{outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.touch-target_9a6532d7{min-height:44px;min-width:44px}@media (prefers-reduced-motion:reduce){.reduced-motion_9a6532d7{animation-duration:0s!important;animation-iteration-count:1!important;transition-duration:0s!important}}.minimalLayout_9a6532d7{display:flex;flex-direction:column;gap:0;padding:0}.minimalItem_9a6532d7{border-bottom:1px solid var(--neutralLight,#edebe9);cursor:pointer;padding:10px 0;transition:background-color .15s ease}.minimalItem_9a6532d7:first-child{padding-top:0}.minimalItem_9a6532d7:last-child{border-bottom:none;padding-bottom:0}.minimalItem_9a6532d7:hover{background-color:var(--neutralLighter,#faf9f8)}.minimalItem_9a6532d7:hover .itemTitle_9a6532d7{color:var(--themePrimary,#0078d4)}.minimalItem_9a6532d7:focus-within{outline:0}.minimalItem_9a6532d7:focus-within .itemTitle_9a6532d7{text-decoration:underline}.itemLink_9a6532d7{color:inherit;display:block;outline:0;text-decoration:none}.itemLink_9a6532d7:focus-visible{border-radius:2px;outline:2px solid var(--themePrimary,#0078d4);outline-offset:2px}.itemTitle_9a6532d7{-webkit-line-clamp:2;-webkit-box-orient:vertical;color:var(--neutralPrimary,#323130);display:-webkit-box;font-size:.875rem;font-weight:600;line-height:1.35;margin:0 0 2px;overflow:hidden;transition:color .15s ease}.itemMeta_9a6532d7{align-items:center;display:flex;gap:8px;margin-top:3px}.itemDate_9a6532d7,.itemSource_9a6532d7{color:var(--neutralSecondary,#605e5c);font-size:.75rem;line-height:1.2;white-space:nowrap}.itemSource_9a6532d7:before{content:\"\\2022\";margin-right:8px}.itemDescription_9a6532d7{-webkit-line-clamp:2;-webkit-box-orient:vertical;color:var(--neutralSecondary,#605e5c);display:-webkit-box;font-size:.8125rem;line-height:1.4;margin:3px 0 0;overflow:hidden}.inverted_9a6532d7 .minimalItem_9a6532d7{border-bottom-color:hsla(0,0%,100%,.2)}.inverted_9a6532d7 .minimalItem_9a6532d7:hover{background-color:hsla(0,0%,100%,.1)}.inverted_9a6532d7 .itemTitle_9a6532d7{color:#fff}.inverted_9a6532d7 .itemDate_9a6532d7,.inverted_9a6532d7 .itemDescription_9a6532d7,.inverted_9a6532d7 .itemSource_9a6532d7{color:hsla(0,0%,100%,.85)}.inverted_9a6532d7 .minimalItem_9a6532d7:hover .itemTitle_9a6532d7{color:hsla(0,0%,100%,.9)}.minimalLayoutNumbered_9a6532d7{counter-reset:item-counter}.minimalLayoutNumbered_9a6532d7 .minimalItem_9a6532d7{counter-increment:item-counter;padding-left:24px;position:relative}.minimalLayoutNumbered_9a6532d7 .minimalItem_9a6532d7:before{color:var(--themePrimary,#0078d4);content:counter(item-counter);font-size:.75rem;font-weight:600;left:0;position:absolute;text-align:right;top:10px;width:16px}.minimalLayoutNumbered_9a6532d7 .minimalItem_9a6532d7:first-child:before{top:0}.minimalLayoutBulleted_9a6532d7 .minimalItem_9a6532d7{padding-left:12px;position:relative}.minimalLayoutBulleted_9a6532d7 .minimalItem_9a6532d7:before{background-color:var(--themePrimary,#0078d4);border-radius:50%;content:\"\";height:4px;left:0;position:absolute;top:16px;width:4px}.minimalLayoutBulleted_9a6532d7 .minimalItem_9a6532d7:first-child:before{top:6px}@media (pointer:coarse){.minimalItem_9a6532d7{min-height:44px;padding:12px 0}.minimalItem_9a6532d7:first-child{padding-top:0}.minimalItem_9a6532d7:last-child{padding-bottom:0}}@media (forced-colors:active){.minimalItem_9a6532d7{border-bottom:1px solid CanvasText}.minimalItem_9a6532d7:hover{background-color:Highlight}.minimalItem_9a6532d7:hover .itemDate_9a6532d7,.minimalItem_9a6532d7:hover .itemDescription_9a6532d7,.minimalItem_9a6532d7:hover .itemSource_9a6532d7,.minimalItem_9a6532d7:hover .itemTitle_9a6532d7{color:HighlightText}.minimalLayoutBulleted_9a6532d7 .minimalItem_9a6532d7:before,.minimalLayoutNumbered_9a6532d7 .minimalItem_9a6532d7:before{background-color:CanvasText;color:CanvasText}}@media print{.minimalLayout_9a6532d7{gap:0}.minimalItem_9a6532d7{border-bottom:1px solid #ccc;padding:6px 0;page-break-inside:avoid}.itemTitle_9a6532d7{color:#000!important}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19zcGFjaW5nLnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L3N0eWxlcy9fdHlwb2dyYXBoeS5zY3NzIiwiZmlsZTovLy9Vc2Vycy9wbG9mL0RvY3VtZW50cy9HaXRodWIvcG9sLXJzcy9zcmMvd2VicGFydHMvcG9sUnNzR2FsbGVyeS9zdHlsZXMvX2FuaW1hdGlvbnMuc2NzcyIsImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvc3R5bGVzL19hY2Nlc3NpYmlsaXR5LnNjc3MiLCJmaWxlOi8vL1VzZXJzL3Bsb2YvRG9jdW1lbnRzL0dpdGh1Yi9wb2wtcnNzL3NyYy93ZWJwYXJ0cy9wb2xSc3NHYWxsZXJ5L2NvbXBvbmVudHMvbGF5b3V0cy9NaW5pbWFsTGF5b3V0L01pbmltYWxMYXlvdXQubW9kdWxlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUpBLE1BRUUsWUFBQSxDQUNBLFlBQUEsQ0FDQSxhQUFBLENBQ0EsYUFBQSxDQUNBLGFBQUEsQ0FHQSxnQkFBQSxDQUNBLGlCQUFBLENBQ0EsaUJBQUEsQ0FDQSxpQkFBQSxDQUNBLGlCQUFBLENBT0YseUJBQ0UsTUFFRSxhQUFBLENBQ0EsYUFBQSxDQUNBLGlCQUFBLENBQ0EsaUJBQUEsQ0FBQSxDQVFKLGFBQ0UsTUFFRSxlQUFBLENBQ0EsZ0JBQUEsQ0FDQSxtQkFBQSxDQUNBLG9CQUFBLENDOEhBLGNEOUhBLENDaUlGLEtBQ0UseUNBQUEsQ0FDQSxlQUFBLENBR0Ysa0JBQ0Usc0JBQUEsQ0FDQSx1QkFBQSxDQUdGLEVBQ0UsU0FBQSxDQUNBLFFBQUEsQ0Q3SUEsQ0NxSkosOEJBRUUs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 */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "animate-fadeIn_9a6532d7": "animate-fadeIn_9a6532d7",
  fadeIn_9a6532d7: "fadeIn_9a6532d7",
  "animate-fadeOut_9a6532d7": "animate-fadeOut_9a6532d7",
  fadeOut_9a6532d7: "fadeOut_9a6532d7",
  "animate-slideUp_9a6532d7": "animate-slideUp_9a6532d7",
  slideUp_9a6532d7: "slideUp_9a6532d7",
  "animate-slideDown_9a6532d7": "animate-slideDown_9a6532d7",
  slideDown_9a6532d7: "slideDown_9a6532d7",
  "animate-slideLeft_9a6532d7": "animate-slideLeft_9a6532d7",
  slideLeft_9a6532d7: "slideLeft_9a6532d7",
  "animate-slideRight_9a6532d7": "animate-slideRight_9a6532d7",
  slideRight_9a6532d7: "slideRight_9a6532d7",
  "animate-scaleIn_9a6532d7": "animate-scaleIn_9a6532d7",
  scaleIn_9a6532d7: "scaleIn_9a6532d7",
  "animate-spin_9a6532d7": "animate-spin_9a6532d7",
  spin_9a6532d7: "spin_9a6532d7",
  "animate-pulse_9a6532d7": "animate-pulse_9a6532d7",
  pulse_9a6532d7: "pulse_9a6532d7",
  "animate-bounce_9a6532d7": "animate-bounce_9a6532d7",
  bounce_9a6532d7: "bounce_9a6532d7",
  "animate-shake_9a6532d7": "animate-shake_9a6532d7",
  shake_9a6532d7: "shake_9a6532d7",
  "sr-only_9a6532d7": "sr-only_9a6532d7",
  "sr-only-focusable_9a6532d7": "sr-only-focusable_9a6532d7",
  "focus-visible_9a6532d7": "focus-visible_9a6532d7",
  "touch-target_9a6532d7": "touch-target_9a6532d7",
  "reduced-motion_9a6532d7": "reduced-motion_9a6532d7",
  minimalLayout_9a6532d7: "minimalLayout_9a6532d7",
  minimalItem_9a6532d7: "minimalItem_9a6532d7",
  itemTitle_9a6532d7: "itemTitle_9a6532d7",
  itemLink_9a6532d7: "itemLink_9a6532d7",
  itemMeta_9a6532d7: "itemMeta_9a6532d7",
  itemDate_9a6532d7: "itemDate_9a6532d7",
  itemSource_9a6532d7: "itemSource_9a6532d7",
  itemDescription_9a6532d7: "itemDescription_9a6532d7",
  inverted_9a6532d7: "inverted_9a6532d7",
  minimalLayoutNumbered_9a6532d7: "minimalLayoutNumbered_9a6532d7",
  minimalLayoutBulleted_9a6532d7: "minimalLayoutBulleted_9a6532d7",
  scaleOut_9a6532d7: "scaleOut_9a6532d7",
  shimmer_9a6532d7: "shimmer_9a6532d7",
  ripple_9a6532d7: "ripple_9a6532d7"
});


/***/ }),

/***/ 8040:
/*!**************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/MinimalLayout/MinimalLayout.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MinimalLayout: () => (/* binding */ MinimalLayout),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_Skeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/Skeleton */ 990);
/* harmony import */ var _shared_EmptyState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/EmptyState */ 7323);
/* harmony import */ var _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MinimalLayout.module.scss */ 7847);
/**
 * MinimalLayout Component
 *
 * Ultra-compact text-only layout for displaying RSS feed items.
 * Perfect for sidebar (1/3 column) views and narrow spaces.
 *
 * Features:
 * - No images (text-only)
 * - Minimal spacing and padding
 * - Efficient use of vertical space
 * - Clean, professional design
 * - Optimized for narrow columns
 */





/**
 * Format date for Norwegian locale
 */
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return '';
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        // Relative time for recent items
        if (diffHours < 1)
            return 'Akkurat nå';
        if (diffHours < 24)
            return `${diffHours} t siden`;
        if (diffDays < 7)
            return `${diffDays} d siden`;
        // Short date format
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
 * Truncate text to a maximum length
 */
const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength)
        return text;
    return text.substring(0, maxLength).trim() + '…';
};
/**
 * MinimalLayout component
 */
const MinimalLayout = ({ items, showPubDate = true, showDescription = false, showSource = false, truncateDescription = 80, isLoading = false, skeletonCount = 5, onItemClick, className = '', testId = 'minimal-layout', isInverted = false }) => {
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
    // Handle keyboard navigation
    const handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((item, event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onItemClick) {
                onItemClick(item);
            }
            else {
                window.open(item.link, '_blank', 'noopener,noreferrer');
            }
        }
    }, [onItemClick]);
    // Container classes
    const containerClasses = [
        _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].minimalLayout,
        isInverted ? _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].inverted : '',
        className
    ].filter(Boolean).join(' ');
    // Loading state
    if (isLoading) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_Skeleton__WEBPACK_IMPORTED_MODULE_1__.SkeletonGrid, { count: skeletonCount, type: "list", itemProps: {
                    showThumbnail: false,
                    showDescription: false
                }, testId: `${testId}-skeleton` })));
    }
    // Empty state
    if (!items || items.length === 0) {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: containerClasses, "data-testid": testId },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_shared_EmptyState__WEBPACK_IMPORTED_MODULE_2__.NoItemsEmptyState, null)));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("nav", { className: containerClasses, "data-testid": testId, role: "navigation", "aria-label": "Nyhetsliste" }, items.map((item, index) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("article", { key: `${item.link}-${index}`, className: _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].minimalItem, "data-testid": `${testId}-item-${index}` },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", { href: item.link, className: _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].itemLink, onClick: (e) => handleItemClick(item, e), onKeyDown: (e) => handleKeyDown(item, e), target: "_blank", rel: "noopener noreferrer", "aria-label": item.title },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { className: _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].itemTitle }, item.title),
            showDescription && item.description && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { className: _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].itemDescription }, truncateText(item.description.replace(/<[^>]*>/g, ''), truncateDescription))),
            (showPubDate || showSource) && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].itemMeta },
                showPubDate && item.pubDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("time", { className: _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].itemDate, dateTime: item.pubDate }, formatDate(item.pubDate))),
                showSource && item.author && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: _MinimalLayout_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].itemSource }, item.author))))))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (react__WEBPACK_IMPORTED_MODULE_0__.memo(MinimalLayout));


/***/ }),

/***/ 7847:
/*!**************************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/MinimalLayout/MinimalLayout.module.scss.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./MinimalLayout.module.css */ 3083);
const styles = {
    'animate-fadeIn': 'animate-fadeIn_9a6532d7',
    fadeIn: 'fadeIn_9a6532d7',
    'animate-fadeOut': 'animate-fadeOut_9a6532d7',
    fadeOut: 'fadeOut_9a6532d7',
    'animate-slideUp': 'animate-slideUp_9a6532d7',
    slideUp: 'slideUp_9a6532d7',
    'animate-slideDown': 'animate-slideDown_9a6532d7',
    slideDown: 'slideDown_9a6532d7',
    'animate-slideLeft': 'animate-slideLeft_9a6532d7',
    slideLeft: 'slideLeft_9a6532d7',
    'animate-slideRight': 'animate-slideRight_9a6532d7',
    slideRight: 'slideRight_9a6532d7',
    'animate-scaleIn': 'animate-scaleIn_9a6532d7',
    scaleIn: 'scaleIn_9a6532d7',
    'animate-spin': 'animate-spin_9a6532d7',
    spin: 'spin_9a6532d7',
    'animate-pulse': 'animate-pulse_9a6532d7',
    pulse: 'pulse_9a6532d7',
    'animate-bounce': 'animate-bounce_9a6532d7',
    bounce: 'bounce_9a6532d7',
    'animate-shake': 'animate-shake_9a6532d7',
    shake: 'shake_9a6532d7',
    'sr-only': 'sr-only_9a6532d7',
    'sr-only-focusable': 'sr-only-focusable_9a6532d7',
    'focus-visible': 'focus-visible_9a6532d7',
    'touch-target': 'touch-target_9a6532d7',
    'reduced-motion': 'reduced-motion_9a6532d7',
    minimalLayout: 'minimalLayout_9a6532d7',
    minimalItem: 'minimalItem_9a6532d7',
    itemTitle: 'itemTitle_9a6532d7',
    itemLink: 'itemLink_9a6532d7',
    itemMeta: 'itemMeta_9a6532d7',
    itemDate: 'itemDate_9a6532d7',
    itemSource: 'itemSource_9a6532d7',
    itemDescription: 'itemDescription_9a6532d7',
    inverted: 'inverted_9a6532d7',
    minimalLayoutNumbered: 'minimalLayoutNumbered_9a6532d7',
    minimalLayoutBulleted: 'minimalLayoutBulleted_9a6532d7',
    scaleOut: 'scaleOut_9a6532d7',
    shimmer: 'shimmer_9a6532d7',
    ripple: 'ripple_9a6532d7'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 7982:
/*!******************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/layouts/MinimalLayout/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MinimalLayout: () => (/* reexport safe */ _MinimalLayout__WEBPACK_IMPORTED_MODULE_0__.MinimalLayout),
/* harmony export */   "default": () => (/* reexport safe */ _MinimalLayout__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _MinimalLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MinimalLayout */ 8040);




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
//# sourceMappingURL=chunk.layout-minimal.js.map