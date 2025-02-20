<template>
    <div class="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div class="mb-6 flex flex-col sm:flex-row sm:justify-center sm:items-center">
            <input 
                v-model="query" 
                type="text" 
                placeholder="Search for users" 
                class="w-full sm:w-64 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div class="flex flex-wrap justify-center items-stretch gap-6">
                    <ProfileCard 
                        v-for="user in results"
                        :username="user.username" 
                        :email="user.email" 
                        :title="user.title" 
                        :image="user.image" 
                        :sellerId="user.sellerId" 
                    />
        </div>
    </div>
</template>

<script>
    import { collection, query, orderBy, startAt, endAt, getDocs, where } from 'firebase/firestore';
    import { db } from '@/firebase';
    import ProfileCard from '@/components/ProfileCard.vue';

    export default {
        name: 'SearchBar',
        components: {
            ProfileCard,
        },
        data() {
            return {
                query: '',
                results: []
            };
        },
        computed: {
        filteredUsers() {
            return this.results.filter(user => {
                // Check if the user's displayName includes the search term (case insensitive)
                const matchesSearch = this.query
                    ? user.displayName.toLowerCase().includes(this.query.toLowerCase())
                    : true;
                return matchesSearch;
                });
            }
        },
        async created() {
            await this.searchUsers();
        },
        methods: {
            async searchUsers() {
                try {
                    const usersRef = collection(db, "user");
                    // Firestore queries are case-sensitive, so we need to fetch all and filter manually
                    const q = query(usersRef);
                    const querySnapshot = await getDocs(q);

                    // Filter users locally (case insensitive search)
                    this.results = querySnapshot.docs.map(doc => ({ 
                            id: doc.id, 
                            ...doc.data(),
                        }));
                        
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
        }
        }
    };
</script>


