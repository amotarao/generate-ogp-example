/* global document */

import { Request, Response } from 'express';
import * as puppeteer from 'puppeteer';

export const example = async (req: Request, res: Response): Promise<void> => {
  const text: string = req.query['text'] || 'Example Text';
  console.log(`text: ${text}`);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(
    '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><link href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c" rel="stylesheet"/><style>*{margin:0;padding:0;}#app{align-items:center;display:flex;height:630px;justify-content:center;width:1200px;}#text{font-family:"M PLUS Rounded 1c";font-size: 40px;}</style></head><body><div id="app"><p id="text"></p></div></body></html>',
    {
      waitUntil: 'networkidle0',
    }
  );

  await page.evaluate((text: string) => {
    const textElm = document.querySelector<HTMLParagraphElement>('#text');
    if (!textElm) return;
    textElm.innerText = text;
  }, text);

  const png = await page.screenshot({
    type: 'png',
    encoding: 'binary',
  });

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': png.length,
  });
  res.end(png);
};
