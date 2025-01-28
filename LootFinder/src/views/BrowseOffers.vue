<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Browse Offers
    </h1>
    <div class="flex flex-wrap justify-center items-stretch gap-6">
      <OfferCard
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
      />
    </div>
  </div>
</template>

<script>
  import OfferCard from '@/components/OfferCard.vue';

  export default {
    name: 'BrowseOffers',
    components: {
      OfferCard,
    },
    data() {
      return {
        items: [
          {
            title: 'Nike Air Max',
            description:
              'Experience ultimate comfort and style with the Nike Air Max.',
            price: '$129',
            image:
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=320&q=80',
          },
          {
            title: 'Adidas Ultraboost',
            description: 'Run with confidence in the Adidas Ultraboost shoes.',
            price: '$149',
            image:
              'https://images.unsplash.com/photo-1521336631329-8593b84b4a45?ixlib=rb-1.2.1&auto=format&fit=crop&w=320&q=80',
          },
          {
            title: 'Puma RS-X',
            description:
              'A modern take on retro style with the Puma RS-X sneakers.',
            price: '$99',
            image:
              'https://images.unsplash.com/photo-1561309911-66a1c68e12ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=320&q=80',
          },
        ],
      };
    },
  };
</script>
