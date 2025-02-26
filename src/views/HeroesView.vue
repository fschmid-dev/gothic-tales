<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import router from '@/router/index.js'
import Swal from 'sweetalert2'

import { useHeroStore } from '@/stores/hero.js'
import { createHero } from '@/utils/HeroFactory.js'

const { t } = useI18n()

const heroStore = useHeroStore()
const { getHeroes } = storeToRefs(heroStore)

const heroList = computed(() => {
  const heroList = getHeroes.value()

  return heroList.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
})

function openNewHeroModal() {
  Swal.fire({
    title: t('createHeroModal.title'),
    html: t('createHeroModal.html'),
    icon: 'question',
    input: 'text',
    inputValue: t('createHeroModal.defaultValue'),
    inputPlaceholder: t('createHeroModal.placeholder'),
    inputAutoTrim: true,
    inputAutoFocus: true,
    inputAttributes: {
      autocapitalize: 'off',
    },
    confirmButtonColor: 'var(--bs-success)',
    confirmButtonText: t('create'),
    showCancelButton: true,
    cancelButtonColor: 'var(--bs-danger)',
    cancelButtonText: t('cancel'),
    preConfirm: createHeroCallback,
  })
}

function createHeroCallback(name) {
  name = name.toString()
  if (
    !name ||
    name.length === 0 ||
    name.toLowerCase() === t('createHeroModal.namelessHero.name').toLowerCase()
  ) {
    Swal.fire({
      icon: 'error',
      title: t('error'),
      html: t('createHeroModal.namelessHero.html'),
      confirmButtonText: t('back'),
      confirmButtonColor: 'var(--bs-primary)',
      preConfirm: () => {
        openNewHeroModal()
      },
    })
    return
  }
  const hero = createHero(name)
  heroStore.saveHero(hero)
  router.push({ name: 'hero', params: { heroId: hero.id } })
}

function deleteHero(hero) {
  Swal.fire({
    title: t('deleteHero.title', { name: hero.name }),
    text: t('deleteHero.text'),
    icon: 'warning',
    confirmButtonText: t('delete'),
    confirmButtonColor: 'var(--bs-primary)',
    showCancelButton: true,
    cancelButtonColor: 'var(--bs-danger)',
    cancelButtonText: t('cancel'),
    preConfirm: () => {
      heroStore.deleteHero(hero)
      Swal.fire({
        title: t('deleteHero.deletedModal.title', { name: hero.name }),
        html: t('deleteHero.deletedModal.text'),
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: t('close'),
        confirmButtonColor: 'var(--bs-primary)',
      })
    },
  })
}
</script>

<template>
  <div>
    <div class="d-flex flex-row justify-content-between">
      <h1>{{ t('heroesView.headline') }}</h1>
      <button class="btn btn-primary" @click="openNewHeroModal">
        {{ t('new') }}
      </button>
    </div>
    <hr />
    <div class="list-group">
      <RouterLink
        v-for="hero in heroList"
        :key="`hero_${hero.id}`"
        :to="{ name: 'hero', params: { heroId: hero.id } }"
        class="list-group-item list-group-item-action d-flex flex-row justify-content-between align-items-center"
      >
        <div class="d-flex flex-column gap-2">
          <div class="d-flex flex-row align-items-baseline gap-2">
            <h2>{{ hero.name }}</h2>
            <span>
              ({{ t('hero.level') }}: {{ hero.level }} / {{ t('hero.learningPointsShort') }}:
              {{ hero.learningPoints }})
            </span>
          </div>
        </div>
        <div>
          <button class="btn btn-danger" @click.prevent="deleteHero(hero)">
            {{ t('delete') }}
          </button>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
