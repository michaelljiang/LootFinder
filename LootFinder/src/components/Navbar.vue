<template>
  <nav
    x-data="{ isOpen: false }"
    class="relative bg-white shadow dark:bg-gray-800"
  >
    <div class="container px-6 py-4 mx-auto">
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="flex items-center justify-between">
          <router-link to="/">
            <img
              class="w-auto h-6 sm:h-7"
              src="https://www.svgrepo.com/show/275527/treasure-chest.svg"
              alt="Logo"
            />
          </router-link>

          <!-- Mobile menu button -->
          <div class="flex lg:hidden">
            <button
              x-cloak
              @click="isOpen = !isOpen"
              type="button"
              class="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu"
            >
              <svg
                x-show="!isOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 8h16M4 16h16"
                />
              </svg>

              <svg
                x-show="isOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          x-cloak
          :class="[
            isOpen
              ? 'translate-x-0 opacity-100 '
              : 'opacity-0 -translate-x-full',
          ]"
          class="absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center"
        >
          <div class="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
            <router-link
              to="/dashboard"
              class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Dashboard
            </router-link>
            <router-link
              to="/create-offer"
              class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Create Offer
            </router-link>
          </div>

          <div class="flex items-center mt-4 lg:mt-0">
            <!-- Display login button if user is not logged in -->
            <template v-if="!user">
              <button
                @click="login"
                class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
              >
                Login
              </button>
            </template>

            <!-- Display profile picture if user is logged in -->
            <template v-else>
              <button
                type="button"
                class="flex items-center focus:outline-none"
                aria-label="toggle profile dropdown"
              >
                <div
                  class="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full"
                >
                  <router-link to="/profile">
                    <img
                      :src="user?.photoURL || 'https://via.placeholder.com/150'"
                      class="object-cover w-full h-full"
                      alt="avatar"
                    />
                  </router-link>
                </div>

                <h3 class="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">
                  {{ user?.displayName || 'Guest' }}
                </h3>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref, onMounted } from 'vue';

export default {
  name: 'Navbar',
  setup() {
    const user = ref(null);
    const auth = getAuth();

    // Watch for authentication state changes
    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          user.value = {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          };
        } else {
          user.value = null;
        }
      });
    });

    // Login method
    const login = async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        user.value = {
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
      } catch (error) {
        console.error('Login failed:', error.message);
      }
    };

    return { user, login };
  },
};
</script>