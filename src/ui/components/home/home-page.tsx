import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ElectronWindow } from "@erpel/preload-features/app-bridge";
import { PageCenter } from "@erpel/ui/components/layout";
import { useStore } from "@erpel/ui/store/store";
import { Clock } from "./clock";

declare const window: ElectronWindow;

export function Home() {
    const navigate = useNavigate();
    const { services } = useStore();

    useEffect(() => {
        window.electron.hideAllServices();
    }, []);

    useEffect(() => {
        if (services.length === 0) {
            navigate("/setup");
        }
    }, [services, navigate]);

    return (
        <PageCenter>
            <Clock golden={true} />
        </PageCenter>
    );
}
