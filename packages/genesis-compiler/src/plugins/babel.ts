import { Plugin, WebpackHookParams, BabelConfig } from '@fmfe/genesis-core';
export class BabelPlugin extends Plugin {
    public async chainWebpack({ target, config }: WebpackHookParams) {
        const { isProd } = this.ssr;
        config.resolve.extensions.prepend('.js').prepend('.ts');
        const plugins = [
            ['@babel/plugin-transform-modules-commonjs'],
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-export-default-from'],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: false,
                    helpers: false
                }
            ]
        ];
        const presets = [
            [
                '@babel/preset-env',
                {
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 3,
                    include: [
                        'es.array.*',
                        'es.promise.*',
                        'es.object.assign',
                        'es.promise'
                    ],
                    targets: this.ssr.getBrowsers(target)
                }
            ]
        ];
        const presetsTS = [
            [
                'babel-preset-typescript-vue',
                {
                    allowNamespaces: true
                }
            ],
            ...presets
        ];
        const babeljs: BabelConfig = {
            target,
            plugins,
            presets
        };
        const babelts: BabelConfig = {
            target,
            plugins,
            presets: presetsTS
        };
        Object.defineProperty(babeljs, 'target', {
            writable: false,
            enumerable: false
        });
        Object.defineProperty(babelts, 'target', {
            writable: false,
            enumerable: false
        });
        await this.ssr.plugin.callHook('babel', babeljs);
        await this.ssr.plugin.callHook('babel', babelts);
        const jsRule = config.module
            .rule('js')
            .test(/\.m?jsx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options(babeljs)
            .end();
        config.module
            .rule('ts')
            .test(/\.(t)sx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options(babelts)
            .end();

        if (isProd) {
            jsRule
                .use('thread-loader')
                .loader('thread-loader')
                .end();
        }
    }
}
