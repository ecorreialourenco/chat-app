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
import { SignupModel } from "../../../models";

const initialData: SignupModel = {
  username: "",
  password: "",
  password2: "",
};

export const Signup: FC = () => {
  const [formData, setFormData] = useState<SignupModel>(initialData);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signup, { data, loading }] = useMutation(SIGNUP);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prevData) => ({ ...prevData, [name]: value }));

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setError("Passwords don't match");
    } else {
      signup({ variables: formData });
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
          name="username"
          value={formData.username}
          onChange={handleChange}
          required={true}
        />
        {/*  <div style={{ display: "flex" }}>
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required={true}
          />
        </div> */}
        <div style={{ display: "flex" }}>
          <InputPassword
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={true}
          />
          <InputPassword
            label="Password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required={true}
          />
        </div>
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
