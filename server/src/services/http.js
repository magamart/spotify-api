const request = require("request");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const slientSecret = process.env.SPOTIFY_CLIENT_SECRET;

class Http {
  headers = {
    "Content-Type": "application/json",
  };

  getOptions(link, headers = false) {
    const options = {};
    options.url = link;
    options.headers = headers
      ? headers === "token"
        ? this.getAuthHeaders()
        : headers
      : this.headers;
    return options;
  }

  get(link, headers = false) {
    const options = this.getOptions(link, headers);

    return new Promise((resolve, reject) => {
      request.get(options, (error, response, body) => {
        const data = this.parseBody(body);
        if (!error && response.statusCode == 200) {
          resolve({ data: this.parseBody(body) });
        } else {
          reject({ error: data.error_description || data.error });
        }
      });
    });
  }

  post(link, body, headers = false) {
    const options = this.getOptions(link, headers);
    const key =
      options.headers["Content-Type"] === "application/x-www-form-urlencoded"
        ? "form"
        : "body";
    options[key] = body;

    return new Promise((resolve, reject) => {
      request.post(options, (error, response, body) => {
        const data = this.parseBody(body);
        if (!error && response.statusCode == 200) {
          resolve({ data: this.parseBody(body) });
        } else {
          reject({ error: data.error_description || data.error });
        }
      });
    });
  }

  getAuthHeaders() {
    return {
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + slientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  parseBody(body) {
    try {
      return JSON.parse(body);
    } catch (error) {
      return body;
    }
  }
}

module.exports = Http;
