import {
    app,
    BrowserWindow,
    clipboard,
    ipcMain,
    IpcMainEvent,
    Menu,
    Rectangle,
    shell,
    WebContentsView,
} from 'electron';
import { join } from 'node:path';

import type { Service } from './state/schema';

import icon from '../resources/erpel.png?asset';
import { AppMessage } from './app-message';
import { SIDEBAR_WIDTH_CLOSED, SIDEBAR_WIDTH_OPEN } from './components/side-bar/side-bar';
import { loadConfig, saveConfig } from './state/config';

const CONFIG_PATH = join(app.getPath('userData'), 'config.json');
const SESSION_PARTITION = `persist:${import.meta.env.DEV ? 'development' : 'production'}`;

export const createWindow = async () => {
    // Create the browser window.
    const window = new BrowserWindow({
        backgroundColor: '#000000',
        height: 800,
        icon,
        webPreferences: {
            partition: SESSION_PARTITION,
            preload: join(__dirname, 'preload.application.js'),
        },
        width: 1200,
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    }
    else {
        window.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    const views: Record<string, WebContentsView> = {};
    let config = await loadConfig(CONFIG_PATH);
    let sideBarIsOpen = true;

    config.services.forEach(createViewForService);

    ipcMain.on(AppMessage.SaveConfig, (event, data) => {
        config = data;
        saveConfig(CONFIG_PATH, config);
    });

    ipcMain.handle(AppMessage.LoadConfig, () => {
        return config;
    });

    ipcMain.handle(AppMessage.ShouldUseDarkMode, (event) => {
        const id = Object.entries(views).find(([, view]) => view.webContents === event.sender)?.[0] || null;
        if (!id) {
            console.error('Requested dark mode for a service that does not exist');
            return false;
        }
        const service = config.services.find((service) => service.id === id) || null;
        return service?.darkMode ?? service?.template.darkMode.default ?? false;
    });

    ipcMain.on(AppMessage.AddService, (event, service) => {
        createViewForService(service);
    });

    ipcMain.on(AppMessage.RemoveService, (event, id) => {
        const view = views[id] || null;
        if (view) {
            view.webContents.close({ waitForBeforeUnload: false });
            delete views[id];
        }
    });

    ipcMain.on(AppMessage.ActivateService, (event, id) => {
        focusService(id);
    });

    ipcMain.on(AppMessage.HideAllServices, () => {
        Object.entries(views).forEach(([, view]) => {
            view.setVisible(false);
        });
    });

    ipcMain.on(AppMessage.FocusWindow, (event, id: string | undefined) => {
        if (id) {
            focusService(id);
        }
        window.show();
    });

    ipcMain.on(AppMessage.SetSideBarState, (event, isOpen) => {
        sideBarIsOpen = isOpen;
        resizeServices();
    });

    ipcMain.on(AppMessage.ShowContextMenu, (event, data) => {
        const menu = buildMenuForSender({
            data,
            event,
            isServiceWindow: event.sender === window.webContents,
        });
        const popup = BrowserWindow.fromWebContents(event.sender);
        if (!popup) {
            throw new Error('Failed to create popup window for context menu');
        }
        menu.popup({ window: popup });
    });

    window.on('resize', resizeServices);
    window.on('show', window.focus);

    function createViewForService(service: Service) {
        const bounds = window.getContentBounds();
        const view = new WebContentsView({
            webPreferences: {
                partition: SESSION_PARTITION,
                preload: join(__dirname, '/preload.service.js'),
            },
        });

        const darkMode = service.darkMode ?? service.template.darkMode.default;
        view.setBackgroundColor(darkMode ? '#000000' : '#ffffff');
        view.setVisible(false);
        view.setBounds(CalculateBounds(bounds, sideBarIsOpen));
        view.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });

        views[service.id] = view;
        window.contentView.addChildView(view);

        const url = service.url || service.template.url.default;
        view.webContents.loadURL(url);
    }

    function resizeServices() {
        const bounds = window.getContentBounds();
        Object.entries(views).forEach(([, view]) => {
            view.setBounds(CalculateBounds(bounds, sideBarIsOpen));
        });
    }

    function focusService(serviceId: string) {
        Object.entries(views).forEach(([id, view]) => {
            view.setVisible(id === serviceId);
        });
    }
};

interface BuildMenuOptions {
    data: {
        x: number
        y: number
    }
    event: IpcMainEvent
    isServiceWindow: boolean
}

function buildMenuForSender({ data, event, isServiceWindow }: BuildMenuOptions) {
    return Menu.buildFromTemplate([
        {
            role: 'cut',
        },
        {
            role: 'copy',
        },
        {
            role: 'paste',
        },
        {
            type: 'separator',
        },
        ...(!isServiceWindow ? [] : [{
            click: () => {
                clipboard.writeText(event.sender.getURL());
            },
            label: 'Copy URL',
        },
        {
            click: () => {
                shell.openExternal(event.sender.getURL());
            },
            label: 'Open in Browser',
        }]),
        {
            type: 'separator',
        },
        {
            click: () => {
                event.sender.reloadIgnoringCache();
            },
            label: 'Reload',
        },
        {
            click: () => {
                event.sender.openDevTools({ mode: 'bottom' });
            },
            label: 'Developer Tools',
        },
        {
            click: () => {
                event.sender.openDevTools({ mode: 'bottom' });
                event.sender.inspectElement(data.x, data.y);
            },
            label: 'Inspect Element',
        },
    ]);
}

function CalculateBounds(bounds: Rectangle, isOpen: boolean) {
    return {
        height: bounds.height,
        width: bounds.width - (isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED),
        x: isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED,
        y: 0,
    };
}
