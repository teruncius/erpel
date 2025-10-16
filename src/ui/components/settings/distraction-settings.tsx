import { ChangeEvent, useCallback } from 'react';

import { useStore } from '../../store/store';
import { ThemedSection } from '../theme';
import { ThemedCheckbox } from '../theme/checkbox';

export function DistractionSettings() {
    const { isMuted, setIsMuted } = useStore();

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setIsMuted(e.target.checked);
    }, [setIsMuted]);

    return (
        <ThemedSection>
            <ThemedCheckbox
                checked={isMuted}
                onChange={handleChange}
                placeholder="Mute the duck"
            />
        </ThemedSection>
    );
}
