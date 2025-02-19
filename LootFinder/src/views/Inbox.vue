<template>
  <div class="p-4 min-h-screen bg-gray-100">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Inbox</h1>

    <div v-if="loading" class="text-gray-500">Loading conversations...</div>
    <div v-else-if="chats.length === 0" class="text-gray-500">
      No conversations yet.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="goToChat(chat.id)"
        class="flex items-center p-3 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-200 transition"
      >
        <!-- User Avatar or Item Image -->
        <img
          :src="chat.itemImage || 'https://via.placeholder.com/50'"
          alt="Item"
          class="w-12 h-12 rounded-lg object-cover mr-3"
        />

        <div class="flex-1">
          <h2 class="font-bold text-gray-800">{{ chat.otherUserName }}</h2>
          <p class="text-gray-600 text-sm truncate">
            {{ chat.lastMessage || 'No messages yet' }}
          </p>
        </div>

        <!-- Timestamp -->
        <span class="text-xs text-gray-500">
          {{ formatTimestamp(chat.lastMessageTimestamp) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    orderBy,
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    name: 'Inbox',
    setup() {
      const router = useRouter();
      const auth = getAuth();
      const currentUser = ref(null);
      const chats = ref([]);
      const loading = ref(true);

      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            currentUser.value = user;
            fetchChats();
          } else {
            currentUser.value = null;
            chats.value = [];
          }
        });
      });

      const fetchChats = async () => {
        if (!currentUser.value) return;

        try {
          const userId = currentUser.value.uid;
          let chatList = [];

          // Fetch chats where user is the buyer
          const buyerChatsQuery = query(
            collection(db, 'chats'),
            where('buyerId', '==', userId),
            orderBy('lastMessageTimestamp', 'desc')
          );
          const buyerChatsSnapshot = await getDocs(buyerChatsQuery);
          chatList = await processChatDocs(
            buyerChatsSnapshot,
            userId,
            chatList
          );

          // Fetch chats where user is the seller
          const sellerChatsQuery = query(
            collection(db, 'chats'),
            where('sellerId', '==', userId),
            orderBy('lastMessageTimestamp', 'desc')
          );
          const sellerChatsSnapshot = await getDocs(sellerChatsQuery);
          chatList = await processChatDocs(
            sellerChatsSnapshot,
            userId,
            chatList
          );

          // Sort combined chats manually in case some don't have timestamps
          chats.value = chatList.sort((a, b) => {
            if (!a.lastMessageTimestamp) return 1; // Move empty chats to the bottom
            if (!b.lastMessageTimestamp) return -1;
            return (
              b.lastMessageTimestamp.toMillis() -
              a.lastMessageTimestamp.toMillis()
            );
          });
          chats.value = chatList.filter(
            (chat) => chat.otherUserId !== userId && chat.lastMessage !== ''
          );
        } catch (error) {
          console.error('Error fetching conversations:', error);
        } finally {
          loading.value = false;
        }
      };

      const processChatDocs = async (querySnapshot, userId, chatList) => {
        for (const chatDoc of querySnapshot.docs) {
          const chatData = chatDoc.data();

          // Get the other user's ID (buyer or seller)
          const otherUserId =
            chatData.sellerId === userId ? chatData.buyerId : chatData.sellerId;

          // Fetch the other user's name from Firestore (from "user" collection)
          const userRef = doc(db, 'user', otherUserId);
          const userSnap = await getDoc(userRef);
          const otherUserName = userSnap.exists()
            ? userSnap.data().displayName || 'Unknown User'
            : 'Unknown User';

          // Fetch the item details from Firestore (from "offer" collection)
          const itemRef = doc(db, 'offer', chatData.itemId);
          const itemSnap = await getDoc(itemRef);
          const itemImage = itemSnap.exists() ? itemSnap.data().image : null;

          chatList.push({
            id: chatDoc.id,
            otherUserName,
            lastMessage: chatData.lastMessage,
            lastMessageTimestamp: chatData.lastMessageTimestamp,
            itemImage,
          });
        }
        return chatList;
      };

      const goToChat = (chatId) => {
        router.push(`/chat/${chatId}`);
      };

      const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60 / 60 / 24);
        return diff === 0
          ? 'Today'
          : diff === 1
            ? 'Yesterday'
            : `${diff} days ago`;
      };

      return {
        chats,
        loading,
        goToChat,
        formatTimestamp,
      };
    },
  };
</script>
