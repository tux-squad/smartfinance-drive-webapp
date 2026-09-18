import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useIamStore } from '../application/iam.store'

/**
 * Vue Router global navigation guard enforcing authentication policies.
 */
export const authenticationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next?: NavigationGuardNext
) => {
  const iamStore = useIamStore()
  
  // Restore session from localStorage if present
  if (!iamStore.isAuthenticated && localStorage.getItem('access_token')) {
    iamStore.restoreSession()
  }

  const isPublicRoute = to.meta.public === true
  const isGuestOnlyRoute = to.meta.guestOnly === true

  if (!iamStore.isAuthenticated && !isPublicRoute && !isGuestOnlyRoute) {
    // If attempting to access a protected route without auth, redirect to sign-in
    if (next) {
      return next({ name: 'sign-in', query: { redirect: to.fullPath } })
    }
    return { name: 'sign-in', query: { redirect: to.fullPath } }
  }

  if (iamStore.isAuthenticated && isGuestOnlyRoute) {
    // If authenticated user tries to visit login/register, redirect to home
    if (next) {
      return next({ name: 'home' })
    }
    return { name: 'home' }
  }

  if (next) {
    return next()
  }
  return true
}
