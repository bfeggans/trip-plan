var dest = "./client";
var src = './src';

module.exports = {
  browserSync: {
    /*server: {
      // Serve up our build folder
      baseDir: dest
    }*/
    proxy: "localhost:5000"
  },
  /*sass: {
    src: dest + "/styles/*.{sass,scss}",
    dest: dest + "/styles/build",
    settings: {
      indentedSyntax: true, // Enable .sass syntax!
      imagePath: 'images' // Used by the image-url helper
    }
  },*/
  jsx: {
    src: './app/components/**/*.jsx',
    dest: dest + '/scripts/components',
  },
  /*images: {
    src: src + "/images/**",
    dest: dest + "/images"
  },*/
  production: {
    cssSrc: dest + '/*.css',
    jsSrc: dest + '/*.js',
    dest: dest
  }
};
