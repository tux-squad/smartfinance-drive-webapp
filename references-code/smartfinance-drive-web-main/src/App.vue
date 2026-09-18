<script setup lang="ts">
import Header from './components/header/header.vue';
import Sidebar from './components/sidebar/sidebar.vue';
</script>

<template>
  <div class="flex flex-row min-h-screen">
    <Sidebar></Sidebar>
    <div class="flex flex-col flex-1">
      <Header></Header>
      <main class="flex-1 p-4">
        <RouterView></RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
