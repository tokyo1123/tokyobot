const mineflayer = require('mineflayer');

// إعدادات البوت
const bot = mineflayer.createBot({
  host: 'tokyoserver.aternos.me', // استبدلها بعنوان سيرفرك
  port: 54973, // البورت الافتراضي
  username: 'tokyoBot', // اسم البوت في اللعبة
  version: '1.20.1', // يجب أن يكون نفس إصدار السيرفر
  });

  bot.on('login', () => {
    console.log('✅ تم الاتصال بالسيرفر!');
  });

  bot.on('end', () => {
    console.log('🔁 تم قطع الاتصال! إعادة المحاولة خلال 5 ثوان...');
    setTimeout(() => createBot(), 5000);
  });

  bot.on('error', (err) => {
    console.log('❌ حدث خطأ:', err);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === 'ping') {
      bot.chat('pong!');
    }
  });
}

createBot();
