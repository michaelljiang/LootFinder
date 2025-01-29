<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Welcome, {{ user.displayName }}!</p>
    <p v-else>Loading...</p>

    <button @click="logout">Logout</button>
    <button @click="home">Home</button>

    <!-- Listings Section -->
    <div v-if="offers.length > 0">
      <h2>Your Offers</h2>
      <ul>
        <li v-for="(offer, index) in offers" :key="offer.id">
          {{ offer.name }}
          <button @click="deleteOffer(offer.id, index)">Delete</button>
        </li>
      </ul>
    </div>
    <p v-else>No offers available.</p>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default {
  data() {
    return {
      user: null, // Store authenticated user
      offers: [], // Store offers (listings)
    };
  },
  async created() {
    this.user = auth.currentUser;
    auth.onAuthStateChanged((user) => {
      this.user = user;
    });

    await this.fetchOffers();
  },
  methods: {
    // Logout function
    async logout() {
      try {
        await signOut(auth);
        console.log("User logged out");
        this.$router.push("/"); // Redirect to Home after logout
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    },

    // Navigate to Home
    home() {
      this.$router.push("/");
    },

    // Fetch offers from Firestore
    async fetchOffers() {
      try {
        const db = getFirestore();
        const offerCollection = collection(db, "offer"); // Fetch from "offer" collection
        const snapshot = await getDocs(offerCollection);
        this.offers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching offers:", error.message);
      }
    },

    // Delete an offer
    async deleteOffer(offerId, index) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "offer", offerId)); // Delete from Firestore
        this.offers.splice(index, 1); // Remove from local list
        console.log("Offer deleted:", offerId);
      } catch (error) {
        console.error("Error deleting offer:", error.message);
      }
    },
  },
};
</script>
