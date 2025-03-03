<template>
  <div
    class="form-container mx-auto p-6 rounded-2xl shadow-lg border-border border-2"
  >
    <AIDisclaimerModal
      :show="showModal"
      @confirm="confirmSubmit"
      @cancel="showModal = false"
    />
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- ************************** AI-Generated Image Placeholder *********************************
        <div class="flex flex-col items-center">
          <div
            class="flex flex-col justify-center items-center border-2 border-dashed w-11/12 rounded-2xl bg-gray-200"
          >
            <span class="py-4 font-semibold text-gray-600">
              AI-Generated Image Preview
            </span>
            <img
              src="https://via.placeholder.com/150"
              alt="AI-generated preview"
              class="rounded-xl object-cover w-40 h-40 mt-2"
            />
          </div>
        </div> -->

      <!-- ************************** Title ********************************* -->
      <div class="flex flex-col items-center">
        <label
          for="title"
          class="text-center block text-l font-medium text-textPrimary"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          class="text-center text-textBody mt-1 block w-11/12 py-2 border-border border-2 rounded-xl shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <!-- **************************** Description ********************************* -->
      <div class="flex flex-col items-center">
        <label
          for="description"
          class="text-center block text-m font-medium text-textPrimary"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          class="text-center text-textBody mt-1 block w-11/12 h-24 py-2 border-border border-2 rounded-xl shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <!-- ************************** Location ********************************* -->
      <div class="flex flex-col items-center">
        <label
          class="text-center block text-m mb-1 font-medium text-textPrimary"
        >
          Choose a Location
        </label>
        <span v-if="locationError" class="text-red-500 text-sm mb-1">
          {{ locationError }}
        </span>
        <InputMap @updateLatLng="updateLocation" />
      </div>

      <!-- ************************** Price ********************************* -->
      <div class="flex items-center justify-center">
        <label
          for="price"
          class="text-center block text-xl font-medium text-textPrimary pr-1"
        >
          $
        </label>
        <input
          type="number"
          id="price"
          v-model="form.price"
          class="text-border t-1 block w-16 border-border border-2 pl-2 mr-2 rounded-xl shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <!-- ************************** Cancel/Submit ********************************* -->
      <div class="flex justify-center">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 bg-gray-200 text-textBody rounded-2xl font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="ml-2 px-4 py-2 bg-border text-white rounded-2xl font-semibold hover:bg-nav"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import {
    getFirestore,
    collection,
    doc,
    writeBatch,
    serverTimestamp,
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { getAuth } from 'firebase/auth';
  import InputMap from '@/components/InputMap.vue';
  import AIDisclaimerModal from '@/components/AIDisclaimerModal.vue';

  export default {
    name: 'BountyForm',
    components: { InputMap, AIDisclaimerModal },
    data() {
      return {
        form: {
          title: '',
          description: '',
          latitude: null,
          longitude: null,
          price: null,
          image: '', // Placeholder for AI-generated image URL
          buyerId: null,
          active: false,
        },
        locationError: '',
        showModal: false,
      };
    },
    methods: {
      updateLocation(latlng) {
        this.form.latitude = latlng.lat;
        this.form.longitude = latlng.lng;
        this.locationError = '';
      },
      async handleSubmit() {
        if (!this.form.latitude || !this.form.longitude) {
          this.locationError = 'Please select a location.';
          return;
        }
        // Show the modal instead of submitting directly
        this.showModal = true;
      },

      async confirmSubmit() {
        try {
          // Close the modal
          this.showModal = false;

          // Original submission logic
          this.form.image = 'https://via.placeholder.com/150';
          const auth = getAuth();
          const currentUser = auth.currentUser;
          const userRef = doc(db, 'user', currentUser.uid);
          const batch = writeBatch(db);
          const bountyRef = doc(collection(db, 'bounty'));

          batch.set(bountyRef, {
            title: this.form.title,
            description: this.form.description,
            latitude: this.form.latitude,
            longitude: this.form.longitude,
            price: this.form.price,
            image: this.form.image,
            buyerId: userRef,
            createdAt: new Date(),
            active: true,
          });

          await batch.commit();
          this.$router.push('/dashboard');
        } catch (error) {
          console.error('Error creating bounty:', error);
        }
      },
      cancel() {
        this.$router.push('/dashboard');
      },
    },
  };
</script>

<style scoped>
  .form-container {
    max-width: 600px;
  }
</style>
