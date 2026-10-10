import type { RouteLocationNormalized } from 'vue-router'
import { useIamStore } from '../application/iam.store'

/**
 * Vue Router global navigation guard enforcing authentication policies.
 */
export const authenticationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
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
    return { name: 'sign-in', query: { redirect: to.fullPath } }
  }

  if (iamStore.isAuthenticated && isGuestOnlyRoute) {
    // If authenticated user tries to visit login/register, redirect to home
    return { name: 'home' }
  }

  // Role-based route authorization
  const requiredRoles = to.meta.roles as string[] | undefined
  if (iamStore.isAuthenticated && requiredRoles && requiredRoles.length > 0) {
    const hasRole = iamStore.roles.some((role: string) => requiredRoles.includes(role))
    if (!hasRole) {
      // User doesn't have sufficient privileges for this section
      return { name: 'home' }
    }
  }

  return true
}
