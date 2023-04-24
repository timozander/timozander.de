<script setup lang="ts">
import Fuse from "fuse.js";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { SearchInformation } from "./Search";

const isVisible = ref(false);
const searchInput = ref("");
const selectedItemIndex = ref(-1);

const searchBar = ref<HTMLElement | null>(null);
const resultItems = ref<HTMLElement[] | null>(null);

const minMatchCharLength = 3;

const props = defineProps<{
  searchData: SearchInformation[];
}>();

const generateHref = (item: SearchInformation) => {
  if (item.externalSource) {
    return item.externalSource;
  } else {
    return `/blog/${item.slug}`;
  }
};

const openItem = (item: SearchInformation) => {
  if (item.externalSource) {
    const anchor = document.createElement("a");
    Object.assign(anchor, {
      target: "_blank",
      rel: "noopener noreferrer",
      href: item.externalSource,
    }).click();

    anchor.remove();
  } else {
    window.location.href = `/blog/${item.slug}`;
  }

  isVisible.value = false;
};

onMounted(() => {
  window.addEventListener("search", () => {
    isVisible.value = true;
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      isVisible.value = false;
    }

    const scrollIntoView = () => {
      if (selectedItemIndex.value === -1) return;
      const element = resultItems.value?.[selectedItemIndex.value];

      if (element !== undefined) {
        nextTick(() => element.scrollIntoView({ behavior: "smooth" }));
      }
    };

    if (e.key === "ArrowDown") {
      selectedItemIndex.value =
        (selectedItemIndex.value + 1) % searchResults.value.length;
      scrollIntoView();
    }

    if (e.key === "ArrowUp") {
      selectedItemIndex.value =
        (selectedItemIndex.value - 1) % searchResults.value.length;
      scrollIntoView();
    }

    if (e.key === "Enter" && selectedItemIndex.value !== -1) {
      const selectedItem = searchResults.value[selectedItemIndex.value];

      openItem(selectedItem.item);
    }
  });
});

watch(isVisible, () => {
  if (isVisible.value === true) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    nextTick(() => {
      searchBar.value?.focus();
    });
  }

  if (!isVisible.value) {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }
});

watch(searchInput, () => {
  selectedItemIndex.value = -1;
});

const fuse = new Fuse(props.searchData, {
  keys: ["title", "description", "content"],
  includeMatches: true,
  minMatchCharLength,
});

const searchResults = computed(() => {
  return fuse.search<SearchInformation>(searchInput.value);
});
</script>
<template>
  <div class="search-overlay" @click.self="isVisible = false" v-if="isVisible">
    <div class="search-container flex flex-col">
      <div class="text-right mb-3 mt--3 sm:display-none">
        <button
          class="text-white text-2xl font-bold"
          @click="isVisible = false"
        >
          <i class="i-ph-x"><span class="sr-only">&times;</span></i>
        </button>
      </div>
      <input
        type="text"
        ref="searchBar"
        v-model="searchInput"
        autofocus
        placeholder="Search..."
      />

      <p class="text-hint" v-if="searchInput.length < minMatchCharLength">
        Enter your search term
      </p>
      <p class="text-hint" v-else-if="searchResults.length === 0">
        No results found.
      </p>
      <div class="results" v-else>
        <a
          v-for="(r, index) in searchResults"
          ref="resultItems"
          :class="{ selected: index === selectedItemIndex }"
          :target="r.item.externalSource ? '_blank' : '_self'"
          :href="generateHref(r.item)"
          @click.prevent="openItem(r.item)"
        >
          {{ r.item.title }}
          <span
            v-if="r.item.description"
            class="block pt-1 text-md font-normal opacity-60"
            >{{ r.item.description }}</span
          >
          <i
            class="i-ph-arrow-square-out mb-1 ml-1"
            v-else-if="r.item.externalSource"
          />
        </a>
      </div>
    </div>
  </div>
</template>
<style>
body.modal-open {
  height: 100vh;
  overflow-y: hidden;
}

.search-overlay {
  @apply position-fixed px-2 sm:px-0 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50;
  backdrop-filter: blur(4px);
}

.search-container {
  --vertical-margin: 50px;

  @apply mx-auto w-full sm:w-75% md:w-50% max-w-4xl rounded-lg bg-skin-fill p-6;
  margin-top: var(--vertical-margin);
  margin-bottom: var(--vertical-margin);
  max-height: calc(100% - 2 * var(--vertical-margin));
}

@media (min-width: 768px) {
  .search-container {
    --vertical-margin: 150px;
  }
}

.search-container .text-hint {
  @apply @apply text-center p-3 opacity-70;
}

.search-container input {
  @apply px-6 py-3 w-full text-black rounded mb-6;
}

.search-container .results {
  @apply overflow-y-auto;
}

.search-container .results a {
  @apply transition-all block px-6 py-3 rounded bg-white bg-opacity-5 font-medium mb-3 border border-transparent;
}

.search-container .results a.selected {
  @apply border-white;
}

.search-container .results a:hover {
  @apply bg-opacity-10;
}
</style>
