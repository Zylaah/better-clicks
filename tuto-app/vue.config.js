const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        __VUE_PROD_DEVTOOLS__: false
      })
    ]
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: "com.numerix.id",
        productName: "Numerix",
        directories: {
          output: "dist_electron"
        },
        win: {
          icon: "build/icon.ico",
          target: [
            {
              target: "portable",
              arch: ["x64"]
            }
          ],
          artifactName: "Numerix.${ext}"
        },
        mac: {
          icon: "build/icon.icns",
          target: ["dmg"]
        },
        linux: {
          icon: "build/icon.png",
          target: ["AppImage"]
        }
      }
    }
  }
})
