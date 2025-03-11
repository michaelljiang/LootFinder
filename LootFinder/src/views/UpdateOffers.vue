<template>
  <div class="container mx-auto p-6 min-h-screen">
    <h1 class="text-center text-3xl font-bold mb-6 text-logoBrown">
      Manage Your Listings
    </h1>

    <!-- Toggle between Offers and Bounties -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex rounded-md shadow-sm">
        <button
          @click="activeTab = 'offers'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-l-lg',
            activeTab === 'offers'
              ? 'bg-[var(--color-nav)] text-white'
              : 'bg-white text-[var(--color-textPrimary)] hover:bg-gray-50',
          ]"
        >
          Offers
        </button>
        <button
          @click="activeTab = 'bounties'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-r-lg border-l border-[var(--color-border)]',
            activeTab === 'bounties'
              ? 'bg-[var(--color-nav)] text-white'
              : 'bg-white text-[var(--color-textPrimary)] hover:bg-gray-50',
          ]"
        >
          Bounties
        </button>
      </div>
    </div>

    <!-- Offers Section -->
    <div v-if="activeTab === 'offers'">
      <div v-if="offers.length === 0" class="text-center py-8">
        <p class="text-[var(--color-textBody)]">You have no active offers.</p>
        <router-link
          to="/create-offer"
          class="mt-4 inline-block px-4 py-2 bg-[var(--color-accent)] text-[var(--color-textPrimary)] rounded-lg hover:opacity-90 transition-opacity"
        >
          Create an Offer
        </router-link>
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="offer in offers"
          :key="offer.id"
          class="border border-[var(--color-border)] rounded-lg p-5 shadow-md relative"
          :class="{ 'opacity-80': offer.sold }"
          :style="{
            backgroundColor: offer.sold ? 'var(--color-background)' : '#fff',
          }"
        >
          <div class="flex flex-col md:flex-row justify-between">
            <div class="flex-grow">
              <h2 class="text-xl font-bold text-[var(--color-textPrimary)]">
                {{ (offer.sold ? '[SOLD] ' : '') + offer.title }}
              </h2>
              <p class="text-[var(--color-textBody)] my-2">
                {{ offer.description }}
              </p>
              <p class="text-lg font-bold text-[var(--color-textSecondary)]">
                ${{ offer.price }}
              </p>
              <p class="text-sm text-[var(--color-textBody)]">
                Price Negotiable:
                <span
                  :class="offer.negotiable ? 'text-green-600' : 'text-red-600'"
                >
                  {{ offer.negotiable ? 'Yes' : 'No' }}
                </span>
              </p>
              <img
                v-if="offer.image"
                :src="offer.image"
                alt="Offer Image"
                class="mt-3 rounded-lg object-cover h-32 w-auto"
              />
            </div>
            <div class="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
              <button
                @click="deactivateOffer(offer.id)"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                @click="editOffer(offer)"
                class="px-4 py-2 bg-[var(--color-nav)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Edit
              </button>
              <button
                @click="markSold(offer)"
                class="px-4 py-2 text-white rounded-lg transition-colors"
                :class="
                  offer.sold
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-green-500 hover:bg-green-600'
                "
              >
                {{ offer.sold ? 'Mark as unsold' : 'Mark as sold' }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Bounties Section -->
    <div v-if="activeTab === 'bounties'">
      <div v-if="bounties.length === 0" class="text-center py-8">
        <p class="text-[var(--color-textBody)]">You have no active bounties.</p>
        <router-link
          to="/post-bounty"
          class="mt-4 inline-block px-4 py-2 bg-[var(--color-accent)] text-[var(--color-textPrimary)] rounded-lg hover:opacity-90 transition-opacity"
        >
          Post a Bounty
        </router-link>
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="bounty in bounties"
          :key="bounty.id"
          class="border border-[var(--color-border)] rounded-lg p-5 shadow-md relative"
          :class="{ 'opacity-80': !bounty.active }"
          :style="{
            backgroundColor: bounty.active ? '#fff' : 'var(--color-background)',
          }"
        >
          <div class="flex flex-col md:flex-row justify-between">
            <div class="flex-grow">
              <h2 class="text-xl font-bold text-[var(--color-textPrimary)]">
                {{ (bounty.active ? '' : '[FULFILLED] ') + bounty.title }}
              </h2>
              <p class="text-[var(--color-textBody)] my-2">
                {{ bounty.description }}
              </p>
              <p class="text-lg font-bold text-[var(--color-textSecondary)]">
                ${{ bounty.price }}
              </p>
              <img
                v-if="bounty.image"
                :src="bounty.image"
                alt="Bounty Image"
                class="mt-3 rounded-lg object-cover h-32 w-auto"
              />
            </div>
            <div class="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
              <button
                @click="deactivateBounty(bounty.id)"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                @click="markBought(bounty)"
                class="px-4 py-2 text-white rounded-lg transition-colors"
                :class="
                  bounty.active
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-600 hover:bg-gray-700'
                "
              >
                {{
                  bounty.active ? 'Mark as fulfilled' : 'Mark as unfulfilled'
                }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Edit Offer Modal -->
    <div
      v-if="editingOffer"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-[var(--color-lightbackground)] p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 class="text-2xl font-bold mb-4 text-[var(--color-textPrimary)]">
          Edit Offer
        </h2>
        <form @submit.prevent="updateOffer">
          <div class="mb-4">
            <label
              class="block text-[var(--color-textPrimary)] mb-1 font-medium"
            >
              Title
            </label>
            <input
              v-model="editForm.title"
              type="text"
              class="w-full border border-[var(--color-border)] p-2 rounded-lg bg-white"
            />
          </div>

          <div class="mb-4">
            <label
              class="block text-[var(--color-textPrimary)] mb-1 font-medium"
            >
              Description
            </label>
            <textarea
              v-model="editForm.description"
              class="w-full border border-[var(--color-border)] p-2 rounded-lg bg-white h-24"
            ></textarea>
          </div>

          <div class="mb-4">
            <label
              class="block text-[var(--color-textPrimary)] mb-1 font-medium"
            >
              Price
            </label>
            <input
              v-model="editForm.price"
              type="number"
              class="w-full border border-[var(--color-border)] p-2 rounded-lg bg-white"
            />
          </div>

          <div class="flex items-center mb-4">
            <label class="text-[var(--color-textPrimary)] mr-2 font-medium">
              Price Negotiable:
            </label>
            <input
              type="checkbox"
              v-model="editForm.negotiable"
              class="h-5 w-5"
            />
          </div>

          <div class="mb-4">
            <label
              class="block text-[var(--color-textPrimary)] mb-1 font-medium"
            >
              Image Upload
            </label>
            <input
              type="file"
              id="image"
              @change="handleFileUpload"
              class="mt-1 block w-full text-sm text-[var(--color-textPrimary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--color-accent)] file:text-[var(--color-textPrimary)] file:font-medium hover:file:bg-[var(--color-background)]"
            />
            <div v-if="editForm.image" class="mt-2">
              <img
                :src="editForm.image"
                alt="Offer Image"
                class="h-32 w-auto rounded-lg object-cover"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[var(--color-nav)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

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
  import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
  } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { db, storage } from '@/firebase';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

  export default {
    data() {
      return {
        activeTab: 'offers',
        offers: [],
        bounties: [],
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
      await this.fetchUserBounties();
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
        this.offers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      },

      async fetchUserBounties() {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const q = query(
          collection(db, 'bounty'),
          where('buyerId', '==', doc(db, 'user', currentUser.uid)),
          where('active', '==', true)
        );

        const querySnapshot = await getDocs(q);
        this.bounties = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      },

      async deactivateOffer(offerId) {
        const confirmed = window.confirm(
          'Are you sure you want to delete this offer?'
        );
        if (!confirmed) return;

        try {
          const offerRef = doc(db, 'offer', offerId);
          await updateDoc(offerRef, { active: false });

          // Remove from UI
          this.offers = this.offers.filter((offer) => offer.id !== offerId);

          this.showSuccessMessage('Offer deleted successfully!');
        } catch (error) {
          console.error('Error deactivating offer:', error.message);
        }
      },

      async deactivateBounty(bountyId) {
        const confirmed = window.confirm(
          'Are you sure you want to delete this bounty?'
        );
        if (!confirmed) return;

        try {
          const bountyRef = doc(db, 'bounty', bountyId);
          await updateDoc(bountyRef, { active: false });

          // Remove from UI
          this.bounties = this.bounties.filter(
            (bounty) => bounty.id !== bountyId
          );

          this.showSuccessMessage('Bounty deleted successfully!');
        } catch (error) {
          console.error('Error deactivating bounty:', error.message);
        }
      },

      editOffer(offer) {
        this.editingOffer = offer;
        this.editForm = { ...offer };
      },

      async markSold(offer) {
        const offerRef = doc(db, 'offer', offer.id);
        const newSoldStatus = !offer.sold;

        try {
          await updateDoc(offerRef, { sold: newSoldStatus });

          this.offers = this.offers.map((o) =>
            o.id === offer.id ? { ...o, sold: newSoldStatus } : o
          );

          this.showSuccessMessage(
            newSoldStatus ? 'Offer marked as sold!' : 'Offer marked as unsold!'
          );
        } catch (error) {
          console.error('Error updating offer status:', error.message);
        }
      },

      async markBought(bounty) {
        const bountyRef = doc(db, 'bounty', bounty.id);
        const newBoughtStatus = !bounty.active;

        try {
          await updateDoc(bountyRef, { active: newBoughtStatus });

          this.bounties = this.bounties.map((b) =>
            b.id === bounty.id ? { ...b, active: newBoughtStatus } : b
          );

          this.showSuccessMessage(
            newBoughtStatus
              ? 'Bounty marked as unfulfilled!'
              : 'Bounty marked as fulfilled!'
          );
        } catch (error) {
          console.error('Error updating bounty status:', error.message);
        }
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

        this.offers = this.offers.map((offer) =>
          offer.id === this.editingOffer.id
            ? { ...offer, ...this.editForm, image: imageUrl }
            : offer
        );

        this.showSuccessMessage('Offer updated successfully!');
        this.cancelEdit();
      },

      cancelEdit() {
        this.editingOffer = null;
      },

      showSuccessMessage(message) {
        this.successMessage = message;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
    },
  };
</script>

<style scoped>
  .container {
    max-width: 900px;
  }
</style>
