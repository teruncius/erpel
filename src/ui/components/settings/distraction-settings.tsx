import { ChangeEvent, useCallback } from "react";

import { ThemedSection } from "@erpel/ui/components/theme";
import { ThemedCheckbox } from "@erpel/ui/components/theme/checkbox";
import { useStore } from "@erpel/ui/store/store";

export function DistractionSettings() {
    const { isMuted, setIsMuted } = useStore();

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setIsMuted(e.target.checked);
        },
        [setIsMuted]
    );

    return (
        <ThemedSection>
            <ThemedCheckbox checked={isMuted} onChange={handleChange} placeholder="Mute the duck" />
        </ThemedSection>
    );
}
