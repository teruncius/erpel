import { Link } from 'react-router';
import { css, styled } from 'styled-components';
import { ChangeEvent, InputHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

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

type ThemedCheckbox = InputHTMLAttributes<HTMLInputElement> & {
    checked: boolean
}

export function ThemedCheckbox(props: ThemedCheckbox) {
    const { onChange  } = props;
    const ref = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState<boolean>(props.checked);

    useEffect(() => {
        if (onChange) {
            onChange({ target: { value: checked } });
        }
    }, [checked, onChange]);

    const handleClick = useCallback(() => {
        setChecked((state) => !state);
    }, [ref.current]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
    }, [ref.current]);

    return (
        <ThemedCheckboxContainer>
            <ThemedCheckboxButton onClick={handleClick} type={'button'}>
                <Icon name={ref.current?.checked ? 'checkbox-checked' : 'checkbox-unchecked'} size={16}/>
            </ThemedCheckboxButton>
            {props.placeholder && (
                <>{props.placeholder}</>
            )}
            <input
                id={props.id}
                ref={ref}
                type={'checkbox'}
                style={{ display: 'none' }}
                value="on"
                checked={checked}
                onChange={handleChange}
            />
        </ThemedCheckboxContainer>
    );
}

const ThemedCheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
`;

const ThemedCheckboxButton = styled(ThemedButton)`
    padding: 0.5rem;
`;
