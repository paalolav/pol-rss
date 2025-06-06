declare interface IRssFeedWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  FeedUrlFieldLabel: string;
  MaxItemsFieldLabel: string;
  AutoRefreshFieldLabel: string;
  AutoRefreshOnLabel: string;
  AutoRefreshOffLabel: string;
  RefreshIntervalFieldLabel: string;
  LayoutFieldLabel: string;
  LayoutBannerLabel: string;
  LayoutCardLabel: string;
  LayoutListLabel: string;
  ForceFallbackFieldLabel: string;
  ForceFallbackOnLabel: string;
  ForceFallbackOffLabel: string;
  FallbackUrlFieldLabel: string;
  FallbackUrlDescription: string;
  ShowPubDateFieldLabel: string;
  ShowPubDateOnLabel: string;
  ShowPubDateOffLabel: string;
  ShowDescriptionFieldLabel: string;
  ShowDescriptionOnLabel: string;
  ShowDescriptionOffLabel: string;
  BannerSettingsGroupName: string;
  AutoscrollFieldLabel: string;
  AutoscrollOnLabel: string;
  AutoscrollOffLabel: string;
  IntervalFieldLabel: string;
  ErrorLoadingFeed: string;
  ErrorParsingFeed: string;
  RetryButtonText: string;
  LoadingMessage: string;
  NoItemsMessage: string;
}

declare module 'RssFeedWebPartStrings' {
  const strings: IRssFeedWebPartStrings;
  export = strings;
}
