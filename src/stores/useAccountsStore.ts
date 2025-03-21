import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Account {
  id: number
  tag?: string
  type: 'LDAP' | 'LOCAL'
  login: string
  password: string | null
}

const STORAGE_KEY = 'accounts'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem(STORAGE_KEY)
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts)
    }
  }

  const saveAccounts = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
  }

  watch(accounts, saveAccounts, { deep: true })

  const addNewAccount = () => {
    accounts.value.push({
      id: Date.now(),
      tag: '',
      type: 'LOCAL',
      login: '',
      password: null,
    })
  }

  const updateAccount = (id: number, updates: Partial<Account>) => {
    const accountIndex = accounts.value.findIndex((acc) => acc.id === id)
    if (accountIndex !== -1) {
      accounts.value[accountIndex] = {
        ...accounts.value[accountIndex],
        ...updates,
      }
    }
  }

  const deleteAccount = (id: number) => {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  loadAccounts()

  return {
    accounts,
    addNewAccount,
    updateAccount,
    deleteAccount,
  }
})
