<template>
  <div class="flex items-center justify-center h-full min-h-32">
    <div
      class="ship-wheel w-24 h-24"
      :style="{ transform: `rotate(${rotation}deg)` }"
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer ring -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#834848"
          stroke-width="5"
        />

        <!-- Center hub -->
        <circle cx="50" cy="50" r="15" fill="#834848" />

        <!-- Spokes -->
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="95"
          stroke="#834848"
          stroke-width="5"
        />
        <line
          x1="5"
          y1="50"
          x2="95"
          y2="50"
          stroke="#834848"
          stroke-width="5"
        />
        <line
          x1="17"
          y1="17"
          x2="83"
          y2="83"
          stroke="#834848"
          stroke-width="5"
        />
        <line
          x1="17"
          y1="83"
          x2="83"
          y2="17"
          stroke="#834848"
          stroke-width="5"
        />

        <!-- Handles on the wheel -->
        <circle cx="50" cy="5" r="4" fill="#834848" />
        <circle cx="50" cy="95" r="4" fill="#834848" />
        <circle cx="5" cy="50" r="4" fill="#834848" />
        <circle cx="95" cy="50" r="4" fill="#834848" />
        <circle cx="17" cy="17" r="4" fill="#834848" />
        <circle cx="83" cy="83" r="4" fill="#834848" />
        <circle cx="17" cy="83" r="4" fill="#834848" />
        <circle cx="83" cy="17" r="4" fill="#834848" />
      </svg>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, onUnmounted } from 'vue';

  export default {
    name: 'LoadingScreen',
    setup() {
      const rotation = ref(0);
      let animationFrame = null;
      const rotationSpeed = 1; // Slower rotation speed

      const animate = () => {
        // Simply increment the rotation by a fixed amount
        rotation.value += rotationSpeed;
        animationFrame = requestAnimationFrame(animate);
      };

      onMounted(() => {
        animationFrame = requestAnimationFrame(animate);
      });

      onUnmounted(() => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      });

      return {
        rotation,
      };
    },
  };
</script>

<style scoped>
  .ship-wheel {
    transition: transform 0.05s linear;
  }
</style>
