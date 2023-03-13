// const sharp = require("sharp");
// const fetch2 = require("node-fetch");
import sharp from "sharp";
import fetch from "node-fetch";
import path from "path";

// import font from "@fontsource/poppins/files/poppins-all-600-italic.woff";

const fontfile = path.resolve(
  "node_modules",
  "@fontsource/poppins/files/poppins-all-600-italic.woff"
);

async function createMusicInfo() {
  const text1 = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 30"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="26px" fill="#ffffff">Title</text></svg>`
  );

  const avatar = await sharp("./img/avatar.png")
    .resize({
      width: 50,
      height: 50,
      fit: "cover",
    })
    .toBuffer();

  return sharp({
    create: {
      width: 300,
      height: 300,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .composite([
      { input: avatar, left: 0, top: 0 },
      {
        input: Buffer.from(
          `<svg><rect x="0" y="0" width="50" height="50" rx="25" ry="25"/></svg>`
        ),
        left: 0,
        top: 0,
        blend: "dest-in",
      },
      { input: { text: { text: "text" } }, left: 0, top: 0 },
    ]);
}

async function create() {
  const bg = await sharp("./img/bg.png")
    .resize({ width: 940, height: 787 })
    .toBuffer();

  const unsplash = await sharp("./img/unsplash.png").toBuffer();

  const whiteBorder = await sharp({
    create: {
      width: 360,
      height: 360,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer();

  const thumb = await sharp("./img/poster.png")
    .resize({ fit: "cover", width: 350, height: 350 })
    .toBuffer();

  const musicInfo = await (await createMusicInfo()).toBuffer();

  await sharp("./img/poster.png")
    .resize({ width: 940, height: 787 })
    .blur(20)
    .composite([
      { input: bg },
      { input: unsplash, left: 459, top: 220 },
      { input: whiteBorder },
      { input: thumb },
      {
        input: {
          text: {
            text: `<span foreground="#fff">A WONDERFUL MUSIC CREATED WITH</span>`,
            height: 24,
            width: 370,
            rgba: true,
          },
        },
        top: 90,
        left: 285,
      },
      {
        input: {
          text: {
            text: `<span foreground="#fff">MAKE YOUR FIRST SONG IN 5 MINUTES AT</span>`,
            height: 24,
            width: 416,
            rgba: true,
          },
        },
        top: 667,
        left: 260,
      },
      {
        input: {
          text: {
            text: `<span foreground="#fff"><i>BETA.ITOKA.XYZ</i></span>`,
            font: "poppins",
            fontfile,
            height: 48,
            width: 309,
            rgba: true,
          },
        },
        top: 691,
        left: 314,
      },
      // { input: musicInfo, top: 593, gravity: "c" },
    ])
    .toFile("output.png");
}

create();

async function urlToBlob(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  return new Blob([buffer], { type: response.headers.get("content-type") });
}
