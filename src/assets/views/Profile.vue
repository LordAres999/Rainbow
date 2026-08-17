<template>
  <div class="min-h-screen p-10">
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
      <h2 class="text-2xl font-semibold mb-4">Profile</h2>

      <div class="flex items-center gap-4 mb-6">
        <img
          :src="user.avatar || defaultAvatar"
          alt="avatar"
          class="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 class="text-lg font-medium">{{ user.fullName }}</h3>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
          <p class="text-sm text-gray-500">{{ user.role }}</p>
        </div>
      </div>

      <form @submit.prevent="save">
        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Full name</label>
          <input v-model="form.fullName" class="w-full p-3 border rounded" />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Email</label>
          <input v-model="form.email" disabled class="w-full p-3 border rounded bg-gray-100" />
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">New Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Leave blank to keep current"
            class="w-full p-3 border rounded"
          />
        </div>

        <div class="flex gap-3">
          <button type="submit" class="px-4 py-2 bg-primary text-white rounded">Save</button>
          <button type="button" @click="logout" class="px-4 py-2 border rounded">Logout</button>
        </div>
      </form>

      <div v-if="message" class="mt-4 text-sm text-green-600">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const defaultAvatar =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
const user = reactive({ id: null, fullName: '', email: '', role: '', avatar: '', password: '' })
const form = reactive({ fullName: '', email: '', password: '' })
const message = ref('')

onMounted(() => {
  const auth = JSON.parse(localStorage.getItem('authUser') || 'null')
  if (!auth) {
    router.push('/login')
    return
  }
  Object.assign(user, auth)
  form.fullName = user.fullName
  form.email = user.email
})

const save = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const idx = users.findIndex((u) => u.id === user.id)
  if (idx === -1) return

  users[idx].fullName = form.fullName
  if (form.password) users[idx].password = form.password
  localStorage.setItem('users', JSON.stringify(users))

  // update authUser
  const updated = { ...users[idx] }
  localStorage.setItem('authUser', JSON.stringify(updated))
  Object.assign(user, updated)
  message.value = 'Profile updated.'
  setTimeout(() => (message.value = ''), 3000)
}

const logout = () => {
  localStorage.removeItem('authUser')
  router.push('/login')
}
</script>

<style scoped>
.bg-primary {
  background-color: #0ea5a4;
}
</style>
