<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Your Offers</h1>

    <div v-if="offers.length === 0">
      <p class="text-gray-600">You have no active offers.</p>
    </div>

    <ul v-else>
      <li
        v-for="offer in offers"
        :key="offer.id"
        class="border rounded p-4 mb-4 shadow flex justify-between items-center"
      >
        <div>
          <h2 class="text-lg font-semibold">{{ offer.title }}</h2>
          <p class="text-gray-600">{{ offer.description }}</p>
          <p class="text-gray-800 font-bold">${{ offer.price }}</p>
          <p class="text-sm text-gray-500">
            Price Negotiable:
            <span :class="offer.negotiable ? 'text-green-600' : 'text-red-600'">
              {{ offer.negotiable ? 'Yes' : 'No' }}
            </span>
          </p>
          <img v-if="offer.image" :src="offer.image" alt="Offer Image" class="w-24 h-24 mt-2 rounded">
        </div>
        <div class="flex space-x-2">
          <!-- Delete Button (Sets active to false) -->
          <button
            @click="deactivateOffer(offer.id)"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
          <!-- Edit Button -->
          <button
            @click="editOffer(offer)"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      </li>
    </ul>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';

export default {
  data() {
    return {
      offers: [],
      successMessage: '',
    };
  },
  async created() {
    await this.fetchUserOffers();
  },
  methods: {
    async fetchUserOffers() {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, 'offer'),
        where('sellerId', '==', doc(db, 'user', currentUser.uid)),
        where('active', '==', true) // Only fetch active offers
      );
      const querySnapshot = await getDocs(q);
      this.offers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async deactivateOffer(offerId) {
      const confirmed = window.confirm("Are you sure you want to delete this offer?");
      if (!confirmed) return;

      try {
        const offerRef = doc(db, 'offer', offerId);
        await updateDoc(offerRef, { active: false });

        // Remove from UI
        this.offers = this.offers.filter(offer => offer.id !== offerId);

        this.successMessage = "Offer deleted successfully!";
        setTimeout(() => (this.successMessage = ''), 3000);
      } catch (error) {
        console.error("Error deactivating offer:", error.message);
      }
    },

    editOffer(offer) {
      this.$emit("editOffer", offer);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
