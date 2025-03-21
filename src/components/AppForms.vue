<script setup lang="ts">
import { useAccountsStore } from '@/stores/useAccountsStore'
import type { Account } from '@/stores/useAccountsStore'

const store = useAccountsStore()

const handleUpdate = (account: Account, field: keyof Account, value: Account[keyof Account]) => {
  store.updateAccount(account.id, { [field]: value })
}

const handleDelete = (id: number) => {
  store.deleteAccount(id)
}
</script>

<template>
  <div class="forms-container">
    <div class="form-item" v-for="account in store.accounts" :key="account.id">
      <div class="flex flex-column gap-2">
        <label>Метки</label>
        <app-input
          :value="account.tag"
          @update:modelValue="(value: Account['tag']) => handleUpdate(account, 'tag', value)"
          label="Метки"
        />
      </div>
      <div class="flex flex-column gap-2">
        <label>Тип записи</label>
        <app-select
          v-model="account.type"
          @update:modelValue="(value: Account['type']) => handleUpdate(account, 'type', value)"
          :options="['LDAP', 'LOCAL']"
        />
      </div>
      <div class="flex flex-column gap-2">
        <label>Логин</label>
        <app-input
          :value="account.login"
          @update:modelValue="(value: Account['login']) => handleUpdate(account, 'login', value)"
          label="Логин"
        />
      </div>
      <div class="flex flex-column gap-2">
        <label>Пароль</label>
        <app-password
          v-model="account.password"
          @update:modelValue="
            (value: Account['password']) => handleUpdate(account, 'password', value)
          "
          label="Пароль"
          toggleMask
        />
      </div>
      <div class="delete-icon flex align-items-end">
        <i class="pi pi-trash" @click="handleDelete(account.id)"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forms-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.form-item {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
}

.delete-icon i {
  font-size: 2.2rem;
  cursor: pointer;
  margin-bottom: 0.1rem;
}
</style>
