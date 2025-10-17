import { ChangeEvent, useCallback } from "react";
import { styled } from "styled-components";

import { BackgroundMode, DEFAULT_WALLPAPERS } from "@erpel/state/settings";
import { Icon } from "@erpel/ui/components/icon";
import { ThemedSection } from "@erpel/ui/components/theme";
import { ThemedButton } from "@erpel/ui/components/theme/button";
import { ThemedSelect } from "@erpel/ui/components/theme/select";
import { ThemedTextarea } from "@erpel/ui/components/theme/textarea";
import { useStore } from "@erpel/ui/store/store";

const modes = [BackgroundMode.Color, BackgroundMode.Wallpaper];

export function WallpaperSettings() {
    const { mode, setMode, setWallpapers, wallpapers } = useStore();

    const handleChangeMode = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            // TODO: parse value into enum
            setMode(e.target.value as BackgroundMode);
        },
        [setMode]
    );

    const handleChangeUrls = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            setWallpapers(e.target.value.split("\n"));
        },
        [setWallpapers]
    );

    const handleReset = useCallback(() => {
        setWallpapers(DEFAULT_WALLPAPERS);
    }, [setWallpapers]);

    return (
        <ThemedSection>
            <Container>
                <ThemedSelect label="Background mode" onChange={handleChangeMode} options={modes} value={mode} />

                {mode === BackgroundMode.Wallpaper && (
                    <>
                        <div>
                            <ThemedButton onClick={handleReset}>
                                <Icon name="bug" size={20} />
                                <>Reset</>
                            </ThemedButton>
                        </div>
                        <ThemedTextarea onChange={handleChangeUrls} value={wallpapers.join("\n")} />
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
