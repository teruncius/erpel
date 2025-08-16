import { useEffect } from 'react';
import { styled } from 'styled-components';

import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { useStore } from '../../State/Store/Store';
import { Icon } from '../Icon';
import { SetupServices } from '../Setup/SetupServices';
import { ThemedSection } from '../Theme';
import { ThemedLink } from '../Theme/Button';
import { DebugNotificationsButton } from './DebugNotificationsButton';
import { DistractionSettings } from './DistractionSettings';
import { ExportSettingsButton } from './ExportSettingsButton';
import { LocaleSettings } from './LocaleSettings';
import { Services } from './Services';
import { ServiceTemplates } from './ServiceTemplates';
import { WallpaperSettings } from './WallpaperSettings';

declare const window: ElectronWindow;

export function SettingsPage() {
    const { services } = useStore();

    useEffect(() => {
        window.electron.hideAllServices();
    }, []);

    return (
        <>
            {services.length === 0 ? (
                <SetupServices />
            ) : (
                <Services />
            )}
            <ServiceTemplates />
            <LocaleSettings />
            <DistractionSettings />
            <WallpaperSettings />
            <ThemedSection>
                <Container>
                    <ExportSettingsButton />
                    <DebugNotificationsButton />
                    <ThemedLink to="/setup">
                        <Icon name="cog" size={20} />
                        {' '}
                        Go back to set up
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
