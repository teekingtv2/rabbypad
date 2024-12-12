// const { defineConfig } = require("vite");
import { defineConfig } from "vite";

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        mnemonic: "./mnemonic.html",
        onboard: "./onboard.html",
        options: "./options.html",
        error: "./error.html",
        validate: "./validate.html",
        success: "./success.html",
      },
    },
  },
});
