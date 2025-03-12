<template>
  <div>
    <!-- Map and Selected Offer Display -->
    <div
      class="mb-6 flex flex-col sm:flex-row gap-6 justify-center items-center"
    >
      <!-- Map -->
      <BrowseMap
        class="sm:w-1/2"
        :filteredOffers="filteredItems"
        @marker-clicked="setSelectedOffer"
      />

      <!-- Selected Offer Card -->
      <OfferCard
        v-if="selectedOffer"
        class="sm:w-1/3"
        :id="selectedOffer.id"
        :title="selectedOffer.title"
        :description="selectedOffer.description"
        :price="selectedOffer.price"
        :image="selectedOffer.image"
        :sellerId="selectedOffer.sellerId"
      />
    </div>

    <!-- Offers List -->
    <div class="flex flex-wrap justify-center items-stretch gap-10 mt-10">
      <OfferCard
        v-for="item in filteredItems"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
        :sellerId="item.sellerId"
        @contextmenu.prevent="openEditMenu($event, item)"
      />
    </div>
  </div>
</template>

<script>
  import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
  import { db } from '@/firebase';
  import OfferCard from '@/components/OfferCard.vue';
  import BrowseMap from '@/components/BrowseMap.vue';

  export default {
    name: 'OffersView',
    components: {
      OfferCard,
      BrowseMap,
    },
    props: {
      filteredItems: {
        type: Array,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        selectedOffer: null,
        editItem: null,
      };
    },
    methods: {
      setSelectedOffer(offer) {
        this.selectedOffer = offer;
      },
      openEditMenu(event, item) {
        if (this.isAdmin) {
          this.editItem = { ...item };
        }
      },
      async saveEdit() {
        if (!this.editItem) return;
        try {
          await updateDoc(doc(db, 'offer', this.editItem.id), {
            title: this.editItem.title,
            price: this.editItem.price,
            description: this.editItem.description,
          });
          this.editItem = null;
          this.$emit('refresh-data');
        } catch (error) {
          console.error('Error updating offer:', error);
        }
      },
      async deleteOffer(id) {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        try {
          await deleteDoc(doc(db, 'offer', id));
          this.editItem = null;
          this.$emit('refresh-data');
        } catch (error) {
          console.error('Error deleting offer:', error);
        }
      },
    },
  };
</script>
