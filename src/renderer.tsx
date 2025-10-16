import { createRoot } from 'react-dom/client';

import { App } from './ui/components/app';
import './renderer.css';

const root = createRoot(document.body);
root.render(<App />);
