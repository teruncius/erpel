import { useState, useEffect } from 'react';

type Hook = [
    boolean,
    () => void,
    () => void,
]

export const useAudio = (url: string): Hook => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);
    const play = () => setPlaying(true);

    useEffect(() => {
        if (playing) {
            audio.pause();
        } else {
            audio.play();
        }
    }, [playing]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle, play];
};
