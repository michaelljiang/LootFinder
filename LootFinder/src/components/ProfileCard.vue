<template>
    <div class="flex flex-col w-72 h-96 rounded-2xl overflow-hidden min-h-screen text-center bg-gray-100">
        <img 
            :src="image" 
            alt="Profile Picture" 
            class="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 shadow-md"
            />
        <div class="mt-4 space-y-2">
            <p class="text-lg font-medium text-gray-700"> {{ username }}</p>
            <p class="text-gray-600"><strong>Email:</strong> {{ email }}</p>
        </div>
        <button
            @click="openChat"
            class="px-2 py-1 text-xs font-semibold text-white uppercase bg-blue-500 rounded hover:bg-blue-600 transition"
        >
            Message Seller
        </button>
    </div>
</template>

<script>
export default {
name: "ProfileCard",
props: {
    username: {
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