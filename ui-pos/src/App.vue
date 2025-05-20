<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>
<style>
.card-interactive {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.card-interactive:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}

.card-interactive:active {
  transform: scale(0.98);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

/* UNTUK LEBAR MULTI SELECT */
/* CSS */
.multiselect__content-wrapper {
  min-width: 300px !important;
  /* atau bisa pakai width langsung */
  /* max-width: 400px !important; */
  white-space: normal;
  /* supaya teks panjang tidak dipotong */
}
</style>
<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MainView from '@/views/Layout/MainLayout.vue';
import AuthLayout from '@/views/Layout/AuthLayout.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const layoutComponent = computed(() => {
  if (route.meta.layout === 'AuthLayout') {
    return AuthLayout;
  } else if (route.meta.layout === 'MainView') {
    return MainView;
  } else {
    return null;
  }
});
</script>
