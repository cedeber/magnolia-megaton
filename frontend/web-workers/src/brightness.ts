onmessage = event => {
    const image = event.data.image;

    if (image && image.data) {
        const imageData = image.data;
        let colorSum = 0;

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];

            // colorSum += Math.sqrt(0.299 * r * r + 0.587 * g * g  + 0.114 * b * b); // more accurate
            colorSum += Math.floor((r * 299 + g * 587 + b * 114) / 1000); // from W3C
        }

        const brightness = Math.floor(colorSum / (image.width * image.height));

        postMessage(brightness);
    } else {
        postMessage(-1);
    }
};
