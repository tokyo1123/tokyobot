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
  });

  // أمر /tokyo
 bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  if (message === '/tokyo') {
    bot.chat(`👋 مرحبًا ${username}! أهلاً بك في Tokyo DZ Server`);
    bot.chat(`🔗 رابط ديسكورد السيرفر: https://discord.gg/E4XpZeywAJ`);
  }
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

// أول مرة تشغيل
createBot();

