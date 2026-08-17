<template>
  <teleport to="body">
    <transition name="toast">
      <div
        v-if="show"
        class="fixed top-6 right-6 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
      >
        <Icon name="check" klass="w-4 h-4 text-green-400" />
        {{ message }}
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import Icon from './Icon.vue'

defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' },
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.3s ease-in;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
