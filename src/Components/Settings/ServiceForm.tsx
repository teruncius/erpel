import { styled } from 'styled-components';
import { ThemedButton, ThemedCheckbox, ThemedInput } from '../Theme';
import React, { useCallback } from 'react';
import { Service } from '../../State/Settings';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Icon } from '../Icon';
import { useStore } from '../../State/Store';

export interface Values {
    name: string | null
    url: string | null
    darkMode: boolean
}

interface ServiceFormProps {
    service: Service
}

export function ServiceForm(props: ServiceFormProps) {
    const { register, handleSubmit, control } = useForm<Values>({ defaultValues: props.service });
    const { replace } = useStore();

    const onSubmit: SubmitHandler<Values> = useCallback((data) => {
        console.warn(data);
        replace(props.service.id, { ...props.service, ...data });
    }, [props.service, replace]);

    const filterEmptyToString = useCallback((value: string) => {
        return value !== null && value.trim().length > 0 ? value : null;
    }, []);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {props.service.template.options.name && (
                <Fieldset>
                    <Label htmlFor={`${props.service.id}::name`}>Name</Label>
                    <ThemedInput
                        id={`${props.service.id}::name`}
                        {...register('name', { setValueAs: filterEmptyToString })}
                        placeholder="Enter a custom name for this service"
                    />
                </Fieldset>
            )}
            {props.service.template.options.url && (
                <Fieldset>
                    <Label htmlFor={`${props.service.id}::url`}>URL</Label>
                    <ThemedInput
                        id={`${props.service.id}::url`}
                        {...register('url', { setValueAs: filterEmptyToString })}
                        placeholder="Enter a custom URL for this service"
                    />
                </Fieldset>
            )}
            {props.service.template.options.darkMode && (
                <Fieldset>
                    <Label htmlFor={`${props.service.id}::darkMode`}>Dark Mode</Label>
                    <Controller name="darkMode" control={control} render={({ field: { ref, value, ...rest } }) => {
                        return (
                            <ThemedCheckbox
                                id={`${props.service.id}::darkMode`}
                                checked={value}
                                {...rest}
                                placeholder="Enable dark mode"
                            />
                        );
                    }}/>
                </Fieldset>
            )}
            <div>
                <ThemedButton type="submit">
                    <Icon name={'floppy-disk'} size={20}/>
                    <>Save</>
                </ThemedButton>
            </div>
        </Form>
    );
}

const Form = styled.form`
    padding: 0;
    margin: 0;
    
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Fieldset = styled.fieldset`
    padding: 0;
    margin: 0;
    
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    border: 0;
`;

const Label = styled.label`
    cursor: pointer;
`;
