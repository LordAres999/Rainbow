<template>
  <div class="flex min-h-screen">
    <!-- Left Section -->
    <div class="flex-1 relative overflow-hidden">
      <div class="relative w-full h-full">
        <img
          src="@/assets/images/background.jpeg"
          alt="Background Image"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-left text-white w-full max-w-md p-5 flex flex-col items-start justify-center"
        >
          <h1 class="text-5xl mb-4">RainbowMedia</h1>
          <p class="text-xl mb-8">News at your finger tips.</p>
          <button
            type="button"
            class="px-8 py-3 bg-white text-primary rounded-3xl cursor-pointer transition-all font-semibold hover:-translate-y-0.5 hover:shadow-lg"
          >
            Read More
          </button>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex-1 flex items-center justify-center bg-white p-10">
      <div class="w-full max-w-md p-10">
        <h1 class="text-4xl text-gray-800 mb-2">Hello Again!</h1>
        <p class="text-gray-600 mb-8">Welcome Back</p>

        <form @submit.prevent="login">
          <div class="relative mb-6">
            <i
              class="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl"
            ></i>
            <input
              type="email"
              placeholder="Email Address"
              v-model="email"
              required
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-primary"
            />
          </div>

          <div class="relative mb-6">
            <i
              class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl"
            ></i>
            <input
              type="password"
              placeholder="Password"
              v-model="password"
              required
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            class="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Login
          </button>

          <div v-if="error" class="error text-center">{{ error }}</div>

          <div class="text-center mt-5">
            <router-link to="/forgot-password" class="text-primary no-underline hover:underline">
              Forgot Password?
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const login = () => {
  error.value = ''
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find((u) => u.email === email.value && u.password === password.value)
  if (user) {
    localStorage.setItem('authUser', JSON.stringify(user))
    router.push('/dashboard')
  } else {
    error.value = 'Invalid email or password.'
  }
}
</script>

<style scoped>
.error {
  color: #dc2626;
  margin-top: 0.5rem;
}
</style>
