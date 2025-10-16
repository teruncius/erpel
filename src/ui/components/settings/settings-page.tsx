import { useEffect } from 'react';
import { styled } from 'styled-components';

import { ElectronWindow } from '../../../preload-features/app-bridge';
import { useStore } from '../../store/store';
import { Icon } from '../icon';
import { SetupServices } from '../setup/setup-services';
import { ThemedSection } from '../theme';
import { ThemedLink } from '../theme/button';
import { DebugNotificationsButton } from './debug-notifications-button';
import { DistractionSettings } from './distraction-settings';
import { ExportSettingsButton } from './export-settings-button';
import { LocaleSettings } from './locale-settings';
import { ServiceTemplates } from './service-templates';
import { Services } from './services';
import { WallpaperSettings } from './wallpaper-settings';

declare const window: ElectronWindow;

export function SettingsPage() {
    const { services } = useStore();

    useEffect(() => {
        window.electron.hideAllServices();
    }, []);

    return (
        <>
            {services.length === 0 ? <SetupServices /> : <Services />}
            <ServiceTemplates />
            <LocaleSettings />
            <DistractionSettings />
            <WallpaperSettings />
            <ThemedSection>
                <Container>
                    <ExportSettingsButton />
                    <DebugNotificationsButton />
                    <ThemedLink to="/setup">
                        <Icon name="cog" size={20} /> Go back to set up
                    </ThemedLink>
                </Container>
            </ThemedSection>
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 0.5rem;

    @media screen and (max-width: 1000px) {
        display: grid;
        grid-template-columns: 1fr;
    }
`;
