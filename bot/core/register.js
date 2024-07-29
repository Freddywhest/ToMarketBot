const { TelegramClient, sessions } = require("telegram");
const { StringSession } = require("telegram/sessions");
const fs = require("fs");
const { input } = require("@inquirer/prompts");
const logger = require("../utils/logger");
const settings = require("../config/config");
require("dotenv").config();
const path = require("path");
const logger2 = require("../utils/TldLogger");

class Register {
  #stringSession;
  #apiId;
  #apiHash;
  constructor() {
    this.#apiId = settings.API_ID;
    this.#apiHash = settings.API_HASH;
    this.#stringSession = new StringSession("");
  }

  async #getSessionName() {
    const filePath = path.join(process.cwd(), "sessions");
    let sessionsName = await input({
      message: "Please enter your session name: ",
    });
    do {
      if (fs.existsSync(`${filePath}/${sessionsName}.session`)) {
        logger.warning(`Session name ${sessionsName} already exists!`);
        sessionsName = await input({
          message: "Please enter a different session name: ",
        });
      }
    } while (fs.existsSync(`${filePath}/${sessionsName}.session`));
    return sessionsName;
  }

  async start() {
    const filePath = path.join(process.cwd(), "sessions");
    if (!this.#apiId || !this.#apiHash) {
      logger.error("API_ID and API_HASH must be provided.");
      process.exit(1);
    }

    if (typeof this.#apiHash !== "string" || typeof this.#apiId !== "number") {
      logger.error(
        "API_ID and API_HASH must be numbers and strings respectively."
      );
      process.exit(1);
    }

    const sessionsName = await this.#getSessionName();

    const client = new TelegramClient(
      this.#stringSession,
      this.#apiId,
      this.#apiHash,
      {
        connectionRetries: 5,
        deviceModel: "FreddyBot 1.0",
        appVersion: "1.0.0",
        baseLogger: logger2,
      }
    );

    await client.start({
      phoneNumber: async () =>
        await input({
          message: "Please enter your number: ",
        }),
      password: async () =>
        await input({
          message: "Please enter your password: ",
        }),
      phoneCode: async () =>
        await input({
          message: "Please enter the code you received: ",
        }),
      onError: (err) => console.error(err),
    });

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    const sessionData = {
      apiId: this.#apiId,
      apiHash: this.#apiHash,
      sessionString: this.#stringSession.save(),
    };

    fs.writeFileSync(
      `${filePath}/${sessionsName}.session`,
      JSON.stringify(sessionData, null, 2)
    );

    logger.success(`Session saved as ${sessionsName}.session`);
    client.disconnect();
    process.exit(0);
  }
}

const register = new Register();
module.exports = register;
