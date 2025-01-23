<template>
  <div>
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script>
  import { signInWithPopup } from 'firebase/auth';
  import { auth, googleProvider } from '../firebase';

  export default {
    methods: {
      async loginWithGoogle() {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          // The signed-in user info
          const user = result.user;
          console.log('User logged in:', user);

          // Optional: Access the Google token if needed
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          console.log('Google Access Token:', token);
        } catch (error) {
          console.error('Error logging in with Google:', error.message);
        }
      },
    },
  };
</script>
