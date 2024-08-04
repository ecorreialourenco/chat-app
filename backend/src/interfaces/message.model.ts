export interface MessageProps {
  message: {
    groupId: number;
    id?: number;
    message: string;
  };
}

export interface ReadMessageProps {
  read: {
    messageIds: [number];
  };
}
