
<template>
  <div >

    <lottie :options="defaultOptions" :height="100" :width="400" />

    <div class="flex justify-center px-2 mb-2">  
      <div class="topFoto">
            <div class="text-[26px] ml-2">岩船沖の日の出</div>
            <Carousel :autoplay="4000" :itemsToShow="1" :wrapAround="true" :transition="0">
                  <Slide v-for="(slide,index) in slides1" :key="index">
                    <img :src="slide"  class="shadow img-fluid rounded-lg " alt="岩船沖の日の出" />
                  </Slide>        
                <template #addons>
                  <Pagination />
                </template>
            </Carousel>
      </div>
    </div>
    
   
    <div class="flex justify-center px-2 ">      
          <div class="grid sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4 topFoto">
                  <div class="sm: flex justify-center">
                        <div style="width: 400px;">
                            <div class="my-2">
                                  <!-- Pagination Component -->
                                  <PaginationPre 
                                    :currentPage="currentPage"
                                    :totalPages="totalPages"
                                    @changePage="changePage"
                                  />
                            </div>  
                            <!-- <div class="out_line-placeholder" ></div> -->
                              <div class="flex justify-center  " v-for="(item, index) in paginatedPosts" :key="index" >
                                  <div class="cursor-pointer out_line mt-3"   @click="navigateToPage(item)">
                                    <!-- <div class="text-[22px]">{{ item.date }}: {{ item.name }}</div> -->
                                    <img :src="item.image"  />
                                  </div>
                              </div>
                        </div>
                  </div>                    
                  <div>
                        <div >
                              <div class="text-[22px]">Photo</div>
                              <div class="text-[22px]">たい</div>
                              <Carousel :autoplay="4000" :itemsToShow="1" :wrapAround="true" :transition="0">
                                      <Slide v-for="(slide,index) in slides2" :key="index">
                                        <img :src="slide"  class="shadow img-fluid cursor-pointer" alt="たい" @click="changeURL(slide)"/>
                                      </Slide>        
                                    <template #addons>
                                      <Pagination />
                                    </template>
                            </Carousel>

                        </div>
                        <div class="mt-8">
                              <div class="text-[22px]">ひらめ</div>
                              <Carousel :autoplay="4000" :itemsToShow="1" :wrapAround="true" :transition="0">
                                      <Slide v-for="(slide,index) in slides3" :key="index">
                                        <img :src="slide"  class="shadow img-fluid cursor-pointer" alt="ひらめ" @click="changeURL(slide)"/>
                                      </Slide>        
                                    <template #addons>
                                      <Pagination />
                                    </template>
                            </Carousel>
                        </div>
                        
                  </div>

                  <div>
                          <div class="text-[22px]">Video</div>
                          <div class="bg-blue-500 text-white mt-8">スロージギングでヒラメ!!</div>
                          <div >
                              <iframe  src="https://www.youtube.com/embed/U-93VVM1EHM"  class="w-full"
                                  ></iframe>
                          </div>

                          <div class="mt-4 bg-blue-500 text-white">キジハタきたー!!</div>
                          <div >
                              <iframe  src="https://www.youtube.com/embed/I4zQl_LGs1s" class="w-full"
                                  allowfullscreen></iframe>
                          </div>

                          <div class="mt-4 bg-blue-500 text-white">まだいヒット!!</div>
                          <div>
                              <iframe  src="https://www.youtube.com/embed/V1zLBBXdY90" class="w-full"
                                  allowfullscreen></iframe>
                          </div>

                          <div class="mt-4 bg-blue-500 text-white">メバル 入れ食い!!</div>
                          <div>
                              <iframe src="https://www.youtube.com/embed/rWuUI5Oc6fc" class="w-full"
                                  allowfullscreen></iframe>
                          </div>

                          <div class="mt-4 bg-blue-500 text-white">スロージギング!!</div>
                          <div>
                              <iframe src="https://www.youtube.com/embed/Lbxd3dOVWXk" class="w-full"
                                  allowfullscreen></iframe>
                          </div>

                          <div class="mt-4 bg-blue-500 text-white">大ヒラメGET!!</div>
                          <div>
                              <iframe src="https://www.youtube.com/embed/_T8ucxWNyj8" class="w-full mb-4"
                                  allowfullscreen></iframe>
                          </div>
                  </div>
          </div>
  </div>

    

  </div>
</template>

