require('dotenv').config();

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = 3000;

let bot = null;
let jumpInterval = null;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Tokyo_-server.aternos.me',
    port: 43234,
    version: 1.21.8,
    username: 'TOKyobot',
    connectTimeout: 60000
  });

  bot.once('login', () => {
    console.log('✅ Bot logged in');

    // القفز كل 5 ثواني
    jumpInterval = setInterval(() => {
      if (bot.entity && !bot.entity.isInWater) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 5000);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected');
    clearInterval(jumpInterval);
    jumpInterval = null;

    // إعادة الاتصال بعد 5 ثواني
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('❌ Bot error:', err.message);
  });
}

// بدء البوت
createBot();

// موقع ويب بسيط يبقى شغال
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>حالة البوت</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #222;
            color: #3ba55c;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          h1 {
            font-size: 3rem;
          }
        </style>
      </head>
      <body>
        <h1>🌐 البوت شغال</h1>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 الموقع شغال على http://localhost:${PORT}`);
});

