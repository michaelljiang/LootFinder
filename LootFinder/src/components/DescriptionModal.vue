<!-- filepath: src/components/DescriptionModal.vue -->
<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Description</h2>
        <p class="text-gray-800">{{ description }}</p>
        <div class="flex justify-end space-x-3 mt-6">
            <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
            Close
            </button>
        </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DescriptionModal',
    props: {
        description: {
        type: String,
        required: true
        }
    }
});
</script>