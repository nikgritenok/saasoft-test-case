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

const isValidTag = (tag: string | undefined) => {
  return !tag || tag.length <= 50
}

const validateInputTag = (account: Account) => {
  if (account.tag && account.tag.length > 50) {
    account.tag = account.tag.slice(0, 50)
  }
}

const isValidLogin = (login: string | undefined) => {
  return login && login.length <= 100
}

const validateInputLogin = (account: Account) => {
  if (account.login && account.login.length > 100) {
    account.login = account.login.slice(0, 100)
  }
}

const isValidPassword = (password: string | null) => {
  return password && password.length <= 100
}

const validateInputPassword = (account: Account) => {
  if (account.password && account.password.length > 100) {
    account.password = account.password.slice(0, 100)
  }
}

const validateAccount = (account: Account) => {
  const isValid = isValidLogin(account.login) && isValidPassword(account.password)
  if (isValid) {
    store.updateAccount(account.id, account)
  }
  return isValid
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
          @input="validateInputTag(account)"
          :invalid="!isValidTag(account.tag)"
          @blur="validateAccount(account)"
        />
        <small v-if="!isValidTag(account.tag)" class="p-error">Максимум 50 символов</small>
      </div>
      <div class="flex flex-column gap-2 w-12rem">
        <label>Тип записи</label>
        <app-select
          v-model="account.type"
          @update:modelValue="
            (value: Account['type']) => {
              handleUpdate(account, 'type', value)
              validateAccount(account)
            }
          "
          :options="['LDAP', 'LOCAL']"
        />
      </div>
      <div class="flex flex-column gap-2">
        <label>Логин</label>
        <app-input
          :value="account.login"
          @update:modelValue="(value: Account['login']) => handleUpdate(account, 'login', value)"
          label="Логин"
          :invalid="!isValidLogin(account.login)"
          @input="validateInputLogin(account)"
          @blur="validateAccount(account)"
        />
        <small v-if="!isValidLogin(account.login)" class="p-error">Максимум 100 символов</small>
      </div>
      <div v-if="account.type === 'LOCAL'" class="flex flex-column gap-2">
        <label>Пароль</label>
        <app-password
          v-model="account.password"
          @update:modelValue="
            (value: Account['password']) => handleUpdate(account, 'password', value)
          "
          label="Пароль"
          promptLabel="Выберите пароль"
          weakLabel="Слабый"
          mediumLabel="Средний"
          strongLabel="Сильный"
          toggleMask
          :invalid="!isValidPassword(account.password)"
          @input="validateInputPassword(account)"
          @blur="validateAccount(account)"
        >
          <template #footer>
            <app-divider />
            <ul class="my-0 leading-normal">
              <li>Максимум 100 символов</li>
            </ul>
          </template>
        </app-password>
        <small v-if="!isValidPassword(account.password)" class="p-error"
          >Максимум 100 символов</small
        >
      </div>
      <i class="pi pi-trash delete-icon" @click="handleDelete(account.id)"></i>
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
  position: relative;
  max-width: 1200px;
}

.form-item > div {
  flex: 1;
}

.form-item > div.w-12rem {
  flex: 0 0 12rem;
}

.delete-icon {
  position: absolute;
  right: -3rem;
  top: 1.7rem;
  font-size: 2.2rem;
  cursor: pointer;
}
</style>
