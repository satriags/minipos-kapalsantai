<template>
  <div class="container my-4">

    <div class="row">
      <!-- Daftar Produk -->
      <div class="col-md-7">
        <h4>Pilih Produk</h4>
        <input type="text" class="form-control mb-3" placeholder="Cari produk..." v-model="filterProduk.search"
          @input="fetchCardProduk" />
        <div class="row row-cols-1 row-cols-md-3 g-3">
          <!-- Contoh Produk -->
          <div v-for="(produk, index) in cardProduk" :key="index" class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">{{ produk.name }}</h5>
                <p class="card-text text-muted">{{ ((produk.desc)) }}</p>
                <p class="card-text">
                  Harga: {{ formatRupiahMix(Number(produk.price)) }}
                  <br>
                  Stok: {{ (produk.stock) }}
                </p>
                <button @click="addToCard(produk)" class="btn btn-primary  w-100"><i class="bi bi-cart-plus"></i>
                  Tambah</button>
              </div>
            </div>
          </div>

          <!-- Produk lain di-loop di sini -->
        </div>
      </div>

      <!-- Keranjang Belanja -->
      <div class="col-md-5">
        <h4>Keranjang</h4>
        <table class="table table-bordered table-striped table-hover table-primary">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Qty</th>
              <th>Harga</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="keranjangProduk.length == 0">
              <td colspan="5" class="text-center"><i>keranjang kosong</i></td>
            </tr>
            <!-- Loop item keranjang -->
            <tr v-for="(item, index) in keranjangProduk" :key="index">
              <td>{{ item.nameProduct }}</td>
              <td>
                <input type="number" min="1" :max="item.stockMax" v-model.number="item.totalQty"
                  class="form-control form-control-lg" />
                <span v-if="Number(item.totalQty) > Number(item.stockMax)" class="text-danger small">
                  Melebihi stok! Maks: {{ Number(item.stockMax) }}
                </span>
              </td>
              <td>{{ formatRupiahMix(Number(item.price)) }}</td>
              <td>{{ formatRupiahMix(Number(item.price) * Number(item.totalQty)) }}</td>
              <td><button class="btn btn-danger " @click="removeCart(index)"><i class="bi bi-trash"></i></button></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" class="text-end">Total</th>
              <th>{{ formatRupiahMix(totalBayar) }}</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
        <button @click="bayarTransaksi" class="btn btn-success w-100 mt-3"><i class="bi bi-cash"></i> Checkout</button>
      </div>
    </div>

  </div>

</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import Cookies from 'js-cookie';
import Axios from 'axios';
import type { KeranjangProduk, Produk } from "@/interface/PointOfSales";
import { toast } from "vue3-toastify"; import "vue3-toastify/dist/index.css";

import { globalFormatter } from '@/mixins/formatter';
import router from "@/router";
const { formatRupiahMix } = globalFormatter.methods;

const token = Cookies.get('login_session');
const filterProduk = ref({
  search: ''
});
const cardProduk = ref<Produk[]>([]);
const keranjangProduk = ref<KeranjangProduk[]>([]);
const totalBayar = ref(0);
// const loadUserPayload = () => {
//   const encoded = Cookies.get('user');
//   if (!encoded) return null;
//   return JSON.parse(atob(encoded));
// };
const removeCart = (index: number) => {
  keranjangProduk.value.splice(index, 1);
}

const bayarTransaksi = async () => {
  if (keranjangProduk.value.length === 0) {
    toast("Keranjang belanja kosong!", {
      hideProgressBar: true,
      type: "error",
    });
    return;
  }

  const data = {
    keranjang: keranjangProduk.value,
    totalBayar: totalBayar.value,
  };

  try {
    await Axios.post(`${window.__APP_CONFIG__?.API_URL}/orders/create`, data, {
      headers: {
        Authorization: token,
      },
    });

    // toast(`Transaksi berhasil! Invoice: ${response.data.invoice}`, {
    //   type: "success",
    // });
    router.push('/riwayat-transaksi')
    fetchCardProduk();

    // Reset keranjang & total
    keranjangProduk.value = [];
    totalBayar.value = 0;
  } catch (error) {
    console.error("Transaksi gagal:", error);
    toast("Transaksi gagal. Silakan coba lagi.", {
      type: "error",
    });
  }
};
watch(keranjangProduk, (newVal) => {
  for (const item of newVal) {
    if (Number(item.totalQty) > Number(item.stockMax)) {
      item.totalQty = Number(item.stockMax);
    }
  }
  totalBayar.value = newVal.reduce((total, item) => {
    return total + (Number(item.price) * Number(item.totalQty));
  }, 0);
}, { deep: true });

const addToCard = (produk: Produk) => {
  const existingItem = keranjangProduk.value.find(item => item.idProduct === produk.id);
  if (existingItem && typeof existingItem.totalQty === 'number') {
    if (Number(existingItem.totalQty) < Number(produk.stock)) {
      existingItem.totalQty = Number(existingItem.totalQty) + 1;
    } else {

      toast(`Stok maksimum untuk produk "${produk.name}" telah tercapai.`, {
        hideProgressBar: true,
        type: "error",
      });
    }
  } else {
    if (Number(produk.stock) > 0) {
      keranjangProduk.value.push({
        idProduct: produk.id,
        nameProduct: produk.name,
        price: produk.price,
        stockMax: produk.stock ?? 0,
        totalQty: 1,
        descProduct: produk.desc,
      });
    } else {
      toast(`Produk "${produk.name}" sedang kosong.`, {
        hideProgressBar: true,
        type: "error",
      });

    }
  }
}

const fetchCardProduk = async () => {
  try {
    const response = await Axios.get(`${window.__APP_CONFIG__?.API_URL}/products/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: filterProduk.value.search,
      }
    });
    cardProduk.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data supplier:", error);
  }
}
onMounted(() => {
  fetchCardProduk();
});
</script>
