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
    host: 'TokyoServer.aternos.me', // عنوان السيرفر
    port: 43234,                    // البورت
    username: 'TOKyodot',           // اسم البوت
    version: '1.20.1'               // إصدار ماينكرافت
  });

  bot.on('login', () => {
    console.log('✅ تم الاتصال بالسيرفر!');
  });

  // ترحيب باللاعبين الجدد فقط (وليس عند دخول البوت نفسه)
  bot.on('playerJoined', (player) => {
    if (!player || player.username === bot.username) return; // تجاهل البوت نفسه

    // انتظر ثواني قليلة قبل إرسال الرسائل لتجنب الطرد
    setTimeout(() => {
      bot.chat(`👋 أهلاً ${player.username} في سيرفر Tokyo DZ!`);
    }, 2000);

    setTimeout(() => {
      bot.chat(`📌 رابط سيرفرنا على الديسكورد: https://discord.gg/E4XpZeywAJ`);
    }, 5000);
  });

  // مكافحة AFK
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 30000);

  // إعادة الاتصال عند الخروج
  bot.on('end', () => {
    console.log('⚠️ تم قطع الاتصال! إعادة المحاولة خلال 5 ثوان...');
    setTimeout(() => createBot(), 5000);
  });

  bot.on('error', (err) => {
    console.error('❌ حدث خطأ:', err);
  });
}

createBot();
