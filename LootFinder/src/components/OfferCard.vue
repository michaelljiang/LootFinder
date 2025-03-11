<template>
  <div class="relative flex items-center justify-center">
    <!-- Wanted Poster Background -->
    <div
      class="absolute w-80 h-104 bg-nav rounded-lg shadow-2xl
             flex flex-col items-center text-center z-0"
    >
    </div>
    <div
      class="w-72 h-96 overflow-hidden  rounded-lg  flex flex-col z-10"
    >
      <div class="px-4 py-2">
        <h1
          class="text-xl font-bold text-white uppercase truncate border-b-2 border-whie"
        >
          {{ title }}
        </h1>
        <p class="mt-1 text-sm text-white line-clamp-2 truncate">
          {{ description }}
        </p>
      </div>

      <div class="flex-1 relative">
        <img
          class="absolute inset-0 w-full h-full object-cover rounded-xl border-2 border-white bg-white"
          :src="image"
          :alt="title"
        />
      </div>

      <div class="flex items-center justify-between rounded-xl bg-white px-4 py-2 mt-2">
        <h1 class="text-lg font-bold text-logoBrown truncate flex-grow">${{ price }}</h1>
        <button
          @click="openChat"
          class="px-2 py-2 text-xs font-semibold text-black uppercase bg-[#ea7643] rounded-md hover:bg-[#eb8e65] transition"
        >
          Message
        </button>
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
    addDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { useRouter } from 'vue-router';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { ref, onMounted } from 'vue';

  export default {
    name: 'OfferCard',
    props: {
      id: { type: String, required: true }, // itemId
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      sellerId: { type: String, required: true },
    },
    setup(props) {
      const router = useRouter();
      const auth = getAuth();
      const currentUser = ref(null);

      // Track authentication state
      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          currentUser.value = user;
        });
      });

      const openChat = async () => {
        if (!currentUser.value) {
          alert('You must be logged in to message the seller.');
          return;
        }

        const buyerId = currentUser.value.uid;
        const itemId = props.id;
        const sellerId = props.sellerId;

        try {
          const chatsRef = collection(db, 'chats');
          const q = query(
            chatsRef,
            where('buyerId', '==', buyerId),
            where('sellerId', '==', sellerId),
            where('itemId', '==', itemId)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Chat exists, navigate to it
            const chatId = querySnapshot.docs[0].id;
            router.push(`/chat/${chatId}`);
          } else {
            // Create a new chat
            const chatRef = await addDoc(chatsRef, {
              buyerId,
              sellerId,
              itemId,
              createdAt: serverTimestamp(),
              lastMessage: '',
              lastMessageTimestamp: serverTimestamp(),
            });

            router.push(`/chat/${chatRef.id}`);
          }
        } catch (error) {
          console.error('Error starting chat:', error.message);
        }
      };

      return { openChat };
    },
  };
</script>
