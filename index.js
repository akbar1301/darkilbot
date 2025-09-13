const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Ganti dengan token bot kamu
const BOT_TOKEN = '7597477264:AAFMXbMk_j9usWKnYdw0nmxE4U6qXQ0bYUI';
const OWNER_ID = 7143446125;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Saat start
bot.onText(/\/start/, (msg) => {
  bot.sendPhoto(msg.chat.id, 'https://files.catbox.moe/qsjorw.jpg', {
    caption: 'Yahahaha, ngapain lo di sini?'
  });
});

// Relay pesan dari user non-admin ke admin
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Abaikan pesan admin agar tidak dipantulkan balik
  if (chatId === OWNER_ID) return;

  // Format pesan ke admin
  let forwardText = `Pesan Baru 📩\nUserID : ${msg.from.id}\nUsername : @${msg.from.username || '-'}\nPesan : `;

  if (msg.text) {
    forwardText += msg.text;
    await bot.sendMessage(OWNER_ID, forwardText);
  } else if (msg.photo) {
    forwardText += '[Foto]';
    await bot.sendMessage(OWNER_ID, forwardText);
    await bot.sendPhoto(OWNER_ID, msg.photo[msg.photo.length - 1].file_id, { caption: `Dari ${msg.from.id}` });
  } else if (msg.voice) {
    forwardText += '[Voice Note]';
    await bot.sendMessage(OWNER_ID, forwardText);
    await bot.sendVoice(OWNER_ID, msg.voice.file_id, { caption: `Dari ${msg.from.id}` });
  } else if (msg.document) {
    forwardText += `[Dokumen: ${msg.document.file_name}]`;
    await bot.sendMessage(OWNER_ID, forwardText);
    await bot.sendDocument(OWNER_ID, msg.document.file_id, {}, { filename: msg.document.file_name });
  } else {
    forwardText += '[Pesan Non-Teks]';
    await bot.sendMessage(OWNER_ID, forwardText);
  }
});

// Command admin: kirim qr.jpg
bot.onText(/\/sendqr/, (msg) => {
  if (msg.chat.id !== OWNER_ID) return;
  const filePath = './qr.jpg';
  if (fs.existsSync(filePath)) {
    bot.sendDocument(OWNER_ID, filePath);
  } else {
    bot.sendMessage(OWNER_ID, 'qr.jpg tidak ditemukan di server.');
  }
});

// Command admin: balas user
bot.onText(/\/balas (\d+) (.+)/, (msg, match) => {
  if (msg.chat.id !== OWNER_ID) return;

  const userId = match[1];
  const text = match[2];

  bot.sendMessage(userId, text)
    .then(() => bot.sendMessage(OWNER_ID, `Pesan berhasil dikirim ke ${userId}`))
    .catch((err) => bot.sendMessage(OWNER_ID, `Gagal mengirim pesan: ${err.message}`));
});

// Command admin: sendpin
bot.onText(/\/sendpin (\d+)/, (msg, match) => {
  if (msg.chat.id !== OWNER_ID) return;

  const userId = match[1];
  bot.sendMessage(userId, 'PIN : 669614')
    .then(() => bot.sendMessage(OWNER_ID, `PIN berhasil dikirim ke ${userId}`))
    .catch((err) => bot.sendMessage(OWNER_ID, `Gagal mengirim PIN: ${err.message}`));
});

console.log('Bot sedang berjalan...');
