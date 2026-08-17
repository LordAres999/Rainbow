<template>
  <aside
    class="w-64 bg-gradient-to-b from-primary to-primary-dark p-5 flex flex-col fixed h-screen left-0 top-0"
  >
    <div class="py-5 border-b border-white/20 mb-5">
      <h2 class="text-white text-2xl">Rainbow</h2>
    </div>

    <nav class="flex-1">
      <ul class="list-none">
        <li v-for="item in menu" :key="item.name" class="mb-2">
          <router-link
            :to="item.route"
            class="flex items-center p-4 text-white no-underline rounded-xl transition-all"
            :class="
              route.path === item.route
                ? 'bg-white/20 font-semibold shadow-sm'
                : 'hover:bg-white/20'
            "
          >
            <i :class="item.icon" class="mr-4 text-xl"></i>
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <router-link
      to="/user-guide"
      class="flex items-center p-4 bg-white/10 rounded-3xl mt-auto no-underline hover:bg-white/15 transition-colors"
    >
      <i class="fas fa-user-circle text-2xl text-white mr-4"></i>
      <div>
        <h4 class="text-white text-base mb-1">User Guide</h4>
        <p class="text-white/80 text-sm">Documentation</p>
      </div>
    </router-link>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menu = [
  {
    name: 'Dashboard',
    icon: 'fas fa-house',
    route: '/dashboard',
  },
  {
    name: 'Posts',
    icon: 'fas fa-pen-to-square',
    route: '/post/1',
  },
  {
    name: 'Categories',
    icon: 'fas fa-folder',
    route: '/categories',
  },
  {
    name: 'Media',
    icon: 'fas fa-image',
    route: '/media',
  },
  {
    name: 'Users',
    icon: 'fas fa-users',
    route: '/users',
  },
  {
    name: 'Settings',
    icon: 'fas fa-gear',
    route: '/settings',
  },
]
</script>
