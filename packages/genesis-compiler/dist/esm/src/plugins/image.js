import { Plugin } from '@fmfe/genesis-core';
export class ImagePlugin extends Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('file')
            .test(/\.(png|jpe?g|gif|svg)$/i)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('file')
            .loader('file-loader')
            .options({
            esModule: false,
            name: this.ssr.isProd
                ? 'images/[name].[contenthash:8].[ext]'
                : 'images/[path][name].[ext]'
        });
    }
}
