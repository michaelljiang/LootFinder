<template>
  <div
    class="w-72 h-96 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 flex flex-col"
  >
    <div class="px-4 py-2">
      <h1
        class="text-xl font-bold text-gray-800 uppercase dark:text-white truncate"
      >
        {{ title }}
      </h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ description }}
      </p>
    </div>

    <div class="flex-1 relative">
      <img
        class="absolute inset-0 w-full h-full object-cover"
        :src="image"
        :alt="title"
      />
    </div>

    <div class="flex items-center justify-between px-4 py-2 bg-gray-900">
      <h1 class="text-lg font-bold text-white">{{ price }}</h1>
      <button
        class="px-2 py-1 text-xs font-semibold text-gray-900 uppercase transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"
      >
        Add to cart
      </button>
      <button
        @click="openChat"
        class="px-2 py-1 text-xs font-semibold text-white uppercase bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Message Seller
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OfferCard",
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
  },
  methods: {
    openChat() {
      this.$router.push(`/chat/${this.sellerId}`);
    },
  },
};
</script>
