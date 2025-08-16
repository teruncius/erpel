import { describe, expect, test } from 'vitest';
import { ConfigSchema } from './Schema';
import { DefaultConfig } from './Config';
import { z } from 'zod';

describe('Schema', () => {
    test('parses default config without errors', () => {
        const result = z.safeParse(ConfigSchema, DefaultConfig);
        expect(result.success).toEqual(true);
        expect(result.data).toStrictEqual(DefaultConfig);
    });
});
