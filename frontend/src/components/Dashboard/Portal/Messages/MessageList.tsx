import { Send } from "@mui/icons-material";
import { IconButton, TextField, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../../../../axios";
import { useSelector } from "react-redux";
import MessageItem from "./MessageItem";

const MessageSection = styled("div")({
  // background: "#808dd6",
  background: '#abb6f8',
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflow: "auto",
});
const ListSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  flex: 1,
  overflow: "scroll",
  padding: "20px 16px",
});
const MessageForm = styled("div")({
  marginTop: "auto",
  background: "#ffffff88",
  display: "flex",
});

const Input = styled(TextField)({
  borderRadius: "24px",
  "& input": {
    padding: "16px 24px",
  },
  "& fieldset": {
    display: "none",
  },
});

type Props = {
  chat: Chat
  messages: Message[];
  handleMessageList: (message: Message) => void
};
function MessageList(props: Props) {
  const [message, setMessage] = useState("");
  const user: User = useSelector((state: State) => state.user) as User;
  const messageRef = useRef<HTMLDivElement>()

  useEffect(() => {
    messageRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'})
  },[props.messages])

  const handleSendMessage = async () => {
    if (message.length > 0) {
      setMessage("")
      const newMessage: Message = {
        chatId: props.chat,
        sender: user,
        text: message
      }
      props.handleMessageList(newMessage)
      await sendMessage({
        chatId: props.chat._id,
        sender: user._id,
        text: message,
      }).then((res) => {
      console.log(res)
      });
    }
  };
  return (
    <MessageSection>
      <ListSection>
        {props.messages.map((message, idx) => (
          <MessageItem key={idx} text={message.text} isUser={message.sender._id === user._id}  />
        ))}
        <div ref={(el) => (messageRef.current = el as HTMLDivElement)}></div>
      </ListSection>
      <MessageForm>
        <Input
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <IconButton onClick={handleSendMessage}>
          <Send />
        </IconButton>
      </MessageForm>
    </MessageSection>
  );
}
export default MessageList;