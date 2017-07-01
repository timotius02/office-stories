// Reference: https://www.viget.com/articles/instagram-style-filters-in-html5-canvas
export function toasterGradient(width: number, height: number) {
  const texture = document.createElement("canvas");
  const ctx = texture.getContext("2d");

  texture.width = width;
  texture.height = height;

  // Fill a Radial Gradient
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width * 0.6
  );

  gradient.addColorStop(0, "#804e0f");
  gradient.addColorStop(1, "#3b003b");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return ctx;
}

export function blend(
  background,
  foreground,
  width: number,
  height: number,
  transform
) {
  var bottom = background.getImageData(0, 0, width, height);
  var top = foreground.getImageData(0, 0, width, height);

  for (var i = 0, size = top.data.length; i < size; i += 4) {
    // red
    top.data[i + 0] = transform(bottom.data[i + 0], top.data[i + 0]);
    // green
    top.data[i + 1] = transform(bottom.data[i + 1], top.data[i + 1]);
    // blue
    top.data[i + 2] = transform(bottom.data[i + 2], top.data[i + 2]);
    // the fourth slot is alpha. We don't need that (so skip by 4)
  }

  return top;
}

// prettier-ignore
var DELTA_INDEX = [
      0,    0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1,  0.11,
      0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
      0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
      0.44, 0.46, 0.48, 0.5,  0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
      0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
      1.0,  1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
      1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0,  2.12, 2.25,
      2.37, 2.50, 2.62, 2.75, 2.87, 3.0,  3.2,  3.4,  3.6,  3.8,
      4.0,  4.3,  4.7,  4.9,  5.0,  5.5,  6.0,  6.5,  6.8,  7.0,
      7.3,  7.5,  7.8,  8.0,  8.4,  8.7,  9.0,  9.4,  9.6,  9.8,
      10.0
  ];

function multiply(a: number[], b: number[]) {
  var i,
    j,
    k,
    col = [];

  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      col[j] = a[j + i * 5];
    }
    for (j = 0; j < 5; j++) {
      var val = 0;
      for (k = 0; k < 5; k++) {
        val += b[j + k * 5] * col[k];
      }
      a[j + i * 5] = val;
    }
  }
}

export function colorMatrix(imageData, options) {
  var brightness = options.brightness || 0;
  var contrast = options.contrast || 0;

  // prettier-ignore
  var matrix = [
    1,0,0,0,0,
    0,1,0,0,0,
    0,0,1,0,0,
    0,0,0,1,0,
    0,0,0,0,1
  ];

  // Contrast
  var x;
  if (contrast < 0) {
    x = 127 + contrast / 100 * 127;
  } else {
    x = contrast % 1;

    if (x == 0) {
      x = DELTA_INDEX[contrast];
    } else {
      x =
        DELTA_INDEX[contrast << 0] * (1 - x) +
        DELTA_INDEX[(contrast << 0) + 1] * x;
    }

    x = x * 127 + 127;
  }
  // prettier-ignore
  multiply (matrix, [
      x/127,0,0,0,0.5*(127-x),
      0,x/127,0,0,0.5*(127-x),
          0,0,x/127,0,0.5*(127-x),
          0,0,0,1,0,
          0,0,0,0,1
    ]);

  // prettier-ignore
  multiply (matrix,[
          1,0,0,0, brightness,
          0,1,0,0, brightness,
          0,0,1,0, brightness,
          0,0,0,1,0,
        0,0,0,0,1
      ])

  // Apply Filter
  var data = imageData.data;
  var l = data.length;
  var r, g, b, a;
  var m0 = matrix[0],
    m1 = matrix[1],
    m2 = matrix[2],
    m3 = matrix[3],
    m4 = matrix[4];
  var m5 = matrix[5],
    m6 = matrix[6],
    m7 = matrix[7],
    m8 = matrix[8],
    m9 = matrix[9];
  var m10 = matrix[10],
    m11 = matrix[11],
    m12 = matrix[12],
    m13 = matrix[13],
    m14 = matrix[14];
  var m15 = matrix[15],
    m16 = matrix[16],
    m17 = matrix[17],
    m18 = matrix[18],
    m19 = matrix[19];

  for (var i = 0; i < l; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    a = data[i + 3];
    data[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4; // red
    data[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9; // green
    data[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14; // blue
    data[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19; // alpha
  }

  return imageData;
}

export function processPurple(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  var gradient = toasterGradient(width, height);

  var screen = blend(ctx, gradient, width, height, function(
    bottomPixel,
    topPixel
  ) {
    return 255 - (255 - topPixel) * (255 - bottomPixel) / 255;
  });

  var colorCorrected = colorMatrix(screen, {
    contrast: 30,
    brightness: 0
  });

  ctx.putImageData(colorCorrected, 0, 0);
}
// Sepia tones
// prettier-ignore
var r = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
g = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
b = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];

export function processSepia(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  // noise value
  let noise = 20;
  // get current image data
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < imageData.data.length; i += 4) {
    // change image colors
    imageData.data[i] = r[imageData.data[i]];
    imageData.data[i + 1] = g[imageData.data[i + 1]];
    imageData.data[i + 2] = b[imageData.data[i + 2]];
    // apply noise
    if (noise > 0) {
      noise = Math.round(noise - Math.random() * noise);
      for (var j = 0; j < 3; j++) {
        var iPN = noise + imageData.data[i + j];
        imageData.data[i + j] = iPN > 255 ? 255 : iPN;
      }
    }
  }

  // put image data back to context
  ctx.putImageData(imageData, 0, 0);
}

export function processGreyscale(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] = brightness;
    // green
    data[i + 1] = brightness;
    // blue
    data[i + 2] = brightness;
  }

  // overwrite original image
  ctx.putImageData(imageData, 0, 0);
}
