import path from 'path';
import process from 'process';

import * as Genesis from './';
import { PluginManage } from './plugin';
import { Renderer } from './renderer';

export class SSR {
    public static fixVarName(name: string) {
        return name.replace(/\W/g, '_');
    }
    public static getPublicPathVarName(name: string) {
        return `__webpack_public_path_${SSR.fixVarName(name)}__`;
    }
    /**
     * Renderer
     */
    public Renderer = Renderer;
    /**
     * Constructor options
     */
    public options: Genesis.Options;
    /**
     * Plug in management
     */
    public plugin: Genesis.PluginManage;

    public readonly entryName = 'app';

    public sandboxGlobal: Record<string, any> = {
        Buffer,
        console,
        process,
        setTimeout,
        setInterval,
        setImmediate,
        clearTimeout,
        clearInterval,
        clearImmediate,
        URL
    };
    public constructor(options: Genesis.Options = {}) {
        this.options = options;
        this.plugin = new PluginManage(this);
        if ('name' in options && typeof options.name !== 'string') {
            throw new TypeError('Options.name can only be of string type');
        }

        if (options.sandboxGlobal) {
            Object.assign(this.sandboxGlobal, options.sandboxGlobal);
        }
        this.sandboxGlobal.global = this.sandboxGlobal;
    }

    /**
     * Judge whether it is a production environment. By default, judge by process.env.NODE_ENV
     */
    public get isProd() {
        return this.options?.isProd || process.env.NODE_ENV === 'production';
    }

    /**
     * Current app name, default is 'ssr-genesis'
     */
    public get name() {
        return this.options.name || 'ssr-genesis';
    }

    public get extractCSS() {
        if (this.isProd) {
            return this.options?.build?.extractCSS ?? true;
        }
        return false;
    }

    public get publicPath() {
        return `/${this.name}/`;
    }
    public get publicPathVarName() {
        return SSR.getPublicPathVarName(this.name);
    }
    /**
     * CDN resource public path, Only valid in production mode
     */
    public get cdnPublicPath() {
        if (!this.isProd) return '';
        return this.options?.cdnPublicPath || '';
    }
    /**
     * Project root
     */
    public get baseDir() {
        return this.options?.build?.baseDir || path.resolve();
    }

    /**
     * Compiled output directory
     */
    public get outputDir() {
        return path.resolve(this.baseDir, `./dist/${this.name}`);
    }

    public get outputDirInTemplate() {
        return path.resolve(this.outputDir, 'template');
    }

    /**
     * Client compile output directory
     */
    public get outputDirInClient() {
        return path.resolve(this.outputDir, './client');
    }

    /**
     * Server compile output directory
     */
    public get outputDirInServer() {
        return path.resolve(this.outputDir, './server');
    }

    /**
     * Compile source entry directory
     */
    public get srcDir() {
        return path.resolve(this.baseDir, './src');
    }

    /**
     * Directory to be compiled by webpack
     */
    public get srcIncludes() {
        return [...this.transpile, this.srcDir, path.resolve(this.outputDirInTemplate)];
    }

    public get transpile() {
        return this.options?.build?.transpile || [];
    }

    /**
     * Client side compile entry file
     */
    public get entryClientFile() {
        return path.resolve(this.outputDirInTemplate, 'entry-client');
    }

    /**
     * Server side compile entry file
     */
    public get entryServerFile() {
        return path.resolve(this.outputDirInTemplate, 'entry-server');
    }
    /**
     * Manifest file path of client
     */
    public get outputClientManifestFile() {
        return path.resolve(this.outputDirInServer, 'vue-ssr-client-manifest.json');
    }

    /**
     * Manifest file path of server
     */
    public get outputServeAppFile() {
        return path.resolve(this.outputDirInServer, 'js/app.js');
    }

    /**
     * Template path
     */
    public get templateFile() {
        return this.options?.build?.template || path.resolve(this.srcDir, 'index.html');
    }

    public get moduleReplace() {
        return this.options?.build?.moduleReplace || {};
    }

    /**
     * Template output path
     */
    public get outputTemplateFile() {
        return path.resolve(this.outputDirInServer, 'index.html');
    }

    /**
     * Get the configuration of browsers
     */
    public getBuildTarget(env: keyof Genesis.Target) {
        return (this.options?.build?.target || {
            client: 'web',
            server: 'node'
        })[env];
    }

    /**
     * Create a renderer
     */
    public createRenderer() {
        return new this.Renderer(this);
    }
}
