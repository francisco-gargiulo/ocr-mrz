const { exec } = require('child_process');

function getOptions(config) {
    const ocrOptions = ['tessdata-dir', 'user-words', 'user-patterns', 'psm', 'oem']

    return Object.keys(config)
        .map((key) => {
            if (['debug', 'presets'].includes(key)) {
                return;
            }

            if (key === 'lang') {
                return `-l ${config[key]}`;
            }

            if (ocrOptions.includes(key)) {
                return `--${key} ${config[key]}`;
            }

            return `-c ${key}=${config[key]}`;
        })
        .concat(config.presets)
        .filter(key => Boolean(key));
};

module.exports = (logger) => (filename) => {
    const config = {
        lang: 'ocrb_int',
        oem: 1,
        psm: 6,
        'tessdata-dir': __dirname,
        'user-words': `${__dirname}/ocrb.whitelist.txt`
    };

    const options = getOptions(config);
    const binary = config.binary || 'tesseract';

    const command = [binary, `${__dirname}/tmp/${filename}`, 'stdout', ...options].join(' ');

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error(stderr);
                reject(error);
            }
            logger.error(stderr);
            resolve(stdout);
        });
    });
};