<template>
  <div class="p-6 flex-col justify-center items-center">
    <BountyForm />
  </div>
</template>

<script>
  import BountyForm from '@/components/BountyForm.vue';

  export default {
    name: 'CreateBounty',
    components: {
      BountyForm,
    },
  };
</script>
