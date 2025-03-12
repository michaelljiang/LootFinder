<!-- filepath: src/views/UserOffers.vue -->
<template>
    <div class="container mx-auto p-6 min-h-screen">
        <div class="justify-center text-center">
            <h1 class="text-2xl font-bold mb-4">Offers by {{ user.displayName }}</h1>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="item in offers" :key="item.id">
                <OfferCard
                :id="item.id"
                :title="item.title"
                :description="item.description"
                :price="item.price"
                :image="item.image"
                :sellerId="item.sellerId"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import OfferCard from '@/components/OfferCard.vue';
import { fetchItemWithSeller } from '@/firebaseService';

interface User {
    displayName: string;
    email: string;
    photoURL: string;
}

interface Offer {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    sellerId: string;
}

export default defineComponent({
    name: 'UserOffers',
    components: {
        OfferCard,
    },
    
    data() {
        return {
        userId: "",
        user: {} as User,
        offers: [] as Offer[],
        loading: true,
        };
    },
    async created() {
    this.userId = Array.isArray(this.$route.params.id) ? this.$route.params.id[0] : this.$route.params.id;
    await this.fetchUserData();
    await this.fetchUserOffers();
    },
    methods: {
        async fetchUserData() {
        try {
            const userDocRef = doc(db, 'user', this.userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
            this.user = userDoc.data() as User;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        },
        async fetchUserOffers() {
        try {
            const offersQuery = query(collection(db, 'offer'), where('sellerId', '==', doc(db, 'user', this.userId)), where('active', '==', true));
            const querySnapshot = await getDocs(offersQuery);
            
            const items = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
            const resolvedItem = await fetchItemWithSeller(doc.id);
            console.log('Offer data:', resolvedItem); // Add this line to log the offer data
            return resolvedItem ? { ...resolvedItem, id: doc.id } : null;
        })
        );  

          // Remove null values (failed fetches)
            this.offers = items.filter((item) => item !== null) as Offer[];
            } catch (error) {
            console.error('Error fetching active offers:', error);
        }
    }
    },
    
});
</script>

<style scoped>
.offer-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 16px;
    }
</style>