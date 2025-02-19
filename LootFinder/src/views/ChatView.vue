<template>
  <div class="p-4 min-h-screen bg-gray-100 flex flex-col">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">
      Chat with {{ seller?.displayName || 'Seller' }}
    </h1>

    <div v-if="loading" class="text-gray-500">Loading chat...</div>
    <div v-else class="flex flex-col flex-1">
      <!-- Messages Container -->
      <div class="flex-1 overflow-y-auto p-4 bg-white shadow rounded-lg">
        <div
          v-for="message in messages"
          :key="message.id"
          class="mb-2 p-2 rounded-lg text-white"
          :class="{
            'bg-blue-500 self-end': message.senderId === currentUser?.uid,
            'bg-gray-500 self-start': message.senderId !== currentUser?.uid,
          }"
        >
          {{ message.text }}
        </div>
      </div>

      <!-- Message Input -->
      <div class="mt-4 flex">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 p-2 border rounded-l-lg focus:outline-none"
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          class="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    orderBy,
    query,
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  export default {
    name: 'Chat',
    setup() {
      const route = useRoute();
      const chatId = route.params.chatId;
      const messages = ref([]);
      const newMessage = ref('');
      const currentUser = ref(null);
      const seller = ref(null);
      const loading = ref(true);

      const auth = getAuth();

      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            currentUser.value = user;
            fetchChatDetails(); // First, fetch chat details
            fetchMessages(); // Then, listen for chat messages
          } else {
            currentUser.value = null;
            messages.value = [];
          }
        });
      });

      // Step 1: Fetch chat details (to get sellerId)
      const fetchChatDetails = async () => {
        if (!chatId) {
          console.error('Chat ID missing');
          return;
        }

        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          fetchSellerDetails(chatData.sellerId); // Fetch seller name
        } else {
          console.error('Chat not found!');
        }
      };

      // Step 2: Fetch seller details using sellerId
      const fetchSellerDetails = async (sellerId) => {
        if (!sellerId) {
          console.error('Seller ID missing');
          return;
        }

        const sellerRef = doc(db, 'user', sellerId);
        const sellerSnap = await getDoc(sellerRef);

        if (sellerSnap.exists()) {
          seller.value = sellerSnap.data(); // Store seller's data (including name)
        } else {
          console.error('Seller not found in users collection!');
        }
      };

      // Step 3: Fetch chat messages in real-time
      const fetchMessages = () => {
        if (!chatId) {
          console.error('Chat ID missing');
          return;
        }

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        onSnapshot(q, (snapshot) => {
          messages.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          loading.value = false;
        });
      };

      // Step 4: Send a message
      const sendMessage = async () => {
        if (!newMessage.value.trim()) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const chatRef = doc(db, 'chats', chatId);

        await addDoc(messagesRef, {
          senderId: currentUser.value.uid,
          text: newMessage.value,
          createdAt: serverTimestamp(),
        });

        // ✅ Update lastMessage & lastMessageTimestamp in chat document
        await updateDoc(chatRef, {
          lastMessage: newMessage.value,
          lastMessageTimestamp: serverTimestamp(),
        });

        newMessage.value = '';
      };

      return {
        messages,
        newMessage,
        sendMessage,
        currentUser,
        seller,
        loading,
      };
    },
  };
</script>
