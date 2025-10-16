import { ChangeEvent, useCallback } from 'react';
import { styled } from 'styled-components';

import { useStore } from '../../state/store/store';
import { Clock } from '../home/clock';
import { ThemedSection } from '../theme';
import { ThemedSelect } from '../theme/select';

const localeOptions = [
    'en-US',
    'de-DE',
];

const timeOptions = [
    'en-US',
    'de-DE',
];

const dateOptions = [
    'en-US',
    'de-DE',
];

export function LocaleSettings() {
    const { dateFormat, locale, setDateFormat, setLocale, setTimeFormat, timeFormat } = useStore();

    const onChangeLocale = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setLocale(e.target.value);
    }, [setLocale]);

    const onChangeTime = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setTimeFormat(e.target.value);
    }, [setTimeFormat]);

    const onChangeDate = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setDateFormat(e.target.value);
    }, [setDateFormat]);

    return (
        <Container>
            <SettingsSection>
                <ThemedSelect id="locale" label="Locale" onChange={onChangeLocale} options={localeOptions} value={locale} />
                <ThemedSelect id="time" label="Time format" onChange={onChangeTime} options={timeOptions} value={timeFormat} />
                <ThemedSelect id="date" label="Date format" onChange={onChangeDate} options={dateOptions} value={dateFormat} />
            </SettingsSection>
            <Clock />
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: 1rem;

    @media screen and (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const SettingsSection = styled(ThemedSection)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-grow: 1;
`;
