/**
 * Konfiguration av Vue. 
 */

module.exports = {
    outputDir: '../wwwroot',
    assetsDir: 'assets',
    lintOnSave: true,
    filenameHashing: false, // Generera .css och .js utan hashning

    // Import scss variables to access them in every component
    css: {
      loaderOptions: {
        sass: {
          data: `
            @import "@/themes/variables.scss";            
          `
        }
      }
    },
    
    configureWebpack: {
        devtool: 'source-map'
    },   
    pluginOptions: 
    {
        i18n: {        
        enableInSFC: false // Enable locale messages in Single file components
      }
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        public: 'localhost:8080'
      }
}