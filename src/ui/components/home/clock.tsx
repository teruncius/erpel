import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import { useStore } from '../../store/store';
import { FrostedContainerStyle } from '../theme';

interface Props {
    golden?: boolean
}

export function Clock(props: Props) {
    const [now, setNow] = useState(new Date());
    const { dateFormat, locale, timeFormat } = useStore();

    const update = useCallback(() => {
        setNow(new Date());
    }, [setNow]);

    useEffect(() => {
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [update]);

    return (
        <Container $golden={props.golden || false}>
            <ClockTime>
                {new Intl.DateTimeFormat(timeFormat, { hour: '2-digit', minute: '2-digit' }).format(now)}
            </ClockTime>
            <ClockDate>
                {new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now)}
                <>, </>
                {new Intl.DateTimeFormat(dateFormat, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(now)}
            </ClockDate>
        </Container>
    );
}

const Container = styled.div<{ $golden: boolean }>`
    ${FrostedContainerStyle};
    
    padding: 1rem 3rem;
    margin: 0;
    aspect-ratio: ${(props) => props.$golden ? '1.618' : 'auto'};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;

    border-radius: 1rem;
    color: #ffffff;
`;

const ClockTime = styled.div`
    font-size: 3rem;
    white-space: nowrap;
`;

const ClockDate = styled.div`
    font-size: 1rem;
    white-space: nowrap;
`;
