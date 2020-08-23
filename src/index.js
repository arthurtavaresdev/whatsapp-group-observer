const wa = require("@open-wa/wa-automate");
const path = require("path");
const fs = require("fs").promises;
const mime = require("mime-types");

const isValidateBase64 = require("./utils/isValidateBase64");
const gdrive = require("./services/gdrive");

require("dotenv").config();

wa.create().then((client) => start(client));

/**
 *
 * @param {wa.Client} client
 */
async function start(client) {
  /**
   * @param {import("@open-wa/wa-automate").Message}
   */
  client.onMessage(async (message) => {
    if (
      message.chat.name.toUpperCase() === process.env.GROUP_NAME.toUpperCase()
    ) {
      if (message.type === "chat") {
        await createLogFromChat(message);
      } else {
        await transform(client, message);
      }
    }
  });
}

/**
 * @param {import('@open-wa/wa-automate').Client} client
 * @param {import('@open-wa/wa-automate').Chat} chat
 */
async function createLogFromChat(message) {
  const file = path.resolve(__dirname, "..", "tmp", "messages.log");

  try {
    await fs.appendFile(file, message.body + "\n");
  } catch (e) {
    console.error(e);
  }
}

/**
 *
 * @param {import('@open-wa/wa-automate').Message} message
 */
async function transform(client, message) {
  if (isValidateBase64(message.body)) {
    const extension = mime.extension(message.mimetype);
    const filename = `${message.t}.${extension}`;
    const filePath = path.resolve(__dirname, "..", "tmp", filename);

    if (message.mimetype) {
      const mediaData = await wa.decryptMedia(message);

      try {
        await fs.writeFile(filePath, mediaData);

        fs.access("credentials.json")
          .then(() => {
            gdrive.createFile(filename, filePath, message.mimetype, (id) => {
              console.log("Enviado com suceso! - ID: " + id);
            });
          })
          .catch((e) => {});

        await client.reply(
          message.chatId,
          "✅ Imagem salva com sucesso!",
          message.id
        );
      } catch (e) {
        console.error(e);
        await client.reply(
          message.chatId,
          "❌ Ocorreu, um erro ao salvar imagem",
          message.id
        );
      }
    }
  }
}
