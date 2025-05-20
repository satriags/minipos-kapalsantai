<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">
      <!-- Sidebar -->
      <transition name="sidebar">
        <div v-if="!isSidebarHidden" class="sidebar col-auto transition m-0 p-0">
          <SidebarView style="z-index: 1000;" />
        </div>
      </transition>
      <!-- Konten Utama -->
      <div :class="['overflow-auto d-flex flex-column p-0 vh-100', isSidebarHidden ? 'col' : 'col']">
        <!-- Tombol Toggle Sidebar -->
        <div class="row">
          <div class="col-3">
            <button @click="toggleSidebar" class="d-sm-none d-md-block btn btn-primary mt-3 ms-3">
              <i class="bi" :class="isSidebarHidden ?
                'bi-chevron-double-right' :
                'bi-chevron-double-left'"></i>
            </button>
          </div>
          <div class="col-6 text-center">
            <h1 class='text-center mt-1'>{{ menuName }}</h1>
          </div>
        </div>
        <!-- Main Content -->
        <main class="p-0 m-0 vh-100">
          <RouterView />
          <br><br><br>
          <br><br><br>
          <!-- Footer -->
          <footer class="w-100 py-2 position-fixed bottom-0 d-none d-md-block text-white text-center"
            style="background-color: #0266b4; z-index: 3;">
            <div class="container-fluid">
              <div class="row">
                <div class="col-10 ">
                  <div class="float-start">

                    <a target="_blank" :href="`#`" class="text-decoration-none text-white">
                      Created By Satria Giri Syawalludin
                    </a>
                  </div>
                </div>
                <div class="col-2"></div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import SidebarView from '@/components/SidebarView.vue';

const isSidebarHidden = ref(false);

const toggleSidebar = () => {
  isSidebarHidden.value = !isSidebarHidden.value;
};

const menuName = ref('');
const route = useRoute();

onMounted(() => {
  // Set the initial menu name based on the current route
  menuName.value = String(route.meta?.title || route.name || '');
});

// Watch for changes in the route and update the menu name
watch(() => route.name, () => {
  menuName.value = String(route.meta?.title || route.name || '');
});

</script>

<style scoped>
.sidebar-enter-active {
  animation: fadeInLeft 0.5s;
}

.sidebar-leave-active {
  animation: fadeOutLeft 0.5s;
}
</style>
