
<template>
    <div class="flex justify-center px-2">
       <div >
         <lottie :options="defaultOptions" :height="100" :width="400" />
   
         <router-link to="/"  ><div style=" color: #0000FF;" class="text-[24px] ml-2 mt-2">{{queryDate}} : {{$route.query.name}}</div></router-link>
            <div class="imageBox"
               v-for="(task, index) in lists" :key="index" >
               <div class="text-[22px] ml-2 mt-1" > {{task.comment}}</div>
    
               <img :src="task.image" v-if="task.image " @click="$router.push('/pag_image?all_no='+`${task.all_no}`)" class="my-2 img-thumbnail cursor-pointer" />
              
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

onMounted(() => {
    get_data();
});
</script>

<style scoped>

.imageBox{
  max-width: 1000px;
}
</style>


