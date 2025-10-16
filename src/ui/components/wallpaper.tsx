import { animated, useSpringRef, useTransition } from "@react-spring/web";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

import { useStore } from "@erpel/ui/store/store";

export function Wallpaper() {
    const timerRef = useRef<NodeJS.Timeout>(null);
    const [index, set] = useState(0);
    const { wallpapers } = useStore();

    const transRef = useSpringRef();
    const transitions = useTransition(index, {
        config: { duration: 1000 },
        enter: { opacity: 1 },
        from: { opacity: 0 },
        leave: { opacity: 1 },
        ref: transRef,
    });

    const handleNext = useCallback(() => {
        if (transRef.current.length === 1) {
            set((last) => (last + 1) % wallpapers.length);
        }
    }, [wallpapers, set, transRef]);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(handleNext, 60000);
        transRef.start();
    }, [wallpapers, index, handleNext, transRef]);

    return transitions((style: CSSProperties, i: number) => {
        return <Image key={i} onClick={handleNext} style={{ ...style, backgroundImage: `url(${wallpapers[i]})` }} />;
    });
}

const Image = styled(animated.div)`
    position: fixed;
    width: 100%;
    height: 100%;
    will-change: opacity;
    cursor: pointer;
    user-select: none;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;
