import { createRoot } from 'react-dom/client';

import { App } from './components/app';
import './renderer.css';

const root = createRoot(document.body);
root.render(<App />);
