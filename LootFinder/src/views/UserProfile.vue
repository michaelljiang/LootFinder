<template>
    <div class="user-profile" v-if="user">
      <h1>User Profile</h1>
      <img :src="user.photoURL" alt="Profile Picture" />
      <p><strong>Name:</strong> {{ user.displayName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  
  export default defineComponent({
    name: 'UserProfile',
    setup() {
      const user = ref<any>(null);
      const auth = getAuth();
  
      // Listen for changes in authentication state
      onMounted(() => {
        onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            user.value = {
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            };
          } else {
            console.error("No user is logged in");
            user.value = null;
          }
        });
      });
  
      return { user };
    },
  });
  </script>
  
  <style scoped>
  .user-profile img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  </style>
  