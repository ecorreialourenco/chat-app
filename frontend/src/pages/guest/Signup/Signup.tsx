import { useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input, Loading } from "../../../components";
import { AlertMessage } from "../../../components/form/AlertMessage/AlertMessage";
import { InputPassword } from "../../../components/form/InputPassword/InputPassword";
import { SIGNUP } from "../../../queries/signup";
import { setToken } from "../../../store/slices/auth";
import styles from "./Signup.module.scss";

export const Signup: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signup, { data, loading }] = useMutation(SIGNUP);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (password !== password2) {
      setError("Passwords don't match");
    } else {
      signup({ variables: { username, password } });
    }
  };

  useEffect(() => {
    if (data && data.signup) {
      localStorage.setItem("token", data.signup);
      dispatch(setToken(data.signup));
      navigate("/");
    }
  }, [data, dispatch, navigate]);

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.signup}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <Input
          label="Username"
          value={username}
          onChange={(value: string) => setUsername(value)}
          required={true}
        />
        <InputPassword
          label="Password"
          name="password"
          value={password}
          onChange={(value: string) => setPassword(value)}
          required={true}
        />
        <InputPassword
          label="Password"
          name="password2"
          value={password2}
          onChange={(value: string) => setPassword2(value)}
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
