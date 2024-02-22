import { type Genesis, type Remote } from 'genesis3'
import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import JSZIP, { type JSZipObject } from 'jszip'

import { type Manifest } from '../build/build-federation'

/**
 * 获取远程依赖
*/
export async function getExposes (genesis: Genesis) {
  try {
    const remotes = genesis.federation?.remotes
    if (remotes) {
      for (const remote of remotes) {
        const { name, clientOrigin } = remote
        const { data: manifest } = await axios.get<Manifest>(`${clientOrigin}/${name}/node-exposes/manifest.json`)
        await loadExpose({
          remote,
          manifest
        })
      }
    }
  } catch (error) {
    console.error(new Error('get exposes failed'))
  }
}

/**
 * 根据配置加载远程资源
 * 如果存在 dts 则一并下载
*/
async function loadExpose ({
  remote,
  manifest
}: {
  remote: Remote
  manifest: Manifest
}) {
  const { name, clientOrigin } = remote
  const { client, server, dts } = manifest

  if (fs.existsSync(`./node_modules/${name}/manifest.json`)) {
    const localManifest: Manifest = JSON.parse(fs.readFileSync(`./node_modules/${name}/manifest.json`).toString('utf-8'))
    if (localManifest.client === client && localManifest.server === server) {
      console.log(`${name} no update`)
      return
    }
  }

  fs.mkdirSync(`./node_modules/${name}`, {
    recursive: true
  })
  fs.mkdirSync(`./node_modules/${name}/client`, {
    recursive: true
  })
  fs.mkdirSync(`./node_modules/${name}/server`, {
    recursive: true
  })

  fs.writeFileSync(`./node_modules/${name}/package.json`, JSON.stringify({
    name
  }, null, 4))
  fs.writeFileSync(`./node_modules/${name}/manifest.json`, JSON.stringify(manifest, null, 4))

  const clientFileUrl = `${clientOrigin}/${name}/node-exposes/${client}.zip`
  await loadFile(clientFileUrl, `./node_modules/${name}/client`)

  const serverFileUrl = `${clientOrigin}/${name}/node-exposes/${server}.zip`
  await loadFile(serverFileUrl, `./node_modules/${name}/server`)

  if (dts) {
    const url = `${clientOrigin}/${name}/node-exposes/${server}-dts.zip`
    await loadFile(url, `./node_modules/${name}`)
  }
}

/**
 * 加载远程资源并下载到本地
*/
async function loadFile (url: string, savePath: string) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer' // 类型必须为arraybuffer
  })
  const zip = new JSZIP()
  const zipData = await zip.loadAsync(res.data)
  await saveZipFiles(zipData.files, savePath)
}

/**
 * 保存解压后的资源
*/
async function saveZipFiles (files: Record<string, JSZipObject>, savePath: string) {
  for (const filename of Object.keys(files)) {
    const dest = path.join(savePath, filename)
    if (files[filename].dir) {
      fs.mkdirSync(dest, {
        recursive: true
      })
    } else {
      const content = await files[filename].async('nodebuffer')
      fs.writeFileSync(dest, content)
    }
  }
}
