import { describe, expect, test } from 'vitest';

import {
    BackgroundMode,
    DEFAULT_IS_MUTED,
    DEFAULT_LOCALE, DEFAULT_MODE,
    DEFAULT_SERVICE_TEMPLATES,
    DEFAULT_SERVICES,
    DEFAULT_SIDE_BAR_IS_OPEN, DEFAULT_WALLPAPERS,
    IconIdToUrl,
    ServiceFromTemplate,
} from './settings';

describe('Settings', () => {
    test('default side bar is open', () => {
        expect(DEFAULT_SIDE_BAR_IS_OPEN).toBe(true);
    });

    test('default locale is en-US', () => {
        expect(DEFAULT_LOCALE).toBe('en-US');
    });

    test('default is not muted', () => {
        expect(DEFAULT_IS_MUTED).toBe(false);
    });

    test('default mode is wallpaper', () => {
        expect(DEFAULT_MODE).toBe(BackgroundMode.Wallpaper);
    });

    test('default wallpapers are available', () => {
        expect(DEFAULT_WALLPAPERS.length).toBe(7);
    });

    test('default services are empty', () => {
        expect(DEFAULT_SERVICES.length).toBe(0);
    });

    test('default service templates are available', () => {
        expect(DEFAULT_SERVICE_TEMPLATES.length).toBe(9);
    });

    test('get url from services from template', () => {
        const [template] = DEFAULT_SERVICE_TEMPLATES;
        const service = ServiceFromTemplate(template);

        expect(service).toEqual({
            darkMode: null,
            icon: null,
            id: service.id,
            name: null,
            template,
            url: null,
        });
    });

    test('default icons are available for all service templates', () => {
        const ids = DEFAULT_SERVICE_TEMPLATES.map((template) => template.icon.default);
        expect(ids.length).toBeGreaterThan(0);

        const urls = ids.map((id) => IconIdToUrl(id));
        expect(urls.length).toEqual(ids.length);
    });

    test('get url for icon id', () => {
        const [template] = DEFAULT_SERVICE_TEMPLATES;
        const url = IconIdToUrl(template.icon.default);

        expect(url).toBe('/resources/google-mail.png?no-inline');
    });
});
