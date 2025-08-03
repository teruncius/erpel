import { NavLink } from 'react-router';
import React from 'react';
import { styled } from 'styled-components';
import { SoftFrostedEffectStyle } from '../Theme';
import { useStore } from '../../State/Store';
import { Service } from '../../State/Settings';

export function Services() {
    const { currentServices } = useStore();

    if (!currentServices.length) {
        return null;
    }

    return (
        <ServiceList>
            {currentServices.map((service) => {
                return <ServiceItem key={service.id} service={service} />;
            })}
        </ServiceList>
    );
}

type ServiceItemProps = {
    service: Service
}

function ServiceItem(props: ServiceItemProps) {
    const { isOpen } = useStore();

    const name = props.service.name || props.service.service.name;
    const logo = props.service.logo || props.service.service.logo;

    return (
        <ServiceLink key={props.service.id} to={`/service/${props.service.id}`} title={name} $isOpen={isOpen}>
            <ServiceIcon src={logo} alt={name} width={32} height={32}/> {isOpen ? name : null}
        </ServiceLink>
    );
}

const ServiceList = styled.nav`
    padding: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    gap: 4px;
`;

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

const ServiceIcon = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
`;
