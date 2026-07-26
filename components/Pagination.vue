<template>
  <nav class="flex items-center justify-center gap-2">

    <!-- 先頭 -->
    <button
      class="px-3 py-2 rounded border border-blue-600 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
      :disabled="currentPage === 1"
      @click="changePage(1)"
    >
      |&lt;&lt;
    </button>

    <!-- 前へ -->
    <button
      class="px-3 py-2 rounded border border-blue-600 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      ← 前へ
    </button>

    <!-- 現在のページ -->
    <span class="px-4 py-2 rounded bg-blue-700 text-white font-bold">
      {{ currentPage }} / {{ totalPages }}
    </span>

    <!-- 次へ -->
    <button
      class="px-3 py-2 rounded border border-blue-600 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      次へ →
    </button>

    <!-- 最後 -->
    <button
      class="px-3 py-2 rounded border border-blue-600 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500"
      :disabled="currentPage === totalPages"
      @click="changePage(totalPages)"
    >
      &gt;&gt;|
    </button>

  </nav>
</template>

<script setup lang="ts">
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

const emit = defineEmits(['changePage'])

function changePage(page: number) {
  emit('changePage', page)
}
</script>