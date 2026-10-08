<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 font-sans antialiased overflow-x-hidden flex">
    <!-- Column 1: Floating Slim Sidebar -->
    <Sidebar />

    <!-- Main Workspace Container -->
    <div
      class="flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out"
      :class="[
        // Responsive left margin/padding to account for floating sidebar
        layoutStore.isSlim ? 'lg:pl-28' : 'lg:pl-72'
      ]"
    >
      <Header />

      <!-- Multi-Column Layout Body: Column 2 (Content) + Column 3 (Context Rail) -->
      <div class="flex-1 flex min-w-0 overflow-hidden">
        <!-- Column 2: Main View Canvas -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <router-view />
        </main>

        <!-- Column 3: Contextual Action Rail -->
        <ContextRail />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '../components/header.vue'
import Sidebar from '../components/sidebar.vue'
import ContextRail from '../components/context-rail.vue'
import { useLayoutStore } from '@/shared/application/layout.store'

const layoutStore = useLayoutStore()
</script>

<style scoped>
</style>
