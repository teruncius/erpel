import { expect, test } from 'vitest';
import { DEFAULT_SERVICE_TEMPLATES } from './Settings';

test('default services are available', () => {
    expect(DEFAULT_SERVICE_TEMPLATES.length).toBe(7);
});
