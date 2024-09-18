const { default: axios } = require("axios");
const logger = require("../utils/logger");
const headers = require("./header");
const { Api } = require("telegram");
const { HttpsProxyAgent } = require("https-proxy-agent");
const settings = require("../config/config");
const app = require("../config/app");
const user_agents = require("../config/userAgents");
const fs = require("fs");
const sleep = require("../utils/sleep");
const ApiRequest = require("./api");
const parser = require("../utils/parser");
const _ = require("lodash");
const moment = require("moment");
const path = require("path");
const _isArray = require("../utils/_isArray");
const FdyTmp = require("fdy-tmp");

class Tapper {
  constructor(tg_client) {
    this.bot_name = "tomarket";
    this.session_name = tg_client.session_name;
    this.tg_client = tg_client.tg_client;
    this.API_URL = app.apiUrl;
    this.session_user_agents = this.#load_session_data();
    this.headers = { ...headers, "user-agent": this.#get_user_agent() };
    this.api = new ApiRequest(this.session_name, this.bot_name);
    this.MVOH_dly = "fa873d13-d831-4d6f-8aee-9cff7a1d0db1";
    this.JUOY_f = "53b22103-c7ff-413d-bc63-20f6fb806a07";
    this.TOIY_g = "59bcd12e-04e2-404c-a172-311a0084587d";
  }

  #load_session_data() {
    try {
      const filePath = path.join(process.cwd(), "session_user_agents.json");
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return {};
      } else {
        throw error;
      }
    }
  }

  #clean_tg_web_data(queryString) {
    let cleanedString = queryString.replace(/^tgWebAppData=/, "");
    cleanedString = cleanedString.replace(
      /&tgWebAppVersion=.*?&tgWebAppPlatform=.*?(?:&tgWebAppBotInline=.*?)?$/,
      ""
    );
    return cleanedString;
  }

  #get_random_user_agent() {
    const randomIndex = Math.floor(Math.random() * user_agents.length);
    return user_agents[randomIndex];
  }

  #get_user_agent() {
    if (this.session_user_agents[this.session_name]) {
      return this.session_user_agents[this.session_name];
    }

    logger.info(
      `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Generating new user agent...`
    );
    const newUserAgent = this.#get_random_user_agent();
    this.session_user_agents[this.session_name] = newUserAgent;
    this.#save_session_data(this.session_user_agents);
    return newUserAgent;
  }

  #save_session_data(session_user_agents) {
    const filePath = path.join(process.cwd(), "session_user_agents.json");
    fs.writeFileSync(filePath, JSON.stringify(session_user_agents, null, 2));
  }

  #get_platform(userAgent) {
    const platformPatterns = [
      { pattern: /iPhone/i, platform: "ios" },
      { pattern: /Android/i, platform: "android" },
      { pattern: /iPad/i, platform: "ios" },
    ];

    for (const { pattern, platform } of platformPatterns) {
      if (pattern.test(userAgent)) {
        return platform;
      }
    }

    return "Unknown";
  }

  #proxy_agent(proxy) {
    try {
      if (!proxy) return null;
      let proxy_url;
      if (!proxy.password && !proxy.username) {
        proxy_url = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
      } else {
        proxy_url = `${proxy.protocol}://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
      }
      return new HttpsProxyAgent(proxy_url);
    } catch (e) {
      logger.error(
        `<ye>[${this.bot_name}]</ye> | ${
          this.session_name
        } | Proxy agent error: ${e}\nProxy: ${JSON.stringify(proxy, null, 2)}`
      );
      return null;
    }
  }

  async #get_tg_web_data() {
    try {
      const tmp = new FdyTmp({
        fileName: `${this.bot_name}.fdy.tmp`,
        tmpPath: path.join(process.cwd(), "cache/queries"),
      });
      if (tmp.hasJsonElement(this.session_name)) {
        const queryStringFromCache = tmp.getJson(this.session_name);
        if (!_.isEmpty(queryStringFromCache)) {
          const jsonData = {
            init_data: queryStringFromCache,
            invite_code: "00003Ozq",
            is_bot: false,
          };

          const va_hc = axios.create({
            headers: this.headers,
            withCredentials: true,
          });

          const validate = await this.api.validate_query_id(va_hc, jsonData);

          if (validate) {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 🔄 Getting data from cache...`
            );
            if (this.tg_client.connected) {
              await this.tg_client.disconnect();
              await this.tg_client.destroy();
            }
            await sleep(5);
            return jsonData;
          } else {
            tmp.deleteJsonElement(this.session_name);
          }
        }
      }
      await this.tg_client.connect();
      await this.tg_client.start();
      const platform = this.#get_platform(this.#get_user_agent());

      if (!this.bot) {
        this.bot = await this.tg_client.getInputEntity(app.bot);
      }

      if (!this.runOnce) {
        logger.info(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 📡 Waiting for authorization...`
        );
        const botHistory = await this.tg_client.invoke(
          new Api.messages.GetHistory({
            peer: this.bot,
            limit: 10,
          })
        );
        if (botHistory.messages.length < 1) {
          await this.tg_client.invoke(
            new Api.messages.SendMessage({
              message: "/start",
              silent: true,
              noWebpage: true,
              peer: this.bot,
            })
          );
        }
      }

      await sleep(5);

      const result = await this.tg_client.invoke(
        new Api.messages.RequestWebView({
          peer: this.bot,
          bot: this.bot,
          platform,
          from_bot_menu: true,
          url: app.webviewUrl,
        })
      );

      const authUrl = result.url;
      const tgWebData = authUrl.split("#", 2)[1];
      logger.info(
        `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 💾 Storing data in cache...`
      );

      await sleep(5);

      tmp
        .addJson(
          this.session_name,
          decodeURIComponent(this.#clean_tg_web_data(tgWebData))
        )
        .save();

      const jsonData = {
        init_data: decodeURIComponent(this.#clean_tg_web_data(tgWebData)),
        invite_code: "00003Ozq",
        is_bot: false,
      };

      return jsonData;
    } catch (error) {
      if (error.message.includes("AUTH_KEY_DUPLICATED")) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | The same authorization key (session file) was used in more than one place simultaneously. You must delete your session file and create a new session`
        );
        return null;
      }
      const regex = /A wait of (\d+) seconds/;
      if (
        error.message.includes("FloodWaitError") ||
        error.message.match(regex)
      ) {
        const match = error.message.match(regex);

        if (match) {
          this.sleep_floodwait =
            new Date().getTime() / 1000 + parseInt(match[1], 10) + 10;
        } else {
          this.sleep_floodwait = new Date().getTime() / 1000 + 50;
        }
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${
            this.session_name
          } | Some flood error, waiting ${
            this.sleep_floodwait - new Date().getTime() / 1000
          } seconds to try again...`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ❗️Unknown error during Authorization: ${error}`
        );
      }
      return null;
    } finally {
      if (this.tg_client.connected) {
        await this.tg_client.disconnect();
        await this.tg_client.destroy();
      }
      this.runOnce = true;
      if (this.sleep_floodwait > new Date().getTime() / 1000) {
        await sleep(this.sleep_floodwait - new Date().getTime() / 1000);
        return await this.#get_tg_web_data();
      }
      await sleep(3);
    }
  }

  async #get_access_token(tgWebData, http_client) {
    try {
      const response = await http_client.post(
        `${this.API_URL}/tomarket-game/v1/user/login`,
        JSON.stringify(tgWebData)
      );

      if (
        response?.data?.status === 400 ||
        response?.data?.message?.toLowerCase()?.includes("invalid init data")
      ) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ❗️ Error while getting Access Token: Invalid init data signature`
        );
        return null;
      }
      return response.data;
    } catch (error) {
      if (error?.response?.status > 499) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Server Error, retrying again after sleep...`
        );
        await sleep(1);
        return null;
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ❗️Unknown error while getting Access Token: ${error}`
        );
        await sleep(3); // 3 seconds delay
      }
    }
  }

  async #check_proxy(http_client, proxy) {
    try {
      const response = await http_client.get("https://httpbin.org/ip");
      const ip = response.data.origin;
      logger.info(
        `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Proxy IP: ${ip}`
      );
    } catch (error) {
      if (
        error.message.includes("ENOTFOUND") ||
        error.message.includes("getaddrinfo") ||
        error.message.includes("ECONNREFUSED")
      ) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error: Unable to resolve the proxy address. The proxy server at ${proxy.ip}:${proxy.port} could not be found. Please check the proxy address and your network connection.`
        );
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | No proxy will be used.`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Proxy: ${proxy.ip}:${proxy.port} | Error: ${error.message}`
        );
      }

      return false;
    }
  }

  async run(proxy) {
    let http_client;
    let access_token_created_time = 0;
    let next_stars_check = 0;
    let next_combo_check = 0;

    let profile_data;
    let rank_data;
    let sleep_daily_reward = 0;

    if (settings.USE_PROXY_FROM_FILE && proxy) {
      http_client = axios.create({
        httpsAgent: this.#proxy_agent(proxy),
        headers: this.headers,
        withCredentials: true,
      });
      const proxy_result = await this.#check_proxy(http_client, proxy);
      if (!proxy_result) {
        http_client = axios.create({
          headers: this.headers,
          withCredentials: true,
        });
      }
    } else {
      http_client = axios.create({
        headers: this.headers,
        withCredentials: true,
      });
    }
    while (true) {
      try {
        const currentTime = _.floor(Date.now() / 1000);
        if (currentTime - access_token_created_time >= 3600) {
          const tg_web_data = await this.#get_tg_web_data();
          if (
            _.isNull(tg_web_data) ||
            _.isUndefined(tg_web_data) ||
            !tg_web_data ||
            _.isEmpty(tg_web_data)
          ) {
            continue;
          }

          const get_token = await this.#get_access_token(
            tg_web_data,
            http_client
          );
          http_client.defaults.headers[
            "authorization"
          ] = `${get_token?.data?.access_token}`;
          access_token_created_time = currentTime;
          await sleep(2);
        }
        // Get profile data
        profile_data = await this.api.get_user_data(http_client);
        rank_data = await this.api.get_rank_data(http_client);

        if (_.isEmpty(profile_data?.data) || _.isEmpty(rank_data)) {
          continue;
        }

        await sleep(3);

        if (rank_data?.data?.isCreated == false && rank_data?.status === 0) {
          //log check rank data
          logger.info(
            `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Evaluating Rank...`
          );

          const evaluate_rank = await this.api.evaluate_rank_data(http_client);
          if (!_.isEmpty(evaluate_rank?.data) && evaluate_rank?.status === 0) {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Rank evaluated | Tomato stars: <pi>${evaluate_rank?.data?.stars}</pi> | Tomato scores: <la>${evaluate_rank?.data?.tomatoScore}</la>`
            );
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Sleeping 3 seconds before checking rank`
            );
            await sleep(3);
            const create_rank = await this.api.create_rank_data(http_client);
            if (!_.isEmpty(create_rank?.data) && create_rank?.status === 0) {
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Rank created | Current rank: <la>${create_rank?.data?.currentRank?.name}</la>`
              );
            } else {
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Rank not created | Skipping....`
              );
            }
          } else {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Rank not evaluated | Skipping....`
            );
          }
        }
        await sleep(3);
        rank_data = await this.api.get_rank_data(http_client);
        if (
          !_.isEmpty(rank_data?.data) &&
          rank_data?.status === 0 &&
          rank_data?.data?.isCreated == true
        ) {
          if (rank_data?.data?.unusedStars > 0) {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Upgrading rank with <bl>${rank_data?.data?.unusedStars}</bl> stars`
            );
            await sleep(2);

            const upgrade_rank = await this.api.upgrade_rank(http_client, {
              stars: rank_data?.data?.unusedStars,
            });
            if (!_.isEmpty(upgrade_rank?.data) && upgrade_rank?.status === 0) {
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Rank upgraded | New rank: <la>${upgrade_rank?.data?.currentRank?.name}</la>`
              );
            } else {
              logger.warning(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Could not upgrade rank`
              );
            }
          } else {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Your current rank is <la>${rank_data?.data?.currentRank?.name}</la> | Stars used: <pi>${rank_data?.data?.usedStars}</pi>`
            );
          }
        }
        // Claim daily reward
        if (
          settings.AUTO_CLAIM_DAILY_REWARD &&
          sleep_daily_reward < currentTime
        ) {
          const daily_reward = await this.api.claim_daily_reward(http_client);

          if (daily_reward?.status == 0) {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 🎉 Claimed daily reward | Points: <gr>+${daily_reward?.data?.today_points}</gr> | Play Passes: <gr>+${daily_reward?.data?.today_game}</gr>`
            );
            sleep_daily_reward = _.floor(
              new Date(moment().add(1, "days").format("YYYY-MM-DD")).getTime() /
                1000
            );
          } else if (daily_reward?.message?.includes("already_check")) {
            logger.warning(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Already claimed daily reward | Skipping....`
            );
            sleep_daily_reward = _.floor(
              new Date(moment().add(1, "days").format("YYYY-MM-DD")).getTime() /
                1000
            );
          }
        }
        await sleep(3);

        //Daily combo
        if (settings.AUTO_CLAIM_COMBO && next_combo_check < currentTime) {
          const combo_info = await this.api.get_combo(http_client);
          const combo_info_data = combo_info?.data[0] || [];

          if (combo_info?.status == 0 && !_.isEmpty(combo_info_data)) {
            if (combo_info_data?.status > 0) {
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Combo already claimed | Skipping....`
              );
            } else if (
              combo_info_data?.status == 0 &&
              new Date(combo_info_data?.end) > new Date()
            ) {
              const data = {
                task_id: combo_info_data?.taskId,
              };
              const claim_combo = await this.api.claim_task(http_client, data);

              if (claim_combo?.status == 0) {
                logger.info(
                  `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 🎉 Claimed combo | Points: <gr>+${combo_info_data?.score}</gr> | Combo code: <ye>${combo_info_data?.code}</ye>`
                );
              } else {
                logger.warning(
                  `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming combo: ${claim_combo?.message}`
                );
              }
            }
            next_combo_check = _.floor(
              new Date(combo_info_data?.end).getTime() / 1000
            );
          }
        }

        //Claiming stars
        if (settings.AUTO_CLAIM_STARTS && next_stars_check < currentTime) {
          const get_stars = await this.api.get_stars(http_client);

          if (get_stars?.status == 0 && !_.isEmpty(get_stars?.data)) {
            if (get_stars?.data?.status > 2) {
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Stars already claimed | Skipping....`
              );
            } else if (
              get_stars?.data?.status < 3 &&
              new Date(get_stars?.data?.endTime) > new Date()
            ) {
              const data = {
                task_id: get_stars?.data?.taskId,
              };
              const start_stars_claim = await this.api.start_stars_claim(
                http_client,
                data
              );
              const claim_stars = await this.api.claim_task(http_client, data);
              if (claim_stars?.status == 0 && start_stars_claim?.status == 0) {
                logger.info(
                  `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 🎉 Claimed stars | Stars: <gr>+${start_stars_claim?.data?.stars}</gr>`
                );
              } else {
                logger.warning(
                  `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming stars: ${claim_stars?.message} || ${start_stars_claim?.message}`
                );
              }
            }
          }

          next_stars_check = _.floor(
            new Date(get_stars?.data?.endTime).getTime() / 1000
          );
        }

        // Farming
        if (settings.AUTO_FARM) {
          const farm_info_data = {
            game_id: this.JUOY_f,
          };
          let farm_info = await this.api.get_farm_info(
            http_client,
            farm_info_data
          );

          if (farm_info?.status == 0 && _.isEmpty(farm_info?.data)) {
            const start_farm = await this.api.start_farming(
              http_client,
              farm_info_data
            );

            if (start_farm?.status == 0 && !_.isEmpty(start_farm?.data)) {
              farm_info = await this.api.get_farm_info(
                http_client,
                farm_info_data
              );
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${
                  this.session_name
                } | 🌱 Farming started | Duration: ${moment(
                  start_farm?.data?.end_at * 1000
                ).fromNow(true)}`
              );
            } else {
              logger.warning(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while starting farming: ${start_farm?.message}`
              );
            }
          } else if (farm_info?.status == 0 && !_.isEmpty(farm_info?.data)) {
            farm_info = await this.api.get_farm_info(
              http_client,
              farm_info_data
            );
            if (farm_info?.data?.end_at <= currentTime) {
              const claim_farm = await this.api.claim_farming_reward(
                http_client,
                farm_info_data
              );
              if (claim_farm?.status == 0) {
                await sleep(5);
                profile_data = await this.api.get_user_data(http_client);
                await this.api.start_farming(http_client, farm_info_data);
                logger.info(
                  `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 🌱 Claimed farm reward | Balance: <la>${profile_data?.data?.available_balance}</la> <gr>(+${claim_farm?.data?.points})</gr> | Play Passes: ${profile_data?.data?.play_passes}`
                );
              } else {
                logger.warning(
                  `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming farm reward: ${claim_farm?.message}`
                );
              }
            } else if (farm_info?.data?.end_at) {
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${
                  this.session_name
                } | 🌱 Farming is in progress | Time left: ${moment(
                  farm_info?.data?.end_at * 1000
                ).fromNow(true)}`
              );
            }
          } else {
            logger.warning(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while getting farm info: ${farm_info?.message}`
            );
          }
        }

        await sleep(3);

        // Play game
        while (
          !_.isEmpty(profile_data?.data) &&
          !_.isEmpty(profile_data?.data?.play_passes) &&
          profile_data?.data?.play_passes > 0 &&
          settings.AUTO_PLAY_GAME
        ) {
          logger.info(
            `<ye>[${this.bot_name}]</ye> | ${this.session_name} | sleeping for 20 seconds before starting game...`
          );
          await sleep(20);
          const data = { game_id: this.TOIY_g };
          const start_game_response = await this.api.start_game(
            http_client,
            data
          );

          if (
            start_game_response?.status == 0 &&
            !_.isEmpty(start_game_response?.data)
          ) {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${
                this.session_name
              } | 🎲 Game started | Duration: ${
                start_game_response?.data?.end_at -
                start_game_response?.data?.start_at
              } seconds`
            );
            const game_sleep_time =
              start_game_response?.data?.end_at -
              start_game_response?.data?.start_at;

            await sleep(game_sleep_time);

            // Claim game reward
            const points = _.random(300, 400);
            const claim_data = {
              game_id: this.TOIY_g,
              points,
            };
            const claim_game_reward_response = await this.api.claim_game_reward(
              http_client,
              claim_data
            );

            if (
              claim_game_reward_response?.status == 0 &&
              !_.isEmpty(claim_game_reward_response?.data)
            ) {
              profile_data = await this.api.get_user_data(http_client);
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 🎉 Game reward claimed | Balance: <la>${profile_data?.data?.available_balance}</la> (<gr>+${claim_game_reward_response?.data?.points}</gr>) | Available: Play Passes <ye>${profile_data?.data?.play_passes}</ye>`
              );
            } else {
              logger.error(
                `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>claiming game reward:</b>: ${claim_game_reward_response?.message}`
              );
            }
          } else {
            logger.error(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while <b>playing game:</b>: ${start_game_response?.message}`
            );
          }

          await sleep(3);
        }
      } catch (error) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ❗️Unknown error: ${error}`
        );
      } finally {
        let ran_sleep;
        if (_isArray(settings.SLEEP_BETWEEN_TAP)) {
          if (
            _.isInteger(settings.SLEEP_BETWEEN_TAP[0]) &&
            _.isInteger(settings.SLEEP_BETWEEN_TAP[1])
          ) {
            ran_sleep = _.random(
              settings.SLEEP_BETWEEN_TAP[0],
              settings.SLEEP_BETWEEN_TAP[1]
            );
          } else {
            ran_sleep = _.random(450, 800);
          }
        } else if (_.isInteger(settings.SLEEP_BETWEEN_TAP)) {
          const ran_add = _.random(20, 50);
          ran_sleep = settings.SLEEP_BETWEEN_TAP + ran_add;
        } else {
          ran_sleep = _.random(450, 800);
        }

        logger.info(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Sleeping for ${ran_sleep} seconds...`
        );
        await sleep(ran_sleep);
      }
    }
  }
}
module.exports = Tapper;
