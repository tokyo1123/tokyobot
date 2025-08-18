require('dotenv').config();

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = 3000;

let bot = null;
let walkLoop = null;

// دالة مساعدة للنوم (توقف التنفيذ لوقت معين)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// دالة الحركة للأمام والخلف
async function walkForwardBackward() {
  if (!bot || !bot.entity) return;

  try {
    bot.setControlState('forward', true);
    await sleep(15000);
    bot.setControlState('forward', false);

    bot.setControlState('back', true);
    await sleep(15000);
    bot.setControlState('back', false);
  } catch (err) {
    console.log("❌ خطأ أثناء الحركة:", err.message);
  }
}

function createBot() {
  bot = mineflayer.createBot({
    host: 'Tokyo_-server.aternos.me',
    port: 52532,
    version:'1.21.1',
    username: 'TOKyo',
    connectTimeout: 60000
  });

  bot.once('login', () => {
    console.log('✅ Bot logged in');

    // بدء حلقة الحركة المتكررة
    walkLoop = setInterval(() => {
      walkForwardBackward();
    }, 31000); // 15 ثانية للأمام + 15 ثانية للخلف + 1 ثانية فاصلة
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected');
    clearInterval(walkLoop);
    walkLoop = null;

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
