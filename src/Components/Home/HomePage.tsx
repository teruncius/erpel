import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { useStore } from '../../State/Store/Store';
import { PageCenter } from '../Layout';
import { Clock } from './Clock';

declare const window: ElectronWindow;

export function Home() {
    const navigate = useNavigate();
    const { services } = useStore();

    useEffect(() => {
        window.electron.hideAllServices();
    }, []);

    useEffect(() => {
        if (services.length === 0) {
            navigate('/setup');
        }
    }, [services, navigate]);

    return (
        <PageCenter>
            <Clock golden={true} />
        </PageCenter>
    );
}
