import React, { useEffect } from 'react';
import { Clock } from './Clock';
import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { useStore } from '../../State/Store';
import { useNavigate } from 'react-router';
import { PageCenter } from '../Layout';

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
    }, [services]);

    return (
        <PageCenter>
            <Clock/>
        </PageCenter>
    );
}
