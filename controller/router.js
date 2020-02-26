const folders = require('../models/folders.js');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const sd = require('silly-datetime');

exports.showIndex = (req, res, next) => {
    folders.getAllAlbums((err, allAlbums) => {
        if (err) {
            next();
            return;
        }
        res.render("index", {
            "albums" : allAlbums
        });
    });
};

exports.showAlbum = (req, res, next) => {
    let albumNames = req.params.albumName;
    folders.getAllImagesByAlbumNames(albumNames, (err, imagesArray) => {
        if (err) {
            next();
            return;
        }
        res.render('album', {
            "albumNames" : albumNames,
            "images" : imagesArray
        });
    });
};

exports.showUpload = (req, res) => {
    folders.getAllAlbums((err, albums) => {
        res.render('upload', {
            albums : albums
        });
    });
};

exports.doPost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + '/../temp/');
    form.parse(req, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        if (err) {
            next();
        }
        // Check the Size of Uploading Image
        let size = parseInt(files.image.size);
        if (size < 20480) {
            res.send("The size of image should be smaller than 2 MB.");
            // Remove Image
            fs.unlink(files.image.path, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Remove Successfully!');
                }
            });
            return;
        }

        let ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
        let random = parseInt(Math.random() * 89999 + 10000);
        let extname = path.extname(files.image.name);

        let folder = fields.folder;
        let oldPath = files.image.path;
        let newPath = path.normalize(__dirname + '/../uploads/' + folder + '/' + ttt + random + extname);
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                res.send('Change Name is not successfully!');
                return;
            }
            res.end("Upload Successfully!");
        });
    });
};
