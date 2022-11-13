import { WebClient } from '@slack/web-api';
import formidable from 'formidable';
import { createReadStream } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { privateConfig } from '@config';

const web = new WebClient(privateConfig.slack.token);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }
  if (!privateConfig.slack.token) {
    console.warn('Token must not be undefined');
    res.writeHead(405).end('Token must not be undefined');
  }

  if (!privateConfig.slack.channelId) {
    console.warn('ChannelId must not be undefined');
    res.writeHead(405).end('ChannelId must not be undefined');
  }

  await new Promise(function (resolve, reject) {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      multiples: true,
      uploadDir: __dirname,
    });
    form.parse(req, async (err, fields, files) => {
      const message = fields.message;
      let text = message;
      if (err) reject({ err });
      for (const key in files) {
        if (key) {
          const file: formidable.File = files[key] as formidable.File;
          const filePath = file.filepath;
          const upload = await web.files.upload({
            file: createReadStream(filePath),
          });
          if (!upload.file) {
            console.warn('Something wrong with the uploaded file!');
            return;
          }
          text += `<${upload.file.permalink}| >`;
        }
      }
      resolve({ fields, files, text });
    });
  })
    .then((data: any) => {
      web.chat.postMessage({ channel: privateConfig.slack.channelId, text: data.text });
      res.status(200).send({ message: 'ok' });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};