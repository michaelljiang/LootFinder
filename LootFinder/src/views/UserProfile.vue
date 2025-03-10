<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div v-if="user" class="bg-white shadow-lg rounded-2xl p-6 w-96 text-center">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4">User Profile</h1>
      <img 
        :src="user.photoURL" 
        alt="Profile Picture" 
        class="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 shadow-md"
      />
      <div class="mt-4 space-y-2">
        <p class="text-lg font-medium text-gray-700"><strong>Name:</strong> {{ user.displayName }}</p>
        <p class="text-gray-600"><strong>Email:</strong> {{ user.email }}</p>
      </div>
      <button 
        @click="logout"
        class="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Log Out
      </button>
    </div>

    <div v-else class="text-gray-600 text-lg">
      <p>Loading...</p>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const user = ref<any>(null);
    const auth = getAuth();

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

    const logout = () => {
      signOut(auth)
      .then(() => {
        console.log("User signed out");
        user.value = null;
      })
      .catch((error: unknown) => {
      if (error instanceof Error) {
        console.error("Logout error:", error.message);
      } else {
        console.error("Logout error:", error);
      }
    });
};


    return { user, logout };
  },
});
</script>
