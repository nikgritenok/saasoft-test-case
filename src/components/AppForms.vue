<script setup lang="ts">
import { useAccountsStore, parseTagString, isAccountValid } from '@/stores/useAccountsStore'
import type { Account } from '@/stores/useAccountsStore'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const store = useAccountsStore()
const confirm = useConfirm()
const toast = useToast()

const confirm1 = (account: Account) => {
  confirm.require({
    message: 'Вы уверены, что хотите удалить эту учетную запись?',
    header: 'Удаление учетной записи',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Отмена',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Удалить',
    },
    accept: () => {
      handleDelete(account.id)
      toast.add({
        severity: 'info',
        summary: 'Удалено',
        detail: 'Учетная запись удалена',
        life: 3000,
      })
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Отмена',
        detail: 'Учетная запись не удалена',
        life: 3000,
      })
    },
  })
}

const getTagString = (account: Account) => {
  return account.tag.map((t) => t.text).join(';')
}

const setTagString = (account: Account, value: string) => {
  store.updateAccount(account.id, { tag: parseTagString(value) })
}

const handleDelete = (id: number) => {
  store.deleteAccount(id)
}

const isValidTag = (tag: string) => {
  return !tag || tag.length <= 50
}

const validateInputTag = (account: Account, value: string) => {
  if (value.length > 50) {
    setTagString(account, value.slice(0, 50))
  }
}

const isValidLogin = (login: string | undefined) => {
  return login && login.length > 0 && login.length <= 100
}

const validateInputLogin = (account: Account) => {
  if (account.login && account.login.length > 100) {
    account.login = account.login.slice(0, 100)
  }
}

const isValidPassword = (password: string | null) => {
  return password && password.length > 0 && password.length <= 100
}

const validateInputPassword = (account: Account) => {
  if (account.password && account.password.length > 100) {
    account.password = account.password.slice(0, 100)
  }
}

const validateAccount = (account: Account) => {
  return isAccountValid(account)
}

const handleUpdateWithValidation = (
  account: Account,
  field: keyof Account,
  value: Account[keyof Account],
) => {
  // Сначала обновляем значение локально
  const updatedValue = value as unknown as Account[typeof field]

  // Затем проверяем валидность
  if (validateAccount({ ...account, [field]: updatedValue })) {
    // Обновляем только если валидно
    store.updateAccount(account.id, { [field]: value })
  }
}
</script>

<template>
  <app-confirmdialog />
  <app-toast />
  <div v-if="store.accounts.length > 0" class="forms-container flex flex-column p-3">
    <TransitionGroup name="list" tag="div">
      <div
        class="form-item border-round-2xl align-items-start mb-3 gap-3 p-3 w-full flex flex-column md:flex-row"
        v-for="account in store.accounts"
        :key="account.id"
      >
        <app-iftalabel class="flex flex-column gap-2 w-full md:w-15rem">
          <label>Метки</label>
          <app-input
            :modelValue="getTagString(account)"
            @update:modelValue="
              (value: string) => {
                if (isValidTag(value)) {
                  setTagString(account, value)
                }
              }
            "
            inputId="tag"
            label="Метки"
            @input="(e: Event) => validateInputTag(account, (e.target as HTMLInputElement).value)"
            :invalid="!isValidTag(getTagString(account))"
            @blur="validateAccount(account)"
          />
          <small v-if="!isValidTag(getTagString(account))" class="p-error"
            >Максимум 50 символов</small
          >
        </app-iftalabel>

        <app-iftalabel class="flex flex-column gap-2 w-full md:w-15rem">
          <app-select
            v-model="account.type"
            @update:modelValue="
              (value: Account['type']) => {
                if (value === 'LDAP' && account.password) {
                  handleUpdateWithValidation(account, 'password', null)
                }
                handleUpdateWithValidation(account, 'type', value)
              }
            "
            :options="['LDAP', 'LOCAL']"
          />
          <label>Тип записи</label>
        </app-iftalabel>

        <app-iftalabel class="flex flex-column gap-2 login-label flex-grow-1 w-full md:w-15rem">
          <label>Логин</label>
          <app-input
            v-model="account.login"
            @update:modelValue="
              (value: Account['login']) => handleUpdateWithValidation(account, 'login', value)
            "
            label="Логин"
            :invalid="!isValidLogin(account.login)"
            @input="validateInputLogin(account)"
            @blur="validateAccount(account)"
          />
          <small v-if="!isValidLogin(account.login)" class="p-error">Максимум 100 символов</small>
        </app-iftalabel>

        <app-iftalabel
          v-if="account.type === 'LOCAL'"
          class="flex flex-column gap-2 w-full md:w-15rem"
        >
          <app-password
            v-model="account.password"
            @update:modelValue="
              (value: Account['password']) => handleUpdateWithValidation(account, 'password', value)
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
            class="w-full md:w-15rem password-input"
          >
            <template #footer>
              <app-divider />
              <ul class="my-0 leading-normal">
                <li>Максимум 100 символов</li>
              </ul>
            </template>
          </app-password>
          <label>Пароль</label>
          <small v-if="!isValidPassword(account.password)" class="p-error"
            >Максимум 100 символов</small
          >
        </app-iftalabel>
        <app-button
          icon="pi pi-trash delete-icon-container"
          severity="danger"
          class="d-block w-full md:d-none md:w-10rem"
          @click="confirm1(account)"
          label="удалить"
        />
      </div>
    </TransitionGroup>
  </div>
  <div v-else class="no-accounts-container m-3">
    <app-card>
      <template #content>
        <p>Нет учетных записей, добавьте хотя бы одну</p>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.form-item {
  background-color: var(--p-content-border-color);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
