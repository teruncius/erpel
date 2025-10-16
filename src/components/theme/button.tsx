import { Link } from 'react-router';
import { css, styled } from 'styled-components';

import { HardFrostedEffectStyle, ThemedHoverStyle } from '../theme';

const ThemedButtonStyle = css`
    ${HardFrostedEffectStyle};
    ${ThemedHoverStyle};

    padding: 0.5rem calc(1.618rem / 2);
    margin: 0;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    color: #fff;
    border: 0;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;

    filter: brightness(1.0);

    &:hover {
        filter: brightness(1.2);
    }
`;

export const ThemedButton = styled.button`
    ${ThemedButtonStyle};
`;

export const ThemedLink = styled(Link)`
    ${ThemedButtonStyle};
    text-decoration: none;
`;
