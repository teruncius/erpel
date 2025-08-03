import React, { StrictMode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Home } from './Home/HomePage';
import { SettingsPage } from './Settings/SettingsPage';
import { Layout } from './Layout';
import { ServicePage } from './Service/ServicePage';
import { SetupPage } from './Setup/SetupPage';

export function App() {
    return (
        <StrictMode>
            <MemoryRouter>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path={'/service/:id'} element={<ServicePage/>}/>
                        <Route path="/settings" element={<SettingsPage/>}/>
                        <Route path="/setup" element={<SetupPage/>}/>
                        <Route path={'*'} element={<Home/>}/>
                    </Route>
                </Routes>
            </MemoryRouter>
        </StrictMode>
    );
}
