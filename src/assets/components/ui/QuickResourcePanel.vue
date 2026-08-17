<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50"
        @click.self="$emit('update:open', false)"
      >
        <transition name="scale" appear>
          <div v-if="open && resource" class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[80vh] flex flex-col">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Icon :name="resource.icon" klass="w-5 h-5 text-indigo-600" />
                </div>
                <h3 class="font-bold text-slate-900 text-lg">{{ resource.label }}</h3>
              </div>
              <button @click="$emit('update:open', false)" class="text-slate-400 hover:text-slate-600 rounded-lg p-1">
                <Icon name="close" klass="w-5 h-5" />
              </button>
            </div>
            <div class="px-6 py-5 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-3">
              <p v-for="(paragraph, i) in resource.content" :key="i">{{ paragraph }}</p>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import Icon from './Icon.vue'

defineProps({
  open: { type: Boolean, default: false },
  resource: { type: Object, default: null },
})

defineEmits(['update:open'])
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
