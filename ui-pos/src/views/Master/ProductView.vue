<template>
  <div class="container mt-4">
    <!-- Pencarian -->
    <div class="mb-3 input-group">
      <span class="input-group-text" id="basic-addon1"><i class="bi bi-search"></i></span>
      <input type="text" class="form-control" v-model="searchQuery" placeholder="Cari Produk..."
        @input="fetchProduk(1)">

      <span class="input-group-text" id="basic-addon1"><i class="bi bi-person-check"></i></span>

    </div>

    <div class="float-start">
      <button class=" btn btn-primary mb-3" @click="openModal(null)"><i class="bi bi-plus-lg"></i>
        Tambah</button>
      <br>
      Total : <span>{{ totalData }}</span>
    </div>
    <div class="float-end">

      <select @change="changeLimitData" class=" form-select bg-primary text-white">
        <option value="5">5 Data</option>
        <option value="10">10 Data</option>
        <option value="15">15 Data</option>
        <option value="20">20 Data</option>
        <option value="50">50 Data</option>
        <option value="100">100 Data</option>
      </select>

    </div>
    <!-- Tombol Tambah -->
    <div class="table-responsive w-100">
      <table style="border-radius:20px !important;" class=" table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th class=" text-center">No</th>
            <th @click="setSort('name')" style="cursor: pointer;">
              Nama <span v-html="getSortIcon('name')"></span>
            </th>
            <th @click="setSort('price')" style="cursor: pointer;">
              Harga <span v-html="getSortIcon('price')"></span>
            </th>
            <th @click="setSort('stock')" style="cursor: pointer;">
              Stok <span v-html="getSortIcon('stock')"></span>
            </th>
            <th @click="setSort('keterangan')" style="cursor: pointer;">
              Keterangan <span v-html="getSortIcon('keterangan')"></span>
            </th>
            <th @click="setSort('createdBy')" style="cursor: pointer;">
              Dibuat Oleh <span v-html="getSortIcon('createdBy')"></span>
            </th>
            <th @click="setSort('createdAt')" style="cursor: pointer;">
              Dibuat Pada <span v-html="getSortIcon('createdAt')"></span>
            </th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody class="table-group-divider" v-show="isLoadingTable" v-if="produkList.length === 0">
          <tr>
            <td colspan="30" class="text-center">
              <i>belum ada data</i>
            </td>
          </tr>
        </tbody>
        <tbody class="table-group-divider" v-show="isLoadingTable">
          <tr v-for="(produk, index) in produkList" :key="index">
            <td>{{ (fromNomor + index) }}</td>
            <td>{{ produk.name }}</td>
            <td>{{ formatRupiahMix(produk.price) }}</td>
            <td>{{ produk.stock }}</td>
            <td>{{ produk.desc }}</td>
            <td><img :src="produk.creator?.photo" height="35"> {{ produk.creator?.name }}</td>
            <td>{{ formatTanggalJamMix(produk?.createdAt) }}</td>
            <td width="150">
              <div class="d-grid gap-2">
                <button class=" btn btn-warning  me-2" @click="openModal(produk)"><i class="bi bi-pen"></i>
                  Ubah</button>
                <button class=" btn btn-danger " @click="openDeleteModal(produk.id as number)"><i
                    class="bi bi-trash"></i> Hapus</button>
              </div>
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
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->

    <nav>
      <ul class="pagination ">
        <li class="page-item " :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="fetchProduk(currentPage - 1)">Previous</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <button class="page-link" @click="fetchProduk(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="fetchProduk(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>


    <br>
    <br>
    <br>
    <!-- Modal Form (Tambah/Edit) -->
    <div data-bs-backdrop="static" class="modal fade" id="produkModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? "Edit Produk" : "Tambah Produk" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label for="name" class="form-label">Nama Produk</label>
                    <input onfocus type="text" placeholder="isi disini ..." class="form-control" v-model="form.name"
                      required :class="{ 'is-invalid': errors.name }" />

                    <div v-if="errors.name" class="form-text text-danger">
                      <div v-for="(error, index) in errors.name" :key="index">
                        <div>
                          *{{ error }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label for="price" class="form-label">Harga Produk</label>
                    <input onfocus type="number" placeholder="isi disini ..." class="form-control"
                      v-model.number="form.price" required :class="{ 'is-invalid': errors.price }" />
                    <div v-if="errors.price" class="form-text text-danger">
                      <div v-for="(error, index) in errors.price" :key="index">
                        <div>
                          *{{ error }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label for="stock" class="form-label">Stok Produk</label>
                    <input onfocus type="number" placeholder="isi disini ..." class="form-control"
                      v-model.number="form.stock" required :class="{ 'is-invalid': errors.stock }" />
                    <div v-if="errors.stock" class="form-text text-danger">
                      <div v-for="(error, index) in errors.stock" :key="index">
                        <div>
                          *{{ error }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>

            </div>



            <div class="mb-3">
              <label for="desc" class="form-label">Keterangan</label>
              <textarea v-model="form.desc" class="form-control" placeholder="isi disini ..." required
                :class="{ 'is-invalid': errors.desc }"></textarea>
              <div v-if="errors.desc" class="form-text text-danger">
                <div v-for="(error, index) in errors.desc" :key="index">
                  <div>
                    *{{ error }}
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class=" btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i>
              Batal</button>
            <button type="button" class=" btn btn-primary" @click="saveProduk" :disabled="isLoading">
              <i v-if="!isLoading" class="bi bi-save"></i>
              <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
              {{ isLoading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div data-bs-backdrop="static" class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Konfirmasi Hapus</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class=" btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i>
              Batal</button>
            <button type="button" class=" btn btn-danger" @click="deleteProduk" :disabled="isLoadingDelete">
              <i v-if="!isLoadingDelete" class="bi bi-trash"></i>
              <span v-if="isLoadingDelete" class="spinner-border spinner-border-sm"></span>
              {{ isLoadingDelete ? "Menghapus..." : "Hapus" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";
import Axios from "axios";
import { Tooltip, Modal } from "bootstrap";
import Cookies from 'js-cookie';
import type { Produk } from '@/interface/PointOfSales'
// 🛠️ **Tipe Data**
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import { globalFormatter } from '@/mixins/formatter';
const { formatTanggalJamMix, formatRupiahMix } = globalFormatter.methods;
const errors = ref<Record<string, string[]>>({});

const searchQuery = ref(""); // ⬅️ Tambahkan state untuk pencarian
const sortBy = ref<string>("createdAt"); // Kolom default
const orderBy = ref<"asc" | "desc">("desc");

const produkList = ref<Produk[]>([]);
const currentPage = ref<number>(1);
const fromNomor = ref<number>(0);
const totalPages = ref<number>(1);
const totalData = ref<number>(0);
const totalLimit = ref<number>(5);

const isLoading = ref<boolean>(false);
const isLoadingDelete = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const modalInstance = ref<Modal | null>(null);
const deleteModalInstance = ref<Modal | null>(null);
const deleteId = ref<number | null>(null);
const token = Cookies.get('login_session');


const form = ref<Produk>({
  id: null,
  name: "",
  price: null,
  stock: null,
  desc: "",
});



const changeLimitData = async (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  const totalLimitChange = parseInt(target?.value ?? "5", 10); // Pastikan nilai default adalah 5 jika null
  totalLimit.value = totalLimitChange > 0 ? totalLimitChange : 5; // Hindari nilai negatif atau nol
  currentPage.value = 1; // Reset ke halaman pertama
  await fetchProduk(currentPage.value);
};
const getSortIcon = computed(() => (column: string) => {
  if (sortBy.value !== column) return "<i class=\"bi bi-filter\"></i>"; // Jika tidak sedang diurutkan, tidak ada ikon
  return orderBy.value === "asc" ? '<i class="bi bi-sort-up"></i>' : '<i class="bi bi-sort-down"></i>';
});
const setSort = (column: string) => {
  if (sortBy.value === column) {
    orderBy.value = orderBy.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    orderBy.value = "asc";
  }
  fetchProduk(currentPage.value); // Ambil ulang data
};
const isLoadingTable = ref<boolean>(false);

// 🔄 **Fetch Data Produk**
const fetchProduk = async (page: number = 1) => {
  try {
    const response = await Axios.get(`${window.__APP_CONFIG__?.API_URL}/products`, {
      params: {
        page,
        search: searchQuery.value, // ⬅️ Kirim parameter search ke backend
        sortBy: sortBy.value,
        orderBy: orderBy.value,
        totalLimit: totalLimit.value,

      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    produkList.value = response.data.data;
    currentPage.value = response.data.current_page;
    totalPages.value = response.data.last_page;
    fromNomor.value = response.data.from;
    totalData.value = response.data.total;
    isLoadingTable.value = true;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
};

// 🔄 **Buka Modal Form**
const openModal = (produk: Produk | null) => {
  errors.value = {};

  if (produk) {
    form.value = { ...produk };
    isEdit.value = true;
  } else {
    form.value = {
      id: null,
      name: "",
      price: null,
      stock: null,
      desc: "",
    };
    isEdit.value = false;
  }
  const modalElement = document.getElementById("produkModal") as HTMLElement;
  modalInstance.value = new Modal(modalElement);
  modalInstance.value.show();
};

// 🔄 **Simpan (Tambah/Edit)**
const saveProduk = async () => {
  isLoading.value = true;
  let response;
  errors.value = {}; // clear dulu

  try {
    if (isEdit.value && form.value.id !== null) {
      const cleanPayload = {
        name: form.value.name,
        price: form.value.price,
        stock: form.value.stock,
        desc: form.value.desc,
      };

      response = await Axios.patch(`${window.__APP_CONFIG__?.API_URL}/products/${form.value.id}`, cleanPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await Axios.post(`${window.__APP_CONFIG__?.API_URL}/products`, form.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    fetchProduk(currentPage.value);
    modalInstance.value?.hide();
    console.log("Response:", response);

    // ✅ Toast respon API success
    if (response?.status === 201) {
      toast(response.data?.message || "Berhasil menyimpan data!", {
        hideProgressBar: true,
        type: "success",
      });
    } else if (response?.status === 200) {
      toast(response.data?.message || "Berhasil menyimpan perubahan data!", {
        hideProgressBar: true,
        type: "success",
      });
    } else {
      toast("Berhasil, tapi format respon tidak dikenali", {
        hideProgressBar: true,
        type: "default",
      });
    }
  } catch (error) {

    if (Axios.isAxiosError(error) && error.response?.data?.message) {

      errors.value = error.response.data.message; // langsung assign object error

    } else {
      toast('Terjadi masalah internal server', {
        hideProgressBar: true,
        type: "error",
      });
      console.error("Unexpected error:", error);
    }
  } finally {
    isLoading.value = false;
  }
};

// 🔄 **Buka Modal Konfirmasi Delete**
const openDeleteModal = (id: number) => {
  deleteId.value = id;
  const deleteModalElement = document.getElementById("deleteModal") as HTMLElement;
  deleteModalInstance.value = new Modal(deleteModalElement);
  deleteModalInstance.value.show();
};

// ❌ **Hapus Produk**
const deleteProduk = async () => {
  if (deleteId.value === null) return;
  isLoadingDelete.value = true;
  let response;

  try {
    response = await Axios.delete(`${window.__APP_CONFIG__?.API_URL}/products/${deleteId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchProduk(currentPage.value);
    deleteModalInstance.value?.hide();
    // ✅ Toast respon API success
    if (response?.status === 200 || response?.status === 201) {
      toast(response.data?.message, {
        hideProgressBar: true,
        type: "success",
      });
    } else {
      toast("Berhasil, tapi format respon tidak dikenali", {
        hideProgressBar: true,
        type: "default",
      });
    }
  } catch (error) {
    console.error("Gagal menghapus data:", error);
  } finally {
    isLoadingDelete.value = false;
    deleteId.value = null;
  }
};

// 🔄 **Ambil Data Saat Komponen Dimuat**
onMounted(() => {
  fetchProduk(currentPage.value);
  nextTick(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach((el) => {
      new Tooltip(el, {
        html: true,
        animation: true
      })
    })
  })
});
</script>
