<template>
  <div>
    <!-- Bounties List -->
    <div class="flex flex-wrap justify-center items-stretch gap-6">
      <BountyCard
        v-for="item in filteredItems"
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
  import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
  import { db } from '@/firebase';
  import BountyCard from '@/components/BountyCard.vue';

  export default {
    name: 'BountiesView',
    components: {
      BountyCard,
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
        editItem: null,
      };
    },
    methods: {
      openEditMenu(event, item) {
        if (this.isAdmin) {
          this.editItem = { ...item };
        }
      },
      async saveEdit() {
        if (!this.editItem) return;
        try {
          await updateDoc(doc(db, 'bounty', this.editItem.id), {
            title: this.editItem.title,
            price: this.editItem.price,
            description: this.editItem.description,
          });
          this.editItem = null;
          this.$emit('refresh-data');
        } catch (error) {
          console.error('Error updating bounty:', error);
        }
      },
      async deleteBounty(id) {
        if (!confirm('Are you sure you want to delete this bounty?')) return;
        try {
          await deleteDoc(doc(db, 'bounty', id));
          this.editItem = null;
          this.$emit('refresh-data');
        } catch (error) {
          console.error('Error deleting bounty:', error);
        }
      },
    },
  };
</script>
