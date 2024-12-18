import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.js')
        }
      }
    },
    plugins: [
      externalizeDepsPlugin(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/main/database/',
            dest: 'database/' // Carpeta de salida
          },
          {
            src: 'src/main/services/',
            dest: 'services/' // Carpeta de salida
          },
          {
            src: 'src/main/helpers/',
            dest: 'helpers/' // Carpeta de salida
          },
        ]
      })
    ]
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.mjs')
        }
      }

      
    },
    plugins: [
      externalizeDepsPlugin(),
      viteStaticCopy({
        targets:[
          {
            src: 'src/preload/',
            dest: 'preload/' // Carpeta de salida
          }
        ]
      })
    ]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    },
    // resolve: {
    //   alias: {
    //     '@renderer': resolve('src/renderer/src')
    //   }
    // },
    plugins: [react()]
  },
  build: {
    outDir: 'dist',
  },
})
