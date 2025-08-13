import { ThemedCheckbox, ThemedSection } from '../Theme';
import { useStore } from '../../State/Store/Store';
import { ChangeEvent, useCallback } from 'react';

export function DistractionSettings() {
    const { isMuted, setIsMuted } = useStore();

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setIsMuted(e.target.value);
    }, [setIsMuted]);

    return (
        <ThemedSection>
            <ThemedCheckbox
                onChange={handleChange}
                checked={isMuted}
                placeholder="Mute the duck"
            />
        </ThemedSection>
    );
}
