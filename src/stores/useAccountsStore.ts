import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface TagItem {
  text: string
}

export interface Account {
  id: number
  tag: TagItem[]
  type: 'LDAP' | 'LOCAL'
  login: string
  password: string | null
}

interface StoredAccount {
  id: number
  tag: TagItem[] | string
  type: 'LDAP' | 'LOCAL'
  login: string
  password: string | null
}

const STORAGE_KEY = 'accounts'

export const parseTagString = (tagString: string): TagItem[] => {
  if (!tagString) return []
  return tagString
    .split(';')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => ({ text: tag }))
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem(STORAGE_KEY)
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts) as StoredAccount[]
      accounts.value = parsedAccounts.map((account) => ({
        ...account,
        tag: Array.isArray(account.tag) ? account.tag : parseTagString(account.tag || ''),
      }))
    }
    console.log(accounts.value)
  }

  const saveAccounts = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
  }

  watch(accounts, saveAccounts, { deep: true })

  const addNewAccount = () => {
    accounts.value.push({
      id: Date.now(),
      tag: [],
      type: 'LOCAL',
      login: '',
      password: null,
    })
  }

  const updateAccount = (id: number, updates: Partial<Account>) => {
    const accountIndex = accounts.value.findIndex((acc) => acc.id === id)
    if (accountIndex !== -1) {
      if (typeof updates.tag === 'string') {
        updates.tag = parseTagString(updates.tag)
      }
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
