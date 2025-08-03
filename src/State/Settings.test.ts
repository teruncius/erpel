import { expect, test } from 'vitest';
import { SERVICES } from './Settings';

test('default services are available', () => {
    expect(SERVICES.length).toBe(7);
});
