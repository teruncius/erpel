import { createRoot } from 'react-dom/client';
import { App } from './Components/App';
import './renderer.css';

const root = createRoot(document.body);
root.render(<App />);
