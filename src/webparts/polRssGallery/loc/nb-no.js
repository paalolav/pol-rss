define([], function() {
  return {
    // Property Pane Description
    "PropertyPaneDescription": "Konfigurer innstillinger for RSS-visning",

    // Group names
    "LayoutGroupName": "Visningsoppsett",
    "DisplayGroupName": "Visningsinnstillinger",
    "ImagesGroupName": "Bildeinnstillinger",
    "FilterGroupName": "Innholdsfilter",
    "BannerSettingsGroupName": "Karusellinnstillinger",
    "AdvancedGroupName": "Avansert",
    "ProxyGroupName": "Proxy-innstillinger",

    // Basic Settings
    "TitleFieldLabel": "Webdel-tittel",
    "FeedUrlFieldLabel": "RSS-feed URL",
    "FeedUrlDescription": "Skriv inn URL til en RSS- eller Atom-feed",
    "FeedUrlPlaceholder": "https://example.com/feed.xml",
    "LayoutFieldLabel": "Visningsoppsett",
    "LayoutBannerLabel": "Banner",
    "LayoutCardLabel": "Kortvisning",
    "LayoutListLabel": "Liste",
    "LayoutMinimalLabel": "Minimal",
    "LayoutBannerDescription": "Fullbredde rotererende banner for nyheter",
    "LayoutCardDescription": "Rutenett av kort med bilder",
    "LayoutListDescription": "Kompakt liste for sidefelter",
    "LayoutMinimalDescription": "Ren tekst uten bilder, perfekt for smale kolonner",

    // Display Settings
    "MaxItemsFieldLabel": "Maksimalt antall elementer",
    "ShowPubDateFieldLabel": "Vis publiseringsdato",
    "ShowPubDateOnLabel": "Vis",
    "ShowPubDateOffLabel": "Skjul",
    "ShowDescriptionFieldLabel": "Vis beskrivelse",
    "ShowDescriptionOnLabel": "Vis",
    "ShowDescriptionOffLabel": "Skjul",
    "ShowCategoriesFieldLabel": "Vis kategorier",
    "ShowCategoriesOnLabel": "Vis",
    "ShowCategoriesOffLabel": "Skjul",

    // Image Settings
    "ForceFallbackFieldLabel": "Bruk alltid reservebilde",
    "ForceFallbackOnLabel": "Ja",
    "ForceFallbackOffLabel": "Nei",
    "FallbackUrlFieldLabel": "Reservebilde URL",
    "FallbackUrlDescription": "URL som brukes hvis feeden mangler bilde",
    "ImageAspectRatioFieldLabel": "Bildeforhold",

    // Banner Settings (Carousel)
    "AutoscrollFieldLabel": "Automatisk rulling",
    "AutoscrollOnLabel": "På",
    "AutoscrollOffLabel": "Av",
    "IntervalFieldLabel": "Rulleintervall (sekunder)",
    "BannerHeightFieldLabel": "Bannerhøyde",
    "ShowPaginationFieldLabel": "Vis navigasjonsprikker",
    "ShowPaginationOnLabel": "Vis",
    "ShowPaginationOffLabel": "Skjul",

    // Filter Settings
    "FilterByKeywordsFieldLabel": "Filtrer etter nøkkelord",
    "FilterByKeywordsOnLabel": "På",
    "FilterByKeywordsOffLabel": "Av",
    "FilterKeywordsFieldLabel": "Nøkkelord",
    "FilterKeywordsDescription": "Kommaseparert liste med nøkkelord",
    "FilterModeFieldLabel": "Filtermodus",
    "FilterModeIncludeLabel": "Inkluder elementer med nøkkelord",
    "FilterModeExcludeLabel": "Ekskluder elementer med nøkkelord",
    "FilterByCategoryFieldLabel": "Filtrer etter kategori",
    "FilterByCategoryOnLabel": "På",
    "FilterByCategoryOffLabel": "Av",
    "CategoryFilterModeFieldLabel": "Kategorifiltermodus",
    "CategoryFilterModeIncludeLabel": "Inkluder valgte kategorier",
    "CategoryFilterModeExcludeLabel": "Ekskluder valgte kategorier",

    // Advanced Settings
    "AutoRefreshFieldLabel": "Automatisk oppdatering",
    "AutoRefreshOnLabel": "På",
    "AutoRefreshOffLabel": "Av",
    "RefreshIntervalFieldLabel": "Oppdateringsintervall (minutter)",
    "CacheDurationFieldLabel": "Hurtigbuffer-varighet (minutter)",
    "DebugModeFieldLabel": "Feilsøkingsmodus",
    "DebugModeOnLabel": "På",
    "DebugModeOffLabel": "Av",

    // Proxy Settings
    "ProxyUrlFieldLabel": "Proxy-URL",
    "ProxyUrlDescription": "Valgfri: Konfigurer en CORS-proxy for pålitelig feedtilgang",
    "ProxyUrlPlaceholder": "https://your-proxy.azurewebsites.net/api/proxy",
    "TestConnectionLabel": "Test tilkobling",
    "TestingConnectionLabel": "Tester...",
    "ConnectionSuccessLabel": "Tilkobling vellykket",
    "ConnectionFailedLabel": "Tilkobling mislyktes",
    "ProxyHelpLinkText": "Lær hvordan du setter opp din egen proxy",

    // Preset Templates
    "PresetsFieldLabel": "Forhåndsinnstillinger",
    "PresetNewsBanner": "Nyhetsbanner",
    "PresetNewsBannerDescription": "Fullbredde rotererende banner for nyheter",
    "PresetBlogCards": "Bloggrutenett",
    "PresetBlogCardsDescription": "Kortrutenett for blogginnlegg med bilder",
    "PresetCompactList": "Kompakt liste",
    "PresetCompactListDescription": "Plasseffektiv liste for sidefelter",
    "PresetCustom": "Egendefinert",
    "PresetCustomDescription": "Konfigurer alle innstillinger manuelt",

    // Feed Validation Messages
    "UrlValidating": "Validerer feed...",
    "UrlInvalidFormat": "Ugyldig URL-format",
    "UrlFeedNotFound": "Kunne ikke finne feed på denne URL-en",
    "UrlFeedSuccess": "Feed funnet",
    "UrlRequiresCors": "Denne feeden krever en proxy pga. CORS",
    "UrlRequiresProxy": "Prøv å konfigurere en proxy-URL",

    // Error Messages
    "ErrorLoadingFeed": "Feil ved lasting av RSS-feed",
    "ErrorParsingFeed": "Feil ved tolking av RSS-innhold",
    "ErrorFetchingFeed": "Kunne ikke hente feed",

    // UI Messages
    "RetryButtonText": "Prøv igjen",
    "LoadingMessage": "Laster RSS-feed...",
    "NoItemsMessage": "Ingen elementer å vise",
    "NoMatchingItemsMessage": "Ingen elementer matcher filterkriteriene",
    "AutoRetryInProgress": "Automatisk prøv-igjen pågår",
    "AutoRetryScheduled": "Automatisk prøv-igjen planlagt",
    "AutoRetryAttempting": "Prøver automatisk igjen",

    // Empty State Messages
    "NoFeedConfiguredTitle": "Ingen feed konfigurert",
    "NoFeedConfiguredMessage": "Konfigurer en RSS-feed URL i webdelens innstillinger",
    "ConfigureFeedButton": "Konfigurer feed",
    "FilteredEmptyTitle": "Ingen resultater",
    "FilteredEmptyMessage": "Ingen elementer matcher de aktive filtrene",
    "ClearFiltersButton": "Fjern filtre",
    "OfflineEmptyTitle": "Du er frakoblet",
    "OfflineEmptyMessage": "Koble til internett for å laste feeden",

    // Gallery layout strings
    "LayoutGalleryLabel": "Galleri",
    "LayoutGalleryDescription": "Bilderutenett med titler ved pekerfokus",
    "GallerySettingsGroupName": "Galleriinnstillinger",
    "GalleryColumnsLabel": "Kolonner",
    "GalleryColumnsAuto": "Automatisk (responsiv)",
    "GalleryTitlePositionLabel": "Tittelvisning",
    "GalleryTitleHover": "Vis ved pekerfokus",
    "GalleryTitleBelow": "Vis under bilde",
    "GalleryTitleNone": "Skjul titler",
    "GalleryAspectRatioLabel": "Bildeforhold",
    "AspectRatio1x1": "Kvadratisk (1:1)",
    "AspectRatio4x3": "Standard (4:3)",
    "AspectRatio16x9": "Bredformat (16:9)",
    "GalleryGapLabel": "Avstand mellom elementer",
    "GapSmall": "Liten",
    "GapMedium": "Middels",
    "GapLarge": "Stor",
    "GalleryNoImages": "Ingen elementer med bilder å vise",
    // Gallery preset
    "PresetPhotoGallery": "Fotogalleri",
    "PresetPhotoGalleryDescription": "Bilderutenett med titler ved pekerfokus"
  }
});
