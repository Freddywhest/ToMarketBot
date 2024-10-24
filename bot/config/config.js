const _isArray = require("../utils/_isArray");

require("dotenv").config();
const settings = {
  API_ID:
    process.env.API_ID && /^\d+$/.test(process.env.API_ID)
      ? parseInt(process.env.API_ID)
      : process.env.API_ID && !/^\d+$/.test(process.env.API_ID)
      ? "N/A"
      : undefined,
  API_HASH: process.env.API_HASH || "",

  AUTO_PLAY_GAME: process.env.AUTO_PLAY_GAME
    ? process.env.AUTO_PLAY_GAME.toLowerCase() === "true"
    : true,

  AUTO_TASKS: process.env.AUTO_TASKS
    ? process.env.AUTO_TASKS.toLowerCase() === "true"
    : true,

  AUTO_SPIN: process.env.AUTO_SPIN
    ? process.env.AUTO_SPIN.toLowerCase() === "true"
    : true,

  AUTO_CLAIM_DAILY_REWARD: process.env.AUTO_CLAIM_DAILY_REWARD
    ? process.env.AUTO_CLAIM_DAILY_REWARD.toLowerCase() === "true"
    : true,

  AUTO_FARM: process.env.AUTO_FARM
    ? process.env.AUTO_FARM.toLowerCase() === "true"
    : true,

  AUTO_CLAIM_COMBO: process.env.AUTO_CLAIM_COMBO
    ? process.env.AUTO_CLAIM_COMBO.toLowerCase() === "true"
    : true,

  AUTO_CLAIM_STARTS: process.env.AUTO_CLAIM_STARTS
    ? process.env.AUTO_CLAIM_STARTS.toLowerCase() === "true"
    : true,

  SLEEP_BETWEEN_TAP:
    process.env.SLEEP_BETWEEN_TAP && _isArray(process.env.SLEEP_BETWEEN_TAP)
      ? JSON.parse(process.env.SLEEP_BETWEEN_TAP)
      : process.env.SLEEP_BETWEEN_TAP &&
        /^\d+$/.test(process.env.SLEEP_BETWEEN_TAP)
      ? parseInt(process.env.SLEEP_BETWEEN_TAP)
      : [1500, 2000],

  DELAY_BETWEEN_STARTING_BOT:
    process.env.DELAY_BETWEEN_STARTING_BOT &&
    _isArray(process.env.DELAY_BETWEEN_STARTING_BOT)
      ? JSON.parse(process.env.DELAY_BETWEEN_STARTING_BOT)
      : [15, 20],

  USE_PROXY_FROM_TXT_FILE: process.env.USE_PROXY_FROM_TXT_FILE
    ? process.env.USE_PROXY_FROM_TXT_FILE.toLowerCase() === "true"
    : false,

  USE_PROXY_FROM_JS_FILE: process.env.USE_PROXY_FROM_JS_FILE
    ? process.env.USE_PROXY_FROM_JS_FILE.toLowerCase() === "true"
    : false,

  AUTO_COMPLETE_EMOJI_TASK: process.env.AUTO_COMPLETE_EMOJI_TASK
    ? process.env.AUTO_COMPLETE_EMOJI_TASK.toLowerCase() === "true"
    : true,

  CAN_CREATE_SESSION: false,
};

module.exports = settings;
