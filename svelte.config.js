import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: "build",
      assets: "build",
      fallback: "error.html",
      precompress: false,
      strict: true
    })
  },
  paths: { base: "/viz/paperSimilarity", relative: false }
};

export default config;
