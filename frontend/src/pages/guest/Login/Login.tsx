import { useLazyQuery } from "@apollo/client";
import { Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input, InputPassword, Loading } from "../../../components";
import { AlertMessage } from "../../../components/form/AlertMessage/AlertMessage";
import { LOGIN } from "../../../queries/login";
import { setToken } from "../../../store/slices/auth";
import styles from "./Login.module.scss";

export const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [login, { data, loading }] = useLazyQuery(LOGIN);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!username.length || !password.length) {
      setError("Username and password are required");
    } else if (username && password) {
      login({ variables: { username, password } });
    }
  };

  useEffect(() => {
    const handleStoreToken = () => {
      localStorage.setItem("token", data.login);
      dispatch(setToken(data.login));
      navigate("/");
    };

    data && data.login && handleStoreToken();
  }, [data, dispatch, navigate]);

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.login}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Input
          label="Username"
          required
          value={username}
          onChange={(val: string) => setUsername(val)}
        />
        <InputPassword
          value={password}
          label="Password"
          onChange={(value: string) => setPassword(value)}
          required={true}
        />
        <div className={styles.buttonContainer}>
          <Button variant="outlined" type="submit">
            Submit
          </Button>
        </div>
      </form>

      <AlertMessage
        isOpen={!!error}
        onClose={() => setError("")}
        message={error}
      />
    </div>
  );
};
