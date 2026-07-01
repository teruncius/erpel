import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { styled } from "styled-components";

import { Service } from "@erpel/state/schema";
import { Icon } from "@erpel/ui/components/icon";
import { ThemedButton } from "@erpel/ui/components/theme/button";
import { ThemedCheckbox } from "@erpel/ui/components/theme/checkbox";
import { ThemedInput } from "@erpel/ui/components/theme/input";
import { useStore } from "@erpel/ui/store/store";
import { ServiceIcon } from "./service-icon";

export interface Values {
    darkMode: boolean | null;
    icon: null | string;
    name: null | string;
    url: null | string;
}

interface ServiceFormProps {
    service: Service;
}

export function ServiceForm(props: ServiceFormProps) {
    const { control, handleSubmit, register, setValue, watch } = useForm<Values>({ defaultValues: props.service });
    const { replace } = useStore();

    const currentIcon = watch("icon");
    const iconPreview = currentIcon || props.service.template.icon.default;

    const onSubmit: SubmitHandler<Values> = useCallback(
        (data) => {
            replace(props.service.id, { ...props.service, ...data });
        },
        [props.service, replace]
    );

    const filterEmptyToString = useCallback((value: string) => {
        return value !== null && value.trim().length > 0 ? value : null;
    }, []);

    const handleIconChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setValue("icon", dataUrl);
            };
            reader.readAsDataURL(file);
        },
        [setValue]
    );

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {props.service.template.icon.customizable && (
                <Fieldset>
                    <FieldsetHeading>Icon</FieldsetHeading>
                    <IconUploadRow>
                        <ServiceIcon icon={iconPreview} name="icon preview" size={48} />
                        <IconUploadLabel htmlFor={`${props.service.id}::icon`}>
                            <Icon name="folder-upload" size={16} />
                            Upload Icon
                            <HiddenFileInput
                                accept="image/*"
                                id={`${props.service.id}::icon`}
                                onChange={handleIconChange}
                                type="file"
                            />
                        </IconUploadLabel>
                    </IconUploadRow>
                </Fieldset>
            )}
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
                        render={({ field: { value, onChange, ...rest } }) => {
                            return (
                                <ThemedCheckbox
                                    checked={value || false}
                                    id={`${props.service.id}::darkMode`}
                                    onChange={(e) => {
                                        onChange(e.target.value === "on");
                                    }}
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

const FieldsetHeading = styled.span`
    cursor: default;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const IconUploadRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
`;

const IconUploadLabel = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-size: 0.875rem;
    user-select: none;

    &:hover {
        background: rgba(255, 255, 255, 0.25);
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;
