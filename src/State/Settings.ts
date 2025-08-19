import type { Option, Service, ServiceTemplate } from './Schema';

import calendar from '../../resources/google-calendar.png?no-inline';
import gmail from '../../resources/google-mail.png?no-inline';
import jira from '../../resources/jira.png?no-inline';
import mm from '../../resources/mattermost.png?no-inline';
import spotify from '../../resources/spotify.png?no-inline';
import telegram from '../../resources/telegram.png?no-inline';
import trello from '../../resources/trello.png?no-inline';
import web from '../../resources/web.png?no-inline';

export enum BackgroundMode {
    Color = 'color',
    Wallpaper = 'wallpaper',
}

export const DEFAULT_SIDE_BAR_IS_OPEN = true;
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_IS_MUTED = false;
export const DEFAULT_MODE = BackgroundMode.Wallpaper;

export const DEFAULT_WALLPAPERS = [
    'https://images.unsplash.com/photo-1752520316159-741a8d0bde1d',
    'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5',
    'https://images.unsplash.com/photo-1537819191377-d3305ffddce4',
    'https://images.unsplash.com/photo-1538370965046-79c0d6907d47',
    'https://images.unsplash.com/photo-1472712739516-7ad2b786e1f7',
    'https://images.unsplash.com/photo-1630839437035-dac17da580d0',
    'https://images.unsplash.com/photo-1656842741176-538dbdcd2682',
];

// TODO: force a value for each icon
const ICONS: Record<string, string> = {
    '06654c77-661b-4955-a163-7fbbd0f81de4': trello,
    '0ff56910-61ef-41b0-b74d-dbf48a9c3472': spotify,
    '173773cb-72de-429f-94db-d382613f436d': web,
    '57f999b3-81f1-4cf1-86cf-05602d772d9a': gmail,
    '5bdc9b31-f8e7-4937-a156-33bb6e12cc4f': mm,
    '6f4dc7af-3173-4dab-b7d3-9d88739f57dc': calendar,
    '7c705337-5799-4e45-955a-d57b354d1f71': telegram,
    'c7c7dfd2-2941-462b-b68b-9d4c800e25e8': jira,
};

export function IconIdToUrl(id: string): string {
    return ICONS[id] || '';
}

export function ServiceFromTemplate(template: ServiceTemplate): Service {
    return {
        darkMode: ValueFromOption(template.darkMode),
        icon: ValueFromOption(template.icon),
        id: crypto.randomUUID(),
        name: ValueFromOption(template.name),
        template,
        url: ValueFromOption(template.url),
    };
}

function ValueFromOption(option: Option) {
    if (option.customizable && option.copyOnCreate) {
        return option.default;
    }
    return null;
}

export const DEFAULT_SERVICES: Service[] = [];

export const DEFAULT_SERVICE_TEMPLATES: ServiceTemplate[] = [
    {
        darkMode: {
            copyOnCreate: false,
            customizable: false,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: '57f999b3-81f1-4cf1-86cf-05602d772d9a',
        },
        id: '5106fdb4-04a3-4659-8d76-54a79fbf45a2',
        name: {
            copyOnCreate: false,
            customizable: true,
            default: 'Google Mail',
        },
        tags: ['google', 'e-mail'],
        url: {
            copyOnCreate: false,
            customizable: false,
            default: 'https://mail.google.com/',
        },
    },
    {
        darkMode: {
            copyOnCreate: false,
            customizable: false,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: '6f4dc7af-3173-4dab-b7d3-9d88739f57dc',
        },
        id: '2b027a28-172a-4180-bd5a-32070b046b77',
        name: {
            copyOnCreate: false,
            customizable: true,
            default: 'Google Calendar',
        },
        tags: ['google', 'calendar', 'kalender'],
        url: {
            copyOnCreate: false,
            customizable: false,
            default: 'https://calendar.google.com/',
        },
    },
    {
        darkMode: {
            copyOnCreate: false,
            customizable: true,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: '5bdc9b31-f8e7-4937-a156-33bb6e12cc4f',
        },
        id: 'b78be8b5-2772-4cc3-bcfa-f05fcfa05f1a',
        name: {
            copyOnCreate: false,
            customizable: true,
            default: 'Mattermost',
        },
        tags: ['chat', 'mm'],
        url: {
            copyOnCreate: true,
            customizable: true,
            default: 'https://mattermost.com/',
        },
    },
    {
        darkMode: {
            copyOnCreate: false,
            customizable: false,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: '0ff56910-61ef-41b0-b74d-dbf48a9c3472',
        },
        id: '5ba82927-f8b7-4672-9da1-996b7c2430b3',
        name: {
            copyOnCreate: false,
            customizable: true,
            default: 'Spotify',
        },
        tags: ['spotify', 'music'],
        url: {
            copyOnCreate: false,
            customizable: false,
            default: 'https://spotify.com/',
        },
    },
    {
        darkMode: {
            copyOnCreate: false,
            customizable: false,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: 'c7c7dfd2-2941-462b-b68b-9d4c800e25e8',
        },
        id: '3cec01fa-fa1b-458f-b1e2-5aafc63286ce',
        name: {
            copyOnCreate: false,
            customizable: true,
            default: 'Jira',
        },
        tags: ['atlassian'],
        url: {
            copyOnCreate: false,
            customizable: true,
            default: 'https://jira.atlassian.com/',
        },
    },
    {
        darkMode: {
            copyOnCreate: false,
            customizable: false,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: '06654c77-661b-4955-a163-7fbbd0f81de4',
        },
        id: 'fb0c165e-d6fe-41d7-bec6-41a321347826',
        name: {
            copyOnCreate: false,
            customizable: true,
            default: 'Trello',
        },
        tags: ['atlassian'],
        url: {
            copyOnCreate: false,
            customizable: true,
            default: 'https://trello.com/',
        },
    },
    {
        darkMode: {
            copyOnCreate: false,
            customizable: false,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: '7c705337-5799-4e45-955a-d57b354d1f71',
        },
        id: '539b01ef-2748-406a-a6f5-a9d2001c07bd',
        name: {
            copyOnCreate: false,
            customizable: true,
            default: 'Telegram',
        },
        tags: ['telegram', 'messenger', 'chat'],
        url: {
            copyOnCreate: false,
            customizable: true,
            default: 'https://web.telegram.org/',
        },
    },
    {
        darkMode: {
            copyOnCreate: false,
            customizable: true,
            default: false,
        },
        icon: {
            copyOnCreate: false,
            customizable: false,
            default: '173773cb-72de-429f-94db-d382613f436d',
        },
        id: '5f8c2fe3-5be6-4f1c-a58d-e7e746db2b0a',
        name: {
            copyOnCreate: true,
            customizable: true,
            default: 'Website',
        },
        tags: ['web', 'url', 'empty', 'browser', 'tab'],
        url: {
            copyOnCreate: true,
            customizable: true,
            default: 'https://example.com/',
        },
    },
];
