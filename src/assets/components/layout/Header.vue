<template>
  <header class="flex justify-between items-center mb-8 p-5 px-8 bg-white rounded-2xl shadow-sm">
    <div>
      <h1 class="text-gray-800 text-3xl mb-1">{{ title }}</h1>
      <p class="text-gray-600 text-sm">Home / {{ title }}</p>
    </div>
    <div class="flex items-center gap-4">
      <router-link
        v-if="user"
        to="/profile"
        class="flex items-center gap-3 no-underline text-inherit"
      >
        <img
          :src="user.avatar || avatar"
          alt="profile Image"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div class="profile-info">
          <h4 class="text-gray-800 text-base mb-1">{{ user.fullName }}</h4>
          <small class="text-gray-600 text-sm">{{ user.role }}</small>
        </div>
      </router-link>
      <div v-else class="flex items-center gap-3">
        <router-link to="/login" class="text-primary no-underline">Login</router-link>
        <router-link to="/register" class="text-primary no-underline">Register</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ title: String })
const avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
const user = ref(null)

try {
  user.value = JSON.parse(localStorage.getItem('authUser') || 'null')
} catch (e) {
  user.value = null
}
</script>
