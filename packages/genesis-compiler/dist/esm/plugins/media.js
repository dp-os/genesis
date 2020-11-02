import { Plugin } from '@fmfe/genesis-core';
export class MediaPlugin extends Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('media')
            .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i)
            .include.add(this.ssr.srcIncludes)
            .end()
            .use('file')
            .loader('file-loader')
            .options({
            esModule: false,
            name: this.ssr.isProd
                ? 'medias/[name].[contenthash:8].[ext]'
                : 'medias/[path][name].[ext]'
        });
    }
}
