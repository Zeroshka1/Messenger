import React from 'react';
import { auth } from '../../firebase';
import './ChatMessage.css'

function ChatMessage({ message }) {
  const { text, uid, photoURL } = message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="Avatar" className='avatar'/>
      <p>{text}</p>
    </div>
  );
}

export default ChatMessage;
