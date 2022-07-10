let createRollupConfig = require('./rollup.config')

let path = require('path')

const rollup = require('rollup');

async function watch(inputOptions, outputOptions) {
  let watcher = rollup.watch({
    ...inputOptions,
    output: [outputOptions],
    watch: {
      chokidar: true,
      // include: "packages/nezha/src"
    }
  })

  // watcher.on('event', event => {
  //     console.log('重新打包中...', event.code)
  // }) // 处理监听事件
}


async function start() {
  let modules = ['core', 'router', 'store'].map(key => {
    return {
      name: key,
      input: path.resolve(__dirname, `../packages/${key}/src/index.ts`)
    }
  })

  for (let config of modules) {
    let rollupConfig = createRollupConfig(config.name, config.input)
    watch(rollupConfig, {
      file: path.resolve(__dirname, `../packages/${config.name}/esm/index.js`),
      format: 'es'
    })
    await watch(rollupConfig, {
      file: path.resolve(__dirname, `../packages/${config.name}/lib/index.js`),
      format: 'cjs'
    })
  }
}

start()


