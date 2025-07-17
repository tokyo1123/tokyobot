const mineflayer = require('mineflayer');

// إعدادات البوت
const bot = mineflayer.createBot({
  host: 'tokyoserver.aternos.me', // استبدلها بعنوان سيرفرك
  port: 54973, // البورت الافتراضي
  username: 'tokyoBot', // اسم البوت في اللعبة
  version: '1.20.1', // يجب أن يكون نفس إصدار السيرفر
});

// رسالة عند الاتصال
bot.on('login', () => {
  console.log('تم الاتصال بالسيرفر!');
  bot.chat('مرحبًا! أنا بوت هنا لمساعدتكم.');
});

// الرد على الرسائل
bot.on('chat', (username, message) => {
  if (username === bot.username) return; // تجاهل رسائل البوت نفسه

  if (message === '!hello') {
    bot.chat(`مرحبًا ${username}! كيف حالك؟`);
  }

  if (message === '!help') {
    bot.chat('الأوامر المتاحة: !hello, !help, !afk');
  }
});

// مكافحة التوقف (Anti-AFK)
setInterval(() => {
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 500);
}, 30000); // يقفز كل 30 ثانية

// إعادة الاتصال عند فقدان الاتصال
bot.on('end', () => {
  console.log('تم قطع الاتصال! إعادة المحاولة خلال 5 ثوان...');
  setTimeout(() => createBot(), 5000);
});

// معالجة الأخطاء
bot.on('error', (err) => {
  console.error('حدث خطأ:', err);
});