<script setup lang="ts">
//vue3-carouselの設定
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
// スライドデータを定義
const slides1 = ref([ //IwafuneOki
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/sun1.jpg?alt=media&token=9c10ebc3-d9ea-47a3-81ea-5b03c672ad4f",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/sun3.jpg?alt=media&token=732c3379-23d7-4f4f-8aa3-0279fd2ab886",
]);
const slides2 = ref([ //tai
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20210612_tai.jpg?alt=media&token=2fc9678d-4b4f-416a-9cf8-4a33fb0cdac0",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20200829_tai.jpg?alt=media&token=1fcd2158-d288-45a9-8db1-87cdef5356fd",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20170925_madai_5kg1.jpg?alt=media&token=cf099b02-830e-458e-9aa2-ac8d5e47ae20",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20151105_masai.jpg?alt=media&token=e33d6f50-83ee-48cb-8c90-2b4c5b85f513",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20181022_madai.jpg?alt=media&token=7b33dcfa-d73a-429d-85f6-b8acf44dd2de",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20171026_madai_MLmAutl.jpg?alt=media&token=298ea047-f3aa-44d5-8fe3-e78f2b7b0d25",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20171014_madai_BLxi7uY.jpg?alt=media&token=b8bc191e-f3c5-45cf-b459-d31d58e44270",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20170925_madai2_yE8MxNa.jpg?alt=media&token=d40bba66-990b-4152-a269-bc877e44f886",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20151023_big_masai.jpg?alt=media&token=4f59dda0-056b-4c44-ab8e-93d209fe5510",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20171026_madai_MLmAutl.jpg?alt=media&token=298ea047-f3aa-44d5-8fe3-e78f2b7b0d25"
]);
const slides3 = ref([ //Hirame
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20200822_hirame.jpg?alt=media&token=fa548072-ebbe-4d43-9ed0-141161b039d6",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20190927_hirame.jpg?alt=media&token=c83753b0-8491-4196-8e10-628f0f44402a",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20181112_hihame.jpg?alt=media&token=eb8585de-8882-4e6d-89b5-553d7f81e2ea",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20161126_hirame.jpg?alt=media&token=5d8d76b3-7eaf-476b-be0f-9f57aed0c91e",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20161114_hirame.jpg?alt=media&token=6149bfce-af1f-4df9-ab44-0dcfd2ac1c08",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20160925_hirame.jpg?alt=media&token=a6c2c14c-5ad3-4520-af5e-2cf3c5d40e1d",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20160420_hirame.jpg?alt=media&token=cb6c52ae-b943-4a2d-b92b-c190c3b9c7c7",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20151105_hirame.jpg?alt=media&token=13cb1e55-bbea-42ef-b878-2a8fa50896ff"
]);
const slides4 = ref([ //他
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20151023_madai.jpg?alt=media&token=f4f42ce5-6e39-477f-9c72-de01628f0b69",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20160305_mebaru.jpg?alt=media&token=acca71af-72e9-43da-9bfd-c444add3be6d",
"https://firebasestorage.googleapis.com/v0/b/sakana-881ae.appspot.com/o/20151006_herame.jpg?alt=media&token=9bd3ddf7-77e5-4519-9a5c-5eb033b5a5f4" 
]);

//ページネーション設定
import PaginationPre from '~/components/Pagination.vue'
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
return Math.ceil(posts.value.length / itemsPerPage.value)
})

const paginatedPosts = computed(() => {
const start = (currentPage.value - 1) * itemsPerPage.value
const end = start + itemsPerPage.value
return posts.value.slice(start, end)
})

// ページ遷移の処理
const router = useRouter();
const route = useRoute();
const navigateToPage = (item: Post) => {
router.push({ 
  path: '/pag',
  query: {
    total_no: item.total_no.toString(),
    date: item.date,
    name: item.name
  }
});
};

// ページ変更時の処理
//ストアーを抽出
const authStore = useAuthStore();
const changePage=(page: number)=> {
currentPage.value = page 
// クエリパラメータとしてcurrentPageを設定
router.push({ query: { ...route.query, page: page.toString() } });
//ストアーに保存
authStore.catch_currentPagelNo(page)
}

//画像を選択した時のURLを抽出
const changeURL=(url:string)=>{
  //ストアーに保存
  authStore.selectImage(url)
  router.push("/pag_image2");
}
  
//DB所得の設定
import { usePostState } from "~/composables/usePostState";  
posts.value=await usePostState().getPosts()

//Lottie設定
import Lottie from '@/components/Lottie.vue'
// JSONデータを読み込み
import * as animationData from "~/assets/animation/sakana2.json";

const defaultOptions = {
animationData: animationData,  
};

// ページが読み込まれたときにクエリパラメータをチェック
onMounted(() => {
const pageQuery = route.query.page;
if (pageQuery) {
  currentPage.value = parseInt(pageQuery as string, 10);
}
// DBからデータを取得
usePostState().getPosts().then(data => {
  posts.value = data;
});

});

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



