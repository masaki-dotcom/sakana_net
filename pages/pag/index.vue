
<template>
    <div class="flex justify-center px-2">
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

       <div >
         <lottie :options="defaultOptions" :height="100" :width="400" />   
         <router-link
              :to="{
                path: '/',
                query: {
                  page: page
                }
              }"
            >
              <div
                style="color:#0000FF;"
                class="text-[24px] ml-2 mt-2"
              >
                {{ queryDate }} : {{ queryName }}
              </div>
            </router-link>

            <div
                class="imageBox"
                v-for="task in lists"
                :key="task.all_no"
              >
               <div class="text-[22px] ml-2 mt-1" > {{task.comment}}</div>
    
               <img
                :src="task.image"
                v-if="task.image" 
                class="my-2 img-thumbnail cursor-pointer"
                @click="$router.push({
                  path: '/pag_image',
                  query: {
                    all_no: task.all_no,
                    page: page
                  }
                })"
              />
              
           </div>
      </div>
    </div>
    </template>
    

<script setup lang="ts">

const route = useRoute()//ルートクエリの設定
const queryDate = computed(() => route.query.date);
const queryName = computed(() => route.query.name);

//lottie設定
import * as animationData from "~/assets/animation/sakana.json";
const defaultOptions = {
animationData: animationData,  
};



//データの所得
import { getFirestore, addDoc, collection, query, where, getDocs, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
const lists = ref<Array<any>>([]);
const totalNo = computed(() => route.query.total_no);
const get_data= async()=>{
  if (!totalNo.value) return;// total_noが未定義の場合は何もしない
  const firestore=getFirestore();  
  const _query = query(
  collection(firestore,'users'),
  where("total_no", "==", Number(totalNo.value)),
  orderBy('id', 'asc')
  );
  const sanpshot=await getDocs(_query);
  for (const doc of sanpshot.docs){
        lists.value.push(
      { ...doc.data()})
  };
};

const page = computed(() => route.query.page);
onMounted(() => {
    get_data();
});
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

.imageBox{
  max-width: 1000px;
}
</style>


