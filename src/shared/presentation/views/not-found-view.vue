<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <div class="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-4xl shadow-inner">
      <i class="pi pi-exclamation-triangle"></i>
    </div>
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">404 - Página no encontrada</h1>
    <p class="text-gray-500 max-w-md">
      La sección que buscas no existe o ha sido movida como parte de la migración modular a DDD.
    </p>
    <router-link
      to="/home"
      class="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-medium text-sm shadow transition-colors"
    >
      <i class="pi pi-arrow-left text-xs"></i>
      <span>Volver al Inicio</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
