<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Log in to LootFinder</h1>
      <p class="login-description">
        <!-- lorem ipsum dolor sit amet i forgot how this goes -->
      </p>

      <div v-if="loading" class="loading-container">
        <p>Loading...</p>
      </div>

      <div v-else class="login-button-container">
        <button @click="loginWithGoogle" class="login-button">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            class="login-icon"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
  } from 'firebase/auth';
  import { auth, googleProvider, db } from '@/firebase';
  import { doc, setDoc, getDoc } from 'firebase/firestore';

  export default {
    data() {
      return {
        loading: true,
      };
    },

    created() {
      // Check if user is already authenticated
      this.checkAuthState();
    },

    methods: {
      checkAuthState() {
        onAuthStateChanged(auth, (user) => {
          this.loading = false;
          if (user) {
            // User is already signed in, redirect to dashboard
            console.log('User already logged in:', user.displayName);
            this.$router.push('/browse-offers');
          }
        });
      },

      async loginWithGoogle() {
        try {
          this.loading = true;
          const result = await signInWithPopup(auth, googleProvider);
          console.log('User logged in:', result.user);

          const currentUser = result.user;
          // Retrieve Firestore Instance
          const userDocRef = doc(db, 'user', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          // check if user doc exists, if not create it
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              joinDate: new Date(),
              admin: false,
            });
          }

          this.$router.push('/browse'); // Redirect after login
        } catch (error) {
          console.error('Error logging in:', error.message);
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-lightbackground);
    padding: 20px;
  }

  .login-card {
    /* background-color: var(--color-lightbackground); */
    border-radius: 10px;
    border: 2px solid var(--color-border);
    padding: 40px;
    width: 100%;
    max-width: 450px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .login-title {
    color: var(--color-heading);
    font-size: 2rem;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .login-description {
    color: var(--color-textBody);
    margin-bottom: 30px;
    font-size: 1.1rem;
  }

  .login-button-container {
    margin-top: 25px;
  }

  .login-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-nav);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
    width: 100%;
  }

  .login-button:hover {
    background-color: var(--color-border);
    transform: translateY(-2px);
  }

  .login-icon {
    height: 24px;
    width: 24px;
    margin-right: 12px;
    background-color: white;
    border-radius: 2px;
    padding: 2px;
  }

  .loading-container {
    margin-top: 25px;
    color: var(--color-textBody);
    font-style: italic;
  }
</style>