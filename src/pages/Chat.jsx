import React from "react";
import { useParams } from "react-router-dom";
import Messege from "../components/Messege/Messege.jsx";

const Chat = () => {
  const { chatId } = useParams();

  return (
    <div>
      <Messege initialChatId={chatId} />
    </div>
  );
};

export default Chat;
 