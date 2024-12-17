import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  main: {
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
          {
            src: 'src/preload/',
            dest: 'preload/' // Carpeta de salida
          },
          {
            src: 'src/renderer/',
            dest: 'renderer/' // Carpeta de salida
          },
        ]
      })
    ]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  },
  build: {
    outDir: 'dist',
  },
})
