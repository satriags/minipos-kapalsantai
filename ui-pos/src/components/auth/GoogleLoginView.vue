<template>

  <button @click="handleGoogleLogin" class="w-100 shadow-lg btn btn-danger ">
    <span><i class="bi bi-google"></i> Masuk/Daftar {{ props.role == 'Mitra' ? 'sebagai Mitra' : '' }} dengan
      Google
    </span>
  </button>

</template>

<script lang="ts" setup>

const clientId = window.__APP_CONFIG__?.CLIENT_ID;
const scope = 'openid email profile';
const props = defineProps<{
  role: string
}>()
function handleGoogleLogin() {
  const redirectUri = window.__APP_CONFIG__?.API_URL + (props.role == 'Mitra' ? '/auth/callback-mitra' : '/auth/callback');  // sesuaikan dengan url kamu
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `access_type=offline&prompt=consent`;

  window.location.href = googleAuthUrl;
}

</script>
