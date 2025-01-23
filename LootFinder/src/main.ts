import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import Vue Router
import { auth } from './firebase'; // Import Firebase
import { onAuthStateChanged } from 'firebase/auth';

let app: any;

// Initialize Firebase Auth State Listener
onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed. User:', user);

  if (!app) {
    // Create Vue app
    app = createApp(App);

    // Use router
    app.use(router);

    app.mount('#app');
  }
});
