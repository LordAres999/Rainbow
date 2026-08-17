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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
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
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/post/:id',
      name: 'PostPage',
      component: PostPage,
    },
    {
      path: '/post-details/:id',
      name: 'PostDetails',
      component: PostDetails,
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories,
    },
    {
      path: '/media',
      name: 'Media',
      component: Media,
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/user-guide',
      name: 'UserGuide',
      component: UserGuide,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
  ],
})

export default router
