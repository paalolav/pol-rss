"use strict";
(self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] = self["webpackJsonp_2b8f84b4-3b97-49d9-b352-9282b3ee05ae_1.3.0"] || []).push([["lib_webparts_polRssGallery_components_shared_EmptyState_index_js-lib_webparts_polRssGallery_c-818e9d"],{

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

/***/ 1259:
/*!***********************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/Skeleton/Skeleton.module.css ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/@microsoft/sp-css-loader/node_modules/@microsoft/load-themed-styles/lib-es6/index.js */ 6323);
// Imports


_node_modules_microsoft_sp_css_loader_node_modules_microsoft_load_themed_styles_lib_es6_index_js__WEBPACK_IMPORTED_MODULE_0__.loadStyles(".skeleton_1b4c321f{background-color:var(--neutralLight,#edebe9);border-radius:4px}.skeleton_1b4c321f.text_1b4c321f{border-radius:2px;height:1em;margin-bottom:4px}.skeleton_1b4c321f.text_1b4c321f:last-child{margin-bottom:0}.skeleton_1b4c321f.rectangular_1b4c321f{border-radius:4px}.skeleton_1b4c321f.circular_1b4c321f{border-radius:50%}.skeleton_1b4c321f.pulse_1b4c321f{animation:pulse_1b4c321f 1.5s ease-in-out infinite}.skeleton_1b4c321f.wave_1b4c321f{overflow:hidden;position:relative}.skeleton_1b4c321f.wave_1b4c321f:after{animation:wave_1b4c321f 1.5s ease-in-out infinite;background:linear-gradient(90deg,transparent 0,var(--neutralLighter,#f3f2f1) 50%,transparent 100%);bottom:0;content:\"\";left:0;position:absolute;right:0;top:0}.skeleton_1b4c321f.none_1b4c321f{animation:none}@keyframes pulse_1b4c321f{0%,to{opacity:1}50%{opacity:.5}}@keyframes wave_1b4c321f{0%{transform:translateX(-100%)}to{transform:translateX(100%)}}.cardSkeleton_1b4c321f{background:var(--backgroundColor,#fff);border:1px solid var(--neutralLight,#edebe9);border-radius:var(--borderRadius,4px);box-shadow:0 1px 3px rgba(0,0,0,.1);overflow:hidden}.cardContent_1b4c321f{display:flex;flex-direction:column;gap:8px;padding:16px}.listSkeleton_1b4c321f{align-items:flex-start;border-bottom:1px solid var(--neutralLight,#edebe9);display:flex;gap:16px;padding:16px}.listSkeleton_1b4c321f:last-child{border-bottom:none}.thumbnail_1b4c321f{border-radius:4px;flex-shrink:0}.listContent_1b4c321f{display:flex;flex:1;flex-direction:column;gap:8px;min-width:0}.bannerSkeleton_1b4c321f{border-radius:var(--borderRadius,4px);overflow:hidden;position:relative}.bannerBackground_1b4c321f{inset:0;position:absolute}.bannerContent_1b4c321f{background:linear-gradient(0deg,rgba(0,0,0,.5) 0,transparent);bottom:0;display:flex;flex-direction:column;gap:12px;left:0;padding:24px;position:absolute;right:0}.bannerTitle_1b4c321f{background-color:hsla(0,0%,100%,.3)}.descriptionLines_1b4c321f{display:flex;flex-direction:column;gap:6px;margin-top:4px}.categoriesRow_1b4c321f{display:flex;gap:8px;margin-top:8px}.categoryPill_1b4c321f{border-radius:12px}.cardGrid_1b4c321f{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}.listGrid_1b4c321f{display:flex;flex-direction:column}@media (prefers-reduced-motion:reduce){.skeleton_1b4c321f.pulse_1b4c321f,.skeleton_1b4c321f.wave_1b4c321f{animation:none}.skeleton_1b4c321f.wave_1b4c321f:after{animation:none;display:none}}@media (forced-colors:active){.skeleton_1b4c321f{background-color:Canvas}.bannerSkeleton_1b4c321f,.cardSkeleton_1b4c321f,.listSkeleton_1b4c321f,.skeleton_1b4c321f{border:1px solid CanvasText}}@media print{.bannerSkeleton_1b4c321f,.cardSkeleton_1b4c321f,.listSkeleton_1b4c321f,.skeleton_1b4c321f{display:none}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvcGxvZi9Eb2N1bWVudHMvR2l0aHViL3BvbC1yc3Mvc3JjL3dlYnBhcnRzL3BvbFJzc0dhbGxlcnkvY29tcG9uZW50cy9zaGFyZWQvU2tlbGV0b24vU2tlbGV0b24ubW9kdWxlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZUEsbUJBQ0UsNENBQUEsQ0FDQSxpQkFBQSxDQUdBLGlDQUVFLGlCQUFBLENBREEsVUFBQSxDQUVBLGlCQUFBLENBRUEsNENBQ0UsZUFBQSxDQUtKLHdDQUNFLGlCQUFBLENBSUYscUNBQ0UsaUJBQUEsQ0FJRixrQ0FDRSxrREFBQSxDQUlGLGlDQUVFLGVBQUEsQ0FEQSxpQkFDQSxDQUVBLHVDQWFFLGlEQUFBLENBTkEsa0dBQUEsQ0FEQSxRQUFBLENBTEEsVUFBQSxDQUdBLE1BQUEsQ0FGQSxpQkFBQSxDQUdBLE9BQUEsQ0FGQSxLQVVBLENBS0osaUNBQ0UsY0FBQSxDQVFKLDBCQUNFLE1BQ0UsU0FBQSxDQUVGLElBQ0UsVUFBQSxDQUFBLENBSUoseUJBQ0UsR0FDRSwyQkFBQSxDQUVGLEdBQ0UsMEJBQUEsQ0FBQSxDQVFKLHVCQUNFLHNDQUFBLENBQ0EsNENBQUEsQ0FDQSxxQ0FBQSxDQUVBLG1DQUFBLENBREEsZUFDQSxDQUdGLHNCQUVFLFlBQUEsQ0FDQSxxQkFBQSxDQUNBLE9BQUEsQ0FIQSxZQUdBLENBT0YsdUJBS0Usc0JBQUEsQ0FEQSxtREFBQSxDQUhBLFlBQUEsQ0FDQSxRQUFBLENBQ0EsWUFFQSxDQUVBLGtDQUNFLGtCQUFBLENBSUosb0JBRUUsaUJBQUEsQ0FEQSxhQUNBLENBR0Ysc0JBRUUsWUFBQSxDQURBLE1BQUEsQ0FFQSxxQkFBQSxDQUNBLE9BQUEsQ0FDQSxXQUFBLENBT0YseUJBRUUscUNBQUEsQ0FDQSxlQUFBLENBRkEsaUJBRUEsQ0FHRiwyQkFFRSxPQUFBLENBREEsaUJBQ0EsQ0FHRix3QkFTRSw2REFBQSxDQVBBLFFBQUEsQ0FJQSxZQUFBLENBQ0EscUJBQUEsQ0FDQSxRQUFBLENBTEEsTUFBQSxDQUVBLFlBQUEsQ0FKQSxpQkFBQSxDQUdBLE9BS0EsQ0FPRixzQkFDRSxtQ0FBQSxDQU9GLDJCQUNFLFlBQUEsQ0FDQSxxQkFBQSxDQUNBLE9BQUEsQ0FDQSxjQUFBLENBR0Ysd0JBQ0UsWUFBQSxDQUNBLE9BQUEsQ0FDQSxjQUFBLENBR0YsdUJBQ0Usa0JBQUEsQ0FPRixtQkFDRSxZQUFBLENBRUEsUUFBQSxDQURBLHlEQUNBLENBR0YsbUJBQ0UsWUFBQSxDQUNBLHFCQUFBLENBUUYsdUNBRUksbUVBRUUsY0FBQSxDQUdGLHVDQUNFLGNBQUEsQ0FDQSxZQUFBLENBQUEsQ0FNTiw4QkFDRSxtQkFDRSx1QkFDQSxDQUdGLDBGQUhFLDJCQU1BLENBQUEsQ0FRSixhQUNFLDBGQUlFLFlBQUEsQ0FBQSIsImZpbGUiOiJTa2VsZXRvbi5tb2R1bGUuY3NzIn0= */", true);

// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  skeleton_1b4c321f: "skeleton_1b4c321f",
  text_1b4c321f: "text_1b4c321f",
  rectangular_1b4c321f: "rectangular_1b4c321f",
  circular_1b4c321f: "circular_1b4c321f",
  pulse_1b4c321f: "pulse_1b4c321f",
  wave_1b4c321f: "wave_1b4c321f",
  none_1b4c321f: "none_1b4c321f",
  cardSkeleton_1b4c321f: "cardSkeleton_1b4c321f",
  cardContent_1b4c321f: "cardContent_1b4c321f",
  listSkeleton_1b4c321f: "listSkeleton_1b4c321f",
  thumbnail_1b4c321f: "thumbnail_1b4c321f",
  listContent_1b4c321f: "listContent_1b4c321f",
  bannerSkeleton_1b4c321f: "bannerSkeleton_1b4c321f",
  bannerBackground_1b4c321f: "bannerBackground_1b4c321f",
  bannerContent_1b4c321f: "bannerContent_1b4c321f",
  bannerTitle_1b4c321f: "bannerTitle_1b4c321f",
  descriptionLines_1b4c321f: "descriptionLines_1b4c321f",
  categoriesRow_1b4c321f: "categoriesRow_1b4c321f",
  categoryPill_1b4c321f: "categoryPill_1b4c321f",
  cardGrid_1b4c321f: "cardGrid_1b4c321f",
  listGrid_1b4c321f: "listGrid_1b4c321f"
});


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

