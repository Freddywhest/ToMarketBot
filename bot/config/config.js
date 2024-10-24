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

  MAX_CONCURRENT_ACCOUNT:
    process.env.MAX_CONCURRENT_ACCOUNT &&
    /^\d+$/.test(process.env.MAX_CONCURRENT_ACCOUNT)
      ? parseInt(process.env.MAX_CONCURRENT_ACCOUNT)
      : 10,

  RUN_COUNT:
    process.env.RUN_COUNT && /^\d+$/.test(process.env.RUN_COUNT)
      ? parseInt(process.env.RUN_COUNT)
      : 1,

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

  USE_NON_THREAD: process.env.USE_NON_THREAD
    ? process.env.USE_NON_THREAD.toLowerCase() === "true"
    : true,

  SLEEP_BETWEEN_TAP:
    process.env.SLEEP_BETWEEN_TAP && _isArray(process.env.SLEEP_BETWEEN_TAP)
      ? JSON.parse(process.env.SLEEP_BETWEEN_TAP)
      : process.env.SLEEP_BETWEEN_TAP &&
        /^\d+$/.test(process.env.SLEEP_BETWEEN_TAP)
      ? parseInt(process.env.SLEEP_BETWEEN_TAP)
      : [1500, 2000],

  SLEEP_BETWEEN_NON_THREADS:
    process.env.SLEEP_BETWEEN_NON_THREADS &&
    _isArray(process.env.SLEEP_BETWEEN_NON_THREADS)
      ? JSON.parse(process.env.SLEEP_BETWEEN_NON_THREADS)
      : [1500, 2000],

  DELAY_BETWEEN_STARTING_BOT:
    process.env.DELAY_BETWEEN_STARTING_BOT &&
    _isArray(process.env.DELAY_BETWEEN_STARTING_BOT)
      ? JSON.parse(process.env.DELAY_BETWEEN_STARTING_BOT)
      : [15, 20],

  DELAY_BETWEEN_GAME:
    process.env.DELAY_BETWEEN_GAME && _isArray(process.env.DELAY_BETWEEN_GAME)
      ? JSON.parse(process.env.DELAY_BETWEEN_GAME)
      : [5, 10],

  DELAY_BETWEEN_SPIN:
    process.env.DELAY_BETWEEN_SPIN && _isArray(process.env.DELAY_BETWEEN_SPIN)
      ? JSON.parse(process.env.DELAY_BETWEEN_SPIN)
      : [5, 10],

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
