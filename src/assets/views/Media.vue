<template>
  <div class="flex min-h-screen bg-slate-50 font-sans">
    <Sidebar />

    <!-- Main -->
    <main class="flex-1 ml-64 p-6 space-y-6">
      <Header title="Media" :userName="user.name" :role="user.role" />

      <!-- Stat cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
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

      <!-- Body: media grid + right rail -->
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <!-- Media card -->
        <div class="bg-white rounded-2xl shadow-sm">
          <!-- Tabs + Upload -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-5">
            <div
              class="flex items-center gap-6 border-b border-slate-100 w-full sm:w-auto -mb-px overflow-x-auto"
            >
              <button
                v-for="tab in tabs"
                :key="tab"
                @click="activeTab = tab; currentPage = 1"
                class="pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                :class="
                  activeTab === tab
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                "
              >
                {{ tab }}
              </button>
            </div>
            <button
              @click="fileInput.click()"
              class="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm shrink-0"
            >
              <IconUploadCloud class="w-4 h-4" />
              Upload Media
            </button>
            <input ref="fileInput" type="file" multiple class="hidden" @change="handleFiles" />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-slate-100">
            <select
              v-model="categoryFilter"
              class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="All">All Categories</option>
              <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
            </select>

            <select
              v-model="typeFilter"
              class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="All">All Types</option>
              <option v-for="t in extensionOptions" :key="t" :value="t">{{ t }}</option>
            </select>

            <select
              v-model="sortBy"
              class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="largest">Largest First</option>
              <option value="smallest">Smallest First</option>
            </select>

            <div class="relative flex-1 min-w-[180px]">
              <IconSearch class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="search"
                type="text"
                placeholder="Search media..."
                class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              @click="clearFilters"
              class="flex items-center gap-2 text-sm font-medium text-slate-500 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50"
              title="Clear all filters"
            >
              <IconFilter class="w-4 h-4" />
              Filters
            </button>
          </div>

          <!-- Grid -->
          <div class="p-6">
            <div
              v-if="paginatedMedia.length"
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              <div v-for="item in paginatedMedia" :key="item.id" class="group relative">
                <div
                  class="relative aspect-square rounded-xl overflow-hidden flex items-center justify-center"
                  :class="thumbBg(item)"
                >
                  <img
                    v-if="item.dataUrl"
                    :src="item.dataUrl"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                  <component
                    v-else
                    :is="thumbIcon(item)"
                    class="w-10 h-10"
                    :class="thumbIconColor(item)"
                  />

                  <span
                    class="absolute top-2 left-2 w-6 h-6 rounded-md bg-black/40 flex items-center justify-center"
                  >
                    <component :is="typeGlyph(item.type)" class="w-3.5 h-3.5 text-white" />
                  </span>
                  <span
                    class="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-black/60 text-white"
                  >
                    {{ item.ext }}
                  </span>

                  <button
                    @click.stop="toggleMenu(item.id)"
                    class="absolute bottom-2 right-2 w-7 h-7 rounded-md bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IconDots class="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                <p class="mt-2 text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-slate-400">
                    {{ formatDate(item.dateAdded) }} • {{ formatBytes(item.size) }}
                  </p>
                  <button @click="toggleMenu(item.id)" class="text-slate-400 hover:text-slate-600">
                    <IconDots class="w-4 h-4" />
                  </button>
                </div>

                <!-- Dropdown menu -->
                <div
                  v-if="openMenuId === item.id"
                  class="absolute z-20 right-0 top-10 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1 text-sm"
                >
                  <button
                    @click="previewItem = item; openMenuId = null"
                    class="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50"
                  >
                    <IconEye class="w-4 h-4" /> Preview
                  </button>
                  <button
                    @click="downloadMedia(item)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50"
                  >
                    <IconDownload class="w-4 h-4" /> Download
                  </button>
                  <button
                    @click="deleteMedia(item.id)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50"
                  >
                    <IconTrash class="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-16 text-sm text-slate-400">
              No media files match your filters.
            </div>
          </div>

          <!-- Footer / pagination -->
          <div
            class="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-500"
          >
            <p>
              Showing {{ filteredMedia.length === 0 ? 0 : startIndex + 1 }} to
              {{ Math.min(startIndex + pageSize, filteredMedia.length) }} of
              {{ filteredMedia.length }} media files
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

        <!-- Right rail -->
        <div class="space-y-6">
          <!-- Storage overview -->
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h3 class="text-sm font-bold text-slate-900 mb-4">Storage Overview</h3>
            <div class="flex flex-col items-center">
              <svg viewBox="0 0 120 120" class="w-36 h-36 -rotate-90">
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
              <div class="-mt-24 text-center">
                <p class="text-2xl font-bold text-slate-900">{{ storagePercent }}%</p>
                <p class="text-xs text-slate-400">Used</p>
              </div>
              <div class="mt-16 w-full">
                <p class="text-sm text-slate-600 text-center">
                  {{ formatGB(usedBytes) }} of {{ storageLimitGB }} GB used
                </p>
                <div class="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full bg-indigo-500 rounded-full"
                    :style="{ width: storagePercent + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent uploads -->
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-slate-900">Recent Uploads</h3>
              <button
                @click="clearFilters"
                class="text-xs font-medium text-indigo-500 hover:text-indigo-600"
              >
                View all
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="item in recentUploads" :key="item.id" class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
                  :class="thumbBg(item)"
                >
                  <img v-if="item.dataUrl" :src="item.dataUrl" class="w-full h-full object-cover" />
                  <component
                    v-else
                    :is="thumbIcon(item)"
                    class="w-4 h-4"
                    :class="thumbIconColor(item)"
                  />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">{{ item.name }}</p>
                  <p class="text-xs text-slate-400">
                    {{ formatDate(item.dateAdded) }} • {{ formatBytes(item.size) }}
                  </p>
                </div>
              </div>
              <p v-if="!recentUploads.length" class="text-xs text-slate-400">No uploads yet.</p>
            </div>
            <button
              @click="clearFilters"
              class="mt-4 w-full flex items-center justify-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
            >
              View all uploads
              <IconChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Preview modal -->
    <div
      v-if="previewItem"
      @click.self="previewItem = null"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div class="aspect-video flex items-center justify-center" :class="thumbBg(previewItem)">
          <img
            v-if="previewItem.dataUrl"
            :src="previewItem.dataUrl"
            class="w-full h-full object-contain"
          />
          <component
            v-else
            :is="thumbIcon(previewItem)"
            class="w-16 h-16"
            :class="thumbIconColor(previewItem)"
          />
        </div>
        <div class="p-5">
          <p class="font-semibold text-slate-900">{{ previewItem.name }}</p>
          <p class="text-sm text-slate-400 mt-1">
            {{ formatDate(previewItem.dateAdded) }} • {{ formatBytes(previewItem.size) }} •
            {{ previewItem.ext }}
          </p>
          <div class="flex items-center gap-2 mt-4">
            <button
              @click="downloadMedia(previewItem)"
              class="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            >
              <IconDownload class="w-4 h-4" /> Download
            </button>
            <button
              @click="deleteMedia(previewItem.id); previewItem = null"
              class="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
            >
              <IconTrash class="w-4 h-4" /> Delete
            </button>
            <button
              @click="previewItem = null"
              class="ml-auto text-sm font-medium px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
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
/* Icons — inline SVG, zero external dependency                        */
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
const IconSettings = makeIcon([
  'M12 15a3 3 0 100-6 3 3 0 000 6z',
  'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 008 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.36.22.75.22 1.15V10a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
])
const IconUser = makeIcon([
  'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2',
  'M12 11a4 4 0 100-8 4 4 0 000 8z',
])
const IconSearch = makeIcon(['M21 21l-4.35-4.35', 'M11 19a8 8 0 100-16 8 8 0 000 16z'])
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
const IconPlay = makeIcon(['M5 3l14 9-14 9V3z'])
const IconMusic = makeIcon([
  'M9 18V5l12-2v13',
  'M6 21a3 3 0 100-6 3 3 0 000 6z',
  'M18 19a3 3 0 100-6 3 3 0 000 6z',
])
const IconFileText = makeIcon([
  'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z',
  'M14 2v6h6',
  'M9 13h6',
  'M9 17h6',
])
const IconLayers = makeIcon(['M12 2l9 5-9 5-9-5 9-5z', 'M3 12l9 5 9-5', 'M3 17l9 5 9-5'])
const IconUploadCloud = makeIcon([
  'M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25',
  'M12 12v9',
  'M9 16l3-3 3 3',
])
const IconDots = makeIcon([
  'M12 13a1 1 0 100-2 1 1 0 000 2z',
  'M19 13a1 1 0 100-2 1 1 0 000 2z',
  'M5 13a1 1 0 100-2 1 1 0 000 2z',
])
const IconEye = makeIcon([
  'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
  'M12 15a3 3 0 100-6 3 3 0 000 6z',
])
const IconDownload = makeIcon([
  'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4',
  'M7 10l5 5 5-5',
  'M12 15V3',
])
const IconFilter = makeIcon(['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'])

