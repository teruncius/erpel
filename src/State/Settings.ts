import gmail from '../../resources/google-mail.png?no-inline';
import calendar from '../../resources/google-calendar.png?no-inline';
import mm from '../../resources/mattermost.png?no-inline';
import spotify from '../../resources/spotify.png?no-inline';
import jira from '../../resources/jira.png?no-inline';
import trello from '../../resources/trello.png?no-inline';
import web from '../../resources/web.png?no-inline';
import type { Option, Service, ServiceTemplate } from './Schema';

export enum BackgroundMode {
    Wallpaper = 'wallpaper',
    Color = 'color',
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
    '57f999b3-81f1-4cf1-86cf-05602d772d9a': gmail,
    '6f4dc7af-3173-4dab-b7d3-9d88739f57dc': calendar,
    '5bdc9b31-f8e7-4937-a156-33bb6e12cc4f': mm,
    '0ff56910-61ef-41b0-b74d-dbf48a9c3472': spotify,
    'c7c7dfd2-2941-462b-b68b-9d4c800e25e8': jira,
    '06654c77-661b-4955-a163-7fbbd0f81de4': trello,
    '173773cb-72de-429f-94db-d382613f436d': web,
};

export function IconIdToUrl(id: string): string {
    return ICONS[id] || '';
}

export function ServiceFromTemplate(template: ServiceTemplate): Service {
    return {
        id: crypto.randomUUID(),
        name: ValueFromOption(template.name),
        url: ValueFromOption(template.url),
        icon: ValueFromOption(template.icon),
        darkMode: ValueFromOption(template.darkMode),
        template,
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
        id: '5106fdb4-04a3-4659-8d76-54a79fbf45a2',
        name: {
            default: 'Google Mail',
            customizable: true,
            copyOnCreate: false,
        },
        url: {
            default: 'https://mail.google.com/',
            customizable: false,
            copyOnCreate: false,
        },
        icon: {
            default: '57f999b3-81f1-4cf1-86cf-05602d772d9a',
            customizable: false,
            copyOnCreate: false,
        },
        darkMode: {
            default: false,
            customizable: false,
            copyOnCreate: false,
        },
        tags: ['google', 'e-mail'],
    },
    {
        id: '2b027a28-172a-4180-bd5a-32070b046b77',
        name: {
            default: 'Google Calendar',
            customizable: true,
            copyOnCreate: false,
        },
        url: {
            default: 'https://calendar.google.com/',
            customizable: false,
            copyOnCreate: false,
        },
        icon: {
            default: '6f4dc7af-3173-4dab-b7d3-9d88739f57dc',
            customizable: false,
            copyOnCreate: false,
        },
        darkMode: {
            default: false,
            customizable: false,
            copyOnCreate: false,
        },
        tags: ['google', 'calendar', 'kalender'],
    },
    {
        id: 'b78be8b5-2772-4cc3-bcfa-f05fcfa05f1a',
        name: {
            default: 'Mattermost',
            customizable: true,
            copyOnCreate: false,
        },
        url: {
            default: 'https://mattermost.com/',
            customizable: true,
            copyOnCreate: true,
        },
        icon: {
            default: '5bdc9b31-f8e7-4937-a156-33bb6e12cc4f',
            customizable: false,
            copyOnCreate: false,
        },
        darkMode: {
            default: false,
            customizable: true,
            copyOnCreate: false,
        },
        tags: ['chat', 'mm'],
    },
    {
        id: '5ba82927-f8b7-4672-9da1-996b7c2430b3',
        name: {
            default: 'Spotify',
            customizable: true,
            copyOnCreate: false,
        },
        url: {
            default: 'https://spotify.com/',
            customizable: false,
            copyOnCreate: false,
        },
        icon: {
            default: '0ff56910-61ef-41b0-b74d-dbf48a9c3472',
            customizable: false,
            copyOnCreate: false,
        },
        darkMode: {
            default: false,
            customizable: false,
            copyOnCreate: false,
        },
        tags: ['spotify', 'music'],
    },
    {
        id: '3cec01fa-fa1b-458f-b1e2-5aafc63286ce',
        name: {
            default: 'Jira',
            customizable: true,
            copyOnCreate: false,
        },
        url: {
            default: 'https://jira.atlassian.com/',
            customizable: true,
            copyOnCreate: false,
        },
        icon: {
            default: 'c7c7dfd2-2941-462b-b68b-9d4c800e25e8',
            customizable: false,
            copyOnCreate: false,
        },
        darkMode: {
            default: false,
            customizable: false,
            copyOnCreate: false,
        },
        tags: ['atlassian'],
    },
    {
        id: 'fb0c165e-d6fe-41d7-bec6-41a321347826',
        name: {
            default: 'Trello',
            customizable: true,
            copyOnCreate: false,
        },
        url: {
            default: 'https://trello.com/',
            customizable: true,
            copyOnCreate: false,
        },
        icon: {
            default: '06654c77-661b-4955-a163-7fbbd0f81de4',
            customizable: false,
            copyOnCreate: false,
        },
        darkMode: {
            default: false,
            customizable: false,
            copyOnCreate: false,
        },
        tags: ['atlassian'],
    },
    {
        id: '5f8c2fe3-5be6-4f1c-a58d-e7e746db2b0a',
        name: {
            default: 'Website',
            customizable: true,
            copyOnCreate: true,
        },
        url: {
            default: 'https://example.com/',
            customizable: true,
            copyOnCreate: true,
        },
        icon: {
            default: '173773cb-72de-429f-94db-d382613f436d',
            customizable: false,
            copyOnCreate: false,
        },
        darkMode: {
            default: false,
            customizable: true,
            copyOnCreate: false,
        },
        tags: ['web', 'url', 'empty', 'browser', 'tab'],
    },
];
