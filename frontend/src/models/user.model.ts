export interface User {
  id: string;
  username?: string;
}

export interface Token {
  user: User;
  iat: number;
  exp: number;
}
