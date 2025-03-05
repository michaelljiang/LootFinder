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
          class="mb-4 flex"
          :class="{
            'justify-end': message.senderId === currentUser?.uid,
            'justify-start': message.senderId !== currentUser?.uid,
          }"
        >
          <div
            class="max-w-xs md:max-w-md w-fit break-words rounded-lg px-4 py-2"
            :class="message.senderId === currentUser?.uid 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'"
          >
            <p class="text-sm">
              {{ message.text }}
            </p>
            <p
              class="text-xs mt-1 opacity-75 text-right"
              :class="message.senderId === currentUser?.uid ? 'text-gray-100' : 'text-gray-600'"
            >
              {{ formatDate(message.createdAt) }}
            </p>
          </div>
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
  increment,
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
    const chatData = ref(null);
    const chatDocRef = ref(null);

    const auth = getAuth();

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser.value = user;
          fetchChatDetails();
          fetchMessages();
        } else {
          currentUser.value = null;
          messages.value = [];
        }
      });
    });

    // 1. Fetch chat details (and store buyerId/sellerId)
    const fetchChatDetails = async () => {
      if (!chatId) {
        console.error('Chat ID missing');
        return;
      }
      chatDocRef.value = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatDocRef.value);
      if (chatSnap.exists()) {
        const data = chatSnap.data();
        chatData.value = data;
        fetchSellerDetails(data.sellerId);
      } else {
        console.error('Chat not found!');
      }
    };

    // 2. Fetch seller details
    const fetchSellerDetails = async (sellerId) => {
      if (!sellerId) {
        console.error('Seller ID missing');
        return;
      }
      const sellerRef = doc(db, 'user', sellerId);
      const sellerSnap = await getDoc(sellerRef);
      if (sellerSnap.exists()) {
        seller.value = sellerSnap.data();
      } else {
        console.error('Seller not found in users collection!');
      }
    };

    // 3. Fetch messages in real-time and mark as read when viewing
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
        // Mark messages as seen (reset unread count) because user is viewing the conversation
        markChatAsRead();
      });
    };

    // 4. Send a message and increment recipient’s unread count
    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUser.value.uid,
        text: newMessage.value,
        createdAt: serverTimestamp(),
      });

      // Prepare update for last message info…
      const updateData = {
        lastMessage: newMessage.value,
        lastMessageTimestamp: serverTimestamp(),
      };

      // And increment unread count for the other party:
      if (chatData.value) {
        if (currentUser.value.uid === chatData.value.buyerId) {
          // If current user is buyer, increment seller’s unread count:
          updateData.sellerUnreadCount = increment(1);
        } else {
          // Otherwise, increment buyer’s unread count:
          updateData.buyerUnreadCount = increment(1);
        }
      }
      await updateDoc(chatDocRef.value, updateData);
      newMessage.value = '';
    };

    // 5. Mark chat as read by resetting current user’s unread count to 0
    const markChatAsRead = async () => {
      if (!chatData.value || !chatDocRef.value || !currentUser.value) return;
      const field =
        currentUser.value.uid === chatData.value.buyerId
          ? 'buyerUnreadCount'
          : 'sellerUnreadCount';
      await updateDoc(chatDocRef.value, { [field]: 0 });
    };

    // Utility: format timestamps
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      const dateObj = timestamp.toDate();
      return dateObj.toLocaleString();
    };

    return {
      messages,
      newMessage,
      sendMessage,
      currentUser,
      seller,
      loading,
      formatDate,
    };
  },
};
</script>
