import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import CreateOffer from '@/views/CreateOffer.vue';
import { auth } from '@/firebase'; // Import Firebase Auth
import UserProfile from '@/views/UserProfile.vue';
import UpdateOffers from '@/views/UpdateOffers.vue';
import ChatView from '@/views/ChatView.vue';
import Inbox from '@/views/Inbox.vue';
import CreateBounty from '@/views/CreateBounty.vue';
import CreateOptions from '@/views/CreateOptions.vue';
import Browse from '@/views/Browse.vue';
import SearchBar from '@/views/SearchBar.vue';
import UserOffers from '@/views/UserOffers.vue';

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
    path: '/create',
    name: 'CreateOptions',
    component: CreateOptions,
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/create-offer',
    name: 'Create Offer',
    component: CreateOffer,
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/post-bounty',
    name: 'Post Bounty',
    component: CreateBounty,
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }, // Optional: Only allow logged-in users
  },
  {
    path: '/browse',
    name: 'Browse',
    component: Browse,
    meta: { requiresAuth: true }, // Optional: Only allow logged-in users
  },
  {
    path: '/update-offers',
    name: 'UpdateOffers',
    component: UpdateOffers,
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/chat/:userId",
  //   name: "ChatView",
  //   component: ChatView,
  //   meta: { requiresAuth: true },
  // },
  {
    path: '/chat/:chatId',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: Inbox,
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/SearchBar',
    name: 'SearchBar',
    component: SearchBar,
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/UserOffers/:id',
    name: 'UserOffers',
    component: UserOffers,
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
