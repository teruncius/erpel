import React, { useEffect, useState } from 'react';
import { settings } from '../../State/Settings';
import { styled } from 'styled-components';
import { FrostedContainerStyle } from '../Theme';

export function Clock() {
    const [now, setNow] = useState(new Date());

    function update() {
        setNow(new Date());
    }

    useEffect(() => {
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            <ClockTime>
                {new Intl.DateTimeFormat(settings.i18n.time, { hour: '2-digit', minute: '2-digit' }).format(now)}
            </ClockTime>
            <ClockDate>
                {new Intl.DateTimeFormat(settings.i18n.dow, { weekday: 'long' }).format(now)}
                <>, </>
                {new Intl.DateTimeFormat(settings.i18n.date, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(now)}
            </ClockDate>
        </Container>
    );
}

const Container = styled.div`
    ${FrostedContainerStyle};
    padding: 1rem 6rem 1rem 6rem;
    margin: 0;

    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    align-items: center;

    border-radius: 1rem;
    color: #ffffff;
`;

const ClockTime = styled.div`
    font-size: 3rem;
`;

const ClockDate = styled.div`
    font-size: 1rem;
`;
