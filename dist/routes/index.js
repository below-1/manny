"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const entities = __importStar(require("../models"));
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
const util = __importStar(require("util"));
const Jimp = require('jimp');
const writeFile = util.promisify(fs.writeFile);
// const crypto = require('crypto');
// const fs = require('fs');
const LOCATION = 'medias';
function default_1(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { app, context } = options;
        const mediaRepo = yield context.connection.getRepository(entities.Media);
        /**
         * Save the image.
         *
         */
        function saveImageToDatabase({ url, avatar, type, target }) {
            return __awaiter(this, void 0, void 0, function* () {
                let media = mediaRepo.create({
                    url,
                    avatar,
                    type,
                    target
                });
                let result = yield mediaRepo.save(media);
                return result;
            });
        }
        function cloneImage({ name, image, size, extension }) {
            return __awaiter(this, void 0, void 0, function* () {
                let sizeSuffix = size == -1 ? '' : `-${size}`;
                const path = `${LOCATION}/${name}${sizeSuffix}.${extension}`;
                // This is the original image, leave untouched
                if (size == -1) {
                    yield image.writeAsync(path);
                    return;
                }
                // let image = await Jimp.read(from);
                yield image.clone().resize(size, size).writeAsync(path);
            });
        }
        app.post('/v1/medias/single', (req, resp) => __awaiter(this, void 0, void 0, function* () {
            let avatar = null, picture, target = null, type = null;
            try {
                // avatar = parseInt(req.body.avatar) == 1;
                picture = req.files.gambar;
                // target = req.body.target;
                // type = req.body.type;
            }
            catch (err) {
                console.log(err);
                resp.status(500).end('Request body is invalid');
            }
            let extension = picture.name.split('.');
            if (extension && (extension.length > 1)) {
                extension = extension[1];
            }
            else {
                resp.status(500).end(`Filename doesn't have extension: ${picture.name}`);
            }
            // Generate random filename
            const image_name = crypto.randomBytes(4).toString('hex');
            const image_path = LOCATION + '/' + image_name + '.' + extension;
            const baseUrl = req.protocol + '://' + req.get('host') + '/v1/medias';
            const image = yield Jimp.read(picture.data);
            const sizes = [-1, 128, 256, 480, 720, 1080];
            const params = sizes
                .map(size => ({
                name: image_name,
                image,
                size,
                extension,
                type,
                avatar,
                target
            }));
            const result = yield Promise.all(params.map((param) => __awaiter(this, void 0, void 0, function* () {
                let { extension, name, size, avatar, type } = param;
                // Clear size prefix if original image.
                let sizePrefix = size == -1 ? '' : `-${size}`;
                yield cloneImage(param);
                // Build url
                let url = `${baseUrl}/${name}${sizePrefix}.${extension}`;
                return url;
                // Return the media entity
                // return await saveImageToDatabase({ url, avatar, type, target });
            })));
            console.log(result);
            resp.send(result[0]);
        }));
        app.use('/v1/medias', express_1.default.static('medias'));
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map