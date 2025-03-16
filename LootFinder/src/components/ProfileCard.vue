<!-- filepath: src/components/ProfileCard.vue -->
<template>
  <div
    class="w-70 bg-white shadow-lg rounded-xl overflow-hidden p-6 flex flex-col items-center space-y-4"
  >
    <!-- Profile Image -->
    <img
      :src="image"
      alt="Profile Picture"
      class="w-28 h-28 rounded-full border-4 border-nav shadow-md"
    />

    <!-- User Info -->
    <div class="text-center">
      <p class="text-xl font-semibold text-gray-800">{{ displayName }}</p>
      <p class="text-sm text-gray-600">
        <strong>Email:</strong>
        {{ email }}
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        @click="seeOffers"
        class="px-4 py-2 text-sm font-semibold text-white bg-lapis rounded-lg shadow-md hover:bg-lapisLight transition"
      >
        See Offers
      </button>
      <button
        @click="togglePayPalButton"
        class="px-4 py-2 text-sm font-semibold text-white bg-darkGreen rounded-lg shadow-md hover:bg-lightGreen transition"
      >
        Pay with PayPal
      </button>
    </div>

    <!-- PayPal Button Container -->
    <div v-if="showPayPalButton" class="mt-4">
      <div class="flex items-center mb-4">
        <span class="mr-2">$</span>
        <input
          v-model="amount"
          type="number"
          placeholder="Enter amount"
          class="w-full p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
        />
      </div>
      <PayPalButton :amount="amount" currency="USD" :payeeEmail="email" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import PayPalButton from './PayPalButton.vue';

  export default defineComponent({
    name: 'ProfileCard',
    components: {
      PayPalButton,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      displayName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const router = useRouter();
      const showPayPalButton = ref(false);
      const amount = ref('');

      // Track authentication state

      const togglePayPalButton = () => {
        showPayPalButton.value = !showPayPalButton.value;
      };

      const seeOffers = () => {
        if (!props.id) {
          console.error('User ID is undefined in ProfileCard.vue');
        } else {
          router.push(`/UserOffers/${props.id}`);
        }
      };

      return { seeOffers, togglePayPalButton, showPayPalButton, amount };
    },
  });
</script>
