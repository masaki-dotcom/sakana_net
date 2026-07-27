<template>
    <div class="flex justify-center px-2">
        <div>
                <!-- <lottie :options="defaultOptions" :height="150" :width="400" />               -->
                    <img
                        :src="pageImage"
                        @click="router.push({
                            path: '/',
                            query: {
                            page: pageQuery
                            }
                            
                        })"
                        />
                

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
const router = useRouter()

const authStore = useAuthStore()
const route = useRoute();
const pageQuery = computed(() => Number(route.query.page ?? 1))
const pageImage = computed(() => authStore.ImageURL)
const backPage = () => {
  router.push({
    path: "/",
    query: {
      page: pageQuery.value
    }
  });
}

</script>