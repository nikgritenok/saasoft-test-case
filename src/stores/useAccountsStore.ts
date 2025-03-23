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

export const isAccountValid = (account: Account): boolean => {
  const isLoginValid = !!account.login && account.login.length > 0 && account.login.length <= 100

  const isPasswordValid =
    account.type === 'LOCAL'
      ? !!account.password && account.password.length > 0 && account.password.length <= 100
      : true

  const isTagsValid = account.tag.every((tag) => !tag.text || tag.text.length <= 50)

  return isLoginValid && isPasswordValid && isTagsValid
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem(STORAGE_KEY)
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts) as StoredAccount[]

      const allAccounts = parsedAccounts.map((account) => ({
        ...account,
        tag: Array.isArray(account.tag) ? account.tag : parseTagString(account.tag || ''),
      }))

      const validAccounts = allAccounts.filter(isAccountValid)

      if (validAccounts.length !== allAccounts.length) {
        console.warn(
          `Обнаружены невалидные аккаунты в localStorage (${allAccounts.length - validAccounts.length} шт.). Они будут удалены.`,
        )
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validAccounts))
      }

      accounts.value = validAccounts
    }
    console.log(accounts.value)
  }

  const saveAccounts = () => {
    const validAccounts = accounts.value.filter(isAccountValid)

    if (validAccounts.length !== accounts.value.length) {
      console.warn(
        `Некоторые аккаунты не прошли валидацию и не будут сохранены (${accounts.value.length - validAccounts.length} шт.)`,
      )
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validAccounts))
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

      const updatedAccount = {
        ...accounts.value[accountIndex],
        ...updates,
      }

      accounts.value[accountIndex] = updatedAccount
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
