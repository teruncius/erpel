import { CSSProperties } from "react";
import { styled } from "styled-components";

import { IconIdToUrl } from "@erpel/state/settings";

interface ServiceIconProps {
    icon: string;
    name: string;
    size: number;
    style?: CSSProperties;
}

export function ServiceIcon(props: ServiceIconProps) {
    return (
        <Image
            alt={props.name}
            height={props.size}
            src={IconIdToUrl(props.icon)}
            style={props.style}
            width={props.size}
            draggable={false}
        />
    );
}

const Image = styled.img`
    user-select: none;
`;
