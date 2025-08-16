import { styled } from 'styled-components';

import { HardFrostedEffectStyle } from '../Theme';

export const ThemedInput = styled.input`
    ${HardFrostedEffectStyle};

    padding: 0.5rem calc(1.618rem / 2);
    margin: 0;

    border: 0;
    border-radius: 0.5rem;
    font-size: 1rem;
    outline: none;
    color: #ffffff;

    &::placeholder {
        color: #ffffff;
        font-style: italic;
    }
`;
