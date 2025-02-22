<template>
  <main>
    <NotificationToast />
    <Navbar />
    <div class="container mx-auto min-h-screen">
      <router-view></router-view>
    </div>
    <Footer />
  </main>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import NotificationToast from '@/components/NotificationToast.vue';
import { defineComponent } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useNotifications } from '@/components/NotificationService';

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    Footer,
    NotificationToast
  },
  setup() {
    const { addNotification } = useNotifications();
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Listen for new messages where the user is the recipient (as buyer)
        const messagesQuery = query(
          collection(db, 'chats'),
          where('buyerId', '==', user.uid)
        );

        onSnapshot(messagesQuery, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'modified') {
              const chatData = change.doc.data();
              if (chatData.lastMessageTimestamp && 
                  chatData.lastMessage && 
                  chatData.sellerId !== user.uid) {
                // Fetch sender's name
                const senderDoc = await getDoc(doc(db, 'user', chatData.sellerId));
                const senderName = senderDoc.data()?.displayName || 'Someone';
                addNotification(`New message from ${senderName}: ${chatData.lastMessage}`);
              }
            }
          });
        });

        // Listen for new messages where the user is the recipient (as seller)
        const sellerMessagesQuery = query(
          collection(db, 'chats'),
          where('sellerId', '==', user.uid)
        );

        onSnapshot(sellerMessagesQuery, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'modified') {
              const chatData = change.doc.data();
              if (chatData.lastMessageTimestamp && 
                  chatData.lastMessage && 
                  chatData.buyerId !== user.uid) {
                // Fetch sender's name
                const senderDoc = await getDoc(doc(db, 'user', chatData.buyerId));
                const senderName = senderDoc.data()?.displayName || 'Someone';
                addNotification(`New message from ${senderName}: ${chatData.lastMessage}`);
              }
            }
          });
        });
      }
    });
  }
});
</script>
