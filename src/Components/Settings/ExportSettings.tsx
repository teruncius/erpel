import React, { useCallback } from 'react';
import { Icon } from '../Icon';
import { ThemedButton } from '../Theme';
import { ElectronWindow } from '../../PreloadFeatures/AppBridge';

declare const window: ElectronWindow;

export function ExportSettings() {
    const handleExport = useCallback(() => {
        let alive = true;
        const load = async () => {
            const data = await window.electron.loadData();
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

        load();

        return () => {
            alive = false;
        };
    }, []);

    return (
        <ThemedButton onClick={handleExport}>
            <Icon name={'folder-download'} size={20}/>
            <>Export settings</>
        </ThemedButton>
    );
}
