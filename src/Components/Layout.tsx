import { Outlet } from 'react-router';
import { styled } from 'styled-components';

import { BackgroundMode } from '../State/Settings';
import { useStore } from '../State/Store/Store';
import { SideBar, SIDEBAR_WIDTH_CLOSED, SIDEBAR_WIDTH_OPEN } from './SideBar/SideBar';
import { Wallpaper } from './Wallpaper';

export function Layout() {
    const { isOpen, mode } = useStore();

    return (
        <Page>
            {mode === BackgroundMode.Wallpaper && (
                <Wallpaper />
            )}
            <SideBar />
            <Content $isOpen={isOpen}>
                <PageWidescreenLimiter>
                    <Outlet />
                </PageWidescreenLimiter>
            </Content>
        </Page>
    );
}

const Page = styled.div`
    display: flex;
    
    min-height: 100vh;
    overflow: hidden;
`;

const Content = styled.div<{ $isOpen: boolean }>`
    padding: 3rem;
    margin: 0 0 0 ${(props) => props.$isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED}px;

    display: flex;
    flex-grow: 1;
    justify-content: center;
`;

const PageWidescreenLimiter = styled.div`
    max-width: 1000px;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1rem;

    color: #fff;
`;

export const PageCenter = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1rem;
    
    justify-content: center;
    align-items: center;
`;
