<template>
  <div class="mt-5 container container-fluid d-flex align-items-center justify-content-center">
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="row g-0">
            <div class="col-md-4 bg-light d-flex align-items-center justify-content-center">
              <img :src="loadUserPayload().photo" class="img-fluid rounded-circle border border-3 border-primary"
                alt="Foto Profil" style="max-width: 150px; object-fit: cover;" />
            </div>
            <div class="col-md-8 bg-white">
              <div class="card-body">
                <h5 class="card-title fw-bold text-primary mb-1">{{ loadUserPayload().name }}
                </h5>
                <h6 class="text-muted mb-2"><i>{{ loadUserPayload().role }}</i> @{{ loadUserPayload().username }}</h6>
                <p class="mb-1">
                  <i class="bi bi-envelope-fill me-2 text-secondary"></i>{{ loadUserPayload().email }}
                </p>
                <p class="text-muted mb-0">
                  <i class="bi bi-calendar3 me-2 text-secondary"></i>
                  Bergabung pada {{ formatTanggalJamMix(loadUserPayload().createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bonus: Bisa tambahin tombol edit profil -->
        <!-- <div class="text-end mt-3">
          <button class="btn btn-outline-primary rounded-pill px-4">Edit Profil</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import Cookies from 'js-cookie';
import "vue3-toastify/dist/index.css";
import { globalFormatter } from '@/mixins/formatter';
const { formatTanggalJamMix } = globalFormatter.methods;

const loadUserPayload = () => {
  const encoded = Cookies.get('user');
  if (!encoded) return null;
  return JSON.parse(atob(encoded));
};

onMounted(() => {
  // Bisa dipakai buat ambil data API kalau dibutuhkan nanti
});
</script>

<style scoped>
/* Tambahan gaya lembut */
.card {
  background-color: rgba(255, 255, 255, 0.95);
}
</style>
