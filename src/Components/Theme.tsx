import { Link } from 'react-router';
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

const ThemedButtonStyle = css`
    ${HardFrostedEffectStyle};
    ${ThemedHoverStyle};

    padding: 0.65rem 1rem;
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

export const ThemedInput = styled.input`
    padding: 0.5rem;
    margin: 0;

    border: 0;
    border-radius: 0.5rem;
    outline: none;
`;

const ThemedCheckboxElement = styled.input`
    padding: 0;
    margin: 0;
`;

export function ThemedCheckbox() {
    return (
        <ThemedCheckboxElement type={'checkbox'}/>
    );
}

