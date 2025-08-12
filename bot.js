// === TOKyodot Bot ===
const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// واجهة الويب: عرض اللوغ + إرسال رسائل
app.get('/', (req, res) => {
  res.send(`
    <h1 style="color:white;background:#222;padding:10px">TOKyodot Bot Control & Logs</h1>
    <div id="logs" style="height:400px;overflow:auto;border:1px solid #ccc;padding:5px;background:#111;color:#eee"></div>
    <input id="msg" placeholder="اكتب رسالة..." style="width:80%;padding:5px;margin-top:5px">
    <button onclick="sendMessage()" style="padding:5px">إرسال</button>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      const logs = document.getElementById('logs');
      const msgInput = document.getElementById('msg');

      socket.on('log', msg => {
        logs.innerHTML += msg + '<br>';
        logs.scrollTop = logs.scrollHeight;
      });

      function sendMessage() {
        const msg = msgInput.value;
        if(msg.trim() !== "") {
          socket.emit('sendMessage', msg);
          msgInput.value = "";
        }
      }
    </script>
  `);
});

server.listen(3000, () => console.log('🌐 Web server running on port 3000'));

let bot;
let autoMessageInterval = null;
let autoMoveInterval = null;

function createBot() {
  bot = mineflayer.createBot({
    host: 'TokyoServer.aternos.me',
    port: 43234,
    username: 'TOKyodot',
    version: '1.20.4' // تأكد من أنه نفس إصدار السيرفر
  });

  bot.on('login', () => {
    logMsg(`✅ Logged in as ${bot.username}`);

    if (!autoMessageInterval) {
      autoMessageInterval = setInterval(() => {
        if (bot && bot.chat) {
          bot.chat('Welcome to Tokyo dz server — join our Discord: https://discord.gg/E4XpZeywAJ');
          logMsg('📢 Auto-message sent.');
        }
      }, 5 * 60 * 1000);
    }

    if (!autoMoveInterval) {
      autoMoveInterval = setInterval(() => {
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
  });

  bot.on('end', () => {
    logMsg('⚠️ Bot disconnected, reconnecting...');

    if (autoMessageInterval) {
      clearInterval(autoMessageInterval);
      autoMessageInterval = null;
    }
    if (autoMoveInterval) {
      clearInterval(autoMoveInterval);
      autoMoveInterval = null;
    }

    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => logMsg(`❌ Error: ${err}`));

  bot.on('chat', (username, message) => {
    logMsg(`<${username}> ${message}`);
  });

  bot.on('message', (jsonMsg) => {
    const msg = jsonMsg.toString();
    logMsg(`[Minecraft] ${msg}`);
  });
}

// إرسال الرسائل من الموقع للبوت
io.on('connection', (socket) => {
  logMsg('🌐 Web client connected');

  socket.on('sendMessage', (msg) => {
    if (bot && bot.chat) {
      bot.chat(msg);
      logMsg(`💬 [WEB] ${msg}`);
    }
  });
});

// إرسال الرسائل للـ log
function logMsg(msg) {
  console.log(msg);
  io.emit('log', msg);
}

createBot();
