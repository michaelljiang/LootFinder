<template>
  <div class="p-4 sm:p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
      Browse Offers
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

    <!-- Offers List -->
    <div class="flex flex-wrap justify-center items-stretch gap-6">
      <OfferCard
        v-for="item in filteredOffers"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
        :sellerId="item.sellerId"
      />
    </div>
  </div>
</template>

<script>
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { fetchItemWithSeller } from '@/firebaseService'; // Import the function
  import OfferCard from '@/components/OfferCard.vue';

  export default {
    name: 'BrowseOffers',
    components: {
      OfferCard,
    },
    data() {
      return {
        offers: [],
        searchTerm: '',
        minPrice: null,
        maxPrice: null,
      };
    },
    computed: {
      filteredOffers() {
        return this.offers.filter((offer) => {
          // Check if the offer title includes the search term (case insensitive)
          const matchesSearch = this.searchTerm
            ? offer.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            : true;
          // Check if the offer's price is within the min and max price range
          const matchesMinPrice =
            this.minPrice != null ? offer.price >= this.minPrice : true;
          const matchesMaxPrice =
            this.maxPrice != null ? offer.price <= this.maxPrice : true;

          return (
            !offer.sold && matchesSearch && matchesMinPrice && matchesMaxPrice
          );
        });
      },
    },
    async created() {
      await this.fetchActiveOffers();
    },
    methods: {
      async fetchActiveOffers() {
        try {
          const q = query(collection(db, 'offer'), where('active', '==', true));
          const querySnapshot = await getDocs(q);

          // Fetch all items with resolved sellerId
          const items = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const resolvedItem = await fetchItemWithSeller(doc.id);
              return resolvedItem ? { id: doc.id, ...resolvedItem } : null;
            })
          );

          // Remove null values (failed fetches)
          this.offers = items.filter((item) => item !== null);
        } catch (error) {
          console.error('Error fetching active offers:', error.message);
        }
      },
      resetFilters() {
        this.searchTerm = '';
        this.minPrice = null;
        this.maxPrice = null;
      },
    },
  };
</script>
