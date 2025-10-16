import { useEffect } from 'react';
import { styled } from 'styled-components';

import { ElectronWindow } from '../../preload-features/app-bridge';
import { useStore } from '../../state/store/store';
import { SoftFrostedEffectStyle } from '../theme';
import { Actions } from './actions';
import { Logo } from './logo';
import { Services } from './services';

declare const window: ElectronWindow;

export const SIDEBAR_WIDTH_OPEN = 200;
export const SIDEBAR_WIDTH_CLOSED = 60;

export function SideBar() {
    const { isOpen } = useStore();

    useEffect(() => {
        window.electron.setSidebarState(isOpen);
    }, [isOpen]);

    return (
        <Container $isOpen={isOpen}>
            <Header>
                <Logo />
                <Services />
            </Header>
            <Footer>
                <Actions />
            </Footer>
        </Container>
    );
}

const Container = styled.div<{ $isOpen: boolean }>`
    ${SoftFrostedEffectStyle};
    position: fixed;
    width: ${(props) => props.$isOpen ? `${SIDEBAR_WIDTH_OPEN}px` : `${SIDEBAR_WIDTH_CLOSED}px`};
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const Header = styled.header`
    display: flex;
    flex-direction: column;
    width: inherit;
`;

const Footer = styled.footer``;
