import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import LoginView from '@/views/Auth/LoginView.vue'
import DashboardView from '@/views/MainMenu/DashboardView.vue'
import AuthCallback from '@/components/auth/AuthCallback.vue'
import ProfileView from '@/views/MainMenu/ProfileView.vue'
import Axios from 'axios'
import ProductView from '@/views/Master/ProductView.vue'
import BelanjaView from '@/views/MainMenu/BelanjaView.vue'
import KasirTransaksiView from '@/views/MainMenu/KasirTransaksiView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: LoginView,
      meta: { layout: 'AuthLayout' },
    },
    {
      name: 'Overview',
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, layout: 'MainView' }, // Tandai route yang perlu login
    },
    {
      name: 'Profile',
      path: '/profile',
      component: ProfileView,
      meta: { requiresAuth: true, layout: 'MainView' }, // Tandai route yang perlu login
    },
    {
      name: 'Belanja',
      path: '/belanja',
      component: BelanjaView,
      meta: { requiresAuth: true, layout: 'MainView' }, // Tandai route yang perlu login
    },
    {
      name: 'Riwayat Transaksi',
      path: '/riwayat-transaksi',
      component: KasirTransaksiView,
      meta: { requiresAuth: true, layout: 'MainView' }, // Tandai route yang perlu login
    },
    {
      name: 'Loading',
      path: '/auth/callback',
      component: AuthCallback,
      meta: { requiresAuth: false, layout: 'MainView' }, // Tandai route yang perlu login
    },
    {
      name: 'Loading Mitra',
      path: '/auth/callback-mitra',
      component: AuthCallback,
      meta: { requiresAuth: false, layout: 'MainView' }, // Tandai route yang perlu login
    },
    {
      name: 'Product',
      path: '/product',
      component: ProductView,
      meta: { requiresAuth: true, layout: 'MainView' }, // Tandai route yang perlu login
    },
    // LAPORAN
    {
      name: '404',
      path: '/404',
      component: () => {
        alert('404')
      },
      meta: { layout: 'Error' }, // Bisa buat layout khusus kalau mau
    },
  ],
  linkActiveClass: 'nav-link-active',
})

router.beforeEach(async (to, from, next) => {
  const token = Cookies.get('login_session')

  // Kalau user udah login dan buka halaman login ('/')
  if (to.path === '/' && token) {
    return next('/dashboard')
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      // Belum login → balikin ke halaman login
      return next({ path: '/', query: { needLogin: 'true' } })
    }
    try {
      const response = await Axios.post(`${window.__APP_CONFIG__?.API_URL}/auth/payload`, {
        token,
      })
      if (response.data.valid) {
        // Cookies.remove('user')

        Cookies.set('user', btoa(JSON.stringify(response.data.user)))

        return next() // agar Vue tahu ada perubahan
        // return next()
        // setTimeout(() => location.reload(), 10) // Paksa Vue reload dan baca ulang cookie
      } else {
        // Token tidak valid → hapus cookie & redirect ke login
        Cookies.remove('login_session')
        return next({ path: '/', query: { sessionExpired: 'true' } })
      }
    } catch (err) {
      console.log(err)
      // Token gagal diverifikasi (expired, invalid, dll)
      Cookies.remove('login_session')
      return next({ path: '/', query: { responseFailed: 'true' } })
    }
  }

  // Kalau tidak butuh login → lanjut saja
  return next()
})

export default router
