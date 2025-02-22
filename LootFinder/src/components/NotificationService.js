// src/components/NotificationService.js
import { ref } from 'vue';

const notifications = ref([]);
let nextId = 0;

export const useNotifications = () => {
  const addNotification = (message, type = 'info') => {
    const id = nextId++;
    notifications.value.push({
      id,
      message,
      type,
      timestamp: new Date()
    });

    // Remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
};