<template>
    <div class="flex justify-center px-2">
        <div>
                <lottie :options="defaultOptions" :height="150" :width="400" />              
                    <img :src="image_url" class="img-thumbnail mt-2"  @click="$router.push('/?page='+`${pageQuery}`)" />
                

        </div> 
    </div>
</template>

<script setup lang="ts">
//lottie設定
import * as animationData from "~/assets/animation/tai.json";
const defaultOptions = {
animationData: animationData,  
};


const authStore = useAuthStore();//ストアーを抽出
const route = useRoute()//ルートクエリの設定
const queryAllno = computed(() => route.query.all_no);
const pageQuery = computed(() => authStore.currentPagelNo);

//データの所得
import { getFirestore, addDoc, collection, query, where, getDocs, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
const lists = ref<Array<any>>([]);
const image_url=ref<string>('')

const get_data= async()=>{
  if (!queryAllno.value) return;// total_noが未定義の場合は何もしない
  const firestore=getFirestore();  
  const _query = query(
  collection(firestore,'users'),
  where("all_no", "==", Number(queryAllno.value))  
  );
  const sanpshot=await getDocs(_query);
  for (const doc of sanpshot.docs){
    lists.value.push(
      { ...doc.data()})
  };
image_url.value=lists.value[0].image
// console.log(image_url.value)
};

onMounted(() => {
    get_data();
});

</script>

<style scoped>

.imageBox{
  max-width: 1200px;
}
</style>