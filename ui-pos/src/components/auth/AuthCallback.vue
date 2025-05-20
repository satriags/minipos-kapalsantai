<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div>
      <p>Memproses login Google...</p>
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  // return alert('asdasdsa');
  const token = route.query.token as string;

  if (!token) {
    alert('Token tidak ditemukan!');
    router.push('/');
    return;
  }

  // Simpan token ke cookie
  Cookies.set('login_session', token, { expires: 1 });

  // Arahkan ke dashboard
  router.push('/dashboard');
});
</script>