/***/ 943:
/*!***************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/Skeleton/Skeleton.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BannerSkeleton: () => (/* binding */ BannerSkeleton),
/* harmony export */   CardSkeleton: () => (/* binding */ CardSkeleton),
/* harmony export */   ListSkeleton: () => (/* binding */ ListSkeleton),
/* harmony export */   Skeleton: () => (/* binding */ Skeleton),
/* harmony export */   SkeletonGrid: () => (/* binding */ SkeletonGrid),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Skeleton.module.scss */ 3515);
/**
 * Skeleton Loading Components
 *
 * A set of skeleton loading components for displaying loading states.
 * Includes base Skeleton component and layout-specific variants.
 *
 * Features:
 * - Multiple animation styles (pulse, wave, none)
 * - Multiple shape variants (text, rectangular, circular)
 * - Layout-specific skeletons (card, list, banner)
 * - Reduced motion support
 * - Accessible (hidden from screen readers)
 */


/**
 * Base Skeleton component
 */
const Skeleton = ({ variant = 'text', width, height, animation = 'wave', className = '', testId = 'skeleton' }) => {
    const style = {
        ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
        ...(height && { height: typeof height === 'number' ? `${height}px` : height })
    };
    const classes = [
        _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].skeleton,
        _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"][variant],
        _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"][animation],
        className
    ].filter(Boolean).join(' ');
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: classes, style: style, "aria-hidden": "true", "data-testid": testId }));
};
/**
 * Skeleton for card layout items
 */
