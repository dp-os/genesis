import { BabelConfig, Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export class BabelPlugin extends Plugin {
    public async chainWebpack({ target, config }: WebpackHookParams) {
        const { isProd } = this.ssr;
        config.resolve.extensions.prepend('.js').prepend('.ts');
        const plugins = [
            ['@babel/plugin-transform-modules-commonjs'],
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-export-default-from'],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-private-methods', { loose: true }],
            [
                '@babel/plugin-proposal-private-property-in-object',
                { loose: true }
            ],
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: false
                }
            ],
            ['transform-vue-jsx']
        ];
        const presets = [
            [
                '@babel/preset-env',
                {
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 3
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
        const babelJS: BabelConfig = {
            target,
            plugins: [...plugins],
            presets: [...presets]
        };
        const babelTS: BabelConfig = {
            target,
            plugins: [...plugins],
            presets: presetsTS
        };
        Object.defineProperty(babelJS, 'target', {
            writable: false,
            enumerable: false
        });
        Object.defineProperty(babelTS, 'target', {
            writable: false,
            enumerable: false
        });
        await this.ssr.plugin.callHook('babel', babelJS);
        await this.ssr.plugin.callHook('babel', babelTS);
        const jsRule = config.module
            .rule('js')
            .test(/\.m?jsx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options(babelJS)
            .end();
        config.module
            .rule('ts')
            .test(/\.(t)sx?$/)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('babel')
            .loader('babel-loader')
            .options(babelTS)
            .end();
        if (isProd) {
            jsRule.use('thread-loader').loader('thread-loader').end();
        }
    }
}
