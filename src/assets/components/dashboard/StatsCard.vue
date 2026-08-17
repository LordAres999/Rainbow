<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center transition-all hover:-translate-y-1 hover:shadow-md"
  >
    <div>
      <h3 class="text-gray-600 text-base mb-2 font-medium">{{ title }}</h3>
      <h2 class="text-gray-800 text-4xl font-semibold">{{ value }}</h2>
    </div>
    <i :class="icon" class="text-4xl text-primary"></i>
  </div>
</template>

<script setup>
defineProps({
  title: String,

  value: Number,

  icon: String,
})
</script>
