export interface UserType {
  id: string;
  username: string;
  login: string;
  hashPassword?: string;
}

export class User implements UserType {
  id;
  username;
  login;
  hashPassword?;

  constructor({ id, username, login, hashPassword }: UserType) {
    this.id = id;
    this.username = username;
    this.login = login;
    this.hashPassword = hashPassword;
  }

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  getLogin() {
    return this.login;
  }

  gethashPassword() {
    return this.hashPassword;
  }
}
