export interface LoginProps {
  login: {
    username: string;
    password: string;
  };
}

export interface SignupProps {
  signup: {
    username: string;
    password: string;
    password2: string;
  };
}
