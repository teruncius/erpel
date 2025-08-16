import { Fragment, StrictMode } from 'react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';

import { Home } from './Home/HomePage';
import { Layout } from './Layout';
import { ServicePage } from './Service/ServicePage';
import { SettingsPage } from './Settings/SettingsPage';
import { SetupPage } from './Setup/SetupPage';

const ENABLE_STRICT_MODE = false;

export function App() {
    const Strict = ENABLE_STRICT_MODE ? StrictMode : Fragment;
    const Router = import.meta.env.DEV ? BrowserRouter : MemoryRouter;
    return (
        <Strict>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route element={<ServicePage />} path="/service/:id" />
                        <Route element={<SettingsPage />} path="/settings" />
                        <Route element={<SetupPage />} path="/setup" />
                        <Route element={<Home />} path="*" />
                    </Route>
                </Routes>
            </Router>
        </Strict>
    );
}
