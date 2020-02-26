const fs = require('fs');

exports.getAllAlbums = (callback) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            callback("Cannot find upload folders", null);
        }
        let allAlbums = [];
        (function iterator(i) {
            if (i === files.length) {
                callback(null, allAlbums);
                return;
            }
            fs.stat('./uploads/' + files[i], (err, stats) => {
                if (err) {
                    callback("Cannot find folders" + files[i], null);
                }
                if (stats.isDirectory()) {
                    allAlbums.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
};

exports.getAllImagesByAlbumNames = (albumNames, callback) => {
    fs.readdir('./uploads/' + albumNames, (err, files) => {
        if (err) {
            callback("Cannot find upload folders", null);
            return;
        }
        let allImages = [];
        (function iterator(i) {
            if (i === files.length) {
                callback(null, allImages);
                return;
            }
            fs.stat('./uploads/' + albumNames + '/' + files[i], (err, stats) => {
                if (err) {
                    callback("Cannot find images" + files[i], null);
                    return;
                }
                if (stats.isFile()) {
                    allImages.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
};

