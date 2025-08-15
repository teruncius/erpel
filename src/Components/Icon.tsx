import icons from '../../resources/icons.svg';
import React, { CSSProperties } from 'react';
import { styled } from 'styled-components';

interface IconProps {
    name: 'cog'
      | 'arrow-right2' | 'arrow-left2'
      | 'home'
      | 'menu'
      | 'bin'
      | 'dropbox'
      | 'folder-upload' | 'folder-download'
      | 'cross'
      | 'info'
      | 'bug'
      | 'floppy-disk'
      | 'checkbox-checked' | 'checkbox-unchecked'
    size: number
    style?: CSSProperties
}

export function Icon(props: IconProps) {
    const style = {
        ...props.style,
    };
    return (
        <SVG width={props.size} height={props.size} style={style}>
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
