<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Welcome, {{ user.displayName }}!</p>
    <p v-else>Loading...</p>

    <button @click="logout">Logout</button>
    <button @click="home">Home</button>

    <!-- Manage Offers Section -->
    <div v-if="offers.length > 0">
      <h2>Manage Your Offers</h2>

      <label for="offer-select">Select an Offer to Delete:</label>
      <select v-model="selectedOfferId" id="offer-select">
        <!-- Only show active offers in the dropdown -->
        <option v-for="offer in activeOffers" :key="offer.id" :value="offer.id">
          {{ offer.title }}
        </option>
      </select>

      <button @click="deactivateSelectedOffer" :disabled="!selectedOfferId">Delete Offer</button>
    </div>
    <p v-else>You have no offers available.</p>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";

export default {
  data() {
    return {
      user: null, // Store authenticated user
      offers: [], // Store user's offers
      selectedOfferId: "", // Store selected offer ID for deactivation
    };
  },
  async created() {
    this.user = auth.currentUser;
    auth.onAuthStateChanged((user) => {
      this.user = user;
      if (user) {
        this.fetchUserOffers();
      }
    });
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

    // Fetch offers created by the logged-in user (filtered by sellerId)
    async fetchUserOffers() {
      if (!auth.currentUser) return;

      try {
        const db = getFirestore();
        const offerCollection = collection(db, "offer");
        const userRef = doc(db, "user", auth.currentUser.uid); // Match stored reference

        const q = query(offerCollection, where("sellerId", "==", userRef));
        const snapshot = await getDocs(q);

        this.offers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched offers:", this.offers);
      } catch (error) {
        console.error("Error fetching user offers:", error.message);
      }
    },

    // Deactivate the selected offer with confirmation
    async deactivateSelectedOffer() {
      if (!this.selectedOfferId) return;

      // Find the selected offer title
      const selectedOffer = this.offers.find((offer) => offer.id === this.selectedOfferId);
      const offerTitle = selectedOffer ? selectedOffer.title : "this offer";

      // Show confirmation dialog
      const confirmed = window.confirm(`Are you sure you want to delete "${offerTitle}"?`);
      if (!confirmed) return;

      try {
        const db = getFirestore();
        const offerDocRef = doc(db, "offer", this.selectedOfferId);

        // Update the 'active' field to false instead of deleting
        await updateDoc(offerDocRef, { active: false });

        // Update the local offers array to reflect the change
        this.offers = this.offers.map((offer) =>
          offer.id === this.selectedOfferId ? { ...offer, active: false } : offer
        );

        console.log("Offer deleted:", this.selectedOfferId);
        this.selectedOfferId = ""; // Reset selection
      } catch (error) {
        console.error("Error deleting offer:", error.message);
      }
    },
  },
  computed: {
    // Computed property to filter out only active offers
    activeOffers() {
      return this.offers.filter(offer => offer.active === true);
    }
  },
};
</script>
