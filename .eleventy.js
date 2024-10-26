module.exports = function(eleventyConfig) {

    // Copier les fichiers statiques vers le dossier de sortie
    eleventyConfig.addPassthroughCopy("src/static");
    eleventyConfig.addPassthroughCopy("src/styles.css");
    eleventyConfig.addPassthroughCopy("src/script.js");
  
    // Configurer les répertoires racine et de sortie
    return {
      dir: {
        input: "src",
        output: "_site",
        includes: "_includes",
        layouts: "_layouts"
      },
      passthroughFileCopy: true
    };
  };
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(syntaxHighlight);

  // ... (le reste de la configuration)
};
module.exports = function(eleventyConfig) {

    // ... (autres configurations)
  
    eleventyConfig.addCollection("posts", function(collectionApi) {
      return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
        return b.date - a.date;
      });
    });
  
    // ... (retour de la configuration)
  };