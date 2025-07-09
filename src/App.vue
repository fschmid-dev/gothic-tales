<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from './components/layout/HeaderComponent.vue';
import ContextMenu from '@/components/ContextMenu.vue';

const route = useRoute();

const mainContainerClass = computed(() => {
  return route.meta.mainClass || 'container';
});

const transitionName = ref('fade-left');

watch(
  () => route.fullPath,
  (to, from) => {
    const toDepth = to.split('/').filter(Boolean).length;
    const fromDepth = from.split('/').filter(Boolean).length;

    if (toDepth < fromDepth) {
      transitionName.value = 'fade-right';
    } else {
      transitionName.value = 'fade-left';
    }
  }
);
</script>

<template>
  <HeaderComponent />
  <ContextMenu />

  <RouterView v-slot="{ Component }">
    <main class="my-3" :class="mainContainerClass">
      <Transition :name="transitionName" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </main>
  </RouterView>
</template>

<style lang="scss">
/* Fade von rechts rein (Standard-Verhalten) */
.fade-left-enter-active {
  transition: all 0.3s ease-out;
}

.fade-left-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.fade-left-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

/* Fade von links rein */
.fade-right-enter-active {
  transition: all 0.3s ease-out;
}

.fade-right-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-right-leave-to {
  transform: translateX(20px); // Geht nach rechts raus
  opacity: 0;
}

.fade-right-enter-from {
  transform: translateX(-20px); // Kommt von links rein
  opacity: 0;
}

.toastify {
  .toast-close {
    display: none;
  }
}
</style>
