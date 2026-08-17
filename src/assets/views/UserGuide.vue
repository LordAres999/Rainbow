<template>
  <div class="flex min-h-screen bg-slate-50 font-sans">
    <Sidebar />

    <main class="flex-1 ml-64 p-8">
      <Header title="User Guide" />

      <!-- Statistics -->
      <section class="grid grid-cols-4 gap-4 mt-6">
        <StatCard
          icon="book"
          label="Guides"
          value="12"
          description="Total guides"
          iconClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon="article"
          label="Articles"
          value="48"
          description="Help articles"
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon="play"
          label="Video Tutorials"
          value="8"
          description="Step-by-step videos"
          iconClass="bg-amber-50 text-amber-500"
        />
        <StatCard
          icon="download"
          label="Downloads"
          value="5"
          description="Helpful resources"
          iconClass="bg-blue-50 text-blue-600"
        />
      </section>

      <div class="grid grid-cols-[minmax(0,1fr)_275px] gap-5 mt-6">
        <!-- Main documentation -->
        <section class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <!-- Welcome -->
          <div class="px-8 py-7 border-b border-slate-100">
            <div class="flex items-center justify-between gap-8">
              <div class="max-w-[55%]">
                <h3 class="text-xl font-semibold text-slate-900">Welcome to Rainbow</h3>
                <p class="text-sm text-slate-600 leading-6 mt-3">
                  Your all-in-one platform for creating, managing, and sharing amazing content. This
                  guide will help you understand how to make the most of Rainbow.
                </p>
              </div>

              <div
                class="w-[280px] h-[145px] rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center"
              >
                <img
                  :src="userguideImage"
                  alt="User Guide"
                  class="max-h-full max-w-full rounded-3xl object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Getting started -->
          <div class="px-7 py-7 border-b border-slate-100">
            <h3 class="text-lg font-semibold">Getting Started</h3>
            <p class="text-sm text-slate-500 mt-1">
              New to Rainbow? Follow these steps to get started.
            </p>

            <div class="grid grid-cols-5 gap-3 mt-8">
              <GuideStep
                number="1"
                icon="userPlus"
                title="Create Account"
                text="Sign up or log in to your account."
              />
              <GuideStep
                number="2"
                icon="gear"
                title="Set Up Profile"
                text="Add your profile details and preferences."
              />
              <GuideStep
                number="3"
                icon="edit"
                title="Create Content"
                text="Create your first post or upload media."
              />
              <GuideStep
                number="4"
                icon="organize"
                title="Organize"
                text="Use categories to organize your content."
              />
              <GuideStep
                number="5"
                icon="engage"
                title="Engage"
                text="Connect with users and grow your audience."
              />
            </div>
          </div>

          <!-- Popular guides -->
          <div class="px-7 py-7">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">Popular Guides</h3>
                <p class="text-sm text-slate-500 mt-1">
                  Browse our most popular guides and tutorials.
                </p>
              </div>
              <a href="#" class="text-sm text-indigo-600 font-medium flex items-center gap-2">
                View all guides <Icon name="arrowRight" klass="w-4 h-4" />
              </a>
            </div>

            <div class="grid grid-cols-4 gap-4 mt-6">
              <GuideCard
                icon="edit"
                title="Creating Your First Post"
                text="Learn how to create engaging posts."
              />
              <GuideCard
                icon="folder"
                title="Managing Categories"
                text="Organize your content with categories."
              />
              <GuideCard
                icon="media"
                title="Uploading Media"
                text="Upload and manage your images, videos, and files."
              />
              <GuideCard
                icon="users"
                title="Managing Users"
                text="Add, edit, and manage user accounts."
              />
            </div>
          </div>
        </section>

        <!-- Right column -->
        <aside class="space-y-4">
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h3 class="font-semibold">On This Page</h3>
            <div class="mt-5 space-y-3 text-sm">
              <a
                v-for="item in contents"
                :key="item"
                href="#"
                class="block text-slate-600 hover:text-indigo-600"
              >
                {{ item }}
              </a>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h3 class="font-semibold">Need Help?</h3>
            <div class="flex justify-center mt-5">
              <div
                class="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"
              >
                <Icon name="headset" klass="w-7 h-7" />
              </div>
            </div>
            <p class="text-sm text-center text-slate-500 leading-5 mt-4">
              Can't find what you're looking for?<br />
              Our support team is here to help.
            </p>
            <button
              @click="supportOpen = true"
              class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm flex items-center justify-center gap-2"
            >
              <Icon name="mail" klass="w-4 h-4" />
              Contact Support
            </button>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-5">
            <h3 class="font-semibold">Quick Resources</h3>
            <div class="mt-4 divide-y divide-slate-100">
              <a
                v-for="item in resources"
                :key="item.label"
                href="#"
                class="flex items-center justify-between py-3 text-sm"
              >
                <span class="flex items-center gap-3 text-slate-600">
                  <Icon :name="item.icon" klass="w-4 h-4" />
                  {{ item.label }}
                </span>
                <Icon name="chevronRight" klass="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      <!-- CONTACT SUPPORT MODAL -->
      <div
        v-if="supportOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="closeSupport"
      >
        <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Contact Support</h2>
              <p class="text-sm text-slate-500 mt-1">Send a message to the Rainbow admin team.</p>
            </div>
            <button
              @click="closeSupport"
              class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500"
            >
              ✕
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitSupport" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                v-model="supportForm.name"
                type="text"
                required
                placeholder="Enter your name"
                class="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                v-model="supportForm.email"
                type="email"
                required
                placeholder="Enter your email"
                class="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                v-model="supportForm.message"
                rows="5"
                required
                placeholder="Describe the issue you need help with..."
                class="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="closeSupport"
                class="px-5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                Submit Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- SUCCESS TOAST -->
      <transition name="toast">
        <div
          v-if="showSuccessToast"
          class="fixed bottom-6 right-6 z-[100] w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-2xl border border-slate-100 p-4"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center"
            >
              ✓
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-slate-900">Message submitted</h4>
              <p class="text-sm text-slate-500 mt-1 leading-5">
                Your message has been submitted. The admin will get back to you shortly.
              </p>
            </div>
            <button @click="showSuccessToast = false" class="text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { h, ref, reactive } from 'vue'