/* ------------------------------------------------------------------ */
/* User                                                                */
/* ------------------------------------------------------------------ */
const user = {
  name: 'Eze Michael',
  role: 'Head of Media',
  avatar: 'https://i.pravatar.cc/80?img=13',
}

/* ------------------------------------------------------------------ */
/* Storage config                                                      */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = 'rainbow-media-library-v1'
const storageLimitGB = 10 // simulated plan quota shown in the UI
const MAX_PREVIEW_BYTES = 2 * 1024 * 1024 // only inline-store previews for files under 2MB to protect localStorage quota

const toast = ref('')
function showToast(msg) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2500)
}

/* ------------------------------------------------------------------ */
/* Seed data (used only the first time, before any real uploads)       */
/* ------------------------------------------------------------------ */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function seedMedia() {
  const day = 24 * 60 * 60 * 1000
  const now = Date.now()
  return [
    {
      id: generateId(),
      name: 'mountain-lake.jpg',
      ext: 'JPG',
      type: 'image',
      category: 'Photography',
      size: 2.4 * 1024 * 1024,
      dateAdded: now - 2 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'city-sunset.mp4',
      ext: 'MP4',
      type: 'video',
      category: 'Travel',
      size: 18.7 * 1024 * 1024,
      dateAdded: now - 3 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'podcast-episode.mp3',
      ext: 'MP3',
      type: 'audio',
      category: 'Podcast',
      size: 6.3 * 1024 * 1024,
      dateAdded: now - 4 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'content-guidelines.pdf',
      ext: 'PDF',
      type: 'document',
      category: 'Marketing',
      size: 1.2 * 1024 * 1024,
      dateAdded: now - 5 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'camera-review.jpg',
      ext: 'JPG',
      type: 'image',
      category: 'Photography',
      size: 3.1 * 1024 * 1024,
      dateAdded: now - 6 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'ocean-waves.mp4',
      ext: 'MP4',
      type: 'video',
      category: 'Travel',
      size: 12.8 * 1024 * 1024,
      dateAdded: now - 7 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'ambient-sound.wav',
      ext: 'WAV',
      type: 'audio',
      category: 'Podcast',
      size: 24.6 * 1024 * 1024,
      dateAdded: now - 8 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'marketing-plan.pptx',
      ext: 'PPT',
      type: 'document',
      category: 'Marketing',
      size: 2.7 * 1024 * 1024,
      dateAdded: now - 9 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'nature-view.jpg',
      ext: 'JPG',
      type: 'image',
      category: 'Photography',
      size: 2.4 * 1024 * 1024,
      dateAdded: now - 1 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'night-drive.mp4',
      ext: 'MP4',
      type: 'video',
      category: 'Travel',
      size: 15.6 * 1024 * 1024,
      dateAdded: now - 1.5 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'lofi-chill.mp3',
      ext: 'MP3',
      type: 'audio',
      category: 'Podcast',
      size: 4.8 * 1024 * 1024,
      dateAdded: now - 0.5 * day,
      dataUrl: null,
    },
    {
      id: generateId(),
      name: 'brand-guidelines.pdf',
      ext: 'PDF',
      type: 'document',
      category: 'Marketing',
      size: 1.8 * 1024 * 1024,
      dateAdded: now - 3.5 * day,
      dataUrl: null,
    },
  ]
}

