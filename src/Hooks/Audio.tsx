import { useCallback, useEffect, useState } from 'react';

type Hook = [
    boolean,
    () => void,
    () => void,
];

export const useAudio = (url: string): Hook => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = useCallback(() => {
        setPlaying((state) => !state);
    }, [setPlaying]);

    const play = useCallback(() => {
        setPlaying(true);
    }, [setPlaying]);

    useEffect(() => {
        if (playing) {
            audio.play().catch(console.error);
        }
        else {
            audio.pause();
        }
    }, [audio, playing]);

    useEffect(() => {
        const onEnded = () => setPlaying(false);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [audio, setPlaying]);

    return [playing, toggle, play];
};
