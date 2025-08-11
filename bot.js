// --- Express لإبقاء السيرفر مستيقظ ---
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("بوت ماينكرافت يعمل ✅");
});

app.listen(port, () => {
  console.log(`تم تشغيل السيرفر على البورت ${port}`);
});

// --- mineflayer لربط البوت بماينكرافت ---
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

    // كل 5 دقائق يرسل ترحيب ورابط ديسكورد
    setInterval(() => {
      bot.chat(" Hello everyone! Welcome to our humble Discord server");
      bot.chat(" Join us here: https://discord.gg/E4XpZeywAJ");
    }, 5 * 60 * 1000); // 5 دقائق
  });

  // أوامر البوت
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    if (message === '!hello') {
      bot.chat(`مرحبًا ${username}! كيف حالك؟`);
    }

    if (message === '!help') {
      bot.chat('الأوامر المتاحة: !hello, !help, !afk');
    }

  });

  // مكافحة AFK
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 3000);

  // إعادة الاتصال عند الخروج
  bot.on('end', () => {
    console.log('⚠️ تم قطع الاتصال! إعادة المحاولة خلال 5 ثوان...');
    setTimeout(() => createBot(), 3000);
  });

  bot.on('error', (err) => {
    console.error('❌ حدث خطأ:', err);
  });
}

// أول مرة تشغيل
createBot();


