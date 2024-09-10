import React, { useContext} from "react";

import { Context } from "../context";

import { useRouter } from "next/router";

import axios from "axios";

export default function Auth() {
  const{ username, secret, setUsername, setSecret } = useContext (Context);
    
  
  function onSubmit(e){
    e.preventDefault()
    if (username.length === 0 || Secret.length ===o) return
    axios.put(
     'https://api.chatengine.io/users/',
     {username, secret},
    {headers:{"Private-key":"4a7a4d0d-ef2b-45f6-bb22-a54893dcf986"}}
    )
    .then(r => Router.push('/chats'))
  }
    return (
  <div className="background">
  <div className="auth-container"> 
   <form className="auth-form" onSubmit={(e)=>onsubmit(e)} >
    <div className="auth-title"> chatbox</div>
    <div class ="input-container">
      <input
      placeholder="email"
      className="text-input"
      onChange={e => setUsername(e.target.value)}
      />
    </div>

    <div class ="input-container">
      <input
      type="password"
      placeholder="Password"
      className="text-input"
      onChange={e => setSecret(e.target.value)}
      />
      </div>
      <button type="submit" className="submit-button">
      Login/Sign up
      </button>
  </form> 
  </div> 
  </div>
);
}
