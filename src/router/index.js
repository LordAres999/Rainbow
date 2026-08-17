import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/assets/views/Login.vue'
import Register from '@/assets/views/Register.vue'
import Dashboard from '@/assets/views/Dashboard.vue'
import PostPage from '@/assets/views/PostPage.vue'
import PostDetails from '@/assets/views/PostDetails.vue'
import Settings from '@/assets/views/Settings.vue'
import Categories from '@/assets/views/Categories.vue'
import Media from '@/assets/views/Media.vue'
import Users from '@/assets/views/Users.vue'
import UserGuide from '@/assets/views/UserGuide.vue'
import Profile from '@/assets/views/Profile.vue'
import UserSite from '@/assets/views/UserSite.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'UserSite',
      component: UserSite,
    },
    {
      path: '/user-site',
      name: 'UserSiteHome',
      component: UserSite,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    // Admin Routes - Protected section
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/post/:id',
      name: 'PostPage',
      component: PostPage,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/post-details/:id',
      name: 'PostDetails',
      component: PostDetails,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/categories',
      name: 'Categories',
      component: Categories,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/media',
      name: 'Media',
      component: Media,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: Users,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/user-guide',
      name: 'UserGuide',
      component: UserGuide,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAdmin: true },
    },
  ],
})

// Navigation guard to protect admin routes
router.beforeEach((to, from, next) => {
  // If trying to access admin routes without permission, redirect to home
  if (to.meta.requiresAdmin) {
    // Check if user is authenticated as admin
    const isAdminAuthenticated = localStorage.getItem('isAdminAuth') === 'true'
    if (!isAdminAuthenticated) {
      console.warn('Access denied: Admin authentication required')
      next('/')
      return
    }
  }
  next()
})

export default router
