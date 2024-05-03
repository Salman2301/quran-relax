const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const { Writable, PassThrough } = require('stream');
const { spawn } = require('child_process');
const NodeMediaServer = require('node-media-server');
const ffmpeg = require('fluent-ffmpeg');
import fs from 'fs';


const Config = {
  followNewTab: false,
  fps: 25,
  headless: true,
  args: [
    `--headless=new`,  // this will enable the new headless mode (chrome v109)
  ],
  ffmpeg_Path: null,
  videoFrame: {
    width: 1024,
    height: 768
  },
  videoCrf: 18,
  videoCodec: 'libx264',
  videoPreset: 'ultrafast',
  videoBitrate: 1000,
  autopad: {
    color: 'black'
  },
  aspectRatio: '4:3'
};

(async () => {
  const nms = new NodeMediaServer({
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    }
  });

  // Setup event listener for new connections
  nms.on('newConnect', (id,) => {
    console.log(`New RTMP client connected: ${id}`);
  });

  nms.run(); // Run the RTMP server
  
  const browser = await puppeteer.launch({
		defaultViewport: {
			width: 1024,
			height: 720,
		},
    args: [
			`--headless=new`,  // this will enable the new headless mode (chrome v109)
		]
  });
  const page = await browser.newPage();


  const url = "http://localhost:5174";  
  await page.goto(url);
  await page.click('body');
  const recorder = new PuppeteerScreenRecorder(page, Config);

  const passthrough = new PassThrough();
  // format = format.replace('video', 'stream');
  const fileWriteStream = fs.createWriteStream("./stream/tmp.mp4");

  passthrough.pipe(fileWriteStream);
  // passthrough.pipe(nms);
  await recorder.startStream(passthrough);
  
  ffmpeg(passthrough)
  .format('flv')
  .output('rtmp://localhost/live/stream')
  .run()
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to start the RTMP server
function startRTMPServer() {
  const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    }
  };

  const nms = new NodeMediaServer(config);
  nms.run();
}
