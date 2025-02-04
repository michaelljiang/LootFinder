<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Browse Offers
    </h1>

    <!-- Filter/Search Inputs -->
    <div
      class="mb-6 flex flex-col md:flex-row gap-4 justify-center items-center"
    >
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search by title"
        class="p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        v-model.number="minPrice"
        placeholder="Min Price"
        class="p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        v-model.number="maxPrice"
        placeholder="Max Price"
        class="p-2 border border-gray-300 rounded"
      />
      <!-- Reset Filters Button -->
      <button
        @click="resetFilters"
        class="p-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Reset Filters
      </button>
    </div>

    <!-- Offers List -->
    <div class="flex flex-wrap justify-center items-stretch gap-6">
      <OfferCard
        v-for="item in filteredOffers"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
      />
    </div>
  </div>
</template>

<script>
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '@/firebase';
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
          // Check if the offer's price is greater than or equal to minPrice (if provided)
          const matchesMinPrice =
            this.minPrice != null ? offer.price >= this.minPrice : true;
          // Check if the offer's price is less than or equal to maxPrice (if provided)
          const matchesMaxPrice =
            this.maxPrice != null ? offer.price <= this.maxPrice : true;

          return matchesSearch && matchesMinPrice && matchesMaxPrice;
        });
      },
    },
    async created() {
      await this.fetchActiveOffers();
    },
    methods: {
      async fetchActiveOffers() {
        try {
          // Query only offers where active is true
          const q = query(collection(db, 'offer'), where('active', '==', true));
          const querySnapshot = await getDocs(q);

          // Store the offers in the component's data
          this.offers = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error('Error fetching active offers:', error.message);
        }
      },
      resetFilters() {
        // Reset the filter values to their defaults
        this.searchTerm = '';
        this.minPrice = null;
        this.maxPrice = null;
      },
    },
  };
</script>
