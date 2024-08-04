import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PROFILE, UPDATE_PROFILE } from "../../../queries/profile";
import styles from "./Profile.module.scss";

interface ProfileModel {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  isVisible: boolean;
}

export const Profile = () => {
  const initialData: ProfileModel = {
    id: "",
    userName: "",
    firstName: "",
    lastName: "",
    isVisible: false,
  };

  const [oldData, setOldData] = useState<ProfileModel>(initialData);
  const [formData, setFormData] = useState<ProfileModel>(initialData);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [getProfile] = useLazyQuery(GET_PROFILE);
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prevData) => ({ ...prevData, [name]: value }));

  const handleSwitchChange = (
    { target: { name } }: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => setFormData((prevData) => ({ ...prevData, [name]: checked }));

  const handleCancel = () => {
    setFormData(oldData);
    setEditMode(false);
  };

  const handleSubmit = () => {
    updateProfile({ variables: formData });
    setEditMode(false);
  };

  useEffect(() => {
    if (!oldData.id) {
      getProfile().then(({ data: { getProfile } }) => {
        const formatedData = {
          ...getProfile,
          isVisible: getProfile.isVisible === "true",
        };
        setOldData(formatedData);
        setFormData(formatedData);
      });
    }
  }, [getProfile, oldData]);

  return (
    <div className={styles.profile}>
      <Card variant="outlined" sx={{ width: 400 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            My Profile
          </Typography>
          <FormGroup>
            <TextField
              label="Username"
              variant="standard"
              name="userName"
              disabled={!editMode}
              value={formData.userName}
              onChange={handleChange}
            />
            <div>
              <TextField
                label="First Name"
                variant="standard"
                name="firstName"
                disabled={!editMode}
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                label="Last Name"
                variant="standard"
                name="lastName"
                disabled={!editMode}
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <FormControlLabel
              disabled={!editMode}
              control={
                <Switch
                  checked={formData.isVisible}
                  //value={formData.isVisible}
                  name="isVisible"
                  onChange={handleSwitchChange}
                />
              }
              label="Is visible"
            />
            {editMode ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </FormGroup>
        </CardContent>
      </Card>
    </div>
  );
};
