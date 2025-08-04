import { styled } from 'styled-components';
import React, { CSSProperties } from 'react';
import { ASSETS, Logo } from '../../State/Settings';

type ServiceLogoProps = {
    logo: Logo
    name: string
    size: number
    style?: CSSProperties
}

export function ServiceLogo(props: ServiceLogoProps) {
    return (
        <ServiceLogoImage
            src={getUrlFromLogo(props.logo)}
            alt={props.name}
            width={props.size}
            height={props.size}
            style={props.style}
        />
    );
}

function getUrlFromLogo(logo: Logo) {
    if (logo.type === 'user') {
        return logo.path;
    }
    if (logo.type === 'asset') {
        return ASSETS[logo.id];
    }
}

const ServiceLogoImage = styled.img`
    user-select: none;
`;
