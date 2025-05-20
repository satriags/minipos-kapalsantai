<template>
  <div class="container-fluid mt-4">
    <!-- Pencarian -->



    <!-- Tombol Tambah -->
    <div class="table-responsive w-100">
      <table style="border-radius:20px !important;" class=" table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th class=" text-center">No</th>
            <th>
              Invoice
            </th>
            <th>
              Tgl. Transaksi
            </th>
            <th>
              Konsumen
            </th>
            <th>
              Total Belanja
            </th>
            <th>
              Dibuat Pada
            </th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody class="table-group-divider" v-show="isLoadingTable" v-if="formTransaksi.length === 0">
          <tr>
            <td colspan="30" class="text-center">
              <i>belum ada data</i>
            </td>
          </tr>
        </tbody>
        <tbody class="table-group-divider" v-show="isLoadingTable">
          <tr v-for="(formTransaksi, index) in formTransaksi" :key="index">
            <td>{{ (index + 1) }}</td>
            <td>{{ formTransaksi.invoice }}</td>
            <td>{{ formatTanggalMix(formTransaksi?.createdAt) }}</td>
            <td>
              <img height="35" :src="formTransaksi?.user?.photo" alt="">
              {{ formTransaksi?.user?.name }}
            </td>
            <td>
              {{ formatRupiahMix(Number(formTransaksi.totalBayar)) }}
            </td>
            <td>{{ formatTanggalJamMix(formTransaksi.createdAt) }}</td>
            <td>
              <button class="btn btn-secondary me-2" @click="detailTransaksi(formTransaksi)">
                <i class="bi bi-search"></i> Detail
              </button>

            </td>
          </tr>
        </tbody>
        <tbody class="table-group-divider" v-show="!isLoadingTable">
          <tr v-for="n in 5" :key="n">
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>

            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
            <td>
              <div class="placeholder-glow">
                <span class="placeholder col-12 p-3" height="45" width="45"></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->



    <br>
    <br>
    <br>
    <!-- Modal Form (Tambah/Edit) -->
    <!-- Modal Konfirmasi Hapus -->
    <div data-bs-backdrop="static" class="modal fade" id="detailTransaksi" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Transaksi {{ orderInfo?.invoice }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="text-start">
                <strong>Invoice: {{ orderInfo?.invoice }}</strong>
              </div>
              <div class="text-start">
                <strong>Tanggal: {{ formatTanggalJamMix(orderInfo?.createdAt) }}</strong>
              </div>
              <div class="text-start">
                <strong>Pelanggan: {{ orderInfo?.user?.name }}</strong>
              </div>
            </div>
            <table class="mt-2 table table-lg table-bordered table-hover">
              <tr>
                <th>No</th>
                <th>Mitra</th>
                <th>Product</th>
                <th>Jumlah</th>
                <th>Harga Satuan</th>
                <th>Total Harga</th>
              </tr>
              <tr v-for="(item, index) in orderDetail" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item?.product?.creator.name }}</td>
                <td>{{ item?.product?.name }}</td>
                <td>{{ item?.totalQty }}</td>
                <td>{{ formatRupiahMix(Number(item?.price)) }}</td>
                <td>{{ formatRupiahMix(Number(item?.price) * Number(item?.totalQty)) }}</td>
              </tr>
              <tr>
                <th colspan="4" class="text-end">Total</th>
                <th>{{ formatRupiahMix(Number(orderInfo?.totalBayar)) }}</th>
              </tr>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class=" btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i>
              Tutup</button>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import Axios from "axios";
import { Modal } from "bootstrap";
import Cookies from 'js-cookie';
import type { Order, OrderItem } from '@/interface/PointOfSales';
import { toast } from "vue3-toastify"; import "vue3-toastify/dist/index.css";
import { useRoute } from 'vue-router';
const route = useRoute();

import { globalFormatter } from '@/mixins/formatter';
const { formatRupiahMix, formatTanggalJamMix, formatTanggalMix } = globalFormatter.methods;
const token = Cookies.get('login_session');


// Ambil tanggal sekarang
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth(); // Bulan dalam JavaScript mulai dari 0 (Januari = 0)


const firstDay = `${year}-${String(month + 1).padStart(2, "0")}-01`;
const lastDayDate = new Date(year, month + 1, 0).getDate(); // Ambil tanggal terakhir dalam bulan ini
const lastDay = `${year}-${String(month + 1).padStart(2, "0")}-${lastDayDate}`
const searchStartQuery = ref(firstDay);
const searchEndQuery = ref(lastDay);
const searchStatus = ref("");
// Set timezone to Asia/Jakarta

const searchQueryTransaksi = ref<string>(""); // ⬅️ Tambahkan state untuk pencarian
const sortBy = ref<string>("createdAt"); // Kolom default
const orderBy = ref<"asc" | "desc">("desc");

const currentPage = ref<number>(1);
const totalData = ref<number>(0);
const totalLimit = ref<number>(5);



const formTransaksi = ref<Order[]>([]);
const isLoadingTable = ref<boolean>(false);

// 🔄 **Fetch Data Transaksi**
const fetchTransaksi = async (page: number = 1) => {
  try {
    const response = await Axios.get(`${window.__APP_CONFIG__?.API_URL}/orders/transaction`, {
      params: {
        page,
        search: searchQueryTransaksi.value, // ⬅️ Kirim parameter search ke backend
        sortBy: sortBy.value,
        orderBy: orderBy.value,
        totalLimit: totalLimit.value,
        start_date: searchStartQuery.value,
        end_date: searchEndQuery.value,
        status: searchStatus.value
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    formTransaksi.value = response.data;
    totalData.value = response.data.total;
    // await fetchTransaksiTotal(page)

    isLoadingTable.value = true;

  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
};

const orderInfo = ref<Order | null>(null);
const orderDetail = ref<OrderItem | null>(null);
const detailTransaksi = (transaksi: Order) => {
  orderInfo.value = transaksi;
  orderDetail.value = transaksi?.OrderItem ?? null;
  const modal = new Modal(document.getElementById("detailTransaksi") as HTMLElement);
  modal.show();
};



// W


// const kode = route.query.kode; // hasilnya string | undefined

// watch(() => route.query.kode, (newKode) => {
//   console.log('Kode berubah:', newKode);
// });


// 🔄 **Ambil Data Saat Komponen Dimuat**
onMounted(() => {

  searchQueryTransaksi.value = Array.isArray(route.query.kode) ? route.query.kode[0] ?? "" : route.query.kode ?? "";
  fetchTransaksi(currentPage.value);

});
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
