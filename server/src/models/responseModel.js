class ApiResponse {
  constructor(code = 500, data = null, message = "Internal server error") {
    this.code = code;
    this.data = data;
    this.message = message;
  }
}

module.exports = {
  ApiResponse,
};
