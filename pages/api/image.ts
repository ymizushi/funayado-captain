import { WebClient } from "@slack/web-api";
import { privateConfig } from "@/config";
import { createReadStream } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  File as FormidableFile,
  IncomingForm,
  Fields,
  Files,
} from "formidable";

const web = new WebClient(privateConfig.slack.token);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
  if (!privateConfig.slack.token) {
    res.writeHead(405).end("Token must not be undefined");
  }
  if (!privateConfig.slack.channelId) {
    res.writeHead(405).end("ChannelId must not be undefined");
  }
  
  const image = req.body.image
  const coords = req.body.coords
  const fileData = image.replace(/^data:\w+\/\w+;base64,/, '')
  const decodedImage = Buffer.from(fileData, 'base64')

  const upload = await web.files.upload({
    file: decodedImage,
  });
  if (!upload.file) {
    console.warn("Something wrong with the uploaded file!");
    console.log(upload)
  }
  await web.chat.postMessage({
    channel: privateConfig.slack.channelId,
    text: `<https://maps.google.com/?q=${coords.latitude},${coords.longitude} | Maps > \n <${upload.file?.permalink}| {latitude=${coords.latitude}, longitude=${coords.longitude}} >`,
  });
  res.status(200).send({ message: "ok" });
}
