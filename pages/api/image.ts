import { WebClient } from '@slack/web-api';
import { privateConfig } from '@config';
import { createReadStream } from 'fs';
import type { NextApiRequest, NextApiResponse } from "next";
import { File as FormidableFile, IncomingForm, Fields, Files} from "formidable";
export const config = {
  api: {
    bodyParser: false,
  },
}

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

  await new Promise<{fields: Fields, files: Files, text: string|string[]}>(function (resolve, reject) {
    const form = new IncomingForm({
      keepExtensions: true,
      multiples: true,
      uploadDir: __dirname,
    });
    form.parse(req, async (err: Error, fields, files) => {
      const message = fields.message;
      let text = message;
      if (err) reject({ err });
      for (const key in files) {
        if (key) {
          const file: FormidableFile = files[key] as FormidableFile;
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
      const result = { fields, files, text }
      resolve({ fields, files, text });
    });
  }).then((data: {fields: Fields, files: Files, text: string|string[]}) => {
    let message = ""
    if (typeof data.text === "string") {
      message = data.text
    } else if(typeof data.text === "object") {
      message = data.text.join(",")
    }
      web.chat.postMessage({ channel:  privateConfig.slack.channelId, text: message });
      res.status(200).send({ message: 'ok' });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};