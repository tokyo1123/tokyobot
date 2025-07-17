const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'tokyoserver.aternos.me', // استبدلها بعنوان سيرفرك
    port: 54973, // البورت الافتراضي
    username: 'tokyoBot', // اسم البوت في اللعبة
    version: '1.20.1', // يجب أن يكون نفس إصدار السيرفر
  });

  bot.on('login', () => {
    console.log('✅ تم الاتصال بالسيرفر!');
    bot.chat('مرحبًا! أنا بوت هنا لمساعدتكم.');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    if (message === '!hello') {
      bot.chat(`مرحبًا ${username}! كيف حالك؟`);
    }

    if (message === '!help') {
      bot.chat('الأوامر المتاحة: !hello, !help, !afk');
    }
  });

  // Anti-AFK
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 30000);

  // إعادة الاتصال تلقائيًا
  bot.on('end', () => {
    console.log('🔁 تم قطع الاتصال! إعادة المحاولة خلال 5 ثوان...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.error('❌ حدث خطأ:', err);
  });
}

// شغّل البوت لأول مرة
createBot();
