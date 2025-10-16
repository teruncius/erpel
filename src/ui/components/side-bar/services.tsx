import { NavLink } from 'react-router';
import { styled } from 'styled-components';

import { Service } from '../../../state/schema';
import { useStore } from '../../store/store';
import { ServiceIcon } from '../settings/service-icon';
import { SoftFrostedEffectStyle } from '../theme';

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

interface ServiceItemProps {
    service: Service;
}

function ServiceItem(props: ServiceItemProps) {
    const { isOpen } = useStore();

    const name = props.service.name || props.service.template.name.default;
    const icon = props.service.icon || props.service.template.icon.default;

    return (
        <ServiceLink $isOpen={isOpen} key={props.service.id} title={name} to={`/service/${props.service.id}`}>
            <RoundedServiceIcon icon={icon} name={name} size={32} />
            <>{isOpen ? name : null}</>
        </ServiceLink>
    );
}

const ServiceLink = styled(NavLink)<{ $isOpen: boolean }>`
    ${SoftFrostedEffectStyle};
    margin: 0;
    padding: 4px;

    display: flex;
    flex-direction: row;
    justify-content: ${(props) => (props.$isOpen ? 'flex-start' : 'center')};
    align-items: center;
    gap: 0.5rem;

    color: #ffffff;
    text-decoration: none;
    cursor: pointer;
    line-height: 1rem;
    user-select: none;
    background-color: ${(props) => (props.$isOpen ? '#ffffff08' : 'transparent')};
    filter: brightness(0.6);

    &:hover {
        filter: brightness(1);
    }

    &.active {
        filter: brightness(1);
    }

    &:focus {
        outline: 0;
    }
`;

const RoundedServiceIcon = styled(ServiceIcon)`
    border-radius: 50%;
`;
