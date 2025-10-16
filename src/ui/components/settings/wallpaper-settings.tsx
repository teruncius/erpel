import { ChangeEvent, useCallback } from 'react';
import { styled } from 'styled-components';

import { BackgroundMode, DEFAULT_WALLPAPERS } from '../../../state/settings';
import { useStore } from '../../store/store';
import { Icon } from '../icon';
import { ThemedSection } from '../theme';
import { ThemedButton } from '../theme/button';
import { ThemedSelect } from '../theme/select';
import { ThemedTextarea } from '../theme/textarea';

const modes = [BackgroundMode.Color, BackgroundMode.Wallpaper];

export function WallpaperSettings() {
    const { mode, setMode, setWallpapers, wallpapers } = useStore();

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            // TODO: parse value into enum
            setMode(e.target.value as BackgroundMode);
        },
        [setMode]
    );

    const handleChange2 = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            setWallpapers(e.target.value.split('\n'));
        },
        [setWallpapers]
    );

    const handleReset = useCallback(() => {
        setWallpapers(DEFAULT_WALLPAPERS);
    }, [setWallpapers]);

    return (
        <ThemedSection>
            <Container>
                <ThemedSelect label="Background mode" onChange={handleChange} options={modes} value={mode} />

                {mode === BackgroundMode.Wallpaper && (
                    <>
                        <div>
                            <ThemedButton onClick={handleReset}>
                                <Icon name="bug" size={20} />
                                <>Reset</>
                            </ThemedButton>
                        </div>
                        <ThemedTextarea onChange={handleChange2} value={wallpapers.join('\n')} />
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
