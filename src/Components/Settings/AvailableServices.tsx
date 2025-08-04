import { styled } from 'styled-components';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { ServiceTemplate } from '../../State/Settings';
import { ServiceLogo } from './ServiceLogo';
import { useStore } from '../../State/Store';
import { ThemedHoverStyle, ThemedButton, HardFrostedEffectStyle, ThemedInput } from '../Theme';
import { Icon } from '../Icon';

export function AvailableServices() {
    const [search, setSearch] = useState('');
    const { availableServices } = useStore();

    function filter(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    function handleReset() {
        setSearch('');
    }

    const filtered = !search.length ? availableServices : availableServices
        .filter((service) => {
            const name = service.name.toLowerCase().includes(search.toLowerCase());
            const tags = service.tags.filter((tag) => tag.toLowerCase().includes(search.toLowerCase()));
            return name || tags.length > 0;
        });

    return (
        <Container>
            <ServiceFilter>
                <ServiceFilterInput type="text" placeholder="Type to filter" value={search} onChange={filter}/>
                <ServiceFilterButton type="button" onClick={handleReset}><Icon name="cross" size={16} /></ServiceFilterButton>
            </ServiceFilter>
            <ServiceGrid>
                {filtered.map((service) => {
                    return <AvailableService key={service.id} service={service}/>;
                })}
            </ServiceGrid>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ServiceFilter = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
`;

const ServiceFilterInput = styled(ThemedInput)`
    flex-grow: 1;
`;

const ServiceFilterButton = styled(ThemedButton)`
    padding: 0.5rem;
`;

const ServiceGrid = styled.div`
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;

    @media screen and (max-width: 1200px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
    @media screen and (max-width: 1000px) {
        grid-template-columns: 1fr 1fr;
    }
    @media screen and (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

type AvailableServiceProps = {
    service: ServiceTemplate
}

function AvailableService(props: AvailableServiceProps) {
    const { addFromTemplate } = useStore();

    const handleAdd = useCallback(() => {
        addFromTemplate(props.service);
    }, [addFromTemplate, props.service]);

    return (
        <ServiceBox onClick={handleAdd}>
            <ServiceLogo logo={props.service.logo} name={props.service.name} size={32}/>
            <>{props.service.name}</>
        </ServiceBox>
    );
}

const ServiceBox = styled.div`
    ${HardFrostedEffectStyle};
    ${ThemedHoverStyle};
    
    padding: 0.5rem;
    margin: 0;

    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 1rem;

    color: #fff;
    border-radius: 0.5rem;
    cursor: pointer;
    user-select: none;
`;
