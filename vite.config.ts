import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  base: "/threejs-glsl-galaxy-generator-exp/",
  plugins: [glsl()],
});
