/**
 * Available preset templates
 */
export const presets = [
    {
        key: 'news-banner',
        labelKey: 'PresetNewsBanner',
        descriptionKey: 'PresetNewsBannerDescription',
        config: {
            layout: 'banner',
            autoscroll: true,
            interval: 5,
            maxItems: 5,
            showDescription: false,
            showPubDate: true
        }
    },
    {
        key: 'blog-cards',
        labelKey: 'PresetBlogCards',
        descriptionKey: 'PresetBlogCardsDescription',
        config: {
            layout: 'card',
            maxItems: 6,
            showDescription: true,
            showPubDate: true,
            autoscroll: false
        }
    },
    {
        key: 'compact-list',
        labelKey: 'PresetCompactList',
        descriptionKey: 'PresetCompactListDescription',
        config: {
            layout: 'list',
            maxItems: 10,
            showDescription: false,
            showPubDate: true,
            autoscroll: false
        }
    },
    {
        key: 'photo-gallery',
        labelKey: 'PresetPhotoGallery',
        descriptionKey: 'PresetPhotoGalleryDescription',
        config: {
            layout: 'gallery',
            maxItems: 12,
            showDescription: false,
            showPubDate: false,
            galleryColumns: 'auto',
            galleryTitlePosition: 'hover',
            galleryAspectRatio: '4:3',
            galleryGap: 'md'
        }
    },
    {
        key: 'custom',
        labelKey: 'PresetCustom',
        descriptionKey: 'PresetCustomDescription',
        config: {}
    }
];
/**
 * Get preset by key
 */
export function getPreset(key) {
    return presets.find(p => p.key === key);
}
/**
 * Apply preset configuration to properties
 */
export function applyPreset(currentProps, presetKey) {
    const preset = getPreset(presetKey);
    if (!preset || presetKey === 'custom') {
        return {};
    }
    return {
        ...preset.config
    };
}
/**
 * Detect which preset matches the current configuration (if any)
 */
export function detectCurrentPreset(props) {
    // Check each preset (except custom) to see if current config matches
    for (const preset of presets) {
        if (preset.key === 'custom')
            continue;
        const configKeys = Object.keys(preset.config);
        const matches = configKeys.every(key => props[key] === preset.config[key]);
        if (matches) {
            return preset.key;
        }
    }
    return 'custom';
}
//# sourceMappingURL=presets.js.map