<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useHeroStore } from "@/pinia/hero.store";
import { useDeleteHeroModal } from "@/composables/useDeleteHeroModal";
import Swal from "sweetalert2";
import router from "@/plugins/router.js";
import { Hero } from "@/models/Hero";

const heroStore = useHeroStore();
const { showDeleteHeroModal } = useDeleteHeroModal();
const { t } = useI18n();

const heroList = computed(() => {
  const heroList = heroStore.getHeroes;

  return heroList.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
});

function openNewHeroModal() {
  Swal.fire({
    title: t("createHero.title"),
    html: t("createHero.html"),
    icon: "question",
    input: "text",
    inputValue: t("createHero.defaultValue"),
    inputPlaceholder: t("createHero.placeholder"),
    inputAutoTrim: true,
    inputAutoFocus: true,
    inputAttributes: {
      autocapitalize: "off",
    },
    confirmButtonColor: "var(--bs-success)",
    confirmButtonText: t("create"),
    showCancelButton: true,
    cancelButtonColor: "var(--bs-danger)",
    cancelButtonText: t("cancel"),
    preConfirm: createHeroCallback,
  });
}

function createHeroCallback(name) {
  name = name.toString();

  if (
    !name ||
    name.length === 0 ||
    name.toLowerCase() === t("createHero.namelessHero.name").toLowerCase()
  ) {
    Swal.fire({
      icon: "error",
      title: t("error"),
      html: t("createHero.namelessHero.html"),
      confirmButtonText: t("back"),
      confirmButtonColor: "var(--bs-primary)",
      preConfirm: () => {
        openNewHeroModal();
      },
    });

    return;
  }

  try {
    const hero = new Hero(name);

    heroStore.saveHero(hero);
    router.push({ name: "heroes.detail", params: { id: hero.id } });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "error",
      html: error.message,
      confirmButtonText: t("back"),
      confirmButtonColor: "var(--bs-primary)",
      preConfirm: () => {
        openNewHeroModal();
      },
    });
  }
}

function deleteHero(hero) {
  showDeleteHeroModal(hero, () => {
    heroStore.deleteHero(hero);
  });
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>{{ $t("heroesList.headline") }}</h1>

      <button class="btn btn-secondary" @click="openNewHeroModal">
        {{ $t("new") }}
      </button>
    </div>
    <hr />
    <div class="list-group">
      <RouterLink
        v-for="hero in heroList"
        :key="`hero_${hero.name}`"
        :to="{ name: 'heroes.detail', params: { id: hero.id } }"
        class="list-group-item list-group-item-action d-flex flex-row justify-content-between align-items-center"
      >
        <div class="d-flex flex-column gap-2">
          <div class="d-flex flex-row align-items-baseline gap-2">
            <h2>{{ hero.name }}</h2>
            <span>
              ({{ $t("hero.level") }}: {{ hero.level }}
              {{ $t("hero.learningPointsShort") }}: {{ hero.learningPoints }})
            </span>
          </div>
        </div>
        <div>
          <button class="btn btn-danger" @click.prevent="deleteHero(hero)">
            {{ $t("delete") }}
          </button>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
