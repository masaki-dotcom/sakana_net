<template>

<div>


  <!-- ヘッダーバー -->
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
        🎬
      </span>

      <span class="text-lg sm:text-2xl font-bold">
        Video
      </span>

    </div>



    <!-- メニュー -->
    <div class="flex gap-2 sm:gap-3">


      <NuxtLink
        to="/"
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

        🎣 戻る

      </NuxtLink>



      <NuxtLink
        to="/photo"
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


    </div>


  </div>

</div>




  <!-- 動画一覧 -->
  <div class="flex justify-center px-2 mt-5">


    <div class="w-[800px]">


      <div
        v-for="video in videos"
        :key="video.url"
        class="mb-8"
      >


        <!-- 動画タイトル -->
        <div
          class="
            bg-gradient-to-r
            from-blue-500
            to-cyan-400
            text-white
            rounded-t-lg
            px-4
            py-2
            text-lg
            font-bold
            shadow
          "
        >

          🎣 {{ video.title }}

        </div>



        <!-- YouTube -->
        <div
          class="
            shadow-lg
            rounded-b-lg
            overflow-hidden
          "
        >

          <iframe
            :src="video.url"
            class="
              w-full
              aspect-video
            "
            allowfullscreen
          />


        </div>


      </div>


    </div>


  </div>


</div>

</template>



<script setup>

const videos=[

{
title:"スロージギングでヒラメ!!",
url:"https://www.youtube.com/embed/U-93VVM1EHM"
},


{
title:"キジハタきたー!!",
url:"https://www.youtube.com/embed/I4zQl_LGs1s"
},


{
title:"まだいヒット!!",
url:"https://www.youtube.com/embed/V1zLBBXdY90"
}


]

</script>