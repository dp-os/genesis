# 📚 文档

## 引导
- ❓ [为什么使用Genesis？](./why.md#%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8genesis)
  - [什么是模块即服务?](./why.md#%E4%BB%80%E4%B9%88%E6%98%AF%E6%A8%A1%E5%9D%97%E5%8D%B3%E6%9C%8D%E5%8A%A1)
  - [微服务架构](./why.md#%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84)
  - [公共服务](./why.md#%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1)
  - [最后](./why.md#%E6%9C%80%E5%90%8E)
- [🚀 快速开始](./quick-start.md)
  - [💪 TS的支持](./quick-start.md#TS的支持)
  - [😅 Express](./quick-start.md#express)
  - [🔨 例子实现](./quick-start.md#例子实现)
    - [genesis.ts](./quick-start.md#genesists)
    - [genesis.build.ts](./quick-start.md#genesisbuildts)
    - [genesis.dev.ts](./quick-start.md#genesisdevts)
    - [genesis.prod.ts](./quick-start.md#genesisprodts)
    - [tsconfig.json](./quick-start.md#tsconfigjson)
    - [tsconfig.node.json](./quick-start.md#tsconfignodejson)
    - [package.json](./quick-start.md#packagejson)
  - [✨ 全部的能力](./quick-start.md#全部的能力)
- [😎 Webpack module federation](./webpack-module-federation.md)
  - [使用MF插件](./webpack-module-federation.md#%E4%BD%BF%E7%94%A8mf%E6%8F%92%E4%BB%B6)
    - [host端](./webpack-module-federation.md#host%E7%AB%AF)
    - [remote端](./webpack-module-federation.md#remote%E7%AB%AF)
  - [Node端实现module federation原理](./webpack-module-federation.md#node%E7%AB%AF%E5%AE%9E%E7%8E%B0module-federation%E5%8E%9F%E7%90%86)
    - [编译阶段](./webpack-module-federation.md#%E7%BC%96%E8%AF%91%E9%98%B6%E6%AE%B5)
    - [运行阶段](./webpack-module-federation.md#%E8%BF%90%E8%A1%8C%E9%98%B6%E6%AE%B5)
    - [轮询阶段](./webpack-module-federation.md#%E8%BD%AE%E8%AF%A2%E9%98%B6%E6%AE%B5)
    - [安装依赖时，自动下载远程模块的类型文件](./webpack-module-federation.md#%E5%AE%89%E8%A3%85%E4%BE%9D%E8%B5%96%E6%97%B6%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E8%BF%9C%E7%A8%8B%E6%A8%A1%E5%9D%97%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%96%87%E4%BB%B6)
  - [最后](./webpack-module-federation.md#%E6%9C%80%E5%90%8E)
- [状态管理](./state.md)
  - [服务端设置状态](./state.md#服务端设置状态)
  - [客户端读取状态](./state.md#客户端读取状态)
- [💥 管理HTML元数据](./vue-meta.md)
  - [⬇️ 安装依赖](./vue-meta.md#安装依赖)
  - [🔨 快速使用](./vue-meta.md#快速使用)
  - [🔨 模板写入元数据](./vue-meta.md#模板写入元数据)
  - [🔨 模板读取元数据](./vue-meta.md#模板读取元数据)

## 进阶
  - [Webpack](./webpack.md)
  - [Babel](./babel.md)
  - [Postcss](./postcss.md)

## API
😁如果上面的内容，已经不能满足你了，你可以看下API的说明，它详细的阐述了核心API的作用，那么从这里开始深入的了解它吧
- [SSR 选项](./ssr-options.md#选项)
  - [name](./ssr-options.md#name)
  - [isProd](./ssr-options.md#isprod)
  - [cdnPublicPath](./ssr-options.md#cdnpublicpath)
  - [sandboxGlobal](./ssr-options.md#sandboxglobal)
  - [build.extractCSS](./ssr-options.md#buildextractcss)
  - [build.baseDir](./ssr-options.md#buildbasedir)
  - [build.transpile](./ssr-options.md#buildtranspile)
  - [build.alias](./ssr-options.md#buildalias)
  - [build.fallback](./ssr-options.md#buildfallback)
  - [build.template](./ssr-options.md#buildtemplate)
  - [build.target](./packages/genesis-core/README.md#buildtarget)
- [SSR 实例](./ssr-instance.md#ssr)
  - [属性](./ssr-instance.md#%E5%B1%9E%E6%80%A7)
    - [Renderer](./ssr-instance.md#renderer)
    - [options](./ssr-instance.md#options)
    - [plugin](./ssr-instance.md#plugin)
    - [entryName](./ssr-instance.md#entryname)
    - [sandboxGlobal](./ssr-instance.md#sandboxglobal)
    - [isProd](./ssr-instance.md#isprod)
    - [name](./ssr-instance.md#name)
    - [extractCSS](./ssr-instance.md#extractcss)
    - [publicPath](./ssr-instance.md#publicpath)
    - [publicPathVarName](./ssr-instance.md#publicpathvarname)
    - [cdnPublicPath](./ssr-instance.md#cdnpublicpath)
    - [baseDir](./ssr-instance.md#basedir)
    - [outputDir](./ssr-instance.md#outputdir)
    - [outputDirInTemplate](./ssr-instance.md#outputdirintemplate)
    - [outputDirInClient](./ssr-instance.md#outputdirinclient)
    - [outputDirInServer](./ssr-instance.md#outputdirinserver)
    - [srcDir](./ssr-instance.md#srcdir)
    - [srcIncludes](./ssr-instance.md#srcincludes)
    - [transpile](./ssr-instance.md#transpile)
    - [entryClientFile](./ssr-instance.md#entryclientfile)
    - [entryServerFile](./ssr-instance.md#entryserverfile)
    - [outputClientManifestFile](./ssr-instance.md#outputclientmanifestfile)
    - [outputServeAppFile](./ssr-instance.md#outputserveappfile)
    - [templateFile](./ssr-instance.md#templatefile)
    - [outputTemplateFile](./ssr-instance.md#outputtemplatefile)
  - [方法](./ssr-instance.md#%E6%96%B9%E6%B3%95)
    - [getBuildTarget](./ssr-instance.md#getbuildtarget)
    - [createRenderer](./ssr-instance.md#createrenderer)
- [Renderer](./renderer-instance.md#renderer)
  - [属性](./renderer-instance.md#%E5%B1%9E%E6%80%A7)
    - [ssr](./renderer-instance.md#ssr)
    - [clientManifest](./renderer-instance.md#clientmanifest)
    - [staticPublicPath](./renderer-instance.md#staticpublicpath)
    - [staticDir](./renderer-instance.md#staticdir)
  - [方法](./renderer-instance.md#%E6%96%B9%E6%B3%95)
    - [reload](./renderer-instance.md#reload)
    - [renderJson](./renderer-instance.md#renderjson)
    - [renderHtml](./renderer-instance.md#renderhtml)
    - [render](./renderer-instance.md#render)
    - [renderMiddleware](./renderer-instance.md#rendermiddleware)
- [MF](./mf-instance.md#mf)
  - [属性](./mf-instance.md#%E5%B1%9E%E6%80%A7)
    - [options](./mf-instance.md#options)
    - [exposes](./mf-instance.md#exposes)
    - [exposes.manifest](./mf-instance.md#exposesmanifest)
    - [remote](./mf-instance.md#remote)
    - [entryName](./mf-instance.md#entryname)
    - [haveExposes](./mf-instance.md#haveexposes)
    - [varName](./mf-instance.md#varname)
    - [output](./mf-instance.md#output)
    - [outputManifest](./mf-instance.md#outputmanifest)
    - [manifestRoutePath](./mf-instance.md#manifestroutepath)
  - [方法](./mf-instance.md#%E6%96%B9%E6%B3%95)
    - [getWebpackPublicPathVarName](./mf-instance.md#getwebpackpublicpathvarname)
    - [exposes.getManifest](./mf-instance.md#exposesgetmanifest)
    - [remote.inject](./mf-instance.md#remoteinject)
    - [remote.init](./mf-instance.md#remoteinit)
    - [remote.fetch](./mf-instance.md#remotefetch)
