/* global document */

import { Request, Response } from 'express';
import * as puppeteer from 'puppeteer';

export const example = async (req: Request, res: Response): Promise<void> => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.evaluate(() => {
    const text = document.createElement('div');
    text.style.width = '100vw';
    text.style.height = '100vh';
    text.style.fontSize = '40px';
    text.innerText = 'Example Text';
    document.body.appendChild(text);
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
