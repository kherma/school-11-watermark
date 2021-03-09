const { existsSync } = require("fs");
const { quality } = require("jimp");
const Jimp = require("jimp");
const inquirer = require("inquirer");

const addTextWatermarkToImage = async (inputFile, outputFile, text) => {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
    const textData = {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };
    image.print(font, 10, 10, textData, image.getWidth(), image.getHeight());
    await image.quality(100).writeAsync(outputFile);
    console.log("Process succeed");
    startApp();
  } catch (error) {
    console.log("Something went wrong... Try again!");
    startApp();
  }
};

const addImageWatermarkToImage = async (
  inputFile,
  outputFile,
  watermarkFile
) => {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;
    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5,
    });
    await image.quality(100).writeAsync(outputFile);
    console.log("Process succeed");
    startApp();
  } catch (error) {
    console.log("Something went wrong... Try again!");
    startApp();
  }
};

const prepareOutputFilename = (fileName) => {
  const nameSplit = fileName.split(".");
  return `${nameSplit[0]}-with-watermark.${nameSplit[1]}`;
};

prepareOutputFilename("file.png");

const startApp = async () => {
  const answer = await inquirer.prompt([
    {
      name: "start",
      message:
        'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
      type: "confirm",
    },
  ]);

  if (!answer.start) process.exit();

  const options = await inquirer.prompt([
    {
      name: "inputImage",
      type: "input",
      message: "What file do you want to mark?",
      default: "test.jpg",
    },
    {
      name: "watermarkType",
      type: "list",
      choices: ["Text watermark", "Image watermark"],
    },
  ]);

  if (options.watermarkType === "Text watermark") {
    const text = await inquirer.prompt([
      {
        name: "value",
        type: "input",
        message: "Type your watermark text:",
      },
    ]);
    options.watermarkText = text.value;

    if (existsSync("./img/" + options.inputImage)) {
      addTextWatermarkToImage(
        "./img/" + options.inputImage,
        "./img/" + prepareOutputFilename(options.inputImage),
        options.watermarkText
      );
    } else {
      console.log("The path does not exist");
      startApp();
    }
  } else {
    const image = await inquirer.prompt([
      {
        name: "filename",
        type: "input",
        message: "Type your watermark name:",
        default: "logo.png",
      },
    ]);
    options.watermarkImage = image.filename;

    if (
      existsSync("./img/" + options.inputImage) &&
      existsSync("./img/" + options.watermarkImage)
    ) {
      addImageWatermarkToImage(
        "./img/" + options.inputImage,
        "./img/" + prepareOutputFilename(options.inputImage),
        "./img/" + options.watermarkImage
      );
    } else {
      console.log("The path does not exist");
      startApp();
    }
  }
};

startApp();
