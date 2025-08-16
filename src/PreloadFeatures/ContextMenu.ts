import { ipcRenderer } from 'electron';

import { AppMessage } from '../AppMessage';

window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    ipcRenderer.send(AppMessage.ShowContextMenu, { x: event.x, y: event.y });
});
