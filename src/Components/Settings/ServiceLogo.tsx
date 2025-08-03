import { styled } from 'styled-components';
import React, { CSSProperties } from 'react';

type ServiceLogoProps = {
    url: string
    name: string
    size: number
    style?: CSSProperties
}

export function ServiceLogo(props: ServiceLogoProps) {
    return (
        <ServiceLogoImage
            src={props.url}
            alt={props.name}
            width={props.size}
            height={props.size}
            style={props.style}
        />
    );
}

const ServiceLogoImage = styled.img`
    user-select: none;
`;
