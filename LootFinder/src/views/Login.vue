<template>
  <div>
    <h1>Login</h1>
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script>
  import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { auth, googleProvider } from '@/firebase';

  export default {
    methods: {
      async loginWithGoogle() {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          console.log('User logged in:', result.user);
          this.$router.push('/dashboard'); // Redirect after login
        } catch (error) {
          console.error('Error logging in:', error.message);
        }
      },
    },
  };
</script>