const CardSkeleton = ({ showDescription = true, showCategories = false, animation = 'wave', className = '', testId = 'card-skeleton' }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardSkeleton} ${className}`, "data-testid": testId, "aria-hidden": "true" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", height: 180, animation: animation, testId: `${testId}-image` }),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardContent },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "90%", height: 20, animation: animation, testId: `${testId}-title` }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "40%", height: 14, animation: animation, testId: `${testId}-date` }),
            showDescription && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].descriptionLines },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "100%", height: 14, animation: animation }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "85%", height: 14, animation: animation }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "70%", height: 14, animation: animation }))),
            showCategories && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoriesRow },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: 60, height: 24, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoryPill }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: 80, height: 24, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoryPill }))))));
};
/**
 * Skeleton for list layout items
 */
const ListSkeleton = ({ showThumbnail = true, showDescription = true, showCategories = false, animation = 'wave', className = '', testId = 'list-skeleton' }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].listSkeleton} ${className}`, "data-testid": testId, "aria-hidden": "true" },
        showThumbnail && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: 120, height: 80, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].thumbnail, testId: `${testId}-thumbnail` })),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].listContent },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "70%", height: 18, animation: animation, testId: `${testId}-title` }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "25%", height: 14, animation: animation, testId: `${testId}-date` }),
            showDescription && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].descriptionLines },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "100%", height: 14, animation: animation }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "90%", height: 14, animation: animation }))),
            showCategories && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoriesRow },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: 50, height: 20, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoryPill }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: 70, height: 20, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoryPill }))))));
};
/**
 * Skeleton for banner/carousel layout
 */
