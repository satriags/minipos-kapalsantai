import type { AppConfig } from '@/interface/AppConfig'

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig
    BASE_PATH?: '/' // atau '/' jika di root
  }
}
