import { ThemedSection } from '../Theme';
import { ThemedSelect } from '../Theme/Select';
import { BackgroundMode, DEFAULT_WALLPAPERS } from '../../State/Settings';
import { useStore } from '../../State/Store/Store';
import { ChangeEvent, useCallback } from 'react';
import { ThemedTextarea } from '../Theme/Textarea';
import { styled } from 'styled-components';
import { ThemedButton } from '../Theme/Button';
import { Icon } from '../Icon';

const modes = [
    BackgroundMode.Color,
    BackgroundMode.Wallpaper,
];

export function WallpaperSettings() {
    const { mode, setMode, wallpapers, setWallpapers } = useStore();

    const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        // TODO: parse value into enum
        setMode(e.target.value as BackgroundMode);
    }, [setMode]);

    const handleChange2 = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setWallpapers(e.target.value.split('\n'));
    }, [setWallpapers]);

    const handleReset = useCallback(() => {
        setWallpapers(DEFAULT_WALLPAPERS);
    }, [setWallpapers]);

    return (
        <ThemedSection>
            <Container>
                <ThemedSelect label={'Background mode'} value={mode} onChange={handleChange} options={modes}/>

                {mode === BackgroundMode.Wallpaper && (
                    <>
                        <div>
                            <ThemedButton onClick={handleReset}>
                                <Icon name={'bug'} size={20}/>
                                <>Reset</>
                            </ThemedButton>
                        </div>
                        <ThemedTextarea value={wallpapers.join('\n')} onChange={handleChange2}/>
                    </>
                )}
            </Container>
        </ThemedSection>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
