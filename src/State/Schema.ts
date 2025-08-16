import { z } from 'zod';

import { BackgroundMode } from './Settings';

const StringOption = z.object({
    copyOnCreate: z.boolean(),
    customizable: z.boolean(),
    default: z.string(),
});

const BooleanOption = z.object({
    copyOnCreate: z.boolean(),
    customizable: z.boolean(),
    default: z.boolean(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OptionSchema = z.union([StringOption, BooleanOption]);

export type Option = z.infer<typeof OptionSchema>;

export const ServiceTemplateSchema = z.object({
    darkMode: BooleanOption,
    icon: StringOption,
    id: z.string(),
    name: StringOption,
    tags: z.array(z.string()),
    url: StringOption,
});

export type ServiceTemplate = z.infer<typeof ServiceTemplateSchema>;

export const ServiceSchema = z.object({
    darkMode: z.boolean().nullable(),
    icon: z.string().nullable(),
    id: z.string(),
    name: z.string().nullable(),
    template: ServiceTemplateSchema,
    url: z.string().nullable(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const BackgroundModeSchema = z.enum([BackgroundMode.Color, BackgroundMode.Wallpaper]);

export const ConfigSchema = z.object({
    dateFormat: z.string(),
    isMuted: z.boolean(),
    isOpen: z.boolean(),
    locale: z.string(),
    mode: BackgroundModeSchema,
    services: z.array(ServiceSchema),
    timeFormat: z.string(),
    version: z.literal(0),
    wallpapers: z.array(z.string()),
});

export type Config = z.infer<typeof ConfigSchema>;
