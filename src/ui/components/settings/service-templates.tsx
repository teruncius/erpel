import { ChangeEvent, useCallback, useState } from 'react';
import { styled } from 'styled-components';

import { ServiceTemplate } from '../../../state/schema';
import { useStore } from '../../store/store';
import { Icon } from '../icon';
import { HardFrostedEffectStyle, ThemedHoverStyle, ThemedSection } from '../theme';
import { ThemedButton } from '../theme/button';
import { ThemedInput } from '../theme/input';
import { ServiceIcon } from './service-icon';

export function ServiceTemplates() {
    const [search, setSearch] = useState('');
    const { templates } = useStore();

    function filter(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    function handleReset() {
        setSearch('');
    }

    const filtered = !search.length ? templates : templates
        .filter((templates) => {
            const name = templates.name.default.toLowerCase().includes(search.toLowerCase());
            const tags = templates.tags.filter((tag) => tag.toLowerCase().includes(search.toLowerCase()));
            return name || tags.length > 0;
        });

    return (
        <ThemedSection>
            <Container>
                <FilterBar>
                    <FilterInput onChange={filter} placeholder="Type to filter" type="text" value={search} />
                    <FilterButton onClick={handleReset} type="button">
                        <Icon name="cross" size={16} />
                    </FilterButton>
                </FilterBar>
                <Grid>
                    {filtered.map((template) => {
                        return <ServiceTemplate key={template.id} template={template} />;
                    })}
                </Grid>
            </Container>
        </ThemedSection>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FilterBar = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
`;

const FilterInput = styled(ThemedInput)`
    flex-grow: 1;
`;

const FilterButton = styled(ThemedButton)`
    padding: 0.5rem;
`;

const Grid = styled.div`
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

interface ServiceTemplateProps {
    template: ServiceTemplate
}

function ServiceTemplate(props: ServiceTemplateProps) {
    const { addFromTemplate } = useStore();

    const handleAdd = useCallback(() => {
        addFromTemplate(props.template);
    }, [addFromTemplate, props.template]);

    return (
        <TemplateBox onClick={handleAdd}>
            <ServiceIcon icon={props.template.icon.default} name={props.template.name.default} size={32} />
            <>{props.template.name.default}</>
        </TemplateBox>
    );
}

const TemplateBox = styled.div`
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
