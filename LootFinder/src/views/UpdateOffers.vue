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
        class="border rounded p-4 mb-4 shadow"
      >
        <div class="flex justify-between items-center">
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

    <!-- Edit Offer Modal -->
    <div v-if="editingOffer" class="fixed inset-0 flex items-center justify-center">
      <div class="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-semibold mb-4">Edit Offer</h2>
        <form @submit.prevent="updateOffer">
          <label class="block mb-2">Title</label>
          <input v-model="editForm.title" type="text" class="w-full border p-2 rounded mb-2" />

          <label class="block mb-2">Description</label>
          <textarea v-model="editForm.description" class="w-full border p-2 rounded mb-2"></textarea>

          <label class="block mb-2">Price</label>
          <input v-model="editForm.price" type="number" class="w-full border p-2 rounded mb-2" />

          <div class="flex items-center mb-2">
            <label class="mr-2">Price Negotiable:</label>
            <input type="checkbox" v-model="editForm.negotiable" />
          </div>

          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
              Image Upload
            </label>
            <input
              type="file"
              id="image"
              @change="handleFileUpload"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-100"
            />
            <div v-if="editForm.image">
              <img :src="editForm.image" alt="Offer Image" class="w-24 h-24 mt-2 rounded">
            </div>
          </div>

          <div class="flex justify-end">
            <button @click="cancelEdit" class="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="successMessage" class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-center">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  data() {
    return {
      offers: [],
      editingOffer: null,
      editForm: {
        title: '',
        description: '',
        price: '',
        negotiable: false,
        image: '',
        imageFile: null,
      },
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
        where('active', '==', true)
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
      this.editingOffer = offer;
      this.editForm = { ...offer };
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editForm.imageFile = file;
        this.editForm.image = URL.createObjectURL(file);
      }
    },

    async updateOffer() {
      if (!this.editingOffer) return;
      
      const offerRef = doc(db, 'offer', this.editingOffer.id);

      let imageUrl = this.editingOffer.image;
      if (this.editForm.imageFile) {
        const uniqueFileName = `${Date.now()}-${this.editForm.imageFile.name}`;
        const storageRef = ref(storage, `offer/${uniqueFileName}`);
        await uploadBytes(storageRef, this.editForm.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(offerRef, {
        title: this.editForm.title,
        description: this.editForm.description,
        price: this.editForm.price,
        negotiable: this.editForm.negotiable,
        image: imageUrl,
      });

      this.offers = this.offers.map(offer => 
        offer.id === this.editingOffer.id 
          ? { ...offer, ...this.editForm, image: imageUrl } 
          : offer
      );

      this.successMessage = "Offer updated successfully!";
      setTimeout(() => (this.successMessage = ''), 3000);

      this.cancelEdit();
    },

    cancelEdit() {
      this.editingOffer = null;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>