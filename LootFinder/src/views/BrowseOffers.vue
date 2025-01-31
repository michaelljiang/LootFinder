<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Browse Offers
    </h1>
    <div class="flex flex-wrap justify-center items-stretch gap-6">
      <OfferCard
        v-for="item in offers"
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
    };
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
        
        // Store filtered offers in data
        this.offers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error('Error fetching active offers:', error.message);
      }
    },
  },
};
</script>
