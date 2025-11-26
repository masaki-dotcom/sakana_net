<template>
    <teleport to="body">
      <div v-if="show" class="modal-overlay">
      <!-- <div v-if="show" class="modal-overlay" @click="closeModal"> -->
        <div class="modal-content" @click.stop>
          <slot></slot>
          <button class="bg-gray-400  text-black font-bold hover:text-white text-sm rounded px-3 mt-2 ml-2 mb-2 h-6" 
          @click="closeModal">Close</button>
        </div>
      </div>
    </teleport>
  </template>
  
  <script lang="ts" setup>  
  
  // Propsの定義
  const props = defineProps<{
    show: boolean;
  }>();
  
  // Emitsの定義
  const emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
  }>();
  
  const closeModal = () => {
    emit('update:show', false);
  };
  </script>
  
  <style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    /* align-items: center;   */
    align-items: flex-start; /* 上部に寄せる */
   
   
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;  
    
    position: fixed; /* これを追加 */
    top: 50px; /* 画面上部から50pxの位置に配置 */
    left: 50%;
    transform: translateX(-50%); /* 中央揃え */
    
  }
  </style>
  
