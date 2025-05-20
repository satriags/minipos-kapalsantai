export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string | null
  photo: string
  role: string
  emailVerified: string
  familyName: string | null
  givenName: string | null
  locale: string | null
  sub: string | null
  googleId: string | null
}
export interface Menu {
  id: number
  group: string
  name: string
  urut: string
  logo: string // Logo sekarang hanya string (ikon bootstrap)
  path: string
  created_at: string
  created_by: string
}
export interface UserMenu {
  menu_id: number
  menu_name: string
  menu_path: string
}
export interface MenuItem {
  menu_group: string
  menu_name: string
  menu_path: string
  menu_logo?: string | null // Bisa berupa URL atau string icon bootstrap
  role: Array<string>
}

export interface Produk {
  id: number | null
  name: string | null
  price: number | null
  stock: number | null
  desc: string | null
}
export interface KeranjangProduk {
  idProduct: number | null
  nameProduct: string | null
  price: number | null
  stockMax: number
  totalQty: number | null
  descProduct: string | null
}

export interface Order {
  id: number
  userId: User['id']
  invoice: string
  totalBayar: number
}

export interface OrderItem {
  id: number
  orderId: Order['id']
  productId: Produk['id']
  nameProduct: string
  descProduct: string
  price: number
  stockMax: number
  totalQty: number
  
}
