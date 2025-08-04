import { styled } from 'styled-components';
import React, { CSSProperties } from 'react';

interface ServiceIconProps {
    src: string
    name: string
    size: number
    style?: CSSProperties
}

export function ServiceIcon(props: ServiceIconProps) {
    return (
        <Image
            src={props.src}
            alt={props.name}
            width={props.size}
            height={props.size}
            style={props.style}
        />
    );
}

const Image = styled.img`
    user-select: none;
`;