const mediaList = ref([])

function loadMedia() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    mediaList.value = raw ? JSON.parse(raw) : seedMedia()
  } catch {
    mediaList.value = seedMedia()
  }
}

function saveMedia() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mediaList.value))
  } catch (e) {
    try {
      const stripped = mediaList.value.map((m) => ({ ...m, dataUrl: null }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped))
      showToast('Storage limit reached — file previews were dropped to keep your data saved.')
    } catch {
      showToast('Could not save media list — local storage is full.')
    }
  }
}

watch(mediaList, saveMedia, { deep: true })
onMounted(loadMedia)

/* ------------------------------------------------------------------ */
/* Upload / delete                                                     */
/* ------------------------------------------------------------------ */
const fileInput = ref(null)

function detectType(file) {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  return 'document'
}

function handleFiles(e) {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  files.forEach((file) => {
    const type = detectType(file)
    const ext = (file.name.split('.').pop() || 'FILE').toUpperCase().slice(0, 4)
    const entry = {
      id: generateId(),
      name: file.name,
      ext,
      type,
      category: 'Uploads',
      size: file.size,
      dateAdded: Date.now(),
      dataUrl: null,
    }

    mediaList.value = [entry, ...mediaList.value]

    if (type === 'image' && file.size <= MAX_PREVIEW_BYTES) {
      const reader = new FileReader()
      reader.onload = () => {
        const index = mediaList.value.findIndex((item) => item.id === entry.id)
        if (index !== -1) {
          mediaList.value[index].dataUrl = reader.result
        }
      }
      reader.readAsDataURL(file)
    }
  })

  currentPage.value = 1
  e.target.value = ''
  showToast(`${files.length} file${files.length !== 1 ? 's' : ''} uploaded.`)
}

function deleteMedia(id) {
  mediaList.value = mediaList.value.filter((m) => m.id !== id)
  openMenuId.value = null
  showToast('File deleted.')
}

