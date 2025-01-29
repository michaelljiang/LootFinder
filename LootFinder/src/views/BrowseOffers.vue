<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Browse Offers
    </h1>
    <div class="flex flex-wrap justify-center items-stretch gap-6">
      <OfferCard
        v-for="item in offers"
        :key="index"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
      />
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

  import OfferCard from '@/components/OfferCard.vue';

  export default {
    name: 'BrowseOffers',
    components: {
      OfferCard,
    },
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

        const q = query(collection(db, 'offer'));
        const querySnapshot = await getDocs(q);
        this.offers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      },
    },
  };
</script>
