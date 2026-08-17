<template>
  <div class="flex min-h-screen bg-slate-50 font-sans">
    <Sidebar />

    <main class="flex-1 ml-64 p-6 space-y-6">
      <Header title="Users" :userName="currentUser.name" :role="currentUser.role" />

      <!-- Stat cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-2xl shadow-sm px-5 py-5 flex items-start gap-4"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            :class="stat.iconBg"
          >
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
          </div>
          <div>
            <p class="text-sm text-slate-500">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-slate-900 leading-tight">{{ stat.value }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ stat.subtext }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <!-- Users table card -->
        <div class="bg-white rounded-2xl shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5">
            <div>
              <h3 class="text-lg font-bold text-slate-900">All Users</h3>
              <p class="text-sm text-slate-500">Manage and monitor platform users</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="relative">
                <IconSearch
                  class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search users..."
                  class="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
                />
              </div>

              <div class="relative">
                <button
                  @click="showFilters = !showFilters"
                  class="flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50"
                >
                  <IconFilter class="w-4 h-4" />
                  Filters
                  <span
                    v-if="activeFilterCount"
                    class="ml-1 text-xs bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                    >{{ activeFilterCount }}</span
                  >
                </button>

                <div
                  v-if="showFilters"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 p-4 z-20 space-y-3"
                >
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Role</label>
                    <select
                      v-model="roleFilter"
                      class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="All">All Roles</option>
                      <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Status</label>
                    <select
                      v-model="statusFilter"
                      class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="All">All Status</option>
                      <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                  <button
                    @click="clearFilters"
                    class="text-xs font-medium text-indigo-500 hover:text-indigo-600"
                  >
                    Reset filters
                  </button>
                </div>
              </div>

              <button
                @click="openAddModal"
                class="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
              >
                <IconPlus class="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr
                  class="text-xs font-semibold text-slate-400 uppercase tracking-wide border-y border-slate-100"
                >
                  <th class="px-6 py-3">User</th>
                  <th class="px-6 py-3">Role</th>
                  <th class="px-6 py-3">Status</th>
                  <th class="px-6 py-3">Joined</th>
                  <th class="px-6 py-3">Posts</th>
                  <th class="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="u in paginatedUsers"
                  :key="u.id"
                  class="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        :src="u.avatar"
                        :alt="u.name"
                        class="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p class="font-semibold text-slate-900 text-sm">{{ u.name }}</p>
                        <p class="text-xs text-slate-400">{{ u.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-block text-xs font-medium px-3 py-1 rounded-full"
                      :class="roleBadge(u.role)"
                      >{{ u.role }}</span
                    >
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"
                    >
                      <span class="w-2 h-2 rounded-full" :class="statusDot(u.status)"></span>
                      {{ u.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-700">
                    <p>{{ formatDate(u.joinedDate) }}</p>
                    <p class="text-xs text-slate-400">{{ formatTime(u.joinedDate) }}</p>
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-slate-700">{{ u.posts }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 relative">
                      <button
                        @click="openEditModal(u)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors"
                        aria-label="Edit user"
                      >
                        <IconEdit class="w-4 h-4" />
                      </button>
                      <button
                        @click="toggleRowMenu(u.id)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                        aria-label="More actions"
                      >
                        <IconDots class="w-4 h-4" />
                      </button>

                      <div
                        v-if="openMenuId === u.id"
                        class="absolute right-0 top-10 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 text-sm z-20"
                      >
                        <button
                          @click="toggleStatus(u)"
                          class="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50"
                        >
                          <IconToggle class="w-4 h-4" />
                          {{ u.status === 'Suspended' ? 'Reactivate' : 'Suspend' }}
                        </button>
                        <button
                          @click="deleteUser(u.id)"
                          class="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50"
                        >
                          <IconTrash class="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr v-if="!paginatedUsers.length">
                  <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-400">
                    No users match your search or filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex items-center justify-between px-6 py-4 text-sm text-slate-500">
            <p>
              Showing {{ filteredUsers.length === 0 ? 0 : startIndex + 1 }} to
              {{ Math.min(startIndex + pageSize, filteredUsers.length) }} of
              {{ filteredUsers.length }} users
            </p>
            <div class="flex items-center gap-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 hover:bg-slate-50"
              >
                <IconChevronLeft class="w-4 h-4" />
              </button>
              <button
                v-for="page in pagesToShow"
                :key="page"
                @click="typeof page === 'number' && (currentPage = page)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
                :class="
                  page === currentPage
                    ? 'bg-indigo-500 text-white'
                    : page === '...'
                      ? 'text-slate-400 cursor-default'
                      : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                "
              >
                {{ page }}
              </button>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 hover:bg-slate-50"
              >
                <IconChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right rail -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h3 class="text-sm font-bold text-slate-900 mb-4">User Overview</h3>
            <div class="flex flex-col items-center">
              <svg viewBox="0 0 120 120" class="w-32 h-32 -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#EEF2FF" stroke-width="14" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#6366F1"
                  stroke-width="14"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                />
              </svg>
              <div class="-mt-20 text-center">
                <p class="text-xl font-bold text-slate-900">{{ activePercent }}%</p>
                <p class="text-xs text-slate-400">Active Users</p>
              </div>
            </div>
            <div class="mt-8 space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-2 text-slate-600"
                  ><span class="w-2 h-2 rounded-full bg-emerald-500"></span>Active</span
                >
                <span class="font-semibold text-slate-800">{{ counts.active }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-2 text-slate-600"
                  ><span class="w-2 h-2 rounded-full bg-slate-400"></span>Inactive</span
                >
                <span class="font-semibold text-slate-800">{{ counts.inactive }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-2 text-slate-600"
                  ><span class="w-2 h-2 rounded-full bg-red-500"></span>Suspended</span
                >
                <span class="font-semibold text-slate-800">{{ counts.suspended }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h3 class="text-sm font-bold text-slate-900 mb-4">Roles Breakdown</h3>
            <div class="space-y-3">
              <div
                v-for="r in rolesBreakdown"
                :key="r.role"
                class="flex items-center justify-between text-sm"
              >
                <span class="flex items-center gap-2 text-slate-600">
                  <IconUser class="w-4 h-4" :class="r.color" />
                  {{ r.role }}
                </span>
                <span class="font-semibold text-slate-800">{{ r.count }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-slate-900">Recent Signups</h3>
              <button
                @click="clearFilters"
                class="text-xs font-medium text-indigo-500 hover:text-indigo-600"
              >
                View all
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="u in recentSignups" :key="u.id" class="flex items-center gap-3">
                <img
                  :src="u.avatar"
                  :alt="u.name"
                  class="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">{{ u.name }}</p>
                  <p class="text-xs text-slate-400">{{ formatDate(u.joinedDate) }}</p>
                </div>
              </div>
            </div>
            <button
              @click="clearFilters"
              class="mt-4 w-full flex items-center justify-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
            >
              View all users
              <IconChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit user modal -->
    <div
      v-if="showModal"
      @click.self="closeModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">
            {{ editingId ? 'Edit User' : 'Add User' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
            <IconX class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveUser" class="px-6 py-5 space-y-4">
          <div>
            <label class="text-xs font-semibold text-slate-500">Full name</label>
            <input
              v-model.trim="form.name"
              required
              type="text"
              class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="e.g. Amaka Obi"
            />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-500">Email</label>
            <input
              v-model.trim="form.email"
              required
              type="email"
              class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="e.g. amaka.obi@example.com"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-slate-500">Role</label>
              <select
                v-model="form.role"
                class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500">Status</label>
              <select
                v-model="form.status"
                class="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>
          <p v-if="formError" class="text-xs text-red-500">{{ formError }}</p>
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg"
            >
              {{ editingId ? 'Save Changes' : 'Add User' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="text-sm font-medium text-slate-500 px-4 py-2.5 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-40"
    >
      {{ toast }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, h } from 'vue'
import Sidebar from '@/assets/components/layout/Sidebar.vue'
import Header from '@/assets/components/layout/Header.vue'

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */
const makeIcon = (paths) => (props) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      ...props,
    },
    paths.map((d) => h('path', { d })),
  )

const IconHome = makeIcon(['M3 9l9-7 9 7', 'M9 22V12h6v10', 'M4 22h16V10L12 3 4 10z'])
const IconEditNav = makeIcon(['M12 20h9', 'M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z'])
const IconFolder = makeIcon([
  'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
])
const IconImage = makeIcon([
  'M3 3h18v18H3z',
  'M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  'M21 15l-5-5L5 21',
])
const IconUsers = makeIcon([
  'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
  'M9 11a4 4 0 100-8 4 4 0 000 8z',
  'M23 21v-2a4 4 0 00-3-3.87',
  'M16 3.13a4 4 0 010 7.75',
])
const IconUserCheck = makeIcon([
  'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
  'M8.5 11a4 4 0 100-8 4 4 0 000 8z',
  'M17 11l2 2 4-4',
])
const IconShield = makeIcon(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'])
const IconUserPlus = makeIcon([
  'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
  'M8.5 11a4 4 0 100-8 4 4 0 000 8z',
  'M20 8v6',
  'M23 11h-6',
])
const IconSettings = makeIcon([
  'M12 15a3 3 0 100-6 3 3 0 000 6z',
  'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 008 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.36.22.75.22 1.15V10a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
])
const IconUser = makeIcon([
  'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2',
  'M12 11a4 4 0 100-8 4 4 0 000 8z',
])
const IconSearch = makeIcon(['M21 21l-4.35-4.35', 'M11 19a8 8 0 100-16 8 8 0 000 16z'])
const IconPlus = makeIcon(['M12 5v14', 'M5 12h14'])
const IconEdit = makeIcon(['M12 20h9', 'M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z'])
const IconTrash = makeIcon([
  'M3 6h18',
  'M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2',
  'M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6',
])
const IconChevronLeft = makeIcon(['M15 18l-6-6 6-6'])
const IconChevronRight = makeIcon(['M9 18l6-6-6-6'])
const IconChevronDown = makeIcon(['M6 9l6 6 6-6'])
const IconFilter = makeIcon(['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'])
const IconDots = makeIcon([
  'M12 13a1 1 0 100-2 1 1 0 000 2z',
  'M19 13a1 1 0 100-2 1 1 0 000 2z',
  'M5 13a1 1 0 100-2 1 1 0 000 2z',
])
const IconToggle = makeIcon([
  'M17 4H7a8 8 0 000 16h10a8 8 0 000-16z',
  'M7 15a3 3 0 100-6 3 3 0 000 6z',
])
const IconX = makeIcon(['M18 6L6 18', 'M6 6l12 12'])

const currentUser = {
  name: 'Eze Michael',
  role: 'Head of Media',
  avatar: 'https://i.pravatar.cc/80?img=13',
}

/* ------------------------------------------------------------------ */
/* Storage                                                              */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = 'rainbow-users-v1'
const toast = ref('')
function showToast(msg) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2200)
}

const roleOptions = ['Admin', 'Editor', 'Author', 'Contributor', 'Subscriber']
const statusOptions = ['Active', 'Inactive', 'Suspended']

function seedUsers() {
  const day = 24 * 60 * 60 * 1000
  const now = Date.now()
  const rows = [
    ['Eze Michael', 'michael.eze@example.com', 'Admin', 'Active', 2, 23, 13],
    ['Blessing Okafor', 'blessing.okafor@example.com', 'Editor', 'Active', 4, 18, 47],
    ['Daniel Abba', 'daniel.abba@example.com', 'Author', 'Active', 5, 11, 8],
    ['Tosin Adeleke', 'tosin.adeleke@example.com', 'Author', 'Inactive', 8, 5, 25],
    ['Chinedu Nwosu', 'chinedu.nwosu@example.com', 'Contributor', 'Active', 10, 7, 15],
    ['Hannah Faith', 'hannah.faith@example.com', 'Contributor', 'Active', 13, 3, 32],
    ['Samuel Jonah', 'samuel.jonah@example.com', 'Subscriber', 'Inactive', 18, 0, 41],
    ['Victoria Umeh', 'victoria.umeh@example.com', 'Subscriber', 'Active', 0.5, 2, 5],
    ['Ibrahim Musa', 'ibrahim.musa@example.com', 'Editor', 'Active', 1.2, 9, 22],
    ['Peace David', 'peace.david@example.com', 'Author', 'Suspended', 1.8, 1, 61],
    ['Grace Nnamdi', 'grace.nnamdi@example.com', 'Contributor', 'Active', 6, 4, 19],
    ['Kelvin Uche', 'kelvin.uche@example.com', 'Subscriber', 'Suspended', 20, 0, 3],
    ['Amaka Obi', 'amaka.obi@example.com', 'Admin', 'Active', 30, 15, 55],
    ['Femi Bello', 'femi.bello@example.com', 'Editor', 'Active', 12, 6, 27],
    ['Ngozi Eke', 'ngozi.eke@example.com', 'Author', 'Active', 15, 9, 9],
  ]
  return rows.map(([name, email, role, status, daysAgo, posts, imgId], i) => ({
    id: crypto.randomUUID(),
    name,
    email,
    role,
    status,
    posts,
    joinedDate: now - daysAgo * day,
    avatar: `https://i.pravatar.cc/80?img=${imgId}`,
  }))
}

const users = ref([])
function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    users.value = raw ? JSON.parse(raw) : seedUsers()
  } catch {
    users.value = seedUsers()
  }
}
function saveUsers() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value))
  } catch {
    showToast('Could not save — local storage is full.')
  }
}
watch(users, saveUsers, { deep: true })
onMounted(loadUsers)

/* ------------------------------------------------------------------ */
/* Search / filters / pagination                                        */
/* ------------------------------------------------------------------ */
const search = ref('')
const roleFilter = ref('All')
const statusFilter = ref('All')
const showFilters = ref(false)
const currentPage = ref(1)
const pageSize = 7
const openMenuId = ref(null)

function toggleRowMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

const activeFilterCount = computed(
  () => (roleFilter.value !== 'All' ? 1 : 0) + (statusFilter.value !== 'All' ? 1 : 0),
)

const filteredUsers = computed(() => {
  let list = [...users.value]
  if (roleFilter.value !== 'All') list = list.filter((u) => u.role === roleFilter.value)
  if (statusFilter.value !== 'All') list = list.filter((u) => u.status === statusFilter.value)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list.sort((a, b) => b.joinedDate - a.joinedDate)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const paginatedUsers = computed(() =>
  filteredUsers.value.slice(startIndex.value, startIndex.value + pageSize),
)

watch([search, roleFilter, statusFilter], () => (currentPage.value = 1))

const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function clearFilters() {
  search.value = ''
  roleFilter.value = 'All'
  statusFilter.value = 'All'
  showFilters.value = false
  currentPage.value = 1
}

/* ------------------------------------------------------------------ */
/* Add / edit / delete / toggle status                                  */
/* ------------------------------------------------------------------ */
const showModal = ref(false)
const editingId = ref(null)
const formError = ref('')
const form = ref({ name: '', email: '', role: 'Subscriber', status: 'Active' })

function openAddModal() {
  editingId.value = null
  form.value = { name: '', email: '', role: 'Subscriber', status: 'Active' }
  formError.value = ''
  showModal.value = true
}
function openEditModal(u) {
  editingId.value = u.id
  form.value = { name: u.name, email: u.email, role: u.role, status: u.status }
  formError.value = ''
  showModal.value = true
  openMenuId.value = null
}
function closeModal() {
  showModal.value = false
}

function saveUser() {
  const emailTaken = users.value.some(
    (u) => u.email.toLowerCase() === form.value.email.toLowerCase() && u.id !== editingId.value,
  )
  if (emailTaken) {
    formError.value = 'A user with this email already exists.'
    return
  }
  if (editingId.value) {
    const idx = users.value.findIndex((u) => u.id === editingId.value)
    users.value[idx] = { ...users.value[idx], ...form.value }
    showToast('User updated.')
  } else {
    users.value = [
      {
        id: crypto.randomUUID(),
        ...form.value,
        posts: 0,
        joinedDate: Date.now(),
        avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70) + 1}`,
      },
      ...users.value,
    ]
    showToast('User added.')
  }
  showModal.value = false
}

function deleteUser(id) {
  users.value = users.value.filter((u) => u.id !== id)
  openMenuId.value = null
  showToast('User deleted.')
}

function toggleStatus(u) {
  u.status = u.status === 'Suspended' ? 'Active' : 'Suspended'
  openMenuId.value = null
  showToast(`User ${u.status === 'Suspended' ? 'suspended' : 'reactivated'}.`)
}

/* ------------------------------------------------------------------ */
/* Stats / breakdowns                                                    */
/* ------------------------------------------------------------------ */
const counts = computed(() => ({
  active: users.value.filter((u) => u.status === 'Active').length,
  inactive: users.value.filter((u) => u.status === 'Inactive').length,
  suspended: users.value.filter((u) => u.status === 'Suspended').length,
}))

const stats = computed(() => {
  const total = users.value.length || 1
  const activePct = Math.round((counts.value.active / total) * 100)
  const now = new Date()
  const newThisMonth = users.value.filter((u) => {
    const d = new Date(u.joinedDate)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  return [
    {
      label: 'Total Users',
      value: users.value.length,
      subtext: 'All registered users',
      icon: IconUsers,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      label: 'Active Users',
      value: counts.value.active,
      subtext: `${activePct}% of total users`,
      icon: IconUserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Administrators',
      value: users.value.filter((u) => u.role === 'Admin').length,
      subtext: 'System administrators',
      icon: IconShield,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      label: 'New This Month',
      value: newThisMonth,
      subtext: 'Joined this month',
      icon: IconUserPlus,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-500',
    },
  ]
})

const activePercent = computed(() =>
  Math.round((counts.value.active / (users.value.length || 1)) * 100),
)
const radius = 50
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference - (activePercent.value / 100) * circumference)

const rolesBreakdown = computed(() => {
  const colorMap = {
    Admin: 'text-violet-500',
    Editor: 'text-sky-500',
    Author: 'text-indigo-500',
    Contributor: 'text-amber-500',
    Subscriber: 'text-slate-400',
  }
  const labelMap = {
    Admin: 'Administrators',
    Editor: 'Editors',
    Author: 'Authors',
    Contributor: 'Contributors',
    Subscriber: 'Subscribers',
  }
  return roleOptions.map((r) => ({
    role: labelMap[r],
    count: users.value.filter((u) => u.role === r).length,
    color: colorMap[r],
  }))
})

const recentSignups = computed(() =>
  [...users.value].sort((a, b) => b.joinedDate - a.joinedDate).slice(0, 3),
)

/* ------------------------------------------------------------------ */
/* Badge / dot styling                                                   */
/* ------------------------------------------------------------------ */
function roleBadge(role) {
  return {
    Admin: 'bg-violet-50 text-violet-600',
    Editor: 'bg-sky-50 text-sky-600',
    Author: 'bg-indigo-50 text-indigo-600',
    Contributor: 'bg-amber-50 text-amber-600',
    Subscriber: 'bg-slate-100 text-slate-500',
  }[role]
}
function statusDot(status) {
  return { Active: 'bg-emerald-500', Inactive: 'bg-slate-400', Suspended: 'bg-red-500' }[status]
}

/* ------------------------------------------------------------------ */
/* Formatting                                                            */
/* ------------------------------------------------------------------ */
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
</script>
