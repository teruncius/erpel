import { CSSProperties } from 'react';
import { styled } from 'styled-components';

import icons from '../../resources/icons.svg';

interface IconProps {
    name: 'arrow-left2'
      | 'arrow-right2'
      | 'bin'
      | 'bug'
      | 'checkbox-checked'
      | 'checkbox-unchecked'
      | 'cog'
      | 'cross'
      | 'dropbox'
      | 'floppy-disk'
      | 'folder-download'
      | 'folder-upload'
      | 'home'
      | 'info'
      | 'menu'
    size: number
    style?: CSSProperties
}

export function Icon(props: IconProps) {
    const style = {
        ...props.style,
    };
    return (
        <SVG height={props.size} style={style} width={props.size}>
            <use xlinkHref={`${icons}#icon-${props.name}`}></use>
        </SVG>
    );
}

const SVG = styled.svg`
    display: inline-block;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
`;
