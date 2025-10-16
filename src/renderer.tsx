import { createRoot } from 'react-dom/client';

import './renderer.css';
import { App } from './ui/components/app';

const root = createRoot(document.body);
root.render(<App />);
