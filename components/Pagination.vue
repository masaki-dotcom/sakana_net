<template>
  <nav class="flex items-center -space-x-px" aria-label="Pagination">
    <button
      type="button"
      class="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-lg last:rounded-e-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
      aria-label="Previous"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      <svg
        class="shrink-0 size-3.5"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m15 18-6-6 6-6"></path>
      </svg>
      <span class="sr-only">Previous</span>
    </button>

    <!-- Pages 選択されているボタン-->
    <button
      v-for="page in visiblePages"
      :key="page"
      type="button"
      class="min-h-[38px] min-w-[38px] flex justify-center items-center border py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
      :class="{
        'bg-blue-400 text-white border-blue-500': currentPage === page,
        'bg-gray-200 border-gray-200 text-gray-800 hover:bg-gray-100': currentPage !== page
      }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <!-- Ellipsis -->
    <div v-if="showEllipsis" class="hs-tooltip inline-block">
      <button
        type="button"
        class="hs-tooltip-toggle group min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-400 hover:text-blue-600 p-2 text-sm rounded-lg focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:bg-white/10"
      >
        <span class="group-hover:hidden text-xs">•••</span>
        <svg
          class="group-hover:block hidden shrink-0 size-5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 17 5-5-5-5"></path>
          <path d="m13 17 5-5-5-5"></path>
        </svg>
        <span
          class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
          role="tooltip"
        >
          Next 4 pages
        </span>
      </button>
    </div>

    <button
      type="button"
      class="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-lg last:rounded-e-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
      aria-label="Next"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      <span class="sr-only">Next</span>
      <svg
        class="shrink-0 size-3.5"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">

// Propsを定義
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

// Emitイベントを定義
const emit = defineEmits(['changePage'])

// 現在のページを変更する関数
function changePage(page: number) {
  emit('changePage', page)
}

// ページ範囲を制御するロジック
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// ページが多い場合に「...」を表示
const showEllipsis = computed(() => {
  return props.totalPages > 5 && props.currentPage + 2 < props.totalPages
})
</script>



