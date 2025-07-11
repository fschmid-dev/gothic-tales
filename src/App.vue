<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import HeaderComponent from "./components/layout/HeaderComponent.vue";
import ContextMenu from "@/components/ContextMenu.vue";

const route = useRoute();

const currentMainContainerClass = ref("container");
const nextMainContainerClass = computed(
  () => route.meta.mainClass || "container",
);
const transitionName = ref("fade-left");

watch(
  () => route.fullPath,
  (to, from) => {
    const toDepth = to.split("/").filter(Boolean).length;
    const fromDepth = from.split("/").filter(Boolean).length;

    if (toDepth < fromDepth) {
      transitionName.value = "fade-right";
    } else {
      transitionName.value = "fade-left";
    }
  },
);

function updateMainContainerClass() {
  currentMainContainerClass.value = nextMainContainerClass.value;
}
</script>

<template>
  <HeaderComponent />
  <ContextMenu />

  <RouterView v-slot="{ Component }">
    <main class="my-3" :class="currentMainContainerClass">
      <Transition
        :name="transitionName"
        mode="out-in"
        @after-leave="updateMainContainerClass"
        @before-enter="updateMainContainerClass"
      >
        <Component :is="Component" />
      </Transition>
    </main>
  </RouterView>
</template>

<style lang="scss">
:root {
  --fade-transition-distance: 5rem;

  @media (prefers-reduced-motion) {
    --fade-transition-distance: 0.5rem;
  }
}

/* Fade von rechts rein (Standard-Verhalten) */
.fade-left-enter-active {
  transition: all 0.3s ease-out;
}

.fade-left-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-left-leave-to {
  //noinspection CssInvalidFunction
  transform: translateX(calc(var(--fade-transition-distance) * -1));
  opacity: 0;
}

.fade-left-enter-from {
  transform: translateX(var(--fade-transition-distance));
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
  transform: translateX(var(--fade-transition-distance));
  opacity: 0;
}

.fade-right-enter-from {
  //noinspection CssInvalidFunction
  transform: translateX(calc(var(--fade-transition-distance) * -1));
  opacity: 0;
}

.toastify {
  .toast-close {
    display: none;
  }
}
</style>
