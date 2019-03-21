/* global document */

import * as fs from 'fs';
import { Request, Response } from 'express';
import * as puppeteer from 'puppeteer';

const baseHtml = fs.readFileSync('./base.html', 'utf8');

export const example = async (req: Request, res: Response): Promise<void> => {
  const text = req.query['text'] || 'Example Text';

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(baseHtml);

  await page.evaluate(() => {
    const textElm = document.getElementById('text') as HTMLParagraphElement;
    textElm.innerText = text;
  });

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
