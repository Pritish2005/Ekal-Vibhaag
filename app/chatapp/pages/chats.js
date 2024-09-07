import React, {useState, useEffect, useContext} from "react";

import { Context } from "../context";
import { useRouter } from "next/router";
import dynamics from "next/dynamics";
const ChatEngine = dynamics(()=> 
import("rect-chat-engine").then((module) => module.ChatEngine));
const MessageForSocial = dynamics(()=>
import("react-chat-engine").then((module) => module.MessageForSocial));


export default function Chats() {
  const {username, secret} = useContext(Context)
  const [showChat, setShowChat] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof document != null ){
      setShowChat(true)
    }
  });
  useEffect(() => {
    if (username.length === 0 || Secret.length ===o) router.push("/")
  })
  if(showChat) return <div/>;
  return <div className="background">
    <div className="shadow">
      <ChatEngine
      height ='calc(300ch - '
      projectID='7ddaf0b4-643a-47f3-aa50-e37331f2d5ce'
      userName={username}
      userSecret= {secret}
      renderMoveMessageform={() => MessageForSocial }
      />
    </div>
  </div>;
}
