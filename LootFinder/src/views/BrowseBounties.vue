<template>
  <div class="p-4 sm:p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
      Browse Bounties
    </h1>

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
        class="w-full sm:w-auto p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
      >
        Reset Filters
      </button>
    </div>

    <!-- Bounties List -->
    <div class="flex flex-wrap justify-center items-stretch gap-6">
      <BountyCard
        v-for="item in filteredBounties"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
        :buyerId="item.buyerId"
        @contextmenu.prevent="openEditMenu($event, item)"
      />
    </div>
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
    updateDoc,
    deleteDoc,
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { fetchItemWithBuyer } from '@/firebaseService';
  import BountyCard from '@/components/BountyCard.vue';

  export default {
    name: 'BrowseBounties',
    components: {
      BountyCard,
    },
    data() {
      return {
        bounties: [],
        searchTerm: '',
        minPrice: null,
        maxPrice: null,
        isAdmin: false, // Only admins can edit
        editItem: null, // Holds the bounty being edited
      };
    },
    computed: {
      filteredBounties() {
        return this.bounties.filter((bounty) => {
          const matchesSearch = this.searchTerm
            ? bounty.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            : true;
          const matchesMinPrice =
            this.minPrice != null ? bounty.price >= this.minPrice : true;
          const matchesMaxPrice =
            this.maxPrice != null ? bounty.price <= this.maxPrice : true;

          return matchesSearch && matchesMinPrice && matchesMaxPrice;
        });
      },
    },
    async created() {
      await this.fetchActiveBounties();
      this.checkAdminStatus();
    },
    methods: {
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
      openEditMenu(event, item) {
        if (this.isAdmin) {
          this.editItem = { ...item };
        }
      },
    },
  };
</script>
