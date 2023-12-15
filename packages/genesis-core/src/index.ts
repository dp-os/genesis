import { AxiosRequestConfig } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import Vue from 'vue';
import Config from 'webpack-chain';

import { MF as MFConstructor } from './mf';
import {
    Plugin as PluginConstructor,
    PluginManage as PluginManageConstructor
} from './plugin';
import { Renderer as RendererConstructor } from './renderer';
import { SSR as SSRConstructor } from './ssr';

export { SSRConstructor as SSR };
export { MFConstructor as MF };
export { RendererConstructor as Renderer };
export { PluginConstructor as Plugin };
export { PluginManageConstructor as PluginManage };

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Genesis {
    /**
     * SSR Constructor
     */
    export const SSR = SSRConstructor;
    export type SSR = SSRConstructor;
    export const MF = MFConstructor;
    export type MF = MFConstructor;
    /**
     * Renderer Constructor
     */
    export const Renderer = RendererConstructor;
    export type Renderer = RendererConstructor;
    /**
     * SSR plug-in
     */
    export const Plugin = PluginConstructor;
    export type Plugin = PluginConstructor;
    /**
     * Plug in Management Center
     */
    export const PluginManage = PluginManageConstructor;
    export type PluginManage = PluginManageConstructor;
    /**
     * Webpack construction objectives
     */
    export type WebpackBuildTarget = 'client' | 'server';
    export interface MFRemote {
        name: string;
        clientOrigin: string;
        serverOrigin: string;
        serverRequestConfig?: AxiosRequestConfig;
    }
    export interface MFOptions {
        /**
         * You can use absolute or relative paths
         */
        exposes?: Record<string, string>;
        /**
         * Remote service
         */
        remotes?: MFRemote[];
        /**
         * The polling interval of the server is 5000ms by default
         */
        intervalTime?: number;
        /**
         * Shared configuration of webpack modulefederationplugin plug-in
         * https://webpack.docschina.org/plugins/module-federation-plugin/#Specify-package-versions
         */
        shared?: (string | SharedObject)[] | SharedObject;
        /**
         * d.ts declared directory
         */
        typesDir?: string;
    }
    export interface MFManifestJson {
        /**
         * client
         */
        c: string;
        /**
         * server
         */
        s: string;
        /**
         * dts, 1 = have, 0 = not have
         */
        d: number;
        /**
         * build time
         */
        t: number;
    }
    export interface SharedObject {
        [index: string]: string | SharedConfig;
    }
    export interface SharedConfig {
        /**
         * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
         */
        eager?: boolean;

        /**
         * Provided module that should be provided to share scope. Also acts as fallback module if no shared module is found in share scope or version isn't valid. Defaults to the property name.
         */
        import?: string | false;

        /**
         * Package name to determine required version from description file. This is only needed when package name can't be automatically determined from request.
         */
        packageName?: string;

        /**
         * Version requirement from module in share scope.
         */
        requiredVersion?: string | false;

        /**
         * Module is looked up under this key from the share scope.
         */
        shareKey?: string;

        /**
         * Share scope name.
         */
        shareScope?: string;

        /**
         * Allow only a single version of the shared module in share scope (disabled by default).
         */
        singleton?: boolean;

        /**
         * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
         */
        strictVersion?: boolean;

        /**
         * Version of the provided module. Will replace lower matching versions, but not higher.
         */
        version?: string | false;
    }
    /**
     * Build options
     */
    export interface BuildOptions {
        // https://github.com/privatenumber/esbuild-loader#readme
        esbuild?: any;
        // https://github.com/yenshih/style-resources-loader
        styleResourcesLoader?: any;
        /**
         * Valid only in production environment
         */
        extractCSS?: boolean;
        /**
         * Basic folder for the project
         */
        baseDir?: string;
        /**
         * Which compiled directories are included
         */
        transpile?: (RegExp | string)[];
        /**
         * alias settings
         */
        alias?: Record<
            string,
            string | Partial<Record<WebpackBuildTarget, string>>
        >;

        fallback?: Record<string, string | boolean>;
        /**
         * Webpack build target https://webpack.js.org/configuration/target/
         */
        target?: Target;
        /**
         * Template file path
         */
        template?: string;
        moduleReplace?: Record<string, string | ((request: any) => string)>;
    }

    export interface Target {
        /**
         * Server build target
         */
        server?: string;
        /**
         * Client build target
         */
        client?: string;
    }

    export type Browserslist = string | string[];
    export interface Options {
        /**
         * The name of the application. The default is ssr-genesis
         */
        name?: string;
        /**
         * Build side configuration
         */
        build?: BuildOptions;
        /**
         * Production environment or not
         */
        isProd?: boolean;
        /**
         * CDN resource public path, Only valid in production mode
         */
        cdnPublicPath?: string;
        /**
         * In the sandbox environment, inject global variables
         */
        sandboxGlobal?: Record<string, any>;
    }

    /**
     * Hook parameter of webpack
     */
    export interface WebpackHookParams {
        target: WebpackBuildTarget;
        config: Config;
    }
    export interface BabelConfig {
        target: WebpackBuildTarget;
        plugins: any[];
        presets: any[];
    }
    export interface PostcssOptions {
        target: WebpackBuildTarget;
        execute?: boolean;
        postcssOptions: {
            syntax?: string | object;
            parser?: string | Object | Function;
            plugins: any[];
        };
        sourceMap: boolean;
    }
    /**
     * Render Type
     */
    export type RenderType = 'json' | 'html';
    /**
     * Render Mode
     */
    export type RenderModeJson = 'csr-json' | 'ssr-json';
    export type RenderModeHtml = 'csr-html' | 'ssr-html';
    export type RenderMode = RenderModeJson | RenderModeHtml;
    /**
     * Render result
     */
    export type RenderResult<T extends RenderMode = RenderMode> =
        T extends Genesis.RenderModeHtml
            ? Genesis.RenderResultHtml
            : Genesis.RenderResultJson;
    /**
     * Rendered HTML
     */
    export interface RenderResultHtml {
        type: 'html';
        data: string;
        context: RenderContext;
    }
    /**
     * Rendered JSON
     */
    export interface RenderResultJson {
        type: 'json';
        data: RenderData;
        context: RenderContext;
    }
    /**
     * Rendered data
     */
    export interface RenderData {
        url: string;
        id: string;
        html: string;
        name: string;
        state: {
            [x: string]: any;
        };
        style: string;
        script: string;
        scriptState: string;
        resource: RenderContextResource[];
        autoMount: boolean;
        [x: string]: any;
    }
    export interface ClientOptions {
        env: 'client';
        url: string;
        id: string;
        name: string;
        state: {
            [x: string]: any;
        };
        el: Element;
        mounted?: (app: Vue) => void;
        error?: (err: Error) => void;
    }
    export interface RenderOptions<
        T extends Genesis.RenderMode = Genesis.RenderMode
    > {
        req?: IncomingMessage;
        res?: ServerResponse;
        mode?: T;
        url?: string;
        id?: string;
        name?: string;
        autoMount?: boolean;
        /**
         * Extract tags from style files to CSS dynamically, Production environment enabled
         */
        styleTagExtractCSS?: boolean;
        state?: {
            [x: string]: any;
        };
    }
    /**
     * Rendered context
     */
    export interface RenderContext {
        env: 'server';
        data: RenderData;
        mode: RenderMode;
        ssr: SSR;
        renderer: Renderer;
        req?: IncomingMessage;
        res?: ServerResponse;
        styleTagExtractCSS: boolean;
        renderHtml: () => string;
        beforeRender: (cb: (context: RenderContext) => void) => void;
    }

    export interface RenderContextResource {
        file: string;
        extension: string;
    }
    /**
     * Preload resources
     */
    export interface RenderContextPreload extends RenderContextResource {
        fileWithoutQuery: string;
        asType: string;
    }

    export interface ClientManifest {
        publicPath: string;
        all: string[];
        initial: string[];
        async: string[];
        modules: { [key: string]: number[] };
    }

    export interface RendererOptionsMap {
        version: number;
        sources: string[];
        names: string[];
        mappings: string;
        file: string;
        sourcesContent: string[];
        sourceRoot: string;
    }
    export type CompilerType = 'build' | 'watch';
}

export type ClientOptions = Genesis.ClientOptions;
export type RenderContext = Genesis.RenderContext;
export default Genesis;
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        // @ts-ignore
        renderContext?: Genesis.RenderContext;
        clientOptions?: Genesis.ClientOptions;
    }
}
