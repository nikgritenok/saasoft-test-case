<script setup lang="ts">
import { useAccountsStore } from '@/stores/useAccountsStore'

const store = useAccountsStore()

const addNewAccount = () => {
  store.addNewAccount()
}
</script>

<template>
  <header>
    <div class="container">
      <span> Учётные записи </span>
      <app-button label="Добавить" icon="pi pi-plus" @click="addNewAccount" />
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}

span {
  font-weight: 600;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
}
</style>
