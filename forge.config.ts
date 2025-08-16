import type { ForgeConfig } from '@electron-forge/shared-types';

import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
    makers: [
        new MakerSquirrel({
            iconUrl: 'https://raw.githubusercontent.com/teruncius/erpel/refs/heads/master/resources/erpel.ico',
            setupIcon: 'resources/erpel.ico',
        }),
        new MakerDMG({
            icon: 'resources/erpel.icns',
        }),
        new MakerDeb({
            options: {
                icon: 'resources/erpel.png',
            },
        }),
    ],
    packagerConfig: {
        asar: true,
        icon: 'resources/erpel',
    },
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    config: 'vite.main.config.ts',
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: 'src/main.ts',
                    target: 'main',
                },
                {
                    config: 'vite.preload.config.ts',
                    entry: 'src/preload.application.ts',
                    target: 'preload',
                },
                {
                    config: 'vite.preload.config.ts',
                    entry: 'src/preload.service.ts',
                    target: 'preload',
                },
            ],
            renderer: [
                {
                    config: 'vite.renderer.config.ts',
                    name: 'main_window',
                },
            ],
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
            [FuseV1Options.RunAsNode]: false,
            version: FuseVersion.V1,
        }),
    ],
};

export default config;
