<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-2xl max-w-md">
      <h3 class="text-xl font-bold mb-4 text-textPrimary">
        AI-Generated Image Notice
      </h3>
      <p class="text-textBody mb-4">
        Please note that this bounty will include an AI-generated image. This is
        an experimental feature, and the generated image may not perfectly
        represent your actual item. Other users will be aware that this is an AI
        visualization.
      </p>
      <div class="flex justify-end space-x-4">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-200 text-textBody rounded-2xl font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-border text-white rounded-2xl font-semibold hover:bg-nav"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AIDisclaimerModal',
    props: {
      show: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>
