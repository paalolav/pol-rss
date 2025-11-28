declare module 'RssFeedWebPartStrings' {
  interface IRssFeedWebPartStrings {
    // Property Pane Description
    PropertyPaneDescription: string;

    // Group names
    LayoutGroupName: string;
    DisplayGroupName: string;
    ImagesGroupName: string;
    FilterGroupName: string;
    BannerSettingsGroupName: string;
    AdvancedGroupName: string;
    ProxyGroupName: string;

    // Basic Settings
    TitleFieldLabel: string;
    FeedUrlFieldLabel: string;
    FeedUrlDescription: string;
    FeedUrlPlaceholder: string;
    LayoutFieldLabel: string;
    LayoutBannerLabel: string;
    LayoutCardLabel: string;
    LayoutListLabel: string;
    LayoutMinimalLabel: string;
    LayoutBannerDescription: string;
    LayoutCardDescription: string;
    LayoutListDescription: string;
    LayoutMinimalDescription: string;

    // Display Settings
    MaxItemsFieldLabel: string;
    ShowPubDateFieldLabel: string;
    ShowPubDateOnLabel: string;
    ShowPubDateOffLabel: string;
    ShowDescriptionFieldLabel: string;
    ShowDescriptionOnLabel: string;
    ShowDescriptionOffLabel: string;
    ShowSourceFieldLabel: string;
    ShowSourceOnLabel: string;
    ShowSourceOffLabel: string;
    ShowCategoriesFieldLabel: string;
    ShowCategoriesOnLabel: string;
    ShowCategoriesOffLabel: string;

    // Image Settings
    ForceFallbackFieldLabel: string;
    ForceFallbackOnLabel: string;
    ForceFallbackOffLabel: string;
    FallbackUrlFieldLabel: string;
    FallbackUrlDescription: string;
    ImageAspectRatioFieldLabel: string;

    // Banner Settings (Carousel)
    AutoscrollFieldLabel: string;
    AutoscrollOnLabel: string;
    AutoscrollOffLabel: string;
    IntervalFieldLabel: string;
    BannerHeightFieldLabel: string;
    ShowPaginationFieldLabel: string;
    ShowPaginationOnLabel: string;
    ShowPaginationOffLabel: string;

    // Filter Settings
    FilterByKeywordsFieldLabel: string;
    FilterByKeywordsOnLabel: string;
    FilterByKeywordsOffLabel: string;
    FilterKeywordsFieldLabel: string;
    FilterKeywordsDescription: string;
    FilterModeFieldLabel: string;
    FilterModeIncludeLabel: string;
    FilterModeExcludeLabel: string;
    FilterByCategoryFieldLabel: string;
    FilterByCategoryOnLabel: string;
    FilterByCategoryOffLabel: string;
    CategoryFilterModeFieldLabel: string;
    CategoryFilterModeIncludeLabel: string;
    CategoryFilterModeExcludeLabel: string;

    // Advanced Settings
    AutoRefreshFieldLabel: string;
    AutoRefreshOnLabel: string;
    AutoRefreshOffLabel: string;
    RefreshIntervalFieldLabel: string;
    CacheDurationFieldLabel: string;
    DebugModeFieldLabel: string;
    DebugModeOnLabel: string;
    DebugModeOffLabel: string;

    // Proxy Settings
    ProxyUrlFieldLabel: string;
    ProxyUrlDescription: string;
    ProxyUrlPlaceholder: string;
    TestConnectionLabel: string;
    TestingConnectionLabel: string;
    ConnectionSuccessLabel: string;
    ConnectionFailedLabel: string;
    ProxyHelpLinkText: string;

    // Preset Templates
    PresetsFieldLabel: string;
    PresetNewsBanner: string;
    PresetNewsBannerDescription: string;
    PresetBlogCards: string;
    PresetBlogCardsDescription: string;
    PresetCompactList: string;
    PresetCompactListDescription: string;
    PresetCustom: string;
    PresetCustomDescription: string;

    // Feed Validation Messages
    UrlValidating: string;
    UrlInvalidFormat: string;
    UrlFeedNotFound: string;
    UrlFeedSuccess: string;
    UrlRequiresCors: string;
    UrlRequiresProxy: string;

    // Error Messages
    ErrorLoadingFeed: string;
    ErrorParsingFeed: string;
    ErrorFetchingFeed: string;

    // UI Messages
    RetryButtonText: string;
    LoadingMessage: string;
    NoItemsMessage: string;
    NoMatchingItemsMessage: string;
    AutoRetryInProgress: string;
    AutoRetryScheduled: string;
    AutoRetryAttempting: string;

    // Empty State Messages
    NoFeedConfiguredTitle: string;
    NoFeedConfiguredMessage: string;
    ConfigureFeedButton: string;
    FilteredEmptyTitle: string;
    FilteredEmptyMessage: string;
    ClearFiltersButton: string;
    OfflineEmptyTitle: string;
    OfflineEmptyMessage: string;

    // Gallery Layout
    LayoutGalleryLabel: string;
    LayoutGalleryDescription: string;
    GallerySettingsGroupName: string;
    GalleryColumnsLabel: string;
    GalleryColumnsAuto: string;
    GalleryTitlePositionLabel: string;
    GalleryTitleHover: string;
    GalleryTitleBelow: string;
    GalleryTitleNone: string;
    GalleryAspectRatioLabel: string;
    AspectRatio1x1: string;
    AspectRatio4x3: string;
    AspectRatio16x9: string;
    GalleryGapLabel: string;
    GapSmall: string;
    GapMedium: string;
    GapLarge: string;
    GalleryNoImages: string;

    // Gallery Preset
    PresetPhotoGallery: string;
    PresetPhotoGalleryDescription: string;
  }

  const strings: IRssFeedWebPartStrings;
  export = strings;
}
