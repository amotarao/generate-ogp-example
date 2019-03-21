/* global document */

import * as fs from 'fs';
import { Request, Response } from 'express';
import * as puppeteer from 'puppeteer';

const baseHtml = fs.readFileSync('./base.html', 'utf8');

export const example = async (req: Request, res: Response): Promise<void> => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(baseHtml);

  await page.evaluate(() => {
    const text = document.getElementById('text') as HTMLParagraphElement;
    text.innerText = 'Example Text';
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