function downloadMedia(item) {
  if (!item.dataUrl) {
    showToast('No file data stored for this item (demo entry).')
    return
  }
  const a = document.createElement('a')
  a.href = item.dataUrl
  a.download = item.name
  a.click()
}

/* ------------------------------------------------------------------ */
/* Filters / sorting / pagination                                      */
/* ------------------------------------------------------------------ */
const tabs = ['All Media', 'Images', 'Videos', 'Audio', 'Documents']
const activeTab = ref('All Media')
const categoryFilter = ref('All')
const typeFilter = ref('All')
const sortBy = ref('newest')
const search = ref('')
const currentPage = ref(1)
const pageSize = 8
const openMenuId = ref(null)
const previewItem = ref(null)

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

const categoryOptions = computed(() => [
  ...new Set(mediaList.value.map((m) => m.category).filter(Boolean)),
])
const extensionOptions = computed(() => [...new Set(mediaList.value.map((m) => m.ext))])

const tabTypeMap = {
  'All Media': 'All',
  Images: 'image',
  Videos: 'video',
  Audio: 'audio',
  Documents: 'document',
}

const filteredMedia = computed(() => {
  let list = [...mediaList.value]
  const tabType = tabTypeMap[activeTab.value]
  if (tabType !== 'All') list = list.filter((m) => m.type === tabType)
  if (categoryFilter.value !== 'All') list = list.filter((m) => m.category === categoryFilter.value)
  if (typeFilter.value !== 'All') list = list.filter((m) => m.ext === typeFilter.value)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter((m) => m.name.toLowerCase().includes(q))
  }
  switch (sortBy.value) {
    case 'oldest':
      list.sort((a, b) => a.dateAdded - b.dateAdded)
      break
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'largest':
      list.sort((a, b) => b.size - a.size)
      break
    case 'smallest':
      list.sort((a, b) => a.size - b.size)
      break
    default:
      list.sort((a, b) => b.dateAdded - a.dateAdded)
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMedia.value.length / pageSize)))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const paginatedMedia = computed(() =>
  filteredMedia.value.slice(startIndex.value, startIndex.value + pageSize),
)

watch([activeTab, categoryFilter, typeFilter, search], () => (currentPage.value = 1))

function clearFilters() {
  activeTab.value = 'All Media'
  categoryFilter.value = 'All'
  typeFilter.value = 'All'
  sortBy.value = 'newest'
  search.value = ''
  currentPage.value = 1
}

const recentUploads = computed(() =>
  [...mediaList.value].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 5),
)

/* ------------------------------------------------------------------ */
/* Stats                                                                */
/* ------------------------------------------------------------------ */
const stats = computed(() => {
  const total = mediaList.value.length || 1
  const count = (type) => mediaList.value.filter((m) => m.type === type).length
  const pct = (n) => Math.round((n / total) * 100)
  return [
    {
      label: 'Images',
      value: count('image'),
      subtext: `${pct(count('image'))}% of total`,
      icon: IconImage,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      label: 'Videos',
      value: count('video'),
      subtext: `${pct(count('video'))}% of total`,
      icon: IconVideo,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-500',
    },
    {
      label: 'Audio',
      value: count('audio'),
      subtext: `${pct(count('audio'))}% of total`,
      icon: IconMusic,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      label: 'Documents',
      value: count('document'),
      subtext: `${pct(count('document'))}% of total`,
      icon: IconFileText,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Total Files',
      value: mediaList.value.length,
      subtext: 'All media files',
      icon: IconLayers,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
  ]
})

const usedBytes = computed(() => mediaList.value.reduce((sum, m) => sum + (m.size || 0), 0))
const storagePercent = computed(() =>
  Math.min(100, Math.round((usedBytes.value / (storageLimitGB * 1024 ** 3)) * 100)),
)

const circumference = 2 * Math.PI * 50
const dashOffset = computed(() => circumference * (1 - storagePercent.value / 100))

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${Math.round(bytes / (1024 * 1024))} MB`
}

function formatGB(bytes) {
  return (bytes / 1024 ** 3).toFixed(1)
}

function thumbBg(item) {
  if (item.type === 'image') return 'bg-slate-100'
  if (item.type === 'video') return 'bg-slate-900/5'
  if (item.type === 'audio') return 'bg-amber-50'
  return 'bg-slate-50'
}

function thumbIcon(item) {
  if (item.type === 'image') return IconCamera
  if (item.type === 'video') return IconPlay
  if (item.type === 'audio') return IconMusic
  return IconFileText
}

function thumbIconColor(item) {
  if (item.type === 'image') return 'text-indigo-500'
  if (item.type === 'video') return 'text-sky-500'
  if (item.type === 'audio') return 'text-amber-500'
  return 'text-slate-500'
}
</script>
