/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.ttf" {
  const fontData: ArrayBuffer;
  export default fontData;
}

declare global {
  interface Window {
    __theme?: {
      value: "light" | "dark";
    };
  }
}

export {};
