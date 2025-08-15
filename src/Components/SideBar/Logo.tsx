import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import icon from '../../../resources/erpel.png?no-inline';
import quack from '../../../resources/duck-quacking.mp3?no-inline';
import { useAudio } from '../../Hooks/Audio';
import { NavLink } from 'react-router';
import { useStore } from '../../State/Store/Store';

export function Logo() {
    const [, , play] = useAudio(quack);
    const { isOpen, isMuted } = useStore();

    const handleClick = useCallback(() => {
        if (!isMuted) {
            play();
        }
    }, [isMuted, play]);

    return (
        <LogoLink to="/" title="erpel" onClick={handleClick}>
            {isOpen ? (
                <LogoImageBig src={icon} alt="erpel" width={64} height={64} />
            ) : (
                <LogoImageSmall src={icon} alt="erpel" width={30} height={30} />
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
