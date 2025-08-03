import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { animated, useSpringRef, useTransition } from '@react-spring/web';
import { styled } from 'styled-components';

const wallpapers = [
    'https://images.unsplash.com/photo-1752520316159-741a8d0bde1d',
    'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5',
    'https://images.unsplash.com/photo-1537819191377-d3305ffddce4',
    'https://images.unsplash.com/photo-1538370965046-79c0d6907d47',
    'https://images.unsplash.com/photo-1472712739516-7ad2b786e1f7',
    'https://images.unsplash.com/photo-1630839437035-dac17da580d0',
    'https://images.unsplash.com/photo-1656842741176-538dbdcd2682',
];

export function Wallpaper() {
    const timerRef = useRef<NodeJS.Timeout>(null);
    const [index, set] = useState(0);

    const transRef = useSpringRef();
    const transitions = useTransition(index, {
        ref: transRef,
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 1 },
        config: { duration: 1000 },
    });

    const handleNext = useCallback(() => {
        if (transRef.current.length === 1) {
            set((last) => (last + 1) % wallpapers.length);
        }
    }, [set]);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(handleNext, 60000);
        transRef.start();
    }, [timerRef, transRef, index]);

    return transitions((style: CSSProperties, i: number) => {
        return <Image key={i} style={{ ...style, backgroundImage: `url(${wallpapers[i]})` }} onClick={handleNext}/>;
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
