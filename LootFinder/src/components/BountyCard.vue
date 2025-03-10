<template>
  <div class="relative flex items-center justify-center">
    <!-- Wanted Poster Background -->
    <div
      class="absolute w-80 h-104 bg-[#F5DEB3] rounded-lg shadow-2xl border-1 border-brown-700 flex flex-col items-center text-center z-0 before:absolute before:w-full before:bg-gradient-to-b before:from-[#E8C08F] before:to-transparent after:absolute after:w-full after:bg-gradient-to-t after:from-[#E8C08F] after:to-transparent"
    ></div>
    <div class="w-72 h-96 overflow-hidden rounded-lg flex flex-col z-10">
      <div class="px-4 py-2">
        <h1 class="text-xl font-bold text-gray-800 uppercase truncate">
          {{ title }}
        </h1>
        <p class="mt-1 text-sm text-gray-600 line-clamp-2">
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

      <div
        class="flex items-center justify-between bg-[#895129] px-4 py-2 mt-2"
      >
        <h1 class="text-lg font-bold text-gray-200 truncate flex-grow">
          ${{ price }}
        </h1>
        <button
          @click="openChat"
          class="px-2 py-2 text-xs font-semibold text-black uppercase bg-[#ea7643] rounded hover:bg-[#eb8e65] transition"
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
    name: 'BountyCard',
    props: {
      id: { type: String, required: true }, // bountyId
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true }, // AI-generated image URL
      buyerId: { type: String, required: true },
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
          alert('You must be logged in to message the buyer.');
          return;
        }

        const sellerId = currentUser.value.uid;
        const bountyId = props.id;
        const buyerId = props.buyerId;

        try {
          const chatsRef = collection(db, 'chats');
          const q = query(
            chatsRef,
            where('sellerId', '==', sellerId),
            where('buyerId', '==', buyerId),
            where('bountyId', '==', bountyId)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Chat exists, navigate to it
            const chatId = querySnapshot.docs[0].id;
            router.push(`/chat/${chatId}`);
          } else {
            // Create a new chat
            const chatRef = await addDoc(chatsRef, {
              sellerId,
              buyerId,
              bountyId,
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
