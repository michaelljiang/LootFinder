<template>
  <div class="p-4 sm:p-6 min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold text-center text-logoBrown mb-4">
      Browse Marketplace
    </h1>

    <!-- View Toggle Buttons -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex rounded-md shadow-sm">
        <button
          @click="activeView = 'offers'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-l-lg w-24',
            activeView === 'offers'
              ? 'bg-nav text-white' 
              : 'bg-lightGray text-logoBrown hover:bg-gray-200',
          ]"
        >
          Offers
        </button>
        <button
          @click="activeView = 'bounties'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-r-lg w-24',
            activeView === 'bounties'
              ? 'bg-nav text-white'
              : 'bg-lightGray text-logoBrown hover:bg-gray-200',
          ]"
        >
          Bounties
        </button>
      </div>
    </div>

    <!-- Filter/Search Inputs -->
    <div
      class="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center"
    >
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search by title"
        class="w-full sm:w-32 p-2 rounded-md border-2 border-transparent bg-lightGray shadow-sm focus:outline-none focus:border-nav"
      />
      <input
        type="number"
        v-model.number="minPrice"
        placeholder="Min Price"
        class="w-full sm:w-32 p-2 rounded-md border-2 border-transparent bg-lightGray shadow-sm focus:outline-none focus:border-nav"
      />
      <input
        type="number"
        v-model.number="maxPrice"
        placeholder="Max Price"
        class="w-full sm:w-32 p-2 rounded-md border-2 border-transparent bg-lightGray shadow-sm focus:outline-none focus:border-nav"
      />

      <!-- Distance Filter Popup -->
      <DistanceFilterPopup
        :currentRadius="radius"
        :currentLocation="userLocation"
        @update-filter="handleDistanceFilter"
      />

      <button
        @click="resetFilters"
        class="w-full sm:w-auto p-2 bg-nav text-white rounded shadow hover:bg-[#eb8e65] transition border-orange"
      >
        Reset Filters
      </button>
    </div>

    <!-- Distance Filter Indicator -->
    <div v-if="userLocation && radius" class="mb-4 text-center">
      <div
        class="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
      >
        Filtering by: {{ radius }}km radius
        <button
          @click="clearDistanceFilter"
          class="ml-2 text-red-600 hover:text-red-800"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Dynamic Content -->
    <component
      :is="currentView"
      :filtered-items="filteredItems"
      :is-admin="isAdmin"
      @refresh-data="fetchData"
    ></component>
  </div>
</template>

<script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { fetchItemWithBuyer, fetchItemWithSeller } from '@/firebaseService';
  import OffersView from '@/components/BrowseViews/OffersView.vue';
  import BountiesView from '@/components/BrowseViews/BountiesView.vue';
  import DistanceFilterPopup from '@/components/DistanceFilterPopup.vue';

  export default {
    name: 'Browse',
    components: {
      OffersView,
      BountiesView,
      DistanceFilterPopup,
    },
    data() {
      return {
        activeView: 'offers', // Default view
        offers: [],
        bounties: [],
        searchTerm: '',
        minPrice: null,
        maxPrice: null,
        isAdmin: false,
        userLocation: null,
        radius: null,
      };
    },
    computed: {
      currentView() {
        return this.activeView === 'offers' ? 'OffersView' : 'BountiesView';
      },
      filteredItems() {
        const items =
          this.activeView === 'offers' ? this.offers : this.bounties;

        return items.filter((item) => {
          const matchesSearch = this.searchTerm
            ? item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            : true;
          const matchesMinPrice =
            this.minPrice != null ? item.price >= this.minPrice : true;
          const matchesMaxPrice =
            this.maxPrice != null ? item.price <= this.maxPrice : true;

          // For offers, also check if it's not sold
          const isAvailable = this.activeView === 'offers' ? !item.sold : true;

          // Distance filtering
          const itemLocation = {
            lat: item.latitude,
            lng: item.longitude,
          };
          const matchesDistance =
            this.userLocation &&
            this.radius &&
            itemLocation.lat &&
            itemLocation.lng
              ? this.calculateDistance(this.userLocation, itemLocation) <=
                this.radius
              : true; // If no radius is set or no location data, don't filter by it

          return (
            isAvailable &&
            matchesSearch &&
            matchesMinPrice &&
            matchesMaxPrice &&
            matchesDistance
          );
        });
      },
    },
    async created() {
      await this.fetchData();
      this.checkAdminStatus();
    },
    methods: {
      async fetchData() {
        await Promise.all([
          this.fetchActiveOffers(),
          this.fetchActiveBounties(),
        ]);
      },
      async fetchActiveOffers() {
        try {
          const q = query(collection(db, 'offer'), where('active', '==', true));
          const querySnapshot = await getDocs(q);

          const items = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const resolvedItem = await fetchItemWithSeller(doc.id);
              return resolvedItem ? { id: doc.id, ...resolvedItem } : null;
            })
          );

          this.offers = items.filter((item) => item !== null);
        } catch (error) {
          console.error('Error fetching active offers:', error.message);
        }
      },
      async fetchActiveBounties() {
        try {
          const q = query(
            collection(db, 'bounty'),
            where('active', '==', true)
          );
          const querySnapshot = await getDocs(q);

          const items = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const resolvedItem = await fetchItemWithBuyer(doc.id);
              return resolvedItem ? { id: doc.id, ...resolvedItem } : null;
            })
          );

          this.bounties = items.filter((item) => item !== null);
        } catch (error) {
          console.error('Error fetching active bounties:', error.message);
        }
      },
      handleDistanceFilter(filterData) {
        this.userLocation = filterData.location;
        this.radius = filterData.radius;
      },
      clearDistanceFilter() {
        this.userLocation = null;
        this.radius = null;
      },
      calculateDistance(loc1, loc2) {
        if (
          !loc1 ||
          !loc2 ||
          !loc1.lat ||
          !loc1.lng ||
          !loc2.lat ||
          !loc2.lng
        ) {
          return Infinity; // Prevent filtering out all items
        }

        const R = 6371; // Radius of Earth in km
        const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
        const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(loc1.lat * (Math.PI / 180)) *
            Math.cos(loc2.lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in km
      },
      resetFilters() {
        this.searchTerm = '';
        this.minPrice = null;
        this.maxPrice = null;
        this.userLocation = null;
        this.radius = null;
      },
      async checkAdminStatus() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const userDoc = await getDoc(doc(db, 'user', user.uid));
              this.isAdmin = userDoc.exists() && userDoc.data().admin === true;
            } catch (error) {
              console.error('Error checking admin status:', error);
            }
          } else {
            this.isAdmin = false;
          }
        });
      },
    },
  };
</script>
