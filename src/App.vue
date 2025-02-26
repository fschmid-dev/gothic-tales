<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <header id="header" class="navbar navbar-dark navbar-expand-md bg-dark">
    <div class="container-fluid d-flex justify-content-between">
      <RouterLink :to="{ name: 'home' }" class="navbar-brand"> Gothic Tales </RouterLink>

      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink :to="{ name: 'heroes' }" class="nav-link">
            <i class="ra ra-double-team"></i>
            {{ t('heroes') }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </header>

  <RouterView v-slot="{ Component }">
    <div class="container-fluid mt-3">
      <Transition name="fade" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </div>
  </RouterView>
</template>

<style lang="scss">
.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
.fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.toastify {
  .toast-close {
    display: none;
  }
}
</style>
