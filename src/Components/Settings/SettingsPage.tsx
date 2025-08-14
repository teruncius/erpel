import React, { useEffect } from 'react';
import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { Services } from './Services';
import { ServiceTemplates } from './ServiceTemplates';
import { ThemedSection } from '../Theme';
import { SetupServices } from '../Setup/SetupServices';
import { useStore } from '../../State/Store/Store';
import { ExportSettingsButton } from './ExportSettingsButton';
import { DebugNotificationsButton } from './DebugNotificationsButton';
import { styled } from 'styled-components';
import { Icon } from '../Icon';
import { LocaleSettings } from './LocaleSettings';
import { DistractionSettings } from './DistractionSettings';

import { ThemedLink } from '../Theme/Button';

declare const window: ElectronWindow;

export function SettingsPage() {
    const { services } = useStore();

    useEffect(() => {
        window.electron.hideAllServices();
    }, []);

    return (
        <>
            {services.length === 0 ? (
                <SetupServices/>
            ): (
                <Services/>
            )}
            <ServiceTemplates/>

            <LocaleSettings/>

            <DistractionSettings/>

            <ThemedSection>
                <Container>
                    <ExportSettingsButton/>
                    <DebugNotificationsButton/>
                    <ThemedLink to={'/setup'}>
                        <Icon name={'cog'} size={20}/> Go back to set up
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
