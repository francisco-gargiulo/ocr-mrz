# OCR For MRZ Recognition

## Introduction

Optical character recognition implementation for read travel documents based on Doc 9303 from ICAO.

## Requirements

### Install teseract on UBUNTU

    $ sudo apt install tesseract-ocr
    $ sudo apt install libtesseract-dev

## Install

    $ npm i
    $ node index.js

## General Usage

Execution:

```javascript
// replace the demo image and execute;
const img = fs.readFileSync("./id.png");

(async () => {
  const data = await readDocument(img);

  console.log(JSON.stringify(data, null, 2));
})();
```

Response:

```javascript
{
  data: {
    doc_type: 'P',
    doc_subtype: '',
    country: 'UTO',
    full_name: 'ERIKSSON, ANNA MARIA',
    doc_number: 'L898902C3',
    doc_number_check: '6',
    nacionality: 'UT0',
    birth_date: '740812',
    birth_date_check: '2',
    sex: 'F',
    expire_date: '120415',
    expire_date_check: '9',
    personal_number: 'ZE184226B',
    personal_number_check: '1',
    linecheck: '0'
  },
  roi: { // Region Of Interest
    meta: { angle: 90, ratio: 10.737704918032787 },
    roi: Roi {
      map: [RoiMap],
      id: 8,
      minX: 391,
      maxX: 451,
      minY: 49,
      maxY: 703,
      meanX: 421.0077992359932,
      meanY: 376.63635398981324,
      surface: 37696,
      computed: [Object]
    }
  }
}

```

## TODO

- Remove tmp files after recognition

## References

- https://www.icao.int/publications/pages/publication.aspx?docnum=9303
