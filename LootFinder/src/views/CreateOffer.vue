<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Create Offer</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          v-model="form.price"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div class="flex items-center">
        <label for="negotiable" class="mr-3 text-sm font-medium text-gray-700">
          Price Negotiable
        </label>
        <input
          type="checkbox"
          id="negotiable"
          v-model="form.negotiable"
          class="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label for="image" class="block text-sm font-medium text-gray-700">
          Image Upload
        </label>
        <input
          type="file"
          id="image"
          @change="handleFileUpload"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-100"
        />
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { getFirestore, collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '@/firebase';
  import { getAuth } from 'firebase/auth';
  export default {
    data() {
      return {
        form: {
          title: '',
          description: '',
          price: null,
          negotiable: false,
          image: null,
          sellerId: null,
          active: false,
        },
      };
    },
    methods: {
      async handleSubmit() {
        try {
          let imageUrl = '';
          if (this.form.image) {
            const uniqueFileName = `${Date.now()}-${this.form.image.name}`;
            const storageRef = ref(storage, `offer/${uniqueFileName}`);
            await uploadBytes(storageRef, this.form.image);
            imageUrl = await getDownloadURL(storageRef);
          }

          // current user instance
          const auth = getAuth();
          const currentUser = auth.currentUser;

          // reference to the user document of current user
          const userRef = doc(db, 'user', currentUser.uid);

          const batch = writeBatch(db);
          // reference to the offer collection
          const offerRef = doc(collection(db, 'offer'));
          batch.set(offerRef,{
            title: this.form.title,
            description: this.form.description,
            price: this.form.price,
            negotiable: this.form.negotiable,
            image: imageUrl,
            sellerId: userRef,
            createdAt: new Date(),
            active: true,
          });

          // reference to the user offers sub-collection
          const userOfferRef = doc(collection(userRef, 'offers'), offerRef.id);
          batch.set(userOfferRef, {
            offer: offerRef,
          });

          await batch.commit();

          this.$router.push('/dashboard');
          console.log('Form submitted:', this.form);
        }
        catch ( error ) {
          console.error('Error creating offer ', error);
        }
      },
      handleFileUpload(event) {
        this.form.image = event.target.files[0];
      },
      cancel() {
        this.$router.push('/dashboard');
      },
    },
  };
</script>

<style scoped>
  .container {
    max-width: 600px;
  }
</style>
