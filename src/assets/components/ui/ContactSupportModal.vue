<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50"
        @click.self="handleClose"
      >
        <transition name="scale" appear>
          <div v-if="open" class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <template v-if="!submitted">
              <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-lg">Contact Support</h3>
                  <p class="text-xs text-slate-400 mt-0.5">We usually reply within a few hours.</p>
                </div>
                <button @click="handleClose" class="text-slate-400 hover:text-slate-600 rounded-lg p-1">
                  <Icon name="close" klass="w-5 h-5" />
                </button>
              </div>

              <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <input
                    v-model.trim="form.name"
                    type="text"
                    required
                    placeholder="Eze Michael"
                    class="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input
                    v-model.trim="form.email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    class="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Topic</label>
                  <select
                    v-model="form.topic"
                    required
                    class="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option>Account issue</option>
                    <option>Billing question</option>
                    <option>Feature request</option>
                    <option>Bug report</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    v-model.trim="form.message"
                    required
                    rows="4"
                    placeholder="Tell us what's going on..."
                    class="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <div class="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    @click="handleClose"
                    class="flex-1 border border-slate-200 text-slate-600 font-medium text-sm rounded-lg py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="sending"
                    class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg v-if="sending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    {{ sending ? 'Sending...' : 'Submit' }}
                  </button>
                </div>
              </form>
            </template>

            <template v-else>
              <div class="px-8 py-10 text-center">
                <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <Icon name="check" klass="w-8 h-8 text-green-600" />
                </div>
                <h3 class="font-bold text-slate-900 text-lg mb-2">Message submitted</h3>
                <p class="text-sm text-slate-500 leading-relaxed mb-6">
                  Thanks, {{ firstName }}. Our support team has received your message and will
                  reach out to you at <span class="font-medium text-slate-700">{{ form.email }}</span> shortly.
                </p>
                <button
                  @click="handleClose"
                  class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg py-2.5 transition-colors"
                >
                  Done
                </button>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'submitted'])

const submitted = ref(false)
const sending = ref(false)
const form = reactive({ name: '', email: '', topic: '', message: '' })

const firstName = computed(() => form.name.split(' ')[0] || 'there')

function handleClose() {
  emit('update:open', false)
  setTimeout(() => {
    submitted.value = false
    form.name = ''
    form.email = ''
    form.topic = ''
    form.message = ''
  }, 200)
}

function submitForm() {
  sending.value = true
  setTimeout(() => {
    sending.value = false
    submitted.value = true
    emit('submitted', { ...form })
  }, 900)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active {
  transition: all 0.2s ease-out;
}
.scale-leave-active {
  transition: all 0.15s ease-in;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
