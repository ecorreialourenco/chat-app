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
import { LoginModel } from "../../../models";

const initialData: LoginModel = {
  username: "",
  password: "",
};

export const Login: FC = () => {
  const [formData, setFormData] = useState<LoginModel>(initialData);
  const [error, setError] = useState<string>("");
  const [login, { data, loading }] = useLazyQuery(LOGIN);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prevData) => ({ ...prevData, [name]: value }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!formData.username.length || !formData.password.length) {
      setError("Username and password are required");
    } else if (formData.username && formData.password) {
      login({ variables: formData });
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
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <InputPassword
          value={formData.password}
          label="Password"
          name="password"
          onChange={handleChange}
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
