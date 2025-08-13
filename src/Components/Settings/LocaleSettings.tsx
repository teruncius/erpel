import { useStore } from '../../State/Store';
import { Clock } from '../Home/Clock';
import { ChangeEvent, useCallback } from 'react';
import { ThemedSection } from '../Theme';
import { styled } from 'styled-components';

export function LocaleSettings() {
    const { i18n, setLocale, setTimeFormat, setDateFormat } = useStore();

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
                <div>Locale: {i18n.locale}</div>
                <select value={i18n.locale} onChange={onChangeLocale}>
                    <option value="en-US">en</option>
                    <option value="de-DE">de</option>
                </select>

                <div>Time: {i18n.time}</div>
                <select value={i18n.time} onChange={onChangeTime}>
                    <option value="en-US">12 hours</option>
                    <option value="de-DE">24 hours</option>
                </select>

                <div>Date: {i18n.date}</div>
                <select value={i18n.date} onChange={onChangeDate}>
                    <option value="en-US">mm/dd/yyyy</option>
                    <option value="de-DE">dd.mm.yyyy</option>
                </select>
            </SettingsSection>
            <CustomClock/>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`;

const SettingsSection = styled(ThemedSection)`
    flex-grow: 1;
`;

const CustomClock = styled(Clock)`
    justify-content: center;
`;
