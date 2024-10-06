import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.svg';

import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import SignIn from './components/SignIn/SignIn';
import ChatRoom from './components/ChatRoom/ChatRoom';
import ActiveUsersList from './components/ActiveUsersList/ActiveUsersList';
import { auth, firestore } from './firebase';

function App() {
  const [user] = useAuthState(auth);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showActiveUsers, setShowActiveUsers] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(firestore, 'activeUsers'), snapshot => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActiveUsers(users);
      });
      return unsubscribe;
    }
  }, [user]);

  const toggleActiveUsers = () => {
    setShowActiveUsers(!showActiveUsers);
  };

  const handleCloseActiveUsers = () => {
    setShowActiveUsers(false);
  };

  const handleSignOut = async () => {
    const activeUsersRef = collection(firestore, 'activeUsers');
    const userQuery = query(activeUsersRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(userQuery);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    signOut(auth);
  };

  return (
    <div className="App">
      <header>
        <img src={logo} alt='2' className='logo' />
        {user && (
          <div>
            <button onClick={toggleActiveUsers} className='allUsers'>Пользователи</button>
            {showActiveUsers && (
              <div className="active-users-container">
                <ActiveUsersList activeUsers={activeUsers} onClose={handleCloseActiveUsers} />
              </div>
            )}
          </div>
        )}
        {user && (
          <button className="sign-out" onClick={handleSignOut}>Выход</button>
        )}
      </header>

      <section>
        {user ? <ChatRoom user={user} showActiveUsers={showActiveUsers} /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;
