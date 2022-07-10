const typescript = require("rollup-plugin-typescript2")
const resolve = require('@rollup/plugin-node-resolve')

const path = require('path')

module.exports = (name, input) => {
    const external = []
    if(name !== 'core'){
        external.push('@shymean/react-vue')
    }
    return {
        input,
        plugins: [
            resolve.default({
                // 将自定义选项传递给解析插件
                customResolveOptions: {
                    moduleDirectory: 'node_modules'
                }
            }),
            typescript({
                tsconfigDefaults: {
                    exclude: [path.resolve(__dirname, `../packages/${name}/node_modules`)],
                    include: [path.resolve(__dirname, `../packages/${name}/src`)],
                    compilerOptions: {
                        // "declaration": true
                    }
                }

            })
        ],
        external
    };
}
