
export const globalFormatter = {
  methods: {

    formatTanggalJamNowMix() {
      const now = new Date()

      const YYYY = now.getFullYear()
      const MM = String(now.getMonth() + 1).padStart(2, '0') // bulan 0-based
      const DD = String(now.getDate()).padStart(2, '0')
      const HH = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')

      return `${YYYY}${MM}${DD}${HH}${mm}${ss}`
    },
    getCreatedByMix(createdBy: string): string {
      if (!createdBy) return '-' // Jika undefined atau null, return "-"

      // Jika string diawali dengan `{` dan diakhiri dengan `}`, kemungkinan besar itu JSON
      const isJson = createdBy.trim().startsWith('{') && createdBy.trim().endsWith('}')

      if (!isJson) return createdBy // Jika bukan JSON, tampilkan apa adanya

      try {
        const parsed = JSON.parse(createdBy)
        return parsed?.nama ?? '-' // Ambil `nama` jika ada, jika tidak, return "-"
      } catch (error) {
        console.error('Unexpected error parsing created_by:', error)
        return createdBy // Jika parsing gagal, tampilkan teks aslinya
      }
    },
    formatNowTanggalMix() {
      const date = new Date()
      return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date)
    },
    formatTanggalJamMix(tanggal: string | null) {
      if (!tanggal) return '-'
      return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: "2-digit",
        hour12: false,
      }).format(new Date(tanggal))
    },
    formatTanggalIndoMix(tanggal: string | null) {
      if (!tanggal) return '-'
      return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(tanggal))
    },
    formatTanggalMix(tanggal: string | null) {
      if (!tanggal) return '-'
      return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: "2-digit",
        hour12: false,
      }).format(new Date(tanggal))
    },
    getFirstDateToday(): string {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() // Bulan dalam JavaScript mulai dari 0 (Januari = 0)

      return `${year}-${String(month + 1).padStart(2, '0')}-01`
    },
    getLastDateToday(): string {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() // Bulan dalam JavaScript mulai dari 0 (Januari = 0)
      const lastDay = new Date(year, month + 1, 0).getDate() // Ambil tanggal terakhir dalam bulan ini

      return `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`
    },
    formatRupiahMix(amount: number): string {
      if (isNaN(amount)) return '-'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    },
  },
}
