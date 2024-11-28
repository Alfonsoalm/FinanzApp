// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      viteStaticCopy({
        targets: [
          {
            src: "src/main/database/",
            // Ruta relativa al archivo que quieres incluir
            dest: "."
            // Copiar directamente a la raíz de la carpeta de salida
          },
          {
            src: "src/main/models/",
            // Ruta relativa al archivo que quieres incluir
            dest: "."
            // Copiar directamente a la raíz de la carpeta de salida
          }
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
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
