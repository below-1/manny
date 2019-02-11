import express from 'express';
import * as entities from '../models';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as util from 'util';
import { Box } from '../types';

const Jimp = require('jimp');
const writeFile = util.promisify(fs.writeFile);

// const crypto = require('crypto');
// const fs = require('fs');

const LOCATION = 'medias';

interface RoutesOptions {
  app: express.Express;
  context: Box;
}

export default async function (options: RoutesOptions) {

  const { app, context } = options;
  const mediaRepo = await context.connection.getRepository<entities.Media>(entities.Media);

  /**
   * Save the image.
   * 
   */
  async function saveImageToDatabase({ url, avatar, type, target }) : Promise<entities.Media> {
    let media = mediaRepo.create({
      url,
      avatar,
      type,
      target
    });
    let result = await mediaRepo.save(media);
    return result;
  }

  async function cloneImage({ name, image, size, extension }) : Promise<any> {
    let sizeSuffix = size == -1 ? '' : `-${size}`;
    const path = `${LOCATION}/${name}${sizeSuffix}.${extension}`;
    // This is the original image, leave untouched
    if (size == -1) {
      await image.writeAsync(path);
      return;
    }
    // let image = await Jimp.read(from);
    await image.clone().resize(size, size).writeAsync(path);
  }

  app.post('/v1/medias/single', async (req, resp) => {

    let avatar: any = null, picture: any, target: any = null, type: any = null;

    try {
      // avatar = parseInt(req.body.avatar) == 1;
      picture = req.files.gambar;
      // target = req.body.target;
      // type = req.body.type;
    } catch (err) {
      console.log(err);
      resp.status(500).end('Request body is invalid');
    }
    let extension = picture.name.split('.');

    if (extension && (extension.length > 1)) {
      extension = extension[1];
    } else {
      resp.status(500).end(`Filename doesn't have extension: ${picture.name}`);
    }
    
    // Generate random filename
    const image_name = crypto.randomBytes(4).toString('hex');
    const image_path = LOCATION + '/' + image_name + '.' + extension;
    const baseUrl = req.protocol + '://' + req.get('host') + '/v1/medias';

    const image = await Jimp.read(picture.data);

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
    
    const result = await Promise.all( params.map(async (param) => {
      let { extension, name, size, avatar, type } = param;
      // Clear size prefix if original image.
      let sizePrefix = size == -1 ? '' : `-${size}`;
      await cloneImage(param);

      // Build url
      let url = `${baseUrl}/${name}${sizePrefix}.${extension}`;
      return url;

      // Return the media entity
      // return await saveImageToDatabase({ url, avatar, type, target });
    }));

    console.log(result);

    resp.send(result[0]);
  });

  app.use('/v1/medias', express.static('medias'));

}