const { EleventyEdgePlugin } = require("@11ty/eleventy");
/** @param {import('@11ty/eleventy/src/UserConfig')} config */
module.exports = config => {

  if (process.env.NODE_ENV === "development") {
    // minify html,svg and inline css and js
    config.addTransform("htmlmin", async (content, outputPath) => {
      if (outputPath && outputPath.endsWith(".html")) {
        let minified = await minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
          customAttrCollapse: /d/,
          ignoreCustomFragments: [
            /<!--ELEVENTYEDGE_edge.*ELEVENTYEDGE_edge-->/,
          ],
        });
        return minified;
      }

      return content;
    });
  } else {
    // else copy over the assets
    config.addPassthroughCopy("src/css");
    config.addPassthroughCopy("src/js");
  }

  config.addPlugin(EleventyEdgePlugin);

  config.addNunjucksFilter("rand", ([a, b]) => {
    let val = a + Math.floor(Math.random() * (b - a));
    return val;
  });
  config.addNunjucksFilter("clamp", ([x, a, b]) => Math.min(Math.max(x, a), b));

  return {
    dir: {
      input: "src",
    },
  };
};
