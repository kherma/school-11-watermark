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

const initApp = () => {
  addTextWatermarkToImage(
    "./imageSource/test.jpg",
    "./test-with-watermark.jpg",
    "Hello world"
  );
};

initApp();
