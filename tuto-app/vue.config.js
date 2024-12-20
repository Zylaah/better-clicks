const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: "com.numerix.id",
        productName: "Numérix",
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
          artifactName: "Numérix.${ext}"
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
