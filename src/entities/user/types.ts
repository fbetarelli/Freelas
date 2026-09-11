export interface User {
  id: string;
  username: string;
  login: string;
  hashPassword: string;
}

export type SessionUser = Omit<User, "hashPassword">;
