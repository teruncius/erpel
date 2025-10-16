import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ElectronWindow } from "../../../preload-features/app-bridge";
import { useStore } from "../../store/store";
import { PageCenter } from "../layout";
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
