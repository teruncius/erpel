import React, { useEffect } from 'react';
import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { CurrentServices } from './CurrentServices';
import { AvailableServices } from './AvailableServices';
import { ThemedLink, ThemedSection } from '../Theme';
import { SetupServices } from '../Setup/SetupServices';
import { useStore } from '../../State/Store';
import { ExportSettings } from './ExportSettings';
import { DebugNotifications } from './DebugNotifications';
import { styled } from 'styled-components';
import { Icon } from '../Icon';

declare const window: ElectronWindow;

export function SettingsPage() {
    const { currentServices } = useStore();

    useEffect(() => {
        window.electron.hideAllServices();
    }, []);

    return (
        <>
            {currentServices.length === 0 && (
                <SetupServices/>
            )}
            {currentServices.length > 0 && (
                <ThemedSection>
                    <CurrentServices/>
                </ThemedSection>
            )}
            <ThemedSection>
                <AvailableServices/>
            </ThemedSection>
            <ThemedSection>
                <Container>
                    <ExportSettings/>
                    <DebugNotifications/>
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
