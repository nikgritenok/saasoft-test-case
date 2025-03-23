<script setup lang="ts">
import { useAccountsStore } from '@/stores/useAccountsStore'
import { ref } from 'vue'
const store = useAccountsStore()

const isDarkMode = ref(false)

const addNewAccount = () => {
  store.addNewAccount()
}

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark')
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <header
    class="flex justify-content-between align-items-center p-3 mb-3 border-bottom-1 border-500"
  >
    <div class="container flex justify-content-between align-items-center gap-3 ml-3">
      <span class="font-semibold"> Учётные записи </span>
      <app-button label="Добавить" icon="pi pi-plus" @click="addNewAccount" />
    </div>
    <app-button icon="pi pi-moon" @click="toggleDarkMode" v-if="!isDarkMode" />
    <app-button icon="pi pi-sun" @click="toggleDarkMode" v-else />
  </header>
</template>