import Sidebar from '@/assets/components/layout/Sidebar.vue'
import Header from '@/assets/components/layout/Header.vue'
import userguideImage from '@/assets/images/userguide.png'

const contents = [
  'Welcome',
  'Getting Started',
  'Popular Guides',
  'Platform Overview',
  'FAQs',
  'Support',
]

const resources = [
  { label: 'Keyboard Shortcuts', icon: 'keyboard' },
  { label: 'System Requirements', icon: 'system' },
  { label: 'Release Notes', icon: 'notes' },
  { label: 'Video Tutorials', icon: 'video' },
  { label: 'API Documentation', icon: 'api' },
]

const supportOpen = ref(false)
const showSuccessToast = ref(false)
const supportForm = reactive({
  name: '',
  email: '',
  message: '',
})

const closeSupport = () => {
  supportOpen.value = false
}

const submitSupport = () => {
  supportOpen.value = false
  showSuccessToast.value = true
  supportForm.name = ''
  supportForm.email = ''
  supportForm.message = ''

  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const iconPaths = {
  home: '<path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1V10"/>',
  post: '<path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  folder: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>',
  media:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  users:
    '<path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4a4 4 0 11-8 0 4 4 0 018 0zm10 0a4 4 0 11-8 0 4 4 0 018 0z"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.31.44.5.9.5H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4a2 2 0 00-2-2H6.5A2.5 2.5 0 004 4.5v15z"/>',
  article:
    '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/>',
  download: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>',
  userPlus:
    '<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2M19 8v6M22 11h-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.31.44.5.9.5H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  edit: '<path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  organize: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>',
  engage:
    '<path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4a4 4 0 11-8 0 4 4 0 018 0zm10 0a4 4 0 11-8 0 4 4 0 018 0z"/>',
  keyboard:
    '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/>',
  system: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  notes:
    '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
  video: '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="M16 10l6-3v10l-6-3"/>',
  api: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  headset:
    '<path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"/>',
  mail: '<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
  arrowRight: '<path d="M17 8l4 4m0 0l-4 4m4-4H3"/>',
  chevronRight: '<path d="M9 5l7 7-7 7"/>',
}

const Icon = (props) =>
  h('svg', {
    class: props.klass || 'w-5 h-5',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    viewBox: '0 0 24 24',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    innerHTML: iconPaths[props.name] || '',
  })

const StatCard = (props) =>
  h('div', { class: 'bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4' }, [
    h(
      'div',
      { class: `w-14 h-14 rounded-xl flex items-center justify-center ${props.iconClass}` },
      [h(Icon, { name: props.icon, klass: 'w-7 h-7' })],
    ),
    h('div', {}, [
      h('p', { class: 'text-sm text-slate-500' }, props.label),
      h('p', { class: 'text-2xl font-semibold text-slate-900 mt-1' }, props.value),
      h('p', { class: 'text-xs text-slate-400 mt-1' }, props.description),
    ]),
  ])

const GuideStep = (props) =>
  h('div', { class: 'text-center relative' }, [
    h('div', { class: 'flex justify-center' }, [
      h(
        'div',
        {
          class:
            'w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center',
        },
        [h(Icon, { name: props.icon, klass: 'w-6 h-6' })],
      ),
    ]),
    h(
      'div',
      {
        class:
          'w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center mx-auto -mt-1 relative border-2 border-white',
      },
      props.number,
    ),
    h('h4', { class: 'font-semibold text-sm mt-3' }, props.title),
    h('p', { class: 'text-xs text-slate-500 leading-5 mt-1 px-2' }, props.text),
  ])

const GuideCard = (props) =>
  h('div', { class: 'border border-slate-100 rounded-xl p-4 hover:shadow-md transition' }, [
    h(
      'div',
      {
        class: 'w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center',
      },
      [h(Icon, { name: props.icon, klass: 'w-5 h-5' })],
    ),
    h('h4', { class: 'font-semibold text-sm mt-4' }, props.title),
    h('p', { class: 'text-xs text-slate-500 leading-5 mt-2 min-h-[40px]' }, props.text),
    h(
      'a',
      {
        href: '#',
        class: 'text-xs text-indigo-600 font-medium mt-4 inline-flex items-center gap-2',
      },
      ['Read Guide', h(Icon, { name: 'arrowRight', klass: 'w-3.5 h-3.5' })],
    ),
  ])
</script>
