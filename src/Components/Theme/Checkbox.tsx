import { ChangeEvent, InputHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { Icon } from '../Icon';
import { ThemedButton } from './Button';

type ThemedCheckbox = {
    checked: boolean
} & InputHTMLAttributes<HTMLInputElement>;

export function ThemedCheckbox(props: ThemedCheckbox) {
    const { onChange } = props;
    const [checked, setChecked] = useState<boolean>(props.checked);

    useEffect(() => {
        if (onChange) {
            // TODO: fix handling of checked & value
            // TODO: fix creating of event
            onChange({ target: { checked, value: checked } });
        }
    }, [checked, onChange]);

    const handleClick = useCallback(() => {
        setChecked((state) => !state);
    }, [setChecked]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
    }, [setChecked]);

    return (
        <ThemedCheckboxContainer>
            <ThemedCheckboxButton onClick={handleClick} type="button">
                <Icon name={checked ? 'checkbox-checked' : 'checkbox-unchecked'} size={16} />
            </ThemedCheckboxButton>
            {props.placeholder && (
                <>{props.placeholder}</>
            )}
            <input
                checked={checked}
                id={props.id}
                onChange={handleChange}
                style={{ display: 'none' }}
                type="checkbox"
                value="on"
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
