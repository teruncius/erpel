import { useStore } from '../../State/Store/Store';
import { Clock } from '../Home/Clock';
import { ChangeEvent, useCallback } from 'react';
import { ThemedSection } from '../Theme';
import { styled } from 'styled-components';
import { ThemedSelect } from '../Theme/Select';

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
    const { locale, dateFormat, timeFormat, setLocale, setTimeFormat, setDateFormat } = useStore();

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
                <ThemedSelect id="locale" label="Locale" value={locale} onChange={onChangeLocale} options={localeOptions} />
                <ThemedSelect id="time" label="Time format" value={timeFormat} onChange={onChangeTime} options={timeOptions} />
                <ThemedSelect id="date" label="Date format" value={dateFormat} onChange={onChangeDate} options={dateOptions} />
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
