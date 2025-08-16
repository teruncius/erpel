import { useEffect } from 'react';
import { useParams } from 'react-router';

import { ElectronWindow } from '../../PreloadFeatures/AppBridge';

declare const window: ElectronWindow;

export function ServicePage() {
    const { id } = useParams();

    useEffect(() => {
        window.electron.activateService(id);
    }, [id]);

    return (
        <></>
    );
}
