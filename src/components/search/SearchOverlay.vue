<script setup lang="ts">
import Fuse from 'fuse.js'
import { computed, onMounted, ref } from 'vue';
import type { SearchInformation } from './Search';

const isVisible = ref(false)
const searchInput = ref('')

const props = defineProps<{
    searchData: SearchInformation[]
}>()

onMounted(() => {
    window.addEventListener('search', () => {
        isVisible.value = true
    })

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            isVisible.value = false
        }
    })
})

const fuse = new Fuse(props.searchData, {
    keys: ["title", "description", "content"],
    includeMatches: true,
    minMatchCharLength: 3,
    threshold: 0.5,
});

const searchResults = computed(() => {
    console.log("test")
    return fuse.search<SearchInformation>(searchInput.value)
})

const sluggify = (post: SearchInformation) => {
    return `/posts/${post.slug}`
}

</script>
<template>
    <div class="search-overlay" v-if="isVisible">

        <div class="search-container">
            <input type="text" v-model="searchInput" autofocus placeholder="Search..." />

            <div>
                <a v-for="r in searchResults" :href="sluggify(r.item)">
                    {{ r.item.title }}
                </a>
            </div>
        </div>
    </div>
</template>
<style>
.search-overlay {
    @apply position-absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50;
    backdrop-filter: blur(4px);
}

.search-container {
    @apply mt-64 mx-auto w-50% rounded-lg bg-skin-fill p-6;
}

.search-container input {
    @apply px-6 py-3 w-full text-black rounded;
}
</style>