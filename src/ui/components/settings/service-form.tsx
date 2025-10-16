import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { styled } from "styled-components";

import { Service } from "../../../state/schema";
import { useStore } from "../../store/store";
import { Icon } from "../icon";
import { ThemedButton } from "../theme/button";
import { ThemedCheckbox } from "../theme/checkbox";
import { ThemedInput } from "../theme/input";

export interface Values {
    darkMode: boolean | null;
    name: null | string;
    url: null | string;
}

interface ServiceFormProps {
    service: Service;
}

export function ServiceForm(props: ServiceFormProps) {
    const { control, handleSubmit, register } = useForm<Values>({ defaultValues: props.service });
    const { replace } = useStore();

    const onSubmit: SubmitHandler<Values> = useCallback(
        (data) => {
            replace(props.service.id, { ...props.service, ...data });
        },
        [props.service, replace]
    );

    const filterEmptyToString = useCallback((value: string) => {
        return value !== null && value.trim().length > 0 ? value : null;
    }, []);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {props.service.template.name.customizable && (
                <Fieldset>
                    <Label htmlFor={`${props.service.id}::name`}>Name</Label>
                    <ThemedInput
                        id={`${props.service.id}::name`}
                        {...register("name", { setValueAs: filterEmptyToString })}
                        placeholder="Enter a custom name for this service"
                    />
                </Fieldset>
            )}
            {props.service.template.url.customizable && (
                <Fieldset>
                    <Label htmlFor={`${props.service.id}::url`}>URL</Label>
                    <ThemedInput
                        id={`${props.service.id}::url`}
                        {...register("url", { setValueAs: filterEmptyToString })}
                        placeholder="Enter a custom URL for this service"
                    />
                </Fieldset>
            )}
            {props.service.template.darkMode.customizable && (
                <Fieldset>
                    <Label htmlFor={`${props.service.id}::darkMode`}>Dark Mode</Label>
                    <Controller
                        control={control}
                        name="darkMode"
                        render={({ field: { value, ...rest } }) => {
                            return (
                                <ThemedCheckbox
                                    checked={value || false}
                                    id={`${props.service.id}::darkMode`}
                                    {...rest}
                                    placeholder="Enable dark mode"
                                />
                            );
                        }}
                    />
                </Fieldset>
            )}
            <Buttons>
                <ThemedButton type="submit">
                    <Icon name="floppy-disk" size={20} />
                    <>Save</>
                </ThemedButton>
            </Buttons>
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

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;
