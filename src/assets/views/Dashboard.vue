<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <main class="flex-1 ml-64 p-8 bg-gray-50">
      <Header title="Dashboard" />

      <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatsCard title="Posts" :value="10" icon="fas fa-pen-to-square" />

        <StatsCard title="Categories" :value="3" icon="fas fa-folder" />

        <StatsCard title="Users" :value="2" icon="fas fa-users" />
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="lg:col-span-2">
          <ChartSection />
        </div>

        <LatestPosts />
      </section>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/assets/components/layout/Sidebar.vue'
import Header from '@/assets/components/layout/Header.vue'

import StatsCard from '@/assets/components/dashboard/StatsCard.vue'
import ChartSection from '@/assets/components/dashboard/ChartSection.vue'
import LatestPosts from '@/assets/components/dashboard/LatestPosts.vue'
</script>
