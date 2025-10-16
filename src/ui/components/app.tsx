import { Fragment, StrictMode } from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";

import { Home } from "@erpel/ui/components/home/home-page";
import { Layout } from "@erpel/ui/components/layout";
import { ServicePage } from "@erpel/ui/components/service/service-page";
import { SettingsPage } from "@erpel/ui/components/settings/settings-page";
import { SetupPage } from "@erpel/ui/components/setup/setup-page";

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
