const logger = require("./logger");

class Parser {
  #parseQueryString(queryString) {
    let queryParams = {};
    let pairs = queryString.split("&");

    pairs.forEach((pair) => {
      let [key, value] = pair.split("=");
      queryParams[key] = value;
    });

    return queryParams;
  }

  #decodeUrlEncodedString(str) {
    return decodeURIComponent(str.replace(/\+/g, " "));
  }

  toJson(queryString) {
    try {
      const parsedQuery = this.#parseQueryString(queryString);
      const userField = this.#decodeUrlEncodedString(parsedQuery.user);
      const user = JSON.parse(userField);
      parsedQuery.user = user;
      parsedQuery.user.allows_write_to_pm = true;
      return parsedQuery;
    } catch (error) {
      logger.error("Error while parsing query string: " + error.message);
      return null;
    }
  }

  toQueryString(json) {
    let encodedString = Object.keys(json)
      .map((key) => {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(
          typeof json[key] === "object" ? JSON.stringify(json[key]) : json[key]
        );
        return `${encodedKey}=${encodedValue}`;
      })
      .join("&");

    return encodedString;
  }
}

const parser = new Parser();

module.exports = parser;
