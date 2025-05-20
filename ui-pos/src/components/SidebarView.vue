<template>
  <div class="d-none d-md-flex sidebar d-flex flex-column vh-100 bg-light shadow-lg">
    <div class="profile px-3 py-2 text-center">
      <a href="javascript:void(0)"
        class="d-flex align-items-center text-dark text-decoration-none dropdown-toggle flex-nowrap d-lg-flex"
        id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        <!-- Foto Profile -->
        <div>
          <span v-if="isLoading" class="placeholder-glow">
            <span class="placeholder col-12 p-3" height="45" width="45"></span>
          </span>
          <img v-else :src="userPayload.photo" alt="Profile" width="45" height="45" class="rounded-circle" />
        </div>

        <!-- Info Cabang & Nama -->
        <div class="text-start ms-3 w-100">
          <span v-if="isLoading" class="d-none d-sm-inline w-100">
            <span class="placeholder-glow">
              <span class="placeholder col-12" style="height: 20px;"></span>
              <br>
              <span class="placeholder col-12" style="height: 20px;"></span>
            </span>
          </span>
          <span v-else class="d-none d-sm-inline text-wrap">
            <b class="d-block text-wrap">{{ userPayload.name }}</b>
            <span class="d-inline-block ">{{ userPayload.role }}</span>
          </span>
        </div>
      </a>

      <!-- Dropdown -->
      <ul class="dropdown-menu dropdown-menu-light shadow" aria-labelledby="dropdownUser1">
        <li>
          <RouterLink class="dropdown-item" to="/profile">Profile</RouterLink>
        </li>
        <li><a class="dropdown-item" href="javascript:void(0)" @click="showModalLogout = true">Keluar Akun</a></li>
      </ul>
    </div>
    <hr class="text-muted w-100 mt" />
    <div class=" overflow-auto ">
      <ul class="nav nav-pills ps-2 pe-2 flex-column flex-grow-1" id="menu">
        <template v-for="[group, items] in Object.entries(filteredMenus)" :key="group">
          <li class="text-muted pt-3 pb-2">{{ group }}</li>
          <li v-for="menu in items" :key="menu.menu_path">
            <RouterLink :to="menu.menu_path" class="nav-link text-muted">
              <i class="fs-3" :class="menu.menu_logo || 'bi-collection'"></i>
              <span class="fs-5 ms-2 d-none d-sm-inline">{{ menu.menu_name }}</span>
            </RouterLink>
          </li>
        </template>
      </ul>
    </div>

  </div>
  <!-- Bottom Navigation (Hanya Muncul di Mobile) -->

  <div
    class="d-md-none fixed-bottom bg-light border border-top-2  border-bottom-0  border-start-0  border-end-0 ms-0 me-0">
    <!-- Bottom Menu dengan Bootstrap -->
    <div class="d-flex justify-content-around py-2 overflow-auto align-items-center ">
      <!-- Dropdown Profile (Dropup agar tetap di atas) -->
      <div class="dropup position-static" style="">
        <a href="javascript:void(0)" class="text-dark text-decoration-none me-2" id="dropdownUser2"
          data-bs-toggle="dropdown" aria-expanded="false">
          <!-- <div> -->
          <span v-if="isLoading" class="placeholder-glow">
            <span class="placeholder col-12 p-3" height="45" width="45"></span>
          </span>
          <img v-else :src="userPayload.photo" alt="Profile" width="40" height="40" class="rounded-circle" />

        </a>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-light shadow-lg" aria-labelledby="dropdownUser2">

          <li><a class="dropdown-item" href="javascript:void(0)" @click="showModalLogout = true">Keluar Akun</a></li>
        </ul>
      </div>

      <div v-for="(menu, index) in menusBottom" :key="index">
        <!-- Ikon Menu -->
        <RouterLink :to="menu.menu_path" class="nav-link text-muted text-center">
          <div class="container-fluid p-0">
            <div class="row p-0">
              <div class="col-12 p-0">
                <i class="fs-3" :class="menu.menu_logo || 'bi-collection'"></i>
              </div>
              <div class="col-12 p-1">
                <div style="width: 80px !important;">
                  {{ menu.menu_name }}
                </div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

    </div>
  </div>


  <!-- Modal Logout -->
  <div v-if="showModalLogout" data-bs-backdrop="static" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content ">
        <div class="modal-header">
          <h5 class="modal-title">Konfirmasi Keluar Akun</h5>
          <button type="button" class=" btn-close" @click="showModalLogout = false"></button>
        </div>
        <div class="modal-body">
          <p>Apakah Anda yakin ingin keluar dari akun ini?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class=" btn-lg btn btn-secondary" @click="showModalLogout = false"><i
              class="bi bi-x-circle"></i> Batal</button>
          <button type="button" class=" btn-lg btn btn-danger" @click="logout" :disabled="isLoadingLogout">
            <span v-if="isLoadingLogout" class="spinner-border spinner-border-sm me-2" role="status"
              aria-hidden="true"></span>
            <span v-if="isLoadingLogout">sedang keluar...</span>
            <span v-else><i class="bi bi-box-arrow-right"></i>&nbsp;Ya,
              Keluar</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay untuk efek modal -->
  <div v-if="showModalLogout" class="modal-backdrop fade show"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import Cookies from 'js-cookie';
