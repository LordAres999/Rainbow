<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm">
    <h3
      class="text-gray-800 text-xl mb-5 bg-gradient-to-r from-primary/10 to-primary-dark/10 p-4 rounded-xl"
    >
      Latest Posts
    </h3>

    <div
      class="p-4 border-b border-gray-200 transition-all hover:bg-gray-50 last:border-0"
      v-for="post in posts"
      :key="post.id"
    >
      <h4 class="text-gray-800 text-base mb-1">{{ post.title }}</h4>
      <small class="text-gray-600 text-sm">{{ post.date }}</small>
    </div>
  </div>
</template>

<script setup>
const posts = [
  {
    id: 1,
    title: 'The Power of Dream',
    date: '28 June 2021',
  },

  {
    id: 2,
    title: 'Emotional Healing',
    date: '22 June 2021',
  },

  {
    id: 3,
    title: 'Works vs School',
    date: '21 June 2021',
  },
]
</script>
