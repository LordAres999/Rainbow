<template>
  <div class="flex min-h-screen bg-slate-50 font-sans">
    <Sidebar />

    <main class="flex-1 ml-64 p-6 space-y-6">
      <Header title="Categories" :userName="user.name" :role="user.role" />

      <div class="space-y-6">
        <div
          class="bg-white rounded-2xl shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h2 class="text-2xl font-bold text-slate-900">All Categories</h2>
            <p class="text-sm text-slate-500 mt-1">Manage and organize your content categories.</p>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <IconSearch class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="search"
                type="text"
                placeholder="Search categories..."
                class="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
              />
            </div>
            <button
              @click="openForm()"
              class="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
            >
              <IconPlus class="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        <div v-if="showForm" class="bg-white rounded-2xl shadow-sm px-6 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ isEditing ? 'Edit category' : 'Add new category' }}
              </h3>
              <p class="text-sm text-slate-500 mt-1">
                {{
                  isEditing
                    ? 'Update the category details below.'
                    : 'Create a category that fits your content.'
                }}
              </p>
            </div>
            <button @click="closeForm" class="text-sm text-slate-500 hover:text-slate-900">
              Cancel
            </button>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block text-sm text-slate-700">
              Name
              <input
                v-model="form.name"
                type="text"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label class="block text-sm text-slate-700">
              Slug
              <input
                v-model="form.slug"
                type="text"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label class="block text-sm text-slate-700 md:col-span-2">
              Description
              <textarea
                v-model="form.description"
                rows="3"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label class="block text-sm text-slate-700">
              Posts
              <input
                v-model.number="form.posts"
                type="number"
                min="0"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label class="block text-sm text-slate-700">
              Status
              <select
                v-model="form.status"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 mt-6">
            <button
              @click="closeForm"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              @click="saveCategory"
              class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              {{ isEditing ? 'Save changes' : 'Add category' }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr
                class="text-xs font-semibold text-slate-400 uppercase tracking-wide border-y border-slate-100"
              >
                <th class="px-6 py-3">Category</th>
                <th class="px-6 py-3">Description</th>
                <th class="px-6 py-3">Posts</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Created</th>
                <th class="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="category in paginatedCategories"
                :key="category.id"
                class="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      :class="category.iconBg"
                    >
                      <component :is="category.icon" class="w-5 h-5" :class="category.iconColor" />
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 text-sm">{{ category.name }}</p>
                      <p class="text-xs text-slate-400">{{ category.slug }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-600 max-w-xs">
                  {{ category.description }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">
                  <p class="font-semibold">{{ category.posts }}</p>
                  <p class="text-xs text-slate-400">posts</p>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-block text-xs font-medium px-3 py-1 rounded-full"
                    :class="
                      category.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    "
                  >
                    {{ category.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">
                  <p>{{ category.createdDate }}</p>
                  <p class="text-xs text-slate-400">{{ category.createdRelative }}</p>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="editCategory(category)"
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors"
                      aria-label="Edit category"
                    >
                      <IconEdit class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteCategory(category)"
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      aria-label="Delete category"
                    >
                      <IconTrash class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="paginatedCategories.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-400">
                  No categories match your search.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between px-6 py-4 text-sm text-slate-500">
          <p>
            Showing {{ filteredCategories.length === 0 ? 0 : startIndex + 1 }} to
            {{ Math.min(startIndex + pageSize, filteredCategories.length) }} of
            {{ filteredCategories.length }} categories
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
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
              :class="
                currentPage === page
                  ? 'bg-indigo-500 text-white'
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
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, h } from 'vue'
import Sidebar from '@/assets/components/layout/Sidebar.vue'
import Header from '@/assets/components/layout/Header.vue'

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
const IconCamera = makeIcon([
  'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z',
  'M12 17a4 4 0 100-8 4 4 0 000 8z',
])
const IconVideo = makeIcon([
  'M23 7l-7 5 7 5V7z',
  'M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z',
])
const IconMusic = makeIcon([
  'M9 18V5l12-2v13',
  'M6 21a3 3 0 100-6 3 3 0 000 6z',
  'M18 19a3 3 0 100-6 3 3 0 000 6z',
])
const IconFolder = makeIcon([
  'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
])

const user = {
  name: 'Eze Michael',
  role: 'Head of Media',
  avatar: 'https://i.pravatar.cc/80?img=13',
}

const categories = ref([
  {
    id: 1,
    name: 'Photography',
    slug: 'photos',
    description: 'Capturing moments and visual stories through photography.',
    posts: 5,
    status: 'Active',
    createdDate: '26 June 2024',
    createdRelative: '2 days ago',
    icon: IconCamera,
    iconBg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-500',
  },
  {
    id: 2,
    name: 'Videos',
    slug: 'videos',
    description: 'Engaging videos and motion content.',
    posts: 3,
    status: 'Active',
    createdDate: '24 June 2024',
    createdRelative: '4 days ago',
    icon: IconVideo,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
  },
  {
    id: 3,
    name: 'Music',
    slug: 'music',
    description: 'Songs, albums, and music-related content.',
    posts: 2,
    status: 'Active',
    createdDate: '22 June 2024',
    createdRelative: '6 days ago',
    icon: IconMusic,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
])

const stats = computed(() => [
  {
    label: 'Total Categories',
    value: categories.value.length,
    subtext: 'All categories',
    icon: IconCamera,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
  },
  {
    label: 'Active Categories',
    value: categories.value.filter((c) => c.status === 'Active').length,
    subtext: 'Currently active',
    icon: IconMusic,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    label: 'Total Posts',
    value: categories.value.reduce((sum, c) => sum + c.posts, 0),
    subtext: 'Across all categories',
    icon: IconVideo,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    label: 'Total Followers',
    value: 245,
    subtext: 'Across all categories',
    icon: IconMusic,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
  },
])

const search = ref('')
const currentPage = ref(1)
const pageSize = 5
const showForm = ref(false)
const isEditing = ref(false)

const form = reactive({
  id: null,
  name: '',
  slug: '',
  description: '',
  posts: 0,
  status: 'Active',
})

const filteredCategories = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value.filter(
    (category) =>
      category.name.toLowerCase().includes(q) ||
      category.slug.toLowerCase().includes(q) ||
      category.description.toLowerCase().includes(q),
  )
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCategories.value.length / pageSize)),
)

const startIndex = computed(() => (currentPage.value - 1) * pageSize)

const paginatedCategories = computed(() =>
  filteredCategories.value.slice(startIndex.value, startIndex.value + pageSize),
)

watch(search, () => {
  currentPage.value = 1
})

watch(filteredCategories, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

function resetForm() {
  form.id = null
  form.name = ''
  form.slug = ''
  form.description = ''
  form.posts = 0
  form.status = 'Active'
}

function openForm() {
  resetForm()
  isEditing.value = false
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

function editCategory(category) {
  form.id = category.id
  form.name = category.name
  form.slug = category.slug
  form.description = category.description
  form.posts = category.posts
  form.status = category.status
  isEditing.value = true
  showForm.value = true
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function saveCategory() {
  if (!form.name.trim() || !form.slug.trim()) {
    return
  }

  const now = new Date()
  const createdDate = formatDate(now)
  const createdRelative = 'Just now'

  if (isEditing.value) {
    const index = categories.value.findIndex((item) => item.id === form.id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        name: form.name,
        slug: form.slug,
        description: form.description,
        posts: form.posts,
        status: form.status,
      }
    }
  } else {
    categories.value.unshift({
      id: Date.now(),
      name: form.name,
      slug: form.slug,
      description: form.description,
      posts: form.posts,
      status: form.status,
      createdDate,
      createdRelative,
      icon: IconFolder,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    })
  }

  closeForm()
}

function deleteCategory(category) {
  if (!confirm(`Delete ${category.name}?`)) {
    return
  }
  categories.value = categories.value.filter((item) => item.id !== category.id)
}
</script>
