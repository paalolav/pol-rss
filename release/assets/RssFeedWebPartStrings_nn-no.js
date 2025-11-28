define([], function() {
  return {
    // Property Pane Description
    "PropertyPaneDescription": "Konfigurer innstillingar for RSS-vising",

    // Group names
    "LayoutGroupName": "Visingsoppsett",
    "DisplayGroupName": "Visingsinnstillingar",
    "ImagesGroupName": "Bileteinnstillingar",
    "FilterGroupName": "Innhaldsfilter",
    "BannerSettingsGroupName": "Karusellinnstillingar",
    "AdvancedGroupName": "Avansert",
    "ProxyGroupName": "Proxy-innstillingar",

    // Basic Settings
    "TitleFieldLabel": "Webdel-tittel",
    "FeedUrlFieldLabel": "RSS-feed URL",
    "FeedUrlDescription": "Skriv inn URL til ein RSS- eller Atom-feed",
    "FeedUrlPlaceholder": "https://example.com/feed.xml",
    "LayoutFieldLabel": "Visingsoppsett",
    "LayoutBannerLabel": "Banner",
    "LayoutCardLabel": "Kortvising",
    "LayoutListLabel": "Liste",
    "LayoutMinimalLabel": "Minimal",
    "LayoutBannerDescription": "Fullbreidd roterande banner for nyheiter",
    "LayoutCardDescription": "Rutenett av kort med bilete",
    "LayoutListDescription": "Kompakt liste for sidefelt",
    "LayoutMinimalDescription": "Rein tekst utan bilete, perfekt for smale kolonner",

    // Display Settings
    "MaxItemsFieldLabel": "Maksimalt antal element",
    "ShowPubDateFieldLabel": "Vis publiseringsdato",
    "ShowPubDateOnLabel": "Vis",
    "ShowPubDateOffLabel": "Gøym",
    "ShowDescriptionFieldLabel": "Vis skildring",
    "ShowDescriptionOnLabel": "Vis",
    "ShowDescriptionOffLabel": "Gøym",
    "ShowSourceFieldLabel": "Vis kjelde",
    "ShowSourceOnLabel": "Vis",
    "ShowSourceOffLabel": "Gøym",
    "ShowCategoriesFieldLabel": "Vis kategoriar",
    "ShowCategoriesOnLabel": "Vis",
    "ShowCategoriesOffLabel": "Gøym",

    // Image Settings
    "ForceFallbackFieldLabel": "Bruk alltid reservebilete",
    "ForceFallbackOnLabel": "Ja",
    "ForceFallbackOffLabel": "Nei",
    "FallbackUrlFieldLabel": "Reservebilete URL",
    "FallbackUrlDescription": "URL som blir brukt om feeden manglar bilete",
    "ImageAspectRatioFieldLabel": "Bileteforhold",

    // Banner Settings (Carousel)
    "AutoscrollFieldLabel": "Automatisk rulling",
    "AutoscrollOnLabel": "På",
    "AutoscrollOffLabel": "Av",
    "IntervalFieldLabel": "Rulleintervall (sekund)",
    "BannerHeightFieldLabel": "Bannerhøgd",
    "ShowPaginationFieldLabel": "Vis navigasjonsprikkar",
    "ShowPaginationOnLabel": "Vis",
    "ShowPaginationOffLabel": "Gøym",

    // Filter Settings
    "FilterByKeywordsFieldLabel": "Filtrer etter nøkkelord",
    "FilterByKeywordsOnLabel": "På",
    "FilterByKeywordsOffLabel": "Av",
    "FilterKeywordsFieldLabel": "Nøkkelord",
    "FilterKeywordsDescription": "Kommaseparert liste med nøkkelord",
    "FilterModeFieldLabel": "Filtermodus",
    "FilterModeIncludeLabel": "Inkluder element med nøkkelord",
    "FilterModeExcludeLabel": "Ekskluder element med nøkkelord",
    "FilterByCategoryFieldLabel": "Filtrer etter kategori",
    "FilterByCategoryOnLabel": "På",
    "FilterByCategoryOffLabel": "Av",
    "CategoryFilterModeFieldLabel": "Kategorifiltermodus",
    "CategoryFilterModeIncludeLabel": "Inkluder valde kategoriar",
    "CategoryFilterModeExcludeLabel": "Ekskluder valde kategoriar",

    // Advanced Settings
    "AutoRefreshFieldLabel": "Automatisk oppdatering",
    "AutoRefreshOnLabel": "På",
    "AutoRefreshOffLabel": "Av",
    "RefreshIntervalFieldLabel": "Oppdateringsintervall (minutt)",
    "CacheDurationFieldLabel": "Hurtigbuffer-varigheit (minutt)",
    "DebugModeFieldLabel": "Feilsøkingsmodus",
    "DebugModeOnLabel": "På",
    "DebugModeOffLabel": "Av",

    // Proxy Settings
    "ProxyUrlFieldLabel": "Proxy-URL",
    "ProxyUrlDescription": "Valfritt: Konfigurer ein CORS-proxy for påliteleg feedtilgang",
    "ProxyUrlPlaceholder": "https://your-proxy.azurewebsites.net/api/proxy",
    "TestConnectionLabel": "Test tilkopling",
    "TestingConnectionLabel": "Testar...",
    "ConnectionSuccessLabel": "Tilkopling vellykka",
    "ConnectionFailedLabel": "Tilkopling mislukkast",
    "ProxyHelpLinkText": "Lær korleis du set opp din eigen proxy",

    // Preset Templates
    "PresetsFieldLabel": "Førehandsinnstillingar",
    "PresetNewsBanner": "Nyheitsbanner",
    "PresetNewsBannerDescription": "Fullbreidd roterande banner for nyheiter",
    "PresetBlogCards": "Bloggruttenett",
    "PresetBlogCardsDescription": "Kortrutenett for blogginnlegg med bilete",
    "PresetCompactList": "Kompakt liste",
    "PresetCompactListDescription": "Plasseffektiv liste for sidefelt",
    "PresetCustom": "Eigendefinert",
    "PresetCustomDescription": "Konfigurer alle innstillingar manuelt",

    // Feed Validation Messages
    "UrlValidating": "Validerer feed...",
    "UrlInvalidFormat": "Ugyldig URL-format",
    "UrlFeedNotFound": "Kunne ikkje finne feed på denne URL-en",
    "UrlFeedSuccess": "Feed funnen",
    "UrlRequiresCors": "Denne feeden krev ein proxy pga. CORS",
    "UrlRequiresProxy": "Prøv å konfigurere ein proxy-URL",

    // Error Messages
    "ErrorLoadingFeed": "Feil ved lasting av RSS-feed",
    "ErrorParsingFeed": "Feil ved tolking av RSS-innhald",
    "ErrorFetchingFeed": "Kunne ikkje hente feed",

    // UI Messages
    "RetryButtonText": "Prøv igjen",
    "LoadingMessage": "Lastar RSS-feed...",
    "NoItemsMessage": "Ingen element å vise",
    "NoMatchingItemsMessage": "Ingen element passar filterkriteria",
    "AutoRetryInProgress": "Automatisk prøv-igjen pågår",
    "AutoRetryScheduled": "Automatisk prøv-igjen planlagt",
    "AutoRetryAttempting": "Prøvar automatisk igjen",

    // Empty State Messages
    "NoFeedConfiguredTitle": "Ingen feed konfigurert",
    "NoFeedConfiguredMessage": "Konfigurer ein RSS-feed URL i webdelens innstillingar",
    "ConfigureFeedButton": "Konfigurer feed",
    "FilteredEmptyTitle": "Ingen resultat",
    "FilteredEmptyMessage": "Ingen element passar dei aktive filtera",
    "ClearFiltersButton": "Fjern filter",
    "OfflineEmptyTitle": "Du er fråkopla",
    "OfflineEmptyMessage": "Kopla til internett for å laste feeden",

    // Gallery layout strings
    "LayoutGalleryLabel": "Galleri",
    "LayoutGalleryDescription": "Bileterutenett med titlar ved peikarfokus",
    "GallerySettingsGroupName": "Galleriinnstillingar",
    "GalleryColumnsLabel": "Kolonnar",
    "GalleryColumnsAuto": "Automatisk (responsiv)",
    "GalleryTitlePositionLabel": "Tittelvisning",
    "GalleryTitleHover": "Vis ved peikarfokus",
    "GalleryTitleBelow": "Vis under bilete",
    "GalleryTitleNone": "Gøym titlar",
    "GalleryAspectRatioLabel": "Bileteforhold",
    "AspectRatio1x1": "Kvadratisk (1:1)",
    "AspectRatio4x3": "Standard (4:3)",
    "AspectRatio16x9": "Breidformat (16:9)",
    "GalleryGapLabel": "Avstand mellom element",
    "GapSmall": "Liten",
    "GapMedium": "Middels",
    "GapLarge": "Stor",
    "GalleryNoImages": "Ingen element med bilete å vise",
    // Gallery preset
    "PresetPhotoGallery": "Fotogalleri",
    "PresetPhotoGalleryDescription": "Bileterutenett med titlar ved peikarfokus"
  }
});
