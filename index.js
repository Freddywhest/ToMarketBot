const logger = require("./bot/utils/logger");
const luncher = require("./bot/utils/luncher");
const main = async () => {
  await luncher.process();
};

// Wrap main function execution in an async context to handle asynchronous operations
(async () => {
  try {
    await main();
  } catch (error) {
    logger.error("Error: ", error.message);
  }
})();
