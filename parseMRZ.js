/* eslint-disable no-restricted-syntax */
/**
 * Library for detect and parse data in mrz
 *
 * TD1    -> https://www.icao.int/publications/Documents/9303_p5_cons_en.pdf
 * TD2    -> https://www.icao.int/publications/Documents/9303_p6_cons_en.pdf
 * TD3    -> https://www.icao.int/publications/Documents/9303_p4_cons_en.pdf
 * VISAS  -> https://www.icao.int/publications/Documents/9303_p7_cons_en.pdf
 *
 */

const ERR_TYPE_NOT_SUPPORTED = 'ERR_TYPE_NOT_SUPPORTED';
const ERR_INVALID_DATA = 'ERR_INVALID_DATA';

function splitLines(detection) { return detection.split(/[\r\n]+/) };

function cleanSpaces(text) { return text.replace(/\s/g, '') };

function detectZone(detection) {
    return detection
        .map((line) => cleanSpaces(line))
        .filter((line) => /[A-Z0-9<]{30,}/.test(line));
}


function detectType(zone) {
    const firstLine = zone[0];

    if (zone.some((x) => x.length !== firstLine.length)) {
        return;
    }

    let type;
    switch (zone.length) {
        case 2:
            switch (firstLine.length) {
                case 36:
                    type = 'TD2';
                    break;
                case 44:
                    type = 'TD3';
                    break;
                default:
                    break;
            }
            break;
        case 3:
            switch (firstLine.length) {
                case 30:
                    type = 'TD1';
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }

    return type;
};

function cleanModel(fields) {
    const model = {};
    Object.keys(fields).forEach((element) => {
        model[element] = fields[element] && fields[element].replace(/</g, ' ').trimRight().replace(/  /g, ', ');
    });

    return model;
};

function validateModel(fields, regexL1, regexL2, regexL3) {
    const fieldsList = Object.keys(fields);

    let regexL1Fields = [];
    if (regexL1) {
        regexL1Fields = regexL1.source.split(/<|>/)
            .filter(x => !/[^_]/.test(x));
    }

    let regexL2Fields = [];
    if (regexL2) {
        regexL2Fields = regexL2.source.split(/<|>/)
            .filter(x => !/[^_]/.test(x));
    }

    let regexL3Fields = [];
    if (regexL3) {
        regexL3Fields = regexL3.source.split(/<|>/)
            .filter(x => !/[^_]/.test(x));
    }

    const regexFields = [...regexL1Fields, ...regexL2Fields, ...regexL3Fields];

    for (const field of regexFields) {
        if (!fieldsList.includes(field)) {
            throw new Error(ERR_INVALID_DATA);
        }
    }
};

function parseTD1(mrz) {
    const regexL1 = new RegExp([
        '(?<doc_type>[0-9A-Z<]{1})',
        '(?<doc_subtype>[A-Z<]{1})',
        '(?<country>[0-9A-Z<]{3})',
        '(?<doc_number>[0-9A-Z<]{9})',
        '(?<doc_number_check>[0-9A-Z<]{1})',
        '(?<complement>[0-9A-Z<]{15})'
    ].join(''));
    const regexL2 = new RegExp([
        '(?<birth_date>[0-9A-Z<]{6})',
        '(?<birth_date_check>[0-9A-Z<]{1})',
        '(?<sex>[mfMF<]{1})',
        '(?<expire_date>[0-9A-Z<]{6})',
        '(?<expire_date_check>[0-9A-Z<]{1})',
        '(?<nacionality>[0-9A-Z<]{3})',
        '(?<optional_data>[A-Z0-9<]{11})',
        '(?<linecheck>[0-9A-Z<]{1})'
    ].join(''));
    const regexL3 = new RegExp([
        '(?<full_name>[A-Z<]{30})'
    ].join(''));

    const fields = {};
    mrz.zone.forEach((x) => {
        regexL1.test(x) && Object.assign(fields, regexL1.exec(x).groups);
        regexL2.test(x) && Object.assign(fields, regexL2.exec(x).groups);
        regexL3.test(x) && Object.assign(fields, regexL3.exec(x).groups);
    });

    validateModel(fields, regexL1, regexL2, regexL3);

    return cleanModel(fields);
};

function parseTD2(mrz) {
    const regexL1 = new RegExp([
        '(?<doc_type>[0-9A-Z<]{1})',
        '(?<doc_subtype>[A-Z<]{1})',
        '(?<country>[0-9A-Z<]{3})',
        '(?<full_name>[A-Z<]{31})'
    ].join(''));

    const regexL2 = new RegExp([
        '(?<doc_number>[0-9A-Z<]{9})',
        '(?<doc_numbercheck>[0-9A-Z<]{1})',
        '(?<nacionality>[0-9A-Z<]{3})',
        '(?<birth_date>[0-9A-Z<]{6})',
        '(?<birth_date_check>[0-9A-Z<]{1})',
        '(?<sex>[mfMF]{1})',
        '(?<expire_date>[0-9A-Z<]{6})',
        '(?<expire_date_check>[0-9A-Z<]{1})',
        '(?<optional_data>[A-Z0-9<]{7})',
        '(?<line_check>[0-9A-Z<]{1})'
    ].join(''));

    const fields = {};
    mrz.zone.forEach((x) => {
        regexL1.test(x) && Object.assign(fields, regexL1.exec(x).groups);
        regexL2.test(x) && Object.assign(fields, regexL2.exec(x).groups);
    });

    fields

    validateModel(fields, regexL1, regexL2);

    return cleanModel(fields);
};

function parseTD3(mrz) {
    const regexL1 = new RegExp([
        '(?<doc_type>[0-9A-Z<]{1})',
        '(?<doc_subtype>[A-Z<]{1})',
        '(?<country>[0-9A-Z<]{3})',
        '(?<full_name>[A-Z<]{39})'
    ].join(''));

    const regexL2 = new RegExp([
        '(?<doc_number>[0-9A-Z<]{9})',
        '(?<doc_number_check>[0-9A-Z<]{1})',
        '(?<nacionality>[0-9A-Z<]{3})',
        '(?<birth_date>[0-9A-Z<]{6})',
        '(?<birth_date_check>[0-9A-Z<]{1})',
        '(?<sex>[mfMF<]{1})',
        '(?<expire_date>[0-9A-Z<]{6})',
        '(?<expire_date_check>[0-9A-Z<]{1})',
        '(?<personal_number>[A-Z0-9<]{14})',
        '(?<personal_number_check>[0-9A-Z<]{1})',
        '(?<linecheck>[0-9A-Z<]{1})'
    ].join(''));

    const fields = {};

    Object.assign(fields, regexL1.exec(mrz.zone[0]).groups)
    Object.assign(fields, regexL2.exec(mrz.zone[1]).groups)

    validateModel(fields, regexL1, regexL2, null, mrz);

    return cleanModel(fields);
};


/**
 * Detect a mrz type and lines from a string
 *
 * @param { String } detection
 */

function detect(detection) {
    const lines = splitLines(detection);
    const zone = detectZone(lines);
    const type = detectType(zone);

    return {
        type,
        zone
    };
};

function parse(mrz) {
    switch (mrz.type) {
        case 'TD1':
            return parseTD1(mrz);
        case 'TD2':
            return parseTD2(mrz);
        case 'TD3':
            return parseTD3(mrz);
        default:
            throw new Error(ERR_TYPE_NOT_SUPPORTED);
    }
};


module.exports = {
    detect,
    parse
};