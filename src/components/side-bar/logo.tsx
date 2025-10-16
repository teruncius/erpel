import { useCallback } from 'react';
import { NavLink } from 'react-router';
import { styled } from 'styled-components';

import quack from '../../../resources/duck-quacking.mp3?no-inline';
import icon from '../../../resources/erpel.png?no-inline';
import { useAudio } from '../../hooks/audio';
import { useStore } from '../../state/store/store';

export function Logo() {
    const [, , play] = useAudio(quack);
    const { isMuted, isOpen } = useStore();

    const handleClick = useCallback(() => {
        if (!isMuted) {
            play();
        }
    }, [isMuted, play]);

    return (
        <LogoLink onClick={handleClick} title="erpel" to="/">
            {isOpen ? (
                <LogoImageBig alt="erpel" height={64} src={icon} width={64} />
            ) : (
                <LogoImageSmall alt="erpel" height={30} src={icon} width={30} />
            )}
        </LogoLink>
    );
}

const LogoLink = styled(NavLink)`
    margin: 1rem auto;
    outline: none;
`;

const LogoImageBig = styled.img`
    width: 64px;
    height: 64px;
    margin: 1rem auto;
    padding: 0;
    
    cursor: pointer;
    border-radius: 50%;
    background: #202020;
`;

const LogoImageSmall = styled.img`
    width: 30px;
    height: 30px;
    margin: 32px 0 32px 0;
    padding: 0;
    
    cursor: pointer;
    border-radius: 50%;
    background: #202020;
`;
