<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useHeroStore } from "@/pinia/hero.store";
import { useDeleteHeroModal } from "@/composables/useDeleteHeroModal";
import router from "@/plugins/router";

import HeroAbilities from "@/components/Hero/HeroAbilities.vue";
import HeroActions from "@/components/Hero/HeroActions.vue";
import HeroAttributes from "@/components/Hero/HeroAttributes.vue";
import HeroInfo from "@/components/Hero/HeroInfo.vue";
import HeroStats from "@/components/Hero/HeroStats.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "@/assets/hero_page.scss";

const route = useRoute();
const { showDeleteHeroModal } = useDeleteHeroModal();
const heroStore = useHeroStore();

const heroId = computed(() => route.params.id);
const hero = computed(() => {
  const currentHero = heroStore.getHeroById(heroId.value);

  return currentHero || null;
});

function deleteHero() {
  if (!hero.value) {
    return;
  }

  showDeleteHeroModal(hero.value, () => {
    heroStore.deleteHero(hero.value);
    router.push({ name: "heroes.list" });
  });
}

function updateHeroName(name) {
  if (!name) {
    return;
  }

  hero.value.name = name;
}

function updateHeroAttribute(key, newValue) {
  hero.value.attributes[key] = Number(newValue);
}

function updateHoneLevelUpdate(abilityName, newHoneLevel) {
  const abilityToUpdate = hero.value.abilities.find(
    (ab) => ab.name === abilityName,
  );
  if (abilityToUpdate) {
    abilityToUpdate.honeLevel = newHoneLevel;
  }
}

function handleAddAction(newAction) {
  hero.value.actions.push(newAction);
}

function handleUpdateAction(updatedAction) {
  const index = hero.value.actions.findIndex(
    (action) => action.id === updatedAction.id,
  );
  if (index !== -1) {
    hero.value.actions[index] = updatedAction;
  }
}

function handleDeleteAction(actionId) {
  const index = hero.value.actions.findIndex(
    (action) => action.id === actionId,
  );
  if (index !== -1) {
    hero.value.actions.splice(index, 1);
  }
}
</script>

<template>
  <div v-if="hero">
    <div class="d-flex flex-row justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <RouterLink
          :to="{ name: 'heroes.list' }"
          class="btn btn-link"
          title="zurück"
        >
          <font-awesome-icon :icon="['fas', 'fa-chevron-left']" fixed-width />
        </RouterLink>
        <h1>{{ hero.name }}</h1>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-danger" @click="deleteHero" title="wech damit">
          <font-awesome-icon :icon="['fas', 'fa-trash']" fixed-width />
        </button>
      </div>
    </div>
    <hr />
    <div class="hero">
      <div class="hero__info">
        <HeroInfo :hero="hero" @update:name="updateHeroName" />
      </div>
      <div class="hero__stats">
        <HeroStats :hero="hero" />
      </div>
      <div class="hero__attributes">
        <HeroAttributes :hero="hero" @update:attribute="updateHeroAttribute" />
      </div>
      <div class="hero__abilities">
        <HeroAbilities
          :hero="hero"
          @update:ability-hone-level="updateHoneLevelUpdate"
        />
      </div>
      <div class="hero__actions">
        <HeroActions
          :hero="hero"
          @add:action="handleAddAction"
          @update:action="handleUpdateAction"
          @delete:action="handleDeleteAction"
        />
      </div>
      <div class="hero__talents"></div>
    </div>
  </div>
  <div v-else>
    <div class="alert alert-warning">
      <h1>{{ $t("heroNotFound.title") }}</h1>
      <span>
        {{ $t("heroNotFound.text") }}<br />
        <RouterLink class="alert-link" :to="{ name: 'heroes.list' }">
          {{ $t("heroesList.navigateTo") }}
        </RouterLink>
      </span>
    </div>
  </div>
</template>
