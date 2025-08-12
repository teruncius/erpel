import gmail from '../../resources/google-mail.png?no-inline';
import calendar from '../../resources/google-calendar.png?no-inline';
import mm from '../../resources/mattermost.png?no-inline';
import spotify from '../../resources/spotify.png?no-inline';
import jira from '../../resources/jira.png?no-inline';
import trello from '../../resources/trello.png?no-inline';
import web from '../../resources/web.png?no-inline';

export const settings = {
    i18n: {
        date: 'de-DE',
        time: 'de-DE',
        dow: 'de-DE',
    },
};

export type IconId = string;

export interface Service {
    id: string
    name: string | null
    url: string | null
    icon: IconId | null
    template: ServiceTemplate
}

export interface ServiceTemplate {
    id: string
    name: string
    url: string
    icon: IconId
    tags: string[]
}

const ICONS: Record<IconId, string> = {
    '57f999b3-81f1-4cf1-86cf-05602d772d9a': gmail,
    '6f4dc7af-3173-4dab-b7d3-9d88739f57dc': calendar,
    '5bdc9b31-f8e7-4937-a156-33bb6e12cc4f': mm,
    '0ff56910-61ef-41b0-b74d-dbf48a9c3472': spotify,
    'c7c7dfd2-2941-462b-b68b-9d4c800e25e8': jira,
    '06654c77-661b-4955-a163-7fbbd0f81de4': trello,
    '173773cb-72de-429f-94db-d382613f436d': web,
};

export function IconIdToUrl(id: IconId): string {
    return ICONS[id] || '';
}

export const SERVICES: ServiceTemplate[] = [
    {
        id: '5106fdb4-04a3-4659-8d76-54a79fbf45a2',
        name: 'Google Mail',
        url: 'https://mail.google.com/',
        icon: '57f999b3-81f1-4cf1-86cf-05602d772d9a',
        tags: ['google', 'e-mail'],
    },
    {
        id: '2b027a28-172a-4180-bd5a-32070b046b77',
        name: 'Google Calendar',
        url: 'https://calendar.google.com/',
        icon: '6f4dc7af-3173-4dab-b7d3-9d88739f57dc',
        tags: ['google', 'calendar', 'kalender'],
    },
    {
        id: 'b78be8b5-2772-4cc3-bcfa-f05fcfa05f1a',
        name: 'Mattermost',
        url: 'https://mattermost.com/',
        icon: '5bdc9b31-f8e7-4937-a156-33bb6e12cc4f',
        tags: ['chat', 'mm'],
    },
    {
        id: '5ba82927-f8b7-4672-9da1-996b7c2430b3',
        name: 'Spotify',
        url: 'https://spotify.com/',
        icon: '0ff56910-61ef-41b0-b74d-dbf48a9c3472',
        tags: ['spotify', 'music'],
    },
    {
        id: '3cec01fa-fa1b-458f-b1e2-5aafc63286ce',
        name: 'Jira',
        url: 'https://id.atlassian.com/login',
        icon: 'c7c7dfd2-2941-462b-b68b-9d4c800e25e8',
        tags: ['atlassian'],
    },
    {
        id: 'fb0c165e-d6fe-41d7-bec6-41a321347826',
        name: 'Trello',
        url: 'https://trello.com/',
        icon: '06654c77-661b-4955-a163-7fbbd0f81de4',
        tags: ['atlassian'],
    },
    {
        id: '5f8c2fe3-5be6-4f1c-a58d-e7e746db2b0a',
        name: 'Custom Service',
        url: '',
        icon: '173773cb-72de-429f-94db-d382613f436d',
        tags: ['web', 'url', 'empty', 'browser', 'tab'],
    },
];

export function ServiceFromTemplate(template: ServiceTemplate): Service {
    return {
        id: crypto.randomUUID(),
        name: null,
        url: null,
        icon: null,
        template,
    };
}
