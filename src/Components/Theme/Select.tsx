import { SelectHTMLAttributes } from 'react';
import { styled } from 'styled-components';

import { FrostedContainerStyle, HardFrostedEffectStyle, ThemedHoverStyle } from '../Theme';

interface ThemedSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    options: string[]
}

export function ThemedSelect(props: ThemedSelectProps) {
    return (
        <Container>
            <label htmlFor={props.id}>{props.label}</label>
            <Select id={props.id} onChange={props.onChange} value={props.value}>
                {props.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </Select>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Select = styled.select`
    ${HardFrostedEffectStyle};
    ${ThemedHoverStyle};

    padding: 0.5rem calc(1.618rem / 2);
    margin: 0;
    width: 100%;

    border: none;
    border-radius: 0.5rem;
    appearance: base-select;
    color: #ffffff;
    cursor: pointer;

    &::picker(select) {
        ${FrostedContainerStyle};

        padding: 0.5rem;
        margin: 0.5rem 0 0.5rem 0;

        border: none;
        border-radius: 0.5rem;
        appearance: base-select;
        color: #ffffff;
    }

    & option {
        padding: 0.5rem;
        margin: 0;
        border-radius: 0.5rem;
    }
`;
