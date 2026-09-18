<template>
  <div class="flex flex-row min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
    <Sidebar />
    <div class="flex flex-col flex-1 min-w-0">
      <Header />
      <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '../components/header.vue'
import Sidebar from '../components/sidebar.vue'
</script>

<style scoped>
</style>
