import React, { StrictMode } from 'react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
import { Home } from './Home/HomePage';
import { SettingsPage } from './Settings/SettingsPage';
import { Layout } from './Layout';
import { ServicePage } from './Service/ServicePage';
import { SetupPage } from './Setup/SetupPage';

const ENABLE_STRICT_MODE = false;

export function App() {
    const Strict = ENABLE_STRICT_MODE ? StrictMode : React.Fragment;
    const Router = import.meta.env.DEV ? BrowserRouter : MemoryRouter;
    return (
        <Strict>
            <Router>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path={'/service/:id'} element={<ServicePage/>}/>
                        <Route path="/settings" element={<SettingsPage/>}/>
                        <Route path="/setup" element={<SetupPage/>}/>
                        <Route path={'*'} element={<Home/>}/>
                    </Route>
                </Routes>
            </Router>
        </Strict>
    );
}
