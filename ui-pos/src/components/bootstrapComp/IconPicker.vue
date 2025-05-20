<script setup lang="ts">
import { ref, computed } from "vue";
import { bootstrapIcons } from "./icons.ts"; // Import daftar icon Bootstrap

const emit = defineEmits(["select-icon"]);
const searchQuery = ref(""); // Untuk filter ikon berdasarkan input

// Filter ikon berdasarkan pencarian
const filteredIcons = computed(() =>
  bootstrapIcons.filter((icon) =>
    icon.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Fungsi memilih ikon
const selectIcon = (icon: string) => {
  emit("select-icon", icon);
};
</script>

<template>
  <div class="icon-picker">
    <input type="text" v-model="searchQuery" placeholder="Cari ikon..." class="form-control mb-2" />

    <div class="icon-grid">
      <div v-for="icon in filteredIcons" :key="icon" class="icon-item" @click="selectIcon(icon)">
        <i :alt="icon" :class="['bi', icon]"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.icon-item:hover {
  background-color: #f0f0f0;
}

i {
  font-size: 24px;
}
</style>