import { useRouter } from "vue-router";
const router = useRouter();
import type { MenuItem } from '@/interface/PointOfSales'
const isLoadingLogout = ref(false);
const isLoading = ref(true);
const showModalLogout = ref(false);

type GroupedMenu = Record<string, MenuItem[]>;
const menus = ref<GroupedMenu>({}); // Menyimpan menu dalam bentuk grup
const menusBottom = ref<MenuItem[]>([]);

const staticMenuData: GroupedMenu = {
  "Dashboard": [
    {
      menu_group: "Dashboard",
      menu_name: "Beranda",
      menu_path: "/dashboard",
      menu_logo: "bi-house",
      role: ["Konsumen", "Mitra"]
    }
  ],
  "Master": [
    {
      menu_group: "Master",
      menu_name: "Product",
      menu_path: "/product",
      menu_logo: "bi-box",
      role: ["Mitra"]
    }
  ],
  "Transaksi": [
    {
      menu_group: "Transaksi",
      menu_name: "Belanja",
      menu_path: "/belanja",
      menu_logo: "bi-bag-check",
      role: ["Konsumen"]
    }, {
      menu_group: "Riwayat",
      menu_name: "Riwayat Penjualan",
      menu_path: "/riwayat-transaksi",
      menu_logo: "bi-bar-chart-line",
      role: ["Mitra", "Konsumen"]
    }
  ]
};
menus.value = staticMenuData;

const filteredMenus = computed(() => {
  const result: Record<string, typeof staticMenuData[string]> = {};

  for (const [group, items] of Object.entries(menus.value)) {
    // Pakai 'userPayload.value.role' karena userPayload adalah ref
    const filteredItems = items.filter(menu =>
      Array.isArray(menu.role) && menu.role.includes(userPayload?.value?.role)
    );
    if (filteredItems.length > 0) {
      result[group] = filteredItems;
    }
  }

  return result;
});
menusBottom.value = [];
const logout = () => {
  isLoadingLogout.value = true;
  setTimeout(() => {
    Cookies.remove("login_session"); // Hapus token session
    showModalLogout.value = false; // Tutup modal
    router.push({ path: "/", query: { successLogout: 'true' } }); // Redirect ke halaman login
  }, 1000);
};

import * as bootstrap from 'bootstrap';

const userPayload = ref<any>(null);

// Fungsi untuk mengambil data user dari cookie
const loadUserPayload = () => {
  const encoded = Cookies.get('user');
  if (!encoded) return null;
  try {
    return JSON.parse(atob(encoded));
  } catch (err) {
    console.error('Gagal decode user_info:', err);
    return null;
  }
};
onMounted(async () => {
  userPayload.value = loadUserPayload();
  const dropdownTriggerEl = document.getElementById('dropdownUser1');
  if (dropdownTriggerEl) {
    new bootstrap.Dropdown(dropdownTriggerEl);
  }
  setInterval(() => {
    const newPayload = loadUserPayload();
    const oldPayload = JSON.stringify(userPayload.value);
    const newPayloadStr = JSON.stringify(newPayload);
    if (oldPayload !== newPayloadStr) {
      userPayload.value = newPayload;
    }
  }, 1000); // Cek setiap 5 detik

  setInterval(() => {
    isLoading.value = false;
  }, 1200)

});

// setInterval(() => {
//   const newPayload = loadUserPayload();
//   const oldPayload = JSON.stringify(userPayload.value);
//   const newPayloadStr = JSON.stringify(newPayload);
//   if (oldPayload !== newPayloadStr) {
//     userPayload.value = newPayload;
//   }
// }, 1000); // Cek setiap 5 detik

</script>

<style scoped>
.sidebar {
  width: 300px;
  /* Atur lebar sidebar */
  min-height: 100vh;
  /* Pastikan sidebar full tinggi */
}

.nav-link {
  padding: 10px;
  display: flex;
  align-items: center;
}

.nav-link i {
  min-width: 40px;
  text-align: center;
}

/* .nav-link:hover {
  background: #f8f9fa;
  border-radius: 5px;
} */

.nav-link-active {
  background: #ffc107;
  color: white !important;
  border-radius: 5px;
}
</style>
