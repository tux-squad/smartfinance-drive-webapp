<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
}>()

// Min score = 300, Max score = 850 (Total range = 550)
const scorePercentage = computed(() => {
  const min = 300
  const max = 850
  const clamped = Math.min(max, Math.max(min, props.score))
  return (clamped - min) / (max - min)
})

// Calculate rotation angle for semi-circle needle (-90 deg to +90 deg)
const needleAngle = computed(() => {
  return -90 + scorePercentage.value * 180
})

const gaugeColorClass = computed(() => {
  if (props.score >= 700) return 'text-emerald-500'
  if (props.score >= 580) return 'text-amber-500'
  return 'text-red-500'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 text-center space-y-4">
    <!-- SVG Semi-Circle Gauge -->
    <div class="relative w-64 h-36 flex justify-center items-end overflow-hidden">
      <svg viewBox="0 0 200 110" class="w-full h-full">
        <!-- Background Arc Segments -->
        <!-- High Risk Red Arc (300 - 579) -->
        <path
          d="M 20 100 A 80 80 0 0 1 73 30"
          fill="none"
          stroke="#EF4444"
          stroke-width="16"
          stroke-linecap="round"
        />
        <!-- Medium Risk Yellow Arc (580 - 699) -->
        <path
          d="M 77 27 A 80 80 0 0 1 123 27"
          fill="none"
          stroke="#F59E0B"
          stroke-width="16"
        />
        <!-- Low Risk Green Arc (700 - 850) -->
        <path
          d="M 127 30 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#10B981"
          stroke-width="16"
          stroke-linecap="round"
        />

        <!-- Rotating Needle -->
        <g :style="{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 100px' }" class="transition-transform duration-1000 ease-out">
          <polygon points="96,100 104,100 100,25" fill="#1E293B" class="dark:fill-white" />
          <circle cx="100" cy="100" r="8" fill="#0F172A" class="dark:fill-gray-200" />
        </g>
      </svg>
    </div>

    <!-- Score Big Display -->
    <div class="space-y-1">
      <div :class="['text-4xl font-black tracking-tight', gaugeColorClass]">
        {{ score }} <span class="text-base font-normal text-gray-400">/ 850</span>
      </div>
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Puntaje de Crédito Calculado
      </span>
    </div>
  </div>
</template>
