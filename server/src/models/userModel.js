class UserData {
  constructor(
    id = "",
    name = "",
    surname = "",
    userId = "",
    token = "",
    querys = []
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.userId = userId;
    this.token = token;
    this.querys = querys;
  }

  static createUserObject(data) {
    return new UserData(
      data._id,
      data.name,
      data.surname,
      data.userId,
      "",
      data.searchQuerys
    );
  }
}

module.exports = {
  UserData,
};
