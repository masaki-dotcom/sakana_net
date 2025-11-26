<template>
    <div class="flex justify-center px-2">
        <div>
                <!-- <lottie :options="defaultOptions" :height="150" :width="400" />               -->
                    <img :src="pageImage" class="img-thumbnail mt-2 cursor-pointer"  @click="$router.push('/?page='+`${pageQuery}`)" />
                

        </div> 
    </div>
</template>

<script setup lang="ts">
//lottie設定
import * as animationData from "~/assets/animation/tai.json";
const defaultOptions = {
animationData: animationData,  
};

//画像URL設定　ストアーからデータを所得
const authStore = useAuthStore();//ストアーを抽出
const pageQuery = computed(() => authStore.currentPagelNo);
const pageImage = computed(() => authStore.ImageURL);
</script>