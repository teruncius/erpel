import { Service } from '../../State/Settings';
import React, { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { ServiceLogo } from './ServiceLogo';
import { useStore } from '../../State/Store';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Icon } from '../Icon';
import { ThemedButton, HardFrostedEffectStyle, ThemedInput, ThemedCheckbox } from '../Theme';

export function CurrentServices() {
    const { currentServices, swap } = useStore();
    const ids = currentServices.map((service) => service.id);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active.id !== over.id) {
            swap(active.id.toString(), over.id.toString());
        }
    }

    return (
        <ServiceList>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    {currentServices.map((service) => (
                        <CurrentService key={service.id} service={service}/>
                    ))}
                </SortableContext>
            </DndContext>
        </ServiceList>
    );
}

const ServiceList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

type CurrentServiceProps = {
    service: Service
}

function CurrentService(props: CurrentServiceProps) {
    const { remove } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.service.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = useCallback(() => {
        remove(props.service.id);
    }, [props.service.id, remove]);

    const handleOpenClose = useCallback(() => {
        setIsOpen((state) => !state);
    }, [props.service.id, remove]);

    const logo = props.service.logo || props.service.service.logo;
    const name = props.service.name || props.service.service.name;

    return (
        <ServiceBox ref={setNodeRef} style={style} {...attributes}>
            <ServiceHead>
                <ServiceButtonDnD ref={setActivatorNodeRef} {...listeners}>
                    <Icon name={'menu'} size={16}/>
                </ServiceButtonDnD>
                <ServiceLogo logo={logo} name={name} size={32}/>
                <ServiceName>
                    <>{name}</>
                    {props.service.name && props.service.service.name && (
                        <>({props.service.service.name})</>
                    )}
                </ServiceName>
                <ServiceButtons>
                    <ServiceButton onClick={handleOpenClose}>
                        <Icon name={'cog'} size={16}/>
                    </ServiceButton>
                    <ServiceButton onClick={handleDelete}>
                        <Icon name={'bin'} size={16}/>
                    </ServiceButton>
                </ServiceButtons>
            </ServiceHead>
            {isOpen && (
                <ServiceBody service={props.service}/>
            )}
        </ServiceBox>
    );
}

const ServiceBox = styled.div`
    ${HardFrostedEffectStyle};
    
    padding: 0.5rem;
    margin: 0;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    color: #fff;
    border-radius: 0.5rem;
`;

const ServiceHead = styled.div`
    display: flex;
    justify-content: left;
    gap: 0.5rem;
    align-items: center;
    user-select: none;
`;

const ServiceButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
`;

const ServiceButton = styled(ThemedButton)`
    padding: 0.5rem;
`;

const ServiceButtonDnD = styled(ServiceButton)`
    padding: 0.5rem;
    cursor: grab;
`;

const ServiceName = styled.div`
    flex-grow: 1;
`;

type ServiceBodyProps = {
    service: Service
}

function ServiceBody(props: ServiceBodyProps) {
    return (
        <ServiceBodyContainer>
            <Fieldset>
                <Label htmlFor={`${props.service.id}::name`}>Name</Label>
                <ThemedInput id={`${props.service.id}::name`} value={props.service.name}/>
                <ThemedCheckbox/>
            </Fieldset>

            <Fieldset>
                <Label htmlFor={`${props.service.id}::url`}>URL</Label>
                <ThemedInput id={`${props.service.id}::url`} value={props.service.url}/>
                <ThemedCheckbox/>
                <ThemedButton><Icon name={'sphere'} size={20}/></ThemedButton>
                <ThemedButton><Icon name={'lock'} size={20}/></ThemedButton>
                <ThemedButton><Icon name={'unlocked'} size={20}/></ThemedButton>
            </Fieldset>

            <Fieldset>
                <Label htmlFor={`${props.service.id}::logo`}>Icon</Label>
                <ServiceLogo logo={props.service.logo} name={props.service.name} size={64}/>
                <ThemedCheckbox/>
            </Fieldset>
        </ServiceBodyContainer>
    );
}

const ServiceBodyContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
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
