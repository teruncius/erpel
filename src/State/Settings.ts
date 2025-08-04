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

export interface Service {
    id: string
    name: string | null
    url: string | null
    icon: string | null
    template: ServiceTemplate
}

export interface ServiceTemplate {
    id: string
    name: string
    url: string
    icon: string
    tags: string[]
}

export const SERVICES: ServiceTemplate[] = [
    {
        id: '5106fdb4-04a3-4659-8d76-54a79fbf45a2',
        name: 'Google Mail',
        url: 'https://mail.google.com/',
        icon: gmail,
        tags: ['google', 'e-mail'],
    },
    {
        id: '2b027a28-172a-4180-bd5a-32070b046b77',
        name: 'Google Calendar',
        url: 'https://calendar.google.com/',
        icon: calendar,
        tags: ['google', 'calendar', 'kalender'],
    },
    {
        id: 'b78be8b5-2772-4cc3-bcfa-f05fcfa05f1a',
        name: 'Mattermost',
        url: 'https://mattermost.com/',
        icon: mm,
        tags: ['chat', 'mm'],
    },
    {
        id: '5ba82927-f8b7-4672-9da1-996b7c2430b3',
        name: 'Spotify',
        url: 'https://spotify.com/',
        icon: spotify,
        tags: ['spotify', 'music'],
    },
    {
        id: '3cec01fa-fa1b-458f-b1e2-5aafc63286ce',
        name: 'Jira',
        url: 'https://id.atlassian.com/login',
        icon: jira,
        tags: ['atlassian'],
    },
    {
        id: 'fb0c165e-d6fe-41d7-bec6-41a321347826',
        name: 'Trello',
        url: 'https://trello.com/',
        icon: trello,
        tags: ['atlassian'],
    },
    {
        id: '5f8c2fe3-5be6-4f1c-a58d-e7e746db2b0a',
        name: 'Custom Service',
        url: '',
        icon: web,
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
