function readAs(file, as) {
    if (!(file instanceof Blob)) {
        throw new TypeError('Must be a File or Blob');
    }
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.onerror = function (e) {
            reject(new Error('Error reading' + file.name + ': ' + e.target.result));
        };
        reader['readAs' + as](file);
    });
}

export function readAsDataURL(file) {
    return readAs(file, 'DataURL');
}

export function readAsText(file) {
    return readAs(file, 'Text');
}

export function readAsArrayBuffer(file) {
    return readAs(file, 'ArrayBuffer');
}
