import path from 'path';
import process from 'process';
import { PluginManage } from './plugin';
import { Renderer } from './renderer';
export class SSR {
    /**
     * Constructor
     */
    constructor(options = {}) {
        /**
         * Renderer
         */
        this.Renderer = Renderer;
        this.options = options;
        this.plugin = new PluginManage(this);
        if ('name' in options && typeof options.name !== 'string') {
            throw new TypeError('Options.name can only be of string type');
        }
    }
    /**
     * Judge whether it is a production environment. By default, judge by process.env.NODE_ENV
     */
    get isProd() {
        return this.options?.isProd || process.env.NODE_ENV === 'production';
    }
    /**
     * Current app name, default is 'ssr-genesis'
     */
    get name() {
        return this.options.name || 'ssr-genesis';
    }
    /**
     * The basic path of client static resource loading, which is '/ssr-genesis/' by default
     */
    get publicPath() {
        return this.options?.build?.publicPath || `/${this.name}/`;
    }
    /**
     * CDN resource public path, Only valid in production mode
     */
    get cdnPublicPath() {
        if (!this.isProd)
            return '';
        return this.options?.cdnPublicPath || '';
    }
    /**
     * Project root
     */
    get baseDir() {
        return this.options?.build?.baseDir || path.resolve();
    }
    /**
     * Compiled output directory
     */
    get outputDir() {
        if (this.options?.build?.outputDir) {
            if (path.isAbsolute(this.options.build.outputDir)) {
                return this.options.build.outputDir;
            }
            return path.resolve(this.baseDir, this.options.build.outputDir);
        }
        return path.resolve(this.baseDir, `./dist/${this.name}`);
    }
    /**
     * Client compile output directory
     */
    get outputDirInClient() {
        return path.resolve(this.outputDir, './client');
    }
    /**
     * Server compile output directory
     */
    get outputDirInServer() {
        return path.resolve(this.outputDir, './server');
    }
    /**
     * Static file directory
     */
    get staticDir() {
        return path.resolve(this.outputDir, './client');
    }
    /**
     * Compile source entry directory
     */
    get srcDir() {
        return path.resolve(this.baseDir, './src');
    }
    /**
     * Directory to be compiled by webpack
     */
    get srcIncludes() {
        return [
            ...this.transpile,
            this.srcDir,
            path.resolve(this.outputDir, './src')
        ];
    }
    get transpile() {
        return this.options?.build?.transpile || [];
    }
    /**
     * Client side compile entry file
     */
    get entryClientFile() {
        return path.resolve(this.outputDir, 'src/entry-client');
    }
    /**
     * Server side compile entry file
     */
    get entryServerFile() {
        return path.resolve(this.outputDir, 'src/entry-server');
    }
    /**
     * Manifest file path of client
     */
    get outputClientManifestFile() {
        return path.resolve(this.outputDirInServer, 'vue-ssr-client-manifest.json');
    }
    /**
     * Manifest file path of server
     */
    get outputServerBundleFile() {
        return path.resolve(this.outputDirInServer, 'vue-ssr-server-bundle.json');
    }
    /**
     * Template path
     */
    get templateFile() {
        return (this.options?.build?.template ||
            path.resolve(this.srcDir, 'index.html'));
    }
    /**
     * Template output path
     */
    get outputTemplateFile() {
        return path.resolve(this.outputDirInServer, 'index.html');
    }
    /**
     * Get the configuration of browsers
     */
    getBrowsers(env) {
        return (this.options?.build?.browsers || {
            client: ['ie >= 9', 'ios >= 5', 'android >= 4.0'],
            server: [`node >= ${process.versions.node}`]
        })[env];
    }
    /**
     * Create a renderer
     */
    createRenderer(options) {
        return new this.Renderer(this, options);
    }
}
