import path from 'node:path'
import { type InlineConfig, mergeConfig, type PluginOption } from 'vite'
import { type Genesis } from 'genesis3'
import viteFederation from '@originjs/vite-plugin-federation'

export function mergeViteConfig (genesis: Genesis, config: InlineConfig, isNode = false): InlineConfig {
  const plugins: PluginOption[] = []
  const { federation } = genesis
  if (federation && !isNode) {
    const exposes: Record<string, string> = {}
    const remotes: Record<string, string> = {}
    if (Array.isArray(federation.exposes)) {
      for (const filename of federation.exposes) {
        exposes[`./${filename}`] = path.resolve(genesis.root, filename)
      }
    }
    if (Array.isArray(federation.remotes)) {
      for (const { name } of federation.remotes) {
        remotes[name] = path.resolve(genesis.root, `node_modules/${name}/client/assets/remote-entry.js`)
        // remotes[name] = path.resolve(genesis.root, `node_modules/${name}/server/assets/remote-entry.js`)
      }
    }
    plugins.push(viteFederation({
      name: genesis.name,
      filename: 'remote-entry.js',
      shared: federation.shared,
      shareScope: federation.shareScope,
      exposes,
      remotes
    }))
  }
  return mergeConfig<InlineConfig, InlineConfig>(config, {
    root: genesis.root,
    base: genesis.base,
    plugins
  })
}
