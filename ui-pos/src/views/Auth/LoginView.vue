<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-login"
    alt="https://pixabay.com/id/gifs/tropis-pantai-alam-sinematografer-10201/">
    <div class="card shadow-lg border-0 rounded-4 p-4"
      style="max-width: 500px; width: 100%; background-color: rgba(255, 255, 255, 0.9);">
      <div class="text-left mb-4">
        <h2 class="fw-bold text-warning">Selamat Datang</h2>
        <h2 class="fw-bold text-warning">Kawan Santai,</h2>
        <p class="text-muted mb-0">Silakan masuk atau daftar dengan satu tombol</p>
      </div>

      <!-- ALERT -->
      <div v-if="isWarningMsg" class="alert alert-warning" role="alert">{{ warningMsg }}</div>
      <div v-if="isErrorMsg" class="alert alert-danger" role="alert">{{ errorMsg }}</div>
      <div v-if="isInfoMsg" class="alert alert-info" role="alert">{{ infoMsg }}</div>

      <!-- Loader -->
      <div v-if="isPageLoading" class="placeholder-glow mb-3">
        <div class="placeholder col-12 bg-secondary" style="height: 50px;"></div>
      </div>

      <!-- Login Component -->
      <GoogleLoginView :role="roleNow" v-else />

      <a v-show="roleNow != 'Mitra'" class="text-warning text-center mt-2" href="#" @click="roleNow = 'Mitra'">masuk
        sebagai
        Mitra</a>
      <a v-show="roleNow != 'Konsumen'" class="text-warning text-center mt-2" href="#"
        @click="roleNow = 'Konsumen'">masuk
        sebagai
        Konsumen</a>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import GoogleLoginView from '@/components/auth/GoogleLoginView.vue';

const route = useRoute();

const roleNow = ref('Konsumen'); // default role

const isPageLoading = ref(true);
const isErrorMsg = ref(false);
const errorMsg = ref('');
const isInfoMsg = ref(false);
const infoMsg = ref('');
const isWarningMsg = ref(false);
const warningMsg = ref('');

// Simulasi loading halaman
onMounted(() => {
  if (route.query.errorAuth) {
    isInfoMsg.value = true;
    infoMsg.value = "Silahkan coba login ulang!";
  }
  if (route.query.cancelAuth) {
    isInfoMsg.value = true;
    infoMsg.value = "Anda membatalkan login Google!";
  }
  if (route.query.successLogout) {
    isInfoMsg.value = true;
    infoMsg.value = "Anda keluar akun!";
  }

  setTimeout(() => {
    isPageLoading.value = false;
  }, 500);
});
</script>

<style scoped>
.bg-login {
  background: url('@/assets/img/tropical-10201_512.gif') no-repeat center center;
  background-size: cover;
}
</style>
