import { MessageGroups } from "./MessageGroups";
import styles from "./Messages.module.scss";

export const Messages = () => {
  return (
    <div className={styles.container}>
      <MessageGroups />
    </div>
  );
};
