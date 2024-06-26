import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  paths: { base: "/viz/paperSimilarity" },
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: "build",
      assets: "build",
      fallback: "error.html",
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
