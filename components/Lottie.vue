<template>
  <div :style="style" ref="lavContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import lottie from 'lottie-web';

// Propsの定義
const props = defineProps<{
  options: {
    animationData: any,
    loop?: boolean,
    autoplay?: boolean,
    rendererSettings?: object,    
  },
  height?: number,
  width?: number
}>();


// スタイルの計算
const style = computed(() => ({
  width: props.width ? `${props.width}px` : '100%',
  height: props.height ? `${props.height}px` : '100%',
  overflow: 'hidden',
  margin: '0 auto'
}));

// コンテナの参照
const lavContainer = ref<HTMLDivElement | null>(null);

// アニメーションの初期化
onMounted(() => {
  if (lavContainer.value) {
    // console.log(props.options.animationData.default);

    const anim = lottie.loadAnimation({
      container: lavContainer.value,
      renderer: 'svg',
      loop: props.options.loop !== false,
      autoplay: props.options.autoplay !== false,
      animationData: props.options.animationData.default,
      rendererSettings: props.options.rendererSettings
    });
   
  }
});
</script>
