const { createCanvas, loadImage } = require('canvas');

const { createWorker } = require('tesseract.js');
const fs = require('fs');


const recognizeImage = async (imageUrl) => {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageUrl);

    await worker.terminate();
    return text;
};


const captchaExtractor = async (imageUrl) => {
    // Load the image
    const image = await loadImage(imageUrl);

    // Create a canvas
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');

    // Draw black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image on top of the black background
    context.drawImage(image, 0, 0);

    // Convert the canvas to a PNG data URL
    const backgroundImgUrl = canvas.toDataURL('image/png');
    console.log(backgroundImgUrl)
    const text = await recognizeImage(backgroundImgUrl);
    // console.log(text)
    return text;
}

module.exports = captchaExtractor;