/*
 * floyd-steinberg
 *
 * Using 2D error diffusion formula published by Robert Floyd and Louis Steinberg in 1976
 *
 * Javascript implementation of Floyd-Steinberg algorithm thanks to Forrest Oliphant @forresto and @meemoo 
 * via iFramework https://github.com/meemoo/iframework/blob/master/src/nodes/image-monochrome-worker.js
 *
 * Accepts an object that complies with the HTML5 canvas imageData spec https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 * In particular, it makes use of the width, height, and data properties
 *
 * License: MIT
*/

module.exports = floyd_steinberg;

function floyd_steinberg(image) {
  var imageData = image.data;
  var imageDataLength = imageData.length;
  var w = image.width;
  var lumR = [],
      lumG = [],
      lumB = [];

  var newPixel, err;

  for (var i = 0; i < 256; i++) {
    lumR[i] = i * 0.299;
    lumG[i] = i * 0.587;
    lumB[i] = i * 0.110;
  }

  // Greyscale luminance (sets r pixels to luminance of rgb)
  for (var i = 0; i <= imageDataLength; i += 4) {
    imageData[i] = Math.floor(lumR[imageData[i]] + lumG[imageData[i+1]] + lumB[imageData[i+2]]);
  }

  for (var currentPixel = 0; currentPixel <= imageDataLength; currentPixel += 4) {
    // Bill Atkinson's dithering algorithm
    newPixel = imageData[currentPixel] < 129 ? 0 : 255;
    err = Math.floor((imageData[currentPixel] - newPixel) / 8);
    imageData[currentPixel] = newPixel;
    imageData[currentPixel       + 4 ] += err;
    imageData[currentPixel       + 8 ] += err;
    imageData[currentPixel + 4*w - 4 ] += err;
    imageData[currentPixel + 4*w     ] += err;
    imageData[currentPixel + 4*w + 4 ] += err;
    imageData[currentPixel + 8*w     ] += err;
        // Set g and b values equal to r (effectively greyscales the image fully)
    imageData[currentPixel + 1] = imageData[currentPixel + 2] = imageData[currentPixel];
  }

  return image;
}
