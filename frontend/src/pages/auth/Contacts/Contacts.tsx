import React, { useState } from "react";
import { Alert, Button, Tab, Tabs } from "@mui/material";
import { FindContactsModal } from "./FindContacts";
import { TabPanel } from "../../../components";
import { BlockedTab, FriendsTab, RequestTab } from "./Tabs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/store";
import { setAlert } from "src/store/slices/ui";

export const Contacts = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const dispatch = useDispatch();
  const { alertMessage, alertType } = useSelector(
    (state: RootState) => state.ui
  );

  const handleCloseAlert = () => {
    dispatch(
      setAlert({
        msg: null,
        type: "success",
      })
    );
  };

  return (
    <div>
      <h2>Contacts</h2>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpen(true)}
        >
          Find Contacts
        </Button>
      </div>

      {!!alertMessage && (
        <Alert
          style={{ position: "absolute", right: 0, zIndex: 5 }}
          severity={alertType}
          onClose={handleCloseAlert}
        >
          {alertMessage}
        </Alert>
      )}

      <Tabs
        value={selectedTab}
        onChange={(event: React.SyntheticEvent, newValue: number) =>
          setSelectedTab(newValue)
        }
      >
        <Tab label="Friends" />
        <Tab label="Requests" />
        <Tab label="Blocked" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <FriendsTab />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <RequestTab />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <BlockedTab />
      </TabPanel>

      {isOpen && (
        <FindContactsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
