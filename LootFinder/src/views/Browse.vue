<template>
  <div class="p-4 sm:p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
      Browse Marketplace
    </h1>

    <!-- View Toggle Buttons -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex rounded-md shadow-sm">
        <button
          @click="activeView = 'offers'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-l-lg',
            activeView === 'offers'
              ? 'bg-[#ea7643] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          Offers
        </button>
        <button
          @click="activeView = 'bounties'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-r-lg border-l',
            activeView === 'bounties'
              ? 'bg-[#ea7643] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50',
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
        class="w-full sm:w-64 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        type="number"
        v-model.number="minPrice"
        placeholder="Min Price"
        class="w-full sm:w-32 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        type="number"
        v-model.number="maxPrice"
        placeholder="Max Price"
        class="w-full sm:w-32 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        @click="resetFilters"
        class="w-full sm:w-auto p-2 bg-[#ea7643] text-white rounded shadow hover:bg-[#eb8e65] transition"
      >
        Reset Filters
      </button>
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

  export default {
    name: 'Browse',
    components: {
      OffersView,
      BountiesView,
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

          return (
            isAvailable && matchesSearch && matchesMinPrice && matchesMaxPrice
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
      resetFilters() {
        this.searchTerm = '';
        this.minPrice = null;
        this.maxPrice = null;
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
