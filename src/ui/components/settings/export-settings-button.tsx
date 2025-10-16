import { useCallback } from 'react';

import { ElectronWindow } from '../../../preload-features/app-bridge';
import { Icon } from '../icon';
import { ThemedButton } from '../theme/button';

declare const window: ElectronWindow;

export function ExportSettingsButton() {
    const handleExport = useCallback(() => {
        let alive = true;
        const load = async () => {
            const data = await window.electron.loadConfig();
            if (!alive) {
                return;
            }

            const json = JSON.stringify(data, null, 4);
            const file = new Blob([json], { type: 'application/json' });

            const element = document.createElement('a');
            element.href = URL.createObjectURL(file);
            element.download = 'config.json';
            element.click();
        };

        load().catch(console.error);

        return () => {
            alive = false;
        };
    }, []);

    return (
        <ThemedButton onClick={handleExport}>
            <Icon name="folder-download" size={20} />
            <>Export settings</>
        </ThemedButton>
    );
}
