<template>
  <div class="profile-container">
    <div v-if="user" class="profile-card">
      <h1 class="profile-title">User Profile</h1>
      <img
        :src="user.photoURL || '/default-avatar.png'"
        alt="Profile Picture"
        class="profile-avatar"
      />
      <div class="profile-info">
        <p class="profile-detail">
          <strong>Name:</strong>
          {{ user.displayName || 'User' }}
        </p>
        <p class="profile-detail">
          <strong>Email:</strong>
          {{ user.email }}
        </p>
      </div>
      <div class="profile-actions">
        <button @click="goToHome" class="profile-button button-primary">
          Back to Home
        </button>
        <button @click="logout" class="profile-button button-danger">
          Log Out
        </button>
      </div>
    </div>

    <div v-else class="profile-card">
      <p class="profile-message">You need to be logged in to view this page</p>
      <button
        @click="goToLogin"
        class="profile-button button-primary full-width"
      >
        Go to Login
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'UserProfile',
    setup() {
      const user = ref<any>(null);
      const auth = getAuth();
      const router = useRouter();

      onMounted(() => {
        onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            user.value = {
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            };
          } else {
            user.value = null;
          }
        });
      });

      const logout = () => {
        signOut(auth)
          .then(() => {
            console.log('User signed out');
            router.push('/login');
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error('Logout error:', error.message);
            } else {
              console.error('Logout error:', error);
            }
          });
      };

      const goToLogin = () => {
        router.push('/login');
      };

      const goToHome = () => {
        router.push('/browse-offers');
      };

      return { user, logout, goToLogin, goToHome };
    },
  });
</script>

<style scoped>
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-lightbackground);
    padding: 20px;
  }

  .profile-card {
    background-color: var(--color-background);
    border-radius: 10px;
    border: 2px solid var(--color-border);
    padding: 30px;
    width: 100%;
    max-width: 450px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .profile-title {
    color: var(--color-heading);
    font-size: 1.8rem;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    border-radius: 50%;
    border: 4px solid var(--color-accent);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    object-fit: cover;
  }

  .profile-info {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .profile-detail {
    color: var(--color-textBody);
    font-size: 1.1rem;
  }

  .profile-detail strong {
    color: var(--color-textPrimary);
  }

  .profile-actions {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .profile-button {
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
    flex: 1;
  }

  .profile-button:hover {
    transform: translateY(-2px);
  }

  .button-primary {
    background-color: var(--color-nav);
    color: white;
  }

  .button-primary:hover {
    background-color: var(--color-border);
  }

  .button-danger {
    background-color: var(--color-border);
    color: white;
  }

  .button-danger:hover {
    background-color: #673838;
  }

  .profile-message {
    color: var(--color-textPrimary);
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .full-width {
    width: 100%;
  }
</style>
