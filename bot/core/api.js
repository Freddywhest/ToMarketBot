const app = require("../config/app");
const logger = require("../utils/logger");
const sleep = require("../utils/sleep");
const _ = require("lodash");

class ApiRequest {
  constructor(session_name, bot_name) {
    this.session_name = session_name;
    this.bot_name = bot_name;
  }

  async get_user_data(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/user/balance`
      );
      return response.data;
    } catch (error) {
      const regex = /ENOTFOUND\s([^\s]+)/;
      const match = error.message.match(regex);
      logger.error(
        `<ye>[${this.bot_name}]</ye> | ${
          this.session_name
        } | Error while getting User Data: ${
          error.message.includes("ENOTFOUND") ||
          error.message.includes("getaddrinfo") ||
          error.message.includes("ECONNREFUSED")
            ? `The proxy server at ${
                match && match[1] ? match[1] : "unknown address"
              } could not be found. Please check the proxy address and your network connection`
            : error.message
        }`
      );
      await sleep(3); // Sleep for 3 seconds
    }
  }

  async validate_query_id(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/user/login`,
        JSON.stringify(data)
      );
      if (
        response?.data?.status === 400 ||
        response?.data?.message?.toLowerCase()?.includes("invalid init data")
      ) {
        return false;
      }

      if (!_.isEmpty(response?.data?.data?.access_token)) {
        return true;
      }
      return false;
    } catch (error) {
      if (
        error?.response?.data?.message
          ?.toLowerCase()
          ?.includes("invalid init data signature") ||
        error?.response?.status == 401
      ) {
        return false;
      }

      throw error;
    }
  }

  async get_farm_info(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/farm/info`,
        data
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting farm info:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting farm info:</b>: ${error.message}`
        );
      }
    }
  }

  async start_farming(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/farm/start`,
        JSON.stringify(data)
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting farming:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting farming:</b>: ${error.message}`
        );
      }
    }
  }

  async start_game(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/game/play`,
        JSON.stringify(data)
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting game:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting game:</b>: ${error.message}`
        );
      }
    }
  }

  async claim_game_reward(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/game/claim`,
        JSON.stringify(data)
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming game reward:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming game reward:</b>: ${error.message}`
        );
      }
    }
  }

  async claim_daily_reward(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/daily/claim`,
        JSON.stringify({ game_id: "fa873d13-d831-4d6f-8aee-9cff7a1d0db1" })
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming daily reward:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming daily reward:</b>: ${error.message}`
        );
      }
    }
  }

  async claim_farming_reward(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/farm/claim`,
        JSON.stringify(data)
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming farming reward:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming farming reward:</b>: ${error.message}`
        );
      }
    }
  }

  async claim_task(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/claim`,
        JSON.stringify(data)
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming task:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming task:</b>: ${error.message}`
        );
      }
    }
  }

  async get_combo(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/hidden`
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting combo:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting combo:</b>: ${error.message}`
        );
      }
    }
  }

  async get_stars(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/classmateTask`
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting stars:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting stars:</b>: ${error.message}`
        );
      }
    }
  }

  async start_stars_claim(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/classmateStars`,
        JSON.stringify(data)
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting stars claim:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting stars claim:</b>: ${error.message}`
        );
      }
      return null;
    }
  }

  async get_rank_data(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/rank/data`
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting rank data:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting rank data:</b>: ${error.message}`
        );
      }
      return null;
    }
  }

  async evaluate_rank_data(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/rank/evaluate`
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>evaluate rank data:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>evaluate rank data:</b>: ${error.message}`
        );
      }
      return null;
    }
  }

  async create_rank_data(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/rank/create`
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>create rank:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>create rank:</b>: ${error.message}`
        );
      }
      return null;
    }
  }

  async upgrade_rank(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/rank/upgrade`,
        JSON.stringify(data)
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>upgrade rank:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>upgrade rank:</b>: ${error.message}`
        );
      }
      return null;
    }
  }

  async get_tickets(http_client, init_data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/user/tickets`,
        JSON.stringify({ language_code: "en", init_data })
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting tickets:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting tickets:</b> ${error.message}`
        );
      }
      return null;
    }
  }

  async spin(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/spin/raffle`,
        JSON.stringify({ category: "ticket_spin_1" })
      );
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>spinning:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>spinning:</b> ${error.message}`
        );
      }
      return null;
    }
  }

  async get_emoji_task(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/list`,
        JSON.stringify(data)
      );
      return response?.data?.data?.emoji;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting emoji task:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>getting emoji task:</b> ${error.message}`
        );
      }
      return null;
    }
  }

  async start_emoji_task(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/start`,
        JSON.stringify(data)
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting emoji task:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>starting emoji task:</b> ${error.message}`
        );
      }
      return null;
    }
  }

  async check_emoji_task(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/check`,
        JSON.stringify(data)
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>checking emoji task:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>checking emoji task:</b> ${error.message}`
        );
      }
      return null;
    }
  }

  async claim_emoji_task(http_client, data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/tomarket-game/v1/tasks/claim`,
        JSON.stringify(data)
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming emoji task:</b> ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming emoji task:</b> ${error.message}`
        );
      }
      return null;
    }
  }
}

module.exports = ApiRequest;
