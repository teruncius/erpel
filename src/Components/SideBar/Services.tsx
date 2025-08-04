import { NavLink } from 'react-router';
import React from 'react';
import { styled } from 'styled-components';
import { SoftFrostedEffectStyle } from '../Theme';
import { useStore } from '../../State/Store';
import { Service } from '../../State/Settings';
import { ServiceIcon } from '../Settings/ServiceIcon';

export function Services() {
    const { services } = useStore();

    if (!services.length) {
        return null;
    }

    return (
        <ServiceList>
            {services.map((service) => {
                return <ServiceItem key={service.id} service={service} />;
            })}
        </ServiceList>
    );
}

const ServiceList = styled.nav`
    padding: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    gap: 4px;
`;

type ServiceItemProps = {
    service: Service
}

function ServiceItem(props: ServiceItemProps) {
    const { isOpen } = useStore();

    const name = props.service.name || props.service.template.name;
    const icon = props.service.icon || props.service.template.icon;

    return (
        <ServiceLink key={props.service.id} to={`/service/${props.service.id}`} title={name} $isOpen={isOpen}>
            <RoundedServiceIcon src={icon} name={name} size={32} />
            <>{isOpen ? name : null}</>
        </ServiceLink>
    );
}

const ServiceLink = styled(NavLink)<{$isOpen: boolean}>`
    ${SoftFrostedEffectStyle};
    margin: 0;
    padding: 4px;

    display: flex;
    flex-direction: row;
    justify-content: ${(props) => props.$isOpen ? 'flex-start' : 'center'};
    align-items: center;
    gap: 0.5rem;

    color: #ffffff;
    text-decoration: none;
    cursor: pointer;
    line-height: 1rem;
    user-select: none;
    background-color: ${(props) => props.$isOpen ? '#ffffff08' : 'transparent'};
    filter: brightness(0.6);

    &:hover {
        filter: brightness(1.0);
    }

    &.active {
        filter: brightness(1.0);
    }

    &:focus {
        outline: 0;
    }
`;

const RoundedServiceIcon = styled(ServiceIcon)`
    border-radius: 50%;
`;
