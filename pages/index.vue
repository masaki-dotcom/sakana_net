<template>
<div>
  <!-- TOPボタン -->
<button
 v-show="showTopButton"
  @click="scrollToTop"
  class="
    fixed
    bottom-5
    right-5
    z-50
    w-14
    h-14
    rounded-full
    bg-blue-600
    text-white
    shadow-xl
    hover:bg-blue-700
    transition
  "
>
  ⬆
  <div class="text-[11px] leading-none">
    TOP
  </div>
</button>

  <!-- タイトル + メニュー -->
  <div class="max-w-[850px] mx-auto mt-2 px-2">

  <div
    class="
      flex
      items-center
      justify-between
      bg-gradient-to-r
      from-blue-500
      to-cyan-400
      text-white
      rounded-xl
      shadow-lg
      px-3
      py-2
    "
  >

    <!-- タイトル -->
    <div class="flex items-center">

      <span class="text-xl sm:text-3xl mr-1 sm:mr-2">
        🎣
      </span>

      <span class="text-lg sm:text-2xl font-bold">
        fishing
      </span>

    </div>


    <!-- メニュー -->
    <div class="flex gap-2">


      <NuxtLink
        :to="{
            path:'/photo',
            query:{
              page: currentPage
            }
          }"
        class="
          bg-white
          text-blue-600
          px-2
          sm:px-4
          py-1
          sm:py-2
          rounded-full
          text-sm
          sm:text-base
          font-bold
          shadow
          hover:bg-blue-100
          transition
        "
      >
        📷 Photo
      </NuxtLink>



      <NuxtLink       
        :to="{
            path:'/video',
            query:{
              page: currentPage
            }
          }"
        class="
          bg-white
          text-blue-600
          px-2
          sm:px-4
          py-1
          sm:py-2
          rounded-full
          text-sm
          sm:text-base
          font-bold
          shadow
          hover:bg-blue-100
          transition
        "
      >
        🎬 Video
      </NuxtLink>


    </div>


  </div>

</div>


  <!-- Lottie -->
  <lottie 
    :options="defaultOptions"
    :height="100"
    :width="400"
  />



  <div class="flex justify-center px-2">

    <div style="width:800px">


      <PaginationPre
        :currentPage="currentPage"
        :totalPages="totalPages"
        :disabled="loading"
        @changePage="changePage"
      />


      <div
        class="flex justify-center"
        v-for="item in paginatedPosts"
        :key="item.all_no"
      >

        <div
          class="cursor-pointer out_line mt-3  relative"
          @click="navigateToPage(item)"
        >
          <!-- 日付 -->
          <div  class="absolute bottom-2 right-2 bg-black/15 text-white text-sm px-2 py-1 rounded z-10 ">
            {{ item.date }}
          </div>
          
          <img
            :src="item.image"
            class="rounded-lg shadow"
          >

        </div>

      </div>


    </div>

  </div>


</div>
</template>

<script setup lang="ts">

//ページネーション設定
import PaginationPre from '~/components/Pagination.vue'
import { onMounted } from 'vue'
// Post型を定義
interface Post {
name: string
date: string
image: string
total_no:number
all_no:number
}

// postsの型を指定して初期化
const posts = ref<Post[]>([])
const itemsPerPage = ref(10)
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / itemsPerPage.value)
})

const paginatedPosts = computed(() => posts.value)

// ページ遷移の処理
const router = useRouter();
const route = useRoute();
const navigateToPage = (item: Post) => {
  router.push({
    path: "/pag",
    query: {
      total_no: item.total_no.toString(),
      date: item.date,
      name: item.name,
      page: currentPage.value.toString()   // ←追加
    }
  });
};

// ページ変更時の処理
//ストアーを抽出
const authStore = useAuthStore();
const loading = ref(false)
const changePage = async (page: number) => {
  if (loading.value) return
  if (page < 1) return
  if (page > totalPages.value) return

  loading.value = true

  try {
    await router.replace({
      query: {
        ...route.query,
        page: page.toString()
      }
    })
  } finally {
    loading.value = false
  }
}

//画像を選択した時のURLを抽出
const changeURL = (url: string) => {
  authStore.selectImage(url, currentPage.value);

  router.push({
    path: "/pag_image2",
    query: {
      page: currentPage.value
    }
  });
}
  
//DB所得の設定
import { usePostState } from "~/composables/usePostState";  
const totalCount = ref(0)
// posts.value = [
//   ...await usePostState().getPosts(
//     currentPage.value,
//     itemsPerPage.value
//   )
// ]
totalCount.value =
  await usePostState().getPostCount()

//Lottie設定
import Lottie from '@/components/Lottie.vue'
// JSONデータを読み込み
import * as animationData from "~/assets/animation/sakana2.json";

const defaultOptions = {
animationData: animationData,  
};

const loadPosts = async () => {
  const page = Number(route.query.page ?? 1)
  currentPage.value = page
  posts.value = [
    ...await usePostState().getPosts(
      currentPage.value,
      itemsPerPage.value
    )
  ]
}
await loadPosts();
totalCount.value = await usePostState().getPostCount();
watch(
  () => route.fullPath,
  async () => {
    await loadPosts();
  }
);
// TOPボタン表示
const showTopButton = ref(false)

// スクロール監視
const handleScroll = () => {
  const scroll = Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop
  )

  showTopButton.value = scroll > 100
}

let animationId: number

const loop = () => {
  handleScroll()
  animationId = requestAnimationFrame(loop)
}

// 一番上へ戻る
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

onMounted(() => {
  loop()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})


</script>

<style scoped>
.topFoto{
max-width: 1200px;
}
.midFoto{
max-width: 500px;
}

.out_line {
border: 1px solid #9e9e9e;
padding: 3px; 
}

.out_line-placeholder {
border: 1px solid #9e9e9e;
border-bottom: none; /* これにより最初の要素の上部ボーダーが維持される */
}

.out_line:not(:first-of-type) {
border-top: none;
}
</style>



