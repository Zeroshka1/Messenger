import React, { useRef, useState } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ChatMessage from '../ChatMessage/ChatMessage';
import { firestore } from '../../firebase';
import './ChatRoom.css'

function ChatRoom({ user, showActiveUsers }) {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    if (formValue.trim() === '') {
      return;
    }

    const { uid, photoURL } = user;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  const isSystemMessage = (message) => {
    return message.uid === 'system';
  };

  return (
    <>
      <main className={showActiveUsers ? 'chat chat-blur' : 'chat'}>
        {messages && messages.map((msg, index) => (
          <React.Fragment key={index}>
            {isSystemMessage(msg) ? (
              <div className="user-join-message">
                <p>{msg.text}</p>
              </div>
            ) : (
              <ChatMessage key={msg.id} message={msg} />
            )}
            {index === messages.length - 1 && <span ref={dummy} key={`dummy-${index}`}></span>}
          </React.Fragment>
        ))}
      </main>


      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="тут надо писать"
        />
        <button type="submit" disabled={!formValue.trim()}> ⮕</button>
      </form>
    </>
  );
}

export default ChatRoom;
