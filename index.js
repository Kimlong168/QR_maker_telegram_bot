const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode");
require("dotenv").config();

// Use your bot's token from BotFather
const token = process.env.TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for the /start command to greet the user
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome! Send me a link and I'll generate a QR code for you."
  );
});

// Listen for any message that includes a URL (e.g., a link)
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Check if the message contains a link (basic URL pattern check)
  const urlPattern = /https?:\/\/[^\s]+/;
  const urlMatch = text?.match(urlPattern);

  if (urlMatch) {
    const url = urlMatch[0]; // Extract the URL from the message
    try {
      // Generate the QR code and save it as an image file (you can use a library like qrcode)
      const qrCodeImagePath = path.join(__dirname, "qr_code.png");

      // Generate the QR code and save the image
      await qrcode.toFile(qrCodeImagePath, url);

      // Send the image file to the chat
      bot
        .sendPhoto(chatId, qrCodeImagePath, {
          caption: `[Here is your QR code for the link](${url})\n\nPowered by *Chann Kimlong*`,
          parse_mode: "Markdown", // Use Markdown for formatting
        })
        .catch((error) => {
          console.log("Error sending photo:", error);
          bot.sendMessage(
            chatId,
            "Sorry, something went wrong while sending the image."
          );
        });
    } catch (error) {
      console.log("Error generating QR code:", error);
      bot.sendMessage(
        chatId,
        "Sorry, I couldn't generate the QR code. Please try again."
      );
    }
  } else {
    bot.sendMessage(
      chatId,
      "Please send me a valid URL to generate a QR code."
    );
  }
});
