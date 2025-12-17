// Global typings for user-script environment and exposed GPTK globals

declare global {
  interface Window {
    gptkApi: import('../api/api').default;
    gptkCore: import('../gptk-core').default;
    gptkApiUtils: import('../api/api-utils').default;
    // Google Photos global data bag used by GPTK
    WIZ_global_data: any;
  }
}

/// <reference types="greasemonkey" />

export {};
