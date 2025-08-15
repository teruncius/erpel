import { styled } from 'styled-components';
import { ThemedSection } from '../Theme';
import { Icon } from '../Icon';
import { useCallback } from 'react';
import { useStore } from '../../State/Store/Store';
import { Hint } from '../Theme/Hint';
import { ThemedButton, ThemedLink } from '../Theme/Button';
import { Config } from '../../State/Schema';

const FILE_OPTIONS = {
    types: [
        {
            description: 'JSON Config Files',
            accept: {
                'application/json': ['.json'],
            },
        },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
};

interface FileSystemFileHandle {
    getFile: () => Promise<File>
}

// TODO: update typescript defs, check if method exists in new version
export interface CustomWindow extends Window {
    showOpenFilePicker: (options: typeof FILE_OPTIONS) => Promise<FileSystemFileHandle[]>
}

declare const window: CustomWindow;

export function SetupServices() {
    const { loadServicesFromPreset, loadServicesFromFile, loadSettingsFromFile } = useStore();

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
                    title="Set up your services"
                    text="You have not added any services yet. Please use one of the options below to continue."
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
