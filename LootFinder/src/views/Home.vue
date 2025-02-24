<template>
  <div class="mb-70 relative isolate px-6 lg:px-8">
    <div
      class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
      aria-hidden="true"
    >
      <div
        class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#a91b1b] to-[#f6b84c] opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style="
          clip-path: polygon(
            74.1% 44.1%,
            100% 61.6%,
            97.5% 26.9%,
            85.5% 0.1%,
            80.7% 2%,
            72.5% 32.5%,
            60.2% 62.4%,
            52.4% 68.1%,
            47.5% 58.3%,
            45.2% 34.5%,
            27.5% 76.7%,
            0.1% 64.9%,
            17.9% 100%,
            27.6% 76.8%,
            76.1% 97.7%,
            74.1% 44.1%
          );
        "
      ></div>
    </div>

    <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div class="sm:mb-8 sm:flex sm:justify-center">
        <div
        class="relative flex items-center mx-auto gap-2 rounded-full px-4 py-2 text-sm text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 w-max"   
        >
          Post an offer.
          <button
            @click="isLoggedIn ? redirectToCreateOffer() : loginWithGoogle()"
            class="relative font-semibold text-[#ea7643] px-3 py-1 transition duration-200 hover:text-[#eb8e65]"
          >
            <span class="absolute inset-0" aria-hidden="true"></span>
            Try it out!
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      <div class="text-center">
        <h1
          class="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"
        >
          <!-- Data to enrich your online business -->
          Opportunities to discover and trade.
        </h1>
        <p
          class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
        >
        Post bounties, create and discover offers around you, and effortlessly connect with others—all in a seamless and intuitive experience!
        </p>

        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button
            @click="isLoggedIn ? redirectToBrowseOffers() : loginWithGoogle()"
            class="rounded-md bg-[#ea7643] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#eb8e65] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get Started
          </button>
      
          <a href="#about" class="text-sm/6 font-semibold text-gray-900">
            Learn more
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>

    <section id="about" class="mt-20 px-6 py-16">
      <div
        class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 ml-5"
      >
        <!-- Text Section -->
        <div class="lg:w-1/2 text-center lg:text-left">
          <h2 class="text-4xl font-bold text-gray-900">What We Do</h2>
          <p class="mt-4 text-lg text-gray-600">
            LootFinder is a web application designed to help users find and sell
            cheap items ("loots") in their local area. Buyers can browse a map
            to discover nearby deals, while sellers can list items they want to
            sell.
          </p>
          <p class="mt-4 text-lg text-gray-600">
            LootFinder connects local buyers and sellers by showcasing available
            "loots" on an interactive map. Buyers can explore items based on
            proximity and decide if they want to purchase, while sellers can
            easily list their items with details and prices.
          </p>
        </div>

        <div class="lg:w-1/2 flex justify-center">
          <img :src="treasureMap" alt="About Us" class="w-full max-w-4xl" />
        </div>
      </div>
    </section>

    <div
      class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      aria-hidden="true"
    >
      <div
        class="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#6ebf67] to-[#3b569f] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style="
          clip-path: polygon(
            74.1% 44.1%,
            100% 61.6%,
            97.5% 26.9%,
            85.5% 0.1%,
            80.7% 2%,
            72.5% 32.5%,
            60.2% 62.4%,
            52.4% 68.1%,
            47.5% 58.3%,
            45.2% 34.5%,
            27.5% 76.7%,
            0.1% 64.9%,
            17.9% 100%,
            27.6% 76.8%,
            76.1% 97.7%,
            74.1% 44.1%
          );
        "
      ></div>
    </div>
  </div>
</template>

<script setup>
  import treasureMap from '@/assets/treasuremap.png';
</script>

<script>
  import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  import { auth, googleProvider, db } from '@/firebase';
  import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

  export default {
    data() {
      return {
        isLoggedIn: false,
        user: null, // Store user details
      };
    },
    created() {
      this.checkUserAuth();
    },
    methods: {
      async checkUserAuth() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            this.isLoggedIn = true;
            this.user = {
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            };
          } else {
            this.isLoggedIn = false;
            this.user = null;
          }
        });
      },
      async loginWithGoogle() {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          console.log('User logged in:', result.user);

          const currentUser = result.user;
          this.isLoggedIn = true;
          // Retrieve Firestore Instance
          const userDocRef = doc(db, 'user', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          this.$router.push('/browse-offers'); // Redirect after login
        } catch (error) {
          console.error('Error logging in:', error.message);
        }
      },
      redirectToBrowseOffers() {
        this.$router.push('/browse-offers'); // Change to your desired redirect page
      },
      redirectToCreateOffer() {
        this.$router.push('/create-offer'); // Change to your desired redirect page
      },
    },
  };
</script>
