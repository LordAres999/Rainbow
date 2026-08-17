<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-gray-800 text-2xl mb-1">Engagement</h2>
        <p class="text-gray-600 text-sm">Overall Information</p>
      </div>

      <div class="flex gap-2">
        <button
          :class="
            period === 'Monthly'
              ? 'bg-primary text-white'
              : 'bg-transparent text-primary border-2 border-primary'
          "
          @click="period = 'Monthly'"
          class="px-5 py-2 rounded-full cursor-pointer transition-all text-sm"
        >
          Monthly
        </button>

        <button
          :class="
            period === 'Yearly'
              ? 'bg-primary text-white'
              : 'bg-transparent text-primary border-2 border-primary'
          "
          @click="period = 'Yearly'"
          class="px-5 py-2 rounded-full cursor-pointer transition-all text-sm"
        >
          Yearly
        </button>
      </div>
    </div>

    <div class="flex items-end justify-between h-52 py-5 gap-2">
      <div
        v-for="(bar, index) in bars"
        :key="index"
        class="w-5 bg-gray-200 rounded-t-sm transition-all"
        :class="getBarClasses(bar, index)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const period = ref('Monthly')

const bars = [
  'short',
  'medium',
  'tall',
  'medium',
  'short',
  'tall',
  'medium',
  'short',
  'medium',
  'tall',
  'short',
  'medium',
  'tall',
  'short',
  'medium',
  'tall',
  'short',
  'medium',
  'tall',
  'short',
  'medium',
  'tall',
  'tallest',
  'medium',
]

const getBarClasses = (bar, index) => {
  let heightClass = ''
  if (bar === 'short') heightClass = 'h-16'
  else if (bar === 'medium') heightClass = 'h-28'
  else if (bar === 'tall') heightClass = 'h-40'
  else if (bar === 'tallest') heightClass = 'h-48'

  const isPurple = index === bars.length - 2
  const colorClass = isPurple ? 'bg-gradient-to-t from-primary to-primary-dark' : ''

  return `${heightClass} ${colorClass}`
}
</script>
