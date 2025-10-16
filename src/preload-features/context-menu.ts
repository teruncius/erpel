import { ipcRenderer } from 'electron';

import { AppMessage } from '../app-message';

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    ipcRenderer.send(AppMessage.ShowContextMenu, { x: event.x, y: event.y });
});
