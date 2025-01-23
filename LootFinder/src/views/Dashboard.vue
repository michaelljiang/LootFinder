<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Welcome, {{ user.displayName }}!</p>
    <p v-else>Loading...</p>
    <button @click="logout">Logout</button>
    <button @click="home">Home</button>
  </div>
</template>

<script>
  import { auth } from '@/firebase'; // Import Firebase Auth
  import { signOut } from 'firebase/auth';

  export default {
    data() {
      return {
        user: null, // Store the authenticated user
      };
    },
    created() {
      // Check if a user is logged in
      this.user = auth.currentUser;

      // Listen for authentication state changes
      auth.onAuthStateChanged((user) => {
        this.user = user;
      });
    },
    methods: {
      async logout() {
        try {
          await signOut(auth);
          console.log('User logged out');
          this.$router.push('/'); // Redirect to Home after logout
        } catch (error) {
          console.error('Error logging out:', error.message);
        }
      },

      home() {
        this.$router.push('/');
      },
    },
  };
</script>
