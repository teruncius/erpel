import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { useParams } from 'react-router';
import { useEffect } from 'react';

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
