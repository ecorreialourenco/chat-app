export interface User {
  id: number;
  username?: string;
}

export interface LoginModel {
  username: string;
  password: string;
}

export interface SignupModel {
  username: string;
  password: string;
  password2: string;
}

export interface Token {
  user: User;
  iat: number;
  exp: number;
}

export interface Friend {
  id: number;
  request: User;
  target: User;
  status: {
    id: number;
    status: string;
  };
}

export interface UserFriend {
  id: number;
  username: string;
  friends: Friend[];
}

export interface ContactsPaginated {
  users: [UserFriend];
  total: number;
}
