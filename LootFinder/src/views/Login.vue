<template>
  <div>
    <h1>Login</h1>
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script>
  import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { auth, googleProvider, db } from '@/firebase';
  import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';

  export default {
    methods: {
      async loginWithGoogle() {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          console.log('User logged in:', result.user);

          const currentUser = result.user;
          // Retrieve Firestore Instance
          const userDocRef = doc(db, 'user', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          // check if user doc exists, if not create it
          if (!userDoc.exists()) {
            await setDoc(userDocRef,{
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              joinDate: new Date(),
              admin: false,
            });
          }

          this.$router.push('/dashboard'); // Redirect after login
        } catch (error) {
          console.error('Error logging in:', error.message);
        }
      },
    },
  };
</script>
