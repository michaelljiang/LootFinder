<template>
  <div class="mx-auto p-6 max-w-4xl">
    <div class="grid md:grid-cols-2 gap-8 m-16">
      <!-- Create Offer Option -->
      <div
        class="bg-lightGray p-6 rounded-2xl shadow-lg border-border border-2 flex flex-col min-h-[320px] hover:shadow-xl transition-shadow duration-300"
      >
        <div class="mb-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto text-border"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2 text-center">Create an Offer</h2>
        <p class="text-textBody mb-6 text-center">
          List an item you want to sell. Upload photos, set your price, and
          choose your location to make it visible to potential buyers.
        </p>
        <router-link
          to="/create-offer"
          class="mt-auto px-4 py-2 bg-border text-white rounded-2xl font-semibold hover:bg-nav text-center mx-auto block w-[150px]"
        >
          Create Offer
        </router-link>
      </div>

      <!-- Post Bounty Option -->
      <div
        class="bg-lightGray p-6 rounded-2xl shadow-lg border-border border-2 flex flex-col min-h-[320px] hover:shadow-xl transition-shadow duration-300"
      >
        <div class="mb-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto text-border"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2 text-center">Post a Bounty</h2>
        <p class="text-textBody mb-6 text-center">
          Looking for something specific? Post a bounty to let others know what
          you're searching for and how much you're willing to pay for it.
        </p>
        <router-link
          to="/post-bounty"
          class="mt-auto px-4 py-2 bg-border text-white rounded-2xl font-semibold hover:bg-nav text-center mx-auto block w-[150px]"
        >
          Post Bounty
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CreateOptions',
  };
</script>
