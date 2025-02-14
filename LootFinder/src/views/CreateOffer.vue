<template>
  <div class="p-6 flex-col justify-center items-center">
      <OfferForm />
  </div>
</template>

<script>
import OfferForm from '@/components/OfferForm.vue';

export default {
  name: 'CreateOffer',
  components: {
    OfferForm,
  },
};

</script>

