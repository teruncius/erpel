import { useCallback } from "react";
import { NavLink } from "react-router";
import { styled } from "styled-components";

import quack from "@erpel/resources/duck-quacking.mp3?no-inline";
import icon from "@erpel/resources/erpel.png?no-inline";
import { useAudio } from "@erpel/ui/hooks/audio";
import { useStore } from "@erpel/ui/store/store";

export function Logo() {
    const [, , play] = useAudio(quack);
    const { isMuted, isOpen } = useStore();

    const handleClick = useCallback(() => {
        if (!isMuted) {
            play();
        }
    }, [isMuted, play]);

    return (
        <LogoLink onClick={handleClick} title="erpel" to="/" draggable={false}>
            {isOpen ? (
                <LogoImageBig alt="erpel" height={64} src={icon} width={64} draggable={false} />
            ) : (
                <LogoImageSmall alt="erpel" height={30} src={icon} width={30} draggable={false} />
            )}
        </LogoLink>
    );
}

const LogoLink = styled(NavLink)`
    margin: 1rem auto;
    outline: none;

    user-select: none;
`;

const LogoImageBig = styled.img`
    width: 64px;
    height: 64px;
    margin: 1rem auto;
    padding: 0;

    user-select: none;

    cursor: pointer;
    border-radius: 50%;
    background: #202020;
`;

const LogoImageSmall = styled.img`
    width: 30px;
    height: 30px;
    margin: 32px 0 32px 0;
    padding: 0;

    user-select: none;

    cursor: pointer;
    border-radius: 50%;
    background: #202020;
`;
