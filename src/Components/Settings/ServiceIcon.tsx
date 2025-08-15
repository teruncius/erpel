import { styled } from 'styled-components';
import React, { CSSProperties } from 'react';
import { IconIdToUrl } from '../../State/Settings';

interface ServiceIconProps {
    icon: string
    name: string
    size: number
    style?: CSSProperties
}

export function ServiceIcon(props: ServiceIconProps) {
    return (
        <Image
            src={IconIdToUrl(props.icon)}
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
