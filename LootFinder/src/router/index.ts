import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import CreateOffer from '@/views/CreateOffer.vue';
import { auth } from '@/firebase'; // Import Firebase Auth
import UserProfile from '@/views/UserProfile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/create-offer',
    name: 'Create Offer',
    component: CreateOffer,
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }, // Optional: Only allow logged-in users
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Protected Routes
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    // Redirect to login page if user is not authenticated
    next('/login');
  } else {
    next();
  }
});

export default router;
