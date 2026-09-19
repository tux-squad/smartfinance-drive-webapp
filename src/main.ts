import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark'
    }
  }
})

app.mount('#app')

// Hide PrimeUI license badge watermark
if (typeof window !== 'undefined') {
  const hideLicenseBadge = () => {
    document.querySelectorAll('*').forEach((el) => {
      const htmlEl = el as HTMLElement
      if (
        htmlEl.textContent?.trim() === 'Invalid PrimeUI License' ||
        htmlEl.innerText?.trim() === 'Invalid PrimeUI License'
      ) {
        htmlEl.style.setProperty('display', 'none', 'important')
        htmlEl.style.setProperty('visibility', 'hidden', 'important')
        htmlEl.style.setProperty('opacity', '0', 'important')
        htmlEl.style.setProperty('pointer-events', 'none', 'important')
      }
    })
  }
  const observer = new MutationObserver(hideLicenseBadge)
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true })
  setInterval(hideLicenseBadge, 300)
}
