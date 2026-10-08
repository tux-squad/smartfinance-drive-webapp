import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY_SLIM = 'smartfinance_layout_slim'
const STORAGE_KEY_RAIL = 'smartfinance_layout_context_rail'

export const useLayoutStore = defineStore('layout', () => {
  // Floating Slim mode enabled by default (loads preference from localStorage if set)
  const initialSlim = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY_SLIM) !== null
    ? localStorage.getItem(STORAGE_KEY_SLIM) === 'true'
    : true

  const initialRail = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY_RAIL) !== null
    ? localStorage.getItem(STORAGE_KEY_RAIL) === 'true'
    : false

  const isSlim = ref<boolean>(initialSlim)
  const isMobileOpen = ref<boolean>(false)
  const isContextRailOpen = ref<boolean>(initialRail)

  const toggleSlim = () => {
    isSlim.value = !isSlim.value
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SLIM, String(isSlim.value))
    }
  }

  const setSlim = (val: boolean) => {
    isSlim.value = val
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SLIM, String(val))
    }
  }

  const toggleMobile = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const closeMobile = () => {
    isMobileOpen.value = false
  }

  const toggleContextRail = () => {
    isContextRailOpen.value = !isContextRailOpen.value
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_RAIL, String(isContextRailOpen.value))
    }
  }

  const setContextRail = (val: boolean) => {
    isContextRailOpen.value = val
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_RAIL, String(val))
    }
  }

  return {
    isSlim,
    isMobileOpen,
    isContextRailOpen,
    toggleSlim,
    setSlim,
    toggleMobile,
    closeMobile,
    toggleContextRail,
    setContextRail
  }
})
