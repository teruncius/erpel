import { useCallback } from 'react';
import { styled } from 'styled-components';

import { Config } from '../../../state/schema';
import { useStore } from '../../store/store';
import { Icon } from '../icon';
import { ThemedSection } from '../theme';
import { ThemedButton, ThemedLink } from '../theme/button';
import { Hint } from '../theme/hint';

const FILE_OPTIONS = {
    excludeAcceptAllOption: true,
    multiple: false,
    types: [
        {
            accept: {
                'application/json': ['.json'],
            },
            description: 'JSON Config Files',
        },
    ],
};

// TODO: update typescript defs, check if method exists in new version
export interface CustomWindow extends Window {
    showOpenFilePicker: (options: typeof FILE_OPTIONS) => Promise<FileSystemFileHandle[]>
}

interface FileSystemFileHandle {
    getFile: () => Promise<File>
}

declare const window: CustomWindow;

export function SetupServices() {
    const { loadServicesFromFile, loadServicesFromPreset, loadSettingsFromFile } = useStore();

    const handleUsePreset = useCallback(() => {
        loadServicesFromPreset();
    }, [loadServicesFromPreset]);

    const handleUseConfigFile = useCallback(() => {
        let alive = true;
        const upload = async () => {
            const [handle] = await window.showOpenFilePicker(FILE_OPTIONS);
            if (!alive) {
                return;
            }
            const file = await handle.getFile();
            if (!alive) {
                return;
            }
            const text = await file.text();
            if (!alive) {
                return;
            }
            const data: Config = JSON.parse(text);
            // TODO: validation & filter & migrate
            // TODO: set all fields
            loadServicesFromFile(data.services || []);
            loadSettingsFromFile(data);
        };

        upload().catch(console.error);

        return () => {
            alive = false;
        };
    }, [loadServicesFromFile]);

    return (
        <>
            <Container>
                <Hint
                    text="You have not added any services yet. Please use one of the options below to continue."
                    title="Set up your services"
                />
            </Container>
            <Container>
                <SetupSelections>
                    <ThemedButton onClick={handleUsePreset}>
                        <Icon name="dropbox" size={20} />
                        Use a preset
                    </ThemedButton>
                    <ThemedButton onClick={handleUseConfigFile}>
                        <Icon name="folder-upload" size={20} />
                        Upload a config file
                    </ThemedButton>
                    <ThemedLink to="/settings">
                        <Icon name="cog" size={20} />
                        Start from scratch
                    </ThemedLink>
                </SetupSelections>
            </Container>
        </>
    );
}

const Container = styled(ThemedSection)`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    color: #fff;
`;

const SetupSelections = styled.div`
    width: 100%;
    
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    gap: 0.5rem;

    @media screen and (max-width: 1000px) {
        grid-template-columns: 1fr;
    }
`;
