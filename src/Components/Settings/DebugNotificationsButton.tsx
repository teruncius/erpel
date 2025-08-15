import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { Icon } from '../Icon';
import { ThemedButton } from '../Theme/Button';

declare const window: ElectronWindow;

export function DebugNotificationsButton() {
    const navigate = useNavigate();

    const handleNotify = useCallback(() => {
        const title = 'Settings - erpel';
        const body = 'Debug Test Notification';
        const notification = new Notification(title, { body });
        notification.onclick = () => {
            navigate('/settings');
            window.electron.focusWindow();
        };
    }, [navigate]);

    return (
        <ThemedButton onClick={handleNotify}>
            <Icon name="bug" size={20} />
            <>Test Notification</>
        </ThemedButton>
    );
}