const BannerSkeleton = ({ showDescription = true, showCategories = false, animation = 'wave', height = 300, className = '', testId = 'banner-skeleton' }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${_Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].bannerSkeleton} ${className}`, style: { height: typeof height === 'number' ? `${height}px` : height }, "data-testid": testId, "aria-hidden": "true" },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: "100%", height: "100%", animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].bannerBackground, testId: `${testId}-background` }),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].bannerContent },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "60%", height: 28, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].bannerTitle, testId: `${testId}-title` }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "20%", height: 16, animation: animation, testId: `${testId}-date` }),
            showDescription && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].descriptionLines },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "80%", height: 16, animation: animation }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "text", width: "60%", height: 16, animation: animation }))),
            showCategories && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoriesRow },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: 70, height: 24, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoryPill }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(Skeleton, { variant: "rectangular", width: 90, height: 24, animation: animation, className: _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].categoryPill }))))));
};
/**
 * Grid of skeleton items for loading states
 */
const SkeletonGrid = ({ count = 6, type = 'card', animation = 'wave', itemProps = {}, className = '', testId = 'skeleton-grid' }) => {
    const items = Array.from({ length: count }, (_, index) => index);
    const renderSkeleton = (index) => {
        const key = `skeleton-${index}`;
        const itemTestId = `${testId}-item-${index}`;
        switch (type) {
            case 'list':
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(ListSkeleton, { key: key, animation: animation, testId: itemTestId, ...itemProps }));
            case 'banner':
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(BannerSkeleton, { key: key, animation: animation, testId: itemTestId, ...itemProps }));
            case 'card':
            default:
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(CardSkeleton, { key: key, animation: animation, testId: itemTestId, ...itemProps }));
        }
    };
    const gridClass = type === 'list' ? _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].listGrid : _Skeleton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].cardGrid;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: `${gridClass} ${className}`, "data-testid": testId, "aria-busy": "true", "aria-label": "Loading content" }, items.map(renderSkeleton)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Skeleton);


/***/ }),

/***/ 3515:
/*!***************************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/Skeleton/Skeleton.module.scss.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
__webpack_require__(/*! ./Skeleton.module.css */ 1259);
const styles = {
    skeleton: 'skeleton_1b4c321f',
    text: 'text_1b4c321f',
    rectangular: 'rectangular_1b4c321f',
    circular: 'circular_1b4c321f',
    pulse: 'pulse_1b4c321f',
    wave: 'wave_1b4c321f',
    none: 'none_1b4c321f',
    cardSkeleton: 'cardSkeleton_1b4c321f',
    cardContent: 'cardContent_1b4c321f',
    listSkeleton: 'listSkeleton_1b4c321f',
    thumbnail: 'thumbnail_1b4c321f',
    listContent: 'listContent_1b4c321f',
    bannerSkeleton: 'bannerSkeleton_1b4c321f',
    bannerBackground: 'bannerBackground_1b4c321f',
    bannerContent: 'bannerContent_1b4c321f',
    bannerTitle: 'bannerTitle_1b4c321f',
    descriptionLines: 'descriptionLines_1b4c321f',
    categoriesRow: 'categoriesRow_1b4c321f',
    categoryPill: 'categoryPill_1b4c321f',
    cardGrid: 'cardGrid_1b4c321f',
    listGrid: 'listGrid_1b4c321f'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 990:
/*!************************************************************************!*\
  !*** ./lib/webparts/polRssGallery/components/shared/Skeleton/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BannerSkeleton: () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_0__.BannerSkeleton),
/* harmony export */   CardSkeleton: () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_0__.CardSkeleton),
/* harmony export */   ListSkeleton: () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_0__.ListSkeleton),
/* harmony export */   Skeleton: () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_0__.Skeleton),
/* harmony export */   SkeletonGrid: () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonGrid),
/* harmony export */   "default": () => (/* reexport safe */ _Skeleton__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Skeleton */ 943);
/**
 * Skeleton Component Exports
 */



/***/ })

}]);
//# sourceMappingURL=chunk.lib_webparts_polRssGallery_components_shared_EmptyState_index_js-lib_webparts_polRssGallery_c-818e9d.js.map