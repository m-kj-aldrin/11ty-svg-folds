import { EleventyEdge } from "eleventy:edge";
import precompiledAppData from "./_generated/eleventy-edge-app-data.js";

export default async (request, context) => {
  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,

      // default is [], add more keys to opt-in e.g. ["appearance", "username"]
      cookies: [],
    });

    const url = new URL(request.url)
    const nFolds = url.searchParams.get('n-folds') || 16
    const yStride = url.searchParams.get('y-stride') || 2
    
    edge.config(config => {
      config.addNunjucksFilter("rand", ([a, b]) => {
        let val = a + Math.floor(Math.random() * (b - a));
        return val;
      });
      config.addNunjucksFilter("clamp", ([x, a, b]) =>
        Math.min(Math.max(x, a), b)
      );
      config.addGlobalData('nFolds',nFolds)
      config.addGlobalData('yStride',yStride)
      // Add some custom Edge-specific configuration
      // e.g. Fancier json output
      // eleventyConfig.addFilter("json", obj => JSON.stringify(obj, null, 2));
    });

    return await edge.handleResponse();
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
