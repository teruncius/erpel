import { ChangeEvent, useCallback } from 'react';

import { useStore } from '../../State/Store/Store';
import { ThemedSection } from '../Theme';
import { ThemedCheckbox } from '../Theme/Checkbox';

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
