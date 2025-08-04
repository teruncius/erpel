import { Icon } from '../Icon';
import { styled } from 'styled-components';

interface HintProps {
    title: string
    text: string
}

export function Hint(props: HintProps) {
    return (
        <Container>
            <Image name={'info'} size={24}/>
            <Title>{props.title}</Title>
            <Text>{props.text}</Text>
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: auto;
    grid-template-areas: 
        "a b"
        "a c";
    gap: 1rem;
`;

const Image = styled(Icon)`
    grid-area: a;
`;

const Title = styled.div`
    grid-area: b;
    font-size: 1.2rem;
`;

const Text = styled.div`
    grid-area: c;
`;
