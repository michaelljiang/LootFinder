<!-- src/components/NotificationToast.vue -->
<template>
    <div class="fixed top-4 right-4 z-50">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="mb-2 p-4 rounded-lg shadow-lg bg-white border-l-4 border-blue-500 flex items-center justify-between"
        style="min-width: 300px"
      >
        <div>
          <p class="text-gray-800">{{ notification.message }}</p>
          <p class="text-xs text-gray-500">
            {{ new Date(notification.timestamp).toLocaleTimeString() }}
          </p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="ml-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { useNotifications } from './NotificationService';
  
  export default {
    name: 'NotificationToast',
    setup() {
      const { notifications, removeNotification } = useNotifications();
  
      return {
        notifications,
        removeNotification
      };
    }
  };
  </script>