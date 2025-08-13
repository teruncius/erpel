import React, { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { FrostedContainerStyle } from '../Theme';
import { useStore } from '../../State/Store';

interface Props {
    className?: string
}

export function Clock(props: Props) {
    const [now, setNow] = useState(new Date());
    const { i18n } = useStore();

    const update = useCallback(() => {
        setNow(new Date());
    }, [setNow]);

    useEffect(() => {
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [update]);

    return (
        <Container className={props.className}>
            <ClockTime>
                {new Intl.DateTimeFormat(i18n.time, { hour: '2-digit', minute: '2-digit' }).format(now)}
            </ClockTime>
            <ClockDate>
                {new Intl.DateTimeFormat(i18n.locale, { weekday: 'long' }).format(now)}
                <>, </>
                {new Intl.DateTimeFormat(i18n.date, {
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
