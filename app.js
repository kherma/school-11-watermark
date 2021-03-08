const { quality } = require("jimp");
const Jimp = require("jimp");

const addTextWatermarkToImage = async (inputFile, outputFile, text) => {
  const image = await Jimp.read(inputFile);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
  const textData = {
    text,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
  };
  image.print(font, 10, 10, textData, image.getWidth(), image.getHeight());
  await image.quality(100).writeAsync(outputFile);
};

const addImageWatermarkToImage = async (
  inputFile,
  outputFile,
  watermarkFile
) => {
  const image = await Jimp.read(inputFile);
  const watermark = await Jimp.read(watermarkFile);
  const x = image.getWidth() / 2 - watermark.getWidth() / 2;
  const y = image.getHeight() / 2 - watermark.getHeight() / 2;
  image.composite(watermark, x, y, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacitySource: 0.5,
  });
  await image.quality(100).writeAsync(outputFile);
};

const initApp = () => {
  addTextWatermarkToImage(
    "./imageSource/test.jpg",
    "./test-with-watermark.jpg",
    "Hello world"
  );
  addImageWatermarkToImage(
    "./imageSource/test.jpg",
    "./test-with-watermark2.jpg",
    "./imageSource/logo.png"
  );
};

initApp();
