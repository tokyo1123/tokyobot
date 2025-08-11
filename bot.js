const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("بوت ماينكرافت يعمل ✅");
});

app.listen(port, () => {
  console.log(`تم تشغيل السيرفر على البورت ${port}`);
});

const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'TokyoServer.aternos.me',
    port: 43234,
    username: 'TOKyodot',
    version: '1.20.1'
  });

  bot.on('login', () => {
    console.log('✅ تم الاتصال بالسيرفر!');
  });

  // ترحيب باللاعبين الجدد
  bot.on('playerJoined', (player) => {
    if (player && player.username !== bot.username) {
      setTimeout(() => {
        bot.chat(`👋 أهلاً ${player.username} في سيرفر Tokyo DZ!`);
        bot.chat(`📌 رابط سيرفرنا على الديسكورد: https://discord.gg/E4XpZeywAJ`);
      }, 2000);
    }
  });

  // مكافحة AFK + منع Timeout
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
    bot.chat(''); // يرسل رسالة فارغة للمحافظة على الاتصال
  }, 15000);

  // إعادة الاتصال إذا انقطع
  bot.on('end', () => {
    console.log('⚠️ تم قطع الاتصال! إعادة المحاولة خلال 5 ثوان...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.error('❌ حدث خطأ:', err);
  });
}

createBot();
