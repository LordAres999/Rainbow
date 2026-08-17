<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <main class="flex-1 ml-64 bg-rose-50/40 p-6 lg:p-10">
      <!-- Top-right current user chip -->
      <div class="flex justify-end mb-6">
        <div class="flex items-center gap-3">
          <img
            :src="currentUser.avatar"
            :alt="currentUser.name"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p class="text-sm font-semibold text-gray-800 leading-tight">{{ currentUser.name }}</p>
            <p class="text-xs text-gray-400 leading-tight">{{ currentUser.role }}</p>
          </div>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm p-6 lg:p-8 max-w-4xl">
        <!-- Cover banner -->
        <div
          class="h-16 sm:h-20 rounded-xl bg-gradient-to-r from-violet-200 to-indigo-200 mb-8"
        ></div>

        <!-- Profile row -->
        <div class="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ profile.name }}</h2>
              <p class="text-sm text-gray-400">{{ profile.email }}</p>
            </div>
          </div>

          <button
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Edit
          </button>
        </div>

        <!-- Form fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-10">
          <FormField v-model="form.fullName" label="Full Name" placeholder="Your First Name" />
          <FormField v-model="form.nickName" label="Nick Name" placeholder="Your First Name" />

          <FormField
            v-model="form.gender"
            label="Gender"
            placeholder="Your First Name"
            type="select"
            :options="genderOptions"
          />
          <FormField
            v-model="form.country"
            label="Country"
            placeholder="Your First Name"
            type="select"
            :options="countryOptions"
          />

          <FormField
            v-model="form.language"
            label="Language"
            placeholder="Your First Name"
            type="select"
            :options="languageOptions"
          />
          <FormField
            v-model="form.timeZone"
            label="Time Zone"
            placeholder="Your First Name"
            type="select"
            :options="timeZoneOptions"
          />
        </div>

        <!-- Email addresses -->
        <div>
          <h3 class="text-base font-semibold text-gray-900 mb-4">My email Address</h3>

          <div
            v-for="item in emailAddresses"
            :key="item.email"
            class="flex items-center gap-3 mb-4"
          >
            <div
              class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-envelope text-indigo-600 text-sm"></i>
            </div>
            <div>
              <p class="text-sm text-gray-800">{{ item.email }}</p>
              <p class="text-xs text-gray-400">{{ item.addedAgo }}</p>
            </div>
          </div>

          <button
            class="mt-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            + Add Email Address
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Sidebar from '@/assets/components/layout/Sidebar.vue'
import FormField from './FormField.vue'

const currentUser = {
  name: 'Eze Michael',
  role: 'Head of Media',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
}

const profile = {
  name: 'Alexa Rawles',
  email: 'alexarawles@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
}

const form = reactive({
  fullName: '',
  nickName: '',
  gender: '',
  country: '',
  language: '',
  timeZone: '',
})

const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say']
const countryOptions = ['United States', 'United Kingdom', 'Nigeria', 'Canada', 'Germany']
const languageOptions = ['English', 'French', 'Spanish', 'German']
const timeZoneOptions = ['GMT', 'GMT+1', 'EST', 'PST']

const emailAddresses = [{ email: 'alexarawles@gmail.com', addedAgo: '1 month ago' }]
</script>
