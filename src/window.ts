import { join } from 'node:path';
import { BrowserWindow, ipcMain, Menu, Rectangle, WebContentsView, clipboard, shell, IpcMainEvent } from 'electron';
import icon from '../resources/erpel.png?asset';
import { SIDEBAR_WIDTH_CLOSED, SIDEBAR_WIDTH_OPEN } from './Components/SideBar/SideBar';
import { AppMessage } from './AppMessage';
import { loadUserData, saveUserData } from './UserData';
import type { Service } from './State/Settings';

const SESSION_PARTITION = `persist:${import.meta.env.DEV ? 'development' : 'production'}`;

export const createWindow = async () => {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 1200,
        height: 800,
        icon,
        backgroundColor: '#000000',
        webPreferences: {
            preload: join(__dirname, 'preload.application.js'),
            partition: SESSION_PARTITION,
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        window.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    const views: Record<string, WebContentsView> = {};
    let userData = await loadUserData();
    let sideBarIsOpen = true;

    userData.services.forEach(createViewForService);

    ipcMain.on(AppMessage.SaveUserData, (event, data) => {
        userData = data;
        saveUserData(data);
    });

    ipcMain.handle(AppMessage.LoadUserData, () => {
        return loadUserData();
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
            event,
            data,
            isServiceWindow: event.sender === window.webContents,
        });
        menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
    });

    window.on('resize', resizeServices);
    window.on('show', window.focus);

    function createViewForService(service: Service) {
        const bounds = window.getContentBounds();
        const view = new WebContentsView({
            webPreferences: {
                preload: join(__dirname, '/preload.service.js'),
                partition: SESSION_PARTITION,
            },
        });

        view.setBackgroundColor('#000000');
        view.setVisible(false);
        view.setBounds(CalculateBounds(bounds, sideBarIsOpen));
        view.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });

        views[service.id] = view;
        window.contentView.addChildView(view);
        view.webContents.loadURL(service.url || service.template.url);
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
    event: IpcMainEvent
    data: {
        x: number
        y: number
    }
    isServiceWindow: boolean
}

function buildMenuForSender({ event, data, isServiceWindow }: BuildMenuOptions) {
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
            label: 'Copy URL',
            click: () => {
                clipboard.writeText(event.sender.getURL());
            },
        },
        {
            label: 'Open in Browser',
            click: () => {
                shell.openExternal(event.sender.getURL());
            },
        }]),
        {
            type: 'separator',
        },
        {
            label: 'Reload',
            click: () => {
                event.sender.reloadIgnoringCache();
            },
        },
        {
            label: 'Developer Tools',
            click: () => {
                event.sender.openDevTools({ mode: 'bottom' });
            },
        },
        {
            label: 'Inspect Element',
            click: () => {
                event.sender.openDevTools({ mode: 'bottom' });
                event.sender.inspectElement(data.x, data.y);
            },
        },
    ]);
}

function CalculateBounds(bounds: Rectangle, isOpen: boolean) {
    return {
        x: isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED,
        y: 0,
        width: bounds.width - (isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED),
        height: bounds.height,
    };
}
