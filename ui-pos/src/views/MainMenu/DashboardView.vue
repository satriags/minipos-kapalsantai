<template>
  <div class="container-fluid mt-2">
    <!-- CARD UTAMA -->
    <div class="row">
      <div class="col-6 col-md-3 mb-3">
        <RouterLink to="#" class="text-decoration-none card border-primary border-2 p-2">
          <h5 class="text-muted">Pelanggan
            <i class="bg-primary p-2 rounded-circle text-white float-end bi bi-person"></i>
          </h5>
          <h3>{{ cardData.customer }}</h3>
        </RouterLink>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <RouterLink to="#" class="text-decoration-none card border-primary border-2 p-2">
          <h5 class="text-muted">Produk
            <i class="bg-primary p-2 rounded-circle text-white float-end bi bi-capsule"></i>
          </h5>
          <h3>{{ cardData.produk }}</h3>
        </RouterLink>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <RouterLink to="#" class="text-decoration-none card border-primary border-2 p-2">
          <h5 class="text-muted">Transaksi Hari Ini
            <i class="bg-primary p-2 rounded-circle text-white float-end bi bi-bag"></i>
          </h5>
          <h3>{{ formatRupiahMix(cardData.total) }}</h3>
        </RouterLink>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <RouterLink to="#" class="text-decoration-none card border-primary border-2 p-2">
          <h5 class="text-muted">Total Hari Ini
            <i class="bg-primary p-2 rounded-circle text-white float-end bi bi-cash"></i>
          </h5>
          <h3>{{ cardData.transaksi }}</h3>
        </RouterLink>
      </div>

      <!-- BAGIAN GRAFIK DAN TABEL -->
      <div class="col-lg-12">
        <div class="card border-primary border-2 mt-4 p-2">
          <select class="form-control bg-primary text-white" v-model="selectedRange">
            <option value="7_days">7 Hari Terakhir</option>
            <option value="1_month">1 Bulan Terakhir</option>
            <option value="1_year">1 Tahun Terakhir</option>
            <option value="custom">Custom Range</option>
          </select>
          <div v-if="selectedRange === 'custom'" class="d-flex mt-1">
            <input type="date" v-model="customRange.start" class="form-control bg-primary text-white me-2" />
            <input type="date" v-model="customRange.end" class="form-control bg-primary text-white" />
          </div>
          <VueApexCharts type="bar" height="350" :options="chartOptions" :series="series" />
        </div>
      </div>


    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

import { globalFormatter } from '@/mixins/formatter';
const { formatRupiahMix } = globalFormatter.methods;
// Tambahkan ini di <script setup>


const selectedRange = ref('7_days')
const customRange = ref<{ start: string, end: string }>({ start: '', end: '' })

const series = ref([]);
const chartOptions = ref({
  chart: { height: 350, type: 'line', stacked: false },
  colors: ['#0266b4', '#28a745'],
  stroke: { width: [0, 4] },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
    style: { colors: ['#000'] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter: function (val: number, opts: any) {
      const isLineSeries = opts.seriesIndex === 1;
      return isLineSeries ? `Rp ${val.toLocaleString('id-ID')}` : val;
    }
  },
  xaxis: { categories: [] },
  yaxis: [
    { title: { text: 'Jumlah Transaksi' } },
    {
      opposite: true,
      title: { text: 'Total (Rp)' },
      labels: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`
      }
    }
  ],
  tooltip: {
    y: [
      { formatter: (val: number) => `${val} transaksi` },
      { formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}` }
    ]
  }
});


const cardData = ref({
  customer: 0,
  produk: 0,
  transaksi: 0,
  total: 0
})

onMounted(async () => {

})
</script>

<style scoped>
.card h5 {
  font-weight: 500;
}

.badge {
  font-size: 0.9rem;
  padding: 4px 8px;
}
</style>
