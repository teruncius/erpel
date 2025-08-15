import * as z from 'zod';
import { BackgroundMode } from './Settings';

const OptionSchema = z.union([
    z.object({
        default: z.string(),
        customizable: z.boolean(),
        copyOnCreate: z.boolean(),
    }),
    z.object({
        default: z.boolean(),
        customizable: z.boolean(),
        copyOnCreate: z.boolean(),
    }),
]);

export type Option = z.infer<typeof OptionSchema>;

export const ServiceTemplateSchema = z.object({
    id: z.string(),
    name: OptionSchema,
    url: OptionSchema,
    icon: OptionSchema,
    darkMode: OptionSchema,
    tags: z.array(z.string()),
});

export type ServiceTemplate = z.infer<typeof ServiceTemplateSchema>;

export const ServiceSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    url: z.string().nullable(),
    icon: z.string().nullable(),
    darkMode: z.boolean().nullable(),
    template: ServiceTemplateSchema,
});

export type Service = z.infer<typeof ServiceSchema>;

export const BackgroundModeSchema = z.enum([BackgroundMode.Color, BackgroundMode.Wallpaper]);

export const ConfigSchema = z.object({
    version: z.literal(0),
    services: z.array(ServiceSchema),
    isOpen: z.boolean(),
    locale: z.string(),
    dateFormat: z.string(),
    timeFormat: z.string(),
    isMuted: z.boolean(),
    mode: BackgroundModeSchema,
    wallpapers: z.array(z.string()),
});

export type Config = z.infer<typeof ConfigSchema>;
