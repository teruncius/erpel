import { describe, expect, test } from 'vitest';
import { z } from 'zod';

import { DefaultConfig } from './Config';
import { ConfigSchema } from './Schema';

describe('Schema', () => {
    test('parses default config without errors', () => {
        const result = z.safeParse(ConfigSchema, DefaultConfig);
        expect(result.success).toEqual(true);
        expect(result.data).toStrictEqual(DefaultConfig);
    });
});
