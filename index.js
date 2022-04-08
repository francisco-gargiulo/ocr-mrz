const fs = require('fs');
const getMRZ = require('./getMRZ');
const recognize = require('./recognize');
const { detect, parse } = require('./parseMRZ');

const ERR_NOT_TEXT_DETECTED = "ERR_NOT_TEXT_DETECTED";

async function readDocument(img) {
    try {
        const { filename, roi } = await getMRZ(img);

        const text = await recognize(console)(filename);

        if (!text) {
            throw new Error(ERR_NOT_TEXT_DETECTED)
        }

        fs.unlink(`./src/tmp/${filename}`, (error) => {
            if (error) {}
        });

        const detection = detect(text);

        console.log(detection);

        return {
            data: parse(detection),
            roi
        }
    } catch (error) {
        console.error(error);
    }
};

const img = fs.readFileSync('./id.png');

(async() => {
    const data = await readDocument(img);

    console.log(data);
})();