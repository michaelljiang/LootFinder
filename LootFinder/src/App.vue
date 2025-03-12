<template>
  <main class = "bg-lightbackground pt-4">
    <Navbar/>
    <div class = "container mx-auto min-h-screen">
      <router-view></router-view>
    </div>
    <Footer />
  </main>
</template>

<script>
  import Navbar from '@/components/Navbar.vue';
  import Footer from '@/components/Footer.vue';

  export default {
    name: 'App',
    components: {
      Navbar,
      Footer,
    },
  };
</script>
