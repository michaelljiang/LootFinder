<template>
    <div class="flex flex-col h-screen bg-gray-100">
      <div class="bg-blue-600 text-white p-4 text-center text-lg font-bold">
        Chat with {{ chatUser?.displayName || "User" }}
      </div>
  
      <div class="flex-1 overflow-auto p-4 space-y-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="{
            'text-right': msg.senderId === currentUser.uid,
            'text-left': msg.senderId !== currentUser.uid,
          }"
        >
          <div
            class="inline-block px-4 py-2 rounded-lg"
            :class="{
              'bg-blue-500 text-white': msg.senderId === currentUser.uid,
              'bg-gray-300 text-black': msg.senderId !== currentUser.uid,
            }"
          >
            <p>{{ msg.text }}</p>
            <small class="block text-xs mt-1">{{ formatDate(msg.timestamp) }}</small>
          </div>
        </div>
      </div>
  
      <div class="p-4 bg-white border-t flex">
        <input
          v-model="newMessage"
          type="text"
          class="flex-1 p-2 border rounded-lg focus:outline-none"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  import { getAuth } from "firebase/auth";
  
  export default {
    name: "ChatView",
    setup() {
      const route = useRoute();
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const chatUserId = route.params.userId;
      const messages = ref([]);
      const newMessage = ref("");
      const chatUser = ref(null);

      onMounted(() => {
        console.log("Fetching chat user:", chatUserId);
        chatUser.value = { displayName: "Seller Name" }; // Replace with Firestore fetch logic
      });
  
      const sendMessage = () => {
        if (!newMessage.value.trim()) return;
  
        const message = {
          id: Date.now().toString(),
          senderId: currentUser.uid,
          receiverId: chatUserId,
          text: newMessage.value,
          timestamp: new Date().toISOString(),
        };
  
        messages.value.push(message);
        newMessage.value = "";
  
        // Later, store this in Firestore and set up real-time listeners
      };
  
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      };
  
      return { messages, newMessage, sendMessage, chatUser, formatDate, currentUser };
    },
  };
  </script>
