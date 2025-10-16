import { css, styled } from 'styled-components';

export const SoftFrostedEffectStyle = css`
    background: #ffffff08;
    backdrop-filter: blur(16px);
`;

export const HardFrostedEffectStyle = css`
    background: #ffffff1f;
    backdrop-filter: blur(16px);
`;

export const FrostedContainerStyle = css`
    ${SoftFrostedEffectStyle};
    box-shadow: 0 4px 16px #0000007f;   
`;

export const ThemedHoverStyle = css`
    transition: box-shadow 0.1s;
    box-shadow: none;
    &:hover {
        box-shadow: 0 4px 8px #0000007f;
    }
`;

export const ThemedSection = styled.div`
    ${FrostedContainerStyle};
    
    margin: 0;
    padding: 1rem;
    
    border-radius: 1rem;
`;
