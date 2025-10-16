import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useState } from 'react';
import { styled } from 'styled-components';

import { Service } from '../../../state/schema';
import { useStore } from '../../store/store';
import { Icon } from '../icon';
import { HardFrostedEffectStyle, ThemedSection } from '../theme';
import { ThemedButton } from '../theme/button';
import { ServiceForm } from './service-form';
import { ServiceIcon } from './service-icon';

export function Services() {
    const { reorder, services } = useStore();
    const ids = services.map((service) => service.id);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = ids.indexOf(active.id.toString());
            const newIndex = ids.indexOf(over.id.toString());
            reorder(oldIndex, newIndex);
        }
    }

    return (
        <ThemedSection>
            <List>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                        {services.map((service) => (
                            <Service key={service.id} service={service} />
                        ))}
                    </SortableContext>
                </DndContext>
            </List>
        </ThemedSection>
    );
}

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

interface CurrentServiceProps {
    service: Service;
}

function Service(props: CurrentServiceProps) {
    const { remove } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition } = useSortable({
        id: props.service.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = useCallback(() => {
        if (confirm('Do you really want to delete this service?')) {
            remove(props.service.id);
        }
    }, [props.service.id, remove]);

    const handleOpenClose = useCallback(() => {
        setIsOpen((state) => !state);
    }, [setIsOpen]);

    const icon = props.service.icon || props.service.template.icon.default;
    const name = props.service.name || props.service.template.name.default;

    return (
        <ServiceBox ref={setNodeRef} style={style} {...attributes}>
            <ServiceHead>
                <ServiceButtonDnD ref={setActivatorNodeRef} {...listeners}>
                    <Icon name="menu" size={16} />
                </ServiceButtonDnD>
                <ServiceIcon icon={icon} name={name} size={32} />
                <ServiceName>
                    {props.service.name && props.service.template.name && <>{props.service.template.name.default}: </>}
                    <>{name}</>
                </ServiceName>
                <ServiceButtons>
                    <ServiceButton onClick={handleOpenClose}>
                        <Icon name="cog" size={16} />
                    </ServiceButton>
                    <ServiceButton onClick={handleDelete}>
                        <Icon name="bin" size={16} />
                    </ServiceButton>
                </ServiceButtons>
            </ServiceHead>
            {isOpen && (
                <ServiceBodyContainer>
                    <ServiceForm service={props.service} />
                </ServiceBodyContainer>
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

const ServiceBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
