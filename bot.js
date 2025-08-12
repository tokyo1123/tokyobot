// === TOKyodot Bot ===
const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// موقع ويب بسيط مع WebSocket
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.send(`
    <h1>TOKyodot Bot Logs</h1>
    <div id="logs" style="height:400px;overflow:auto;border:1px solid #ccc;padding:5px"></div>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      const logs = document.getElementById('logs');
      socket.on('log', msg => {
        logs.innerHTML += msg + '<br>';
        logs.scrollTop = logs.scrollHeight;
      });
    </script>
  `);
});

server.listen(3000, () => console.log('Web server running on port 3000'));

let bot;
function startBot() {
 bot = mineflayer.createBot({
  host: 'TokyoServer.aternos.me',
  port: 43234,
  username: 'TOKyodot',
  version: '1.20.4' // ← أضف إصدار السيرفر هنا
});

  bot.on('login', () => {
    logMsg(`✅ Logged in as ${bot.username}`);
  });

  bot.on('end', () => {
    logMsg('⚠️ Bot disconnected, reconnecting...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => logMsg(`❌ Error: ${err}`));

  // أي رسالة في الشات تُسجَّل في اللوغ
  bot.on('chat', (username, message) => {
    logMsg(`<${username}> ${message}`);
  });

  // إرسال الرسالة كل 5 دقائق
  setInterval(() => {
    if (bot && bot.chat) {
      bot.chat('Welcome to Tokyo dz server — join our Discord: https://discord.gg/E4XpZeywAJ | TokyoServer.aternos.me:43234');
      logMsg('📢 Auto-message sent.');
    }
  }, 5 * 60 * 1000);

  // التحرك للأمام والخلف كل 10 ثواني
  setInterval(() => {
    if (!bot.entity) return;
    bot.setControlState('forward', true);
    setTimeout(() => {
      bot.setControlState('forward', false);
      setTimeout(() => {
        bot.setControlState('back', true);
        setTimeout(() => {
          bot.setControlState('back', false);
        }, 2500);
      }, 500);
    }, 2500);
  }, 10000);
}

// دالة تسجيل الرسائل في الـ log وفي الموقع
function logMsg(msg) {
  console.log(msg);
  io.emit('log', msg);
}

startBot();

