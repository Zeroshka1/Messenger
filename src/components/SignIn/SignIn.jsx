import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import './SignIn.css'

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
        const user = result.user;
        const activeUsersRef = collection(firestore, 'activeUsers');

        const querySnapshot = await getDocs(query(activeUsersRef, where('uid', '==', user.uid)));
        if (querySnapshot.empty) {
          await addDoc(activeUsersRef, {
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
          });
        }
        const messagesRef = collection(firestore, 'messages');
        await addDoc(messagesRef, {
          text: `${user.displayName} присоединился к чату`,
          createdAt: serverTimestamp(),
          uid: 'system',
          photoURL: null,
        });
      })
      .catch((error) => {
        console.error("Ошибка при входе через Google:", error);
      });
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Войти через Google</button>
    </>
  );
}

export default SignIn;
