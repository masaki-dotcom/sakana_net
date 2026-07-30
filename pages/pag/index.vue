
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-sky-100 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500"
  >

    <!-- ===========================
          TOPボタン
    ============================ -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-show="showTopButton"
        @click="scrollToTop"
        class="
        fixed
        bottom-6
        right-6
        z-50
        w-16
        h-16
        rounded-full
        backdrop-blur-xl
        bg-white/60
        dark:bg-slate-800/70
        border
        border-white/50
        shadow-2xl
        hover:scale-110
        transition
        "
      >
        <div class="text-2xl text-sky-600">
          ↑
        </div>

        <div class="text-[10px] text-slate-600 dark:text-white">
          TOP
        </div>

      </button>
    </Transition>

    

    <!-- ===========================
        メインコンテンツ
    ============================ -->

    <div
      class="
      max-w-7xl
      mx-auto
      px-5
      py-3
      "
    >

      <!-- 戻る -->

      <router-link
        :to="{
          path:'/',
          query:{
            page:page
          }
        }"
      >

        <div
          class="
          inline-flex
          items-center
          gap-2
          text-sky-600
          hover:text-sky-800
          mb-4
          transition
          "
        >

          ← 戻る

        </div>

      </router-link>

      <!-- ===========================
            日付
      ============================ -->

      <div
        class="
        flex
        flex-wrap
        gap-5
        items-center
        mb-5
        "
      >

        <div
          class="
          bg-white
          dark:bg-slate-800
          rounded-full
          shadow-lg
          px-6
          py-1
          flex
          items-center
          gap-2
          "
        >

          
          <span
            class="
            text-lg
            font-semibold
            dark:text-white
            "
          >

            {{queryDate}} {{ queryName }}

          </span>

        </div>

        

      </div>

      
      <!-- ==========
      次回はここから
      Pinterestカード開始
      ========== -->
            <!-- ===========================================
              Pinterest風ギャラリー
      ============================================ -->

      <div
        class="
        grid
        grid-cols-1
        gap-10
        "
      >

        <!-- ===========================
              Card
        ============================ -->

        <article
          v-for="task in lists"
          :key="task.all_no"
          class="
          fishing-card
          max-w-[800px]
          mx-auto
          opacity-0
          translate-y-10
          transition-all
          duration-700
          bg-white/80
          dark:bg-slate-800/80
          backdrop-blur-xl
          rounded-[35px]
          overflow-hidden
          shadow-xl
          border
          border-white/40
        "
        >

          <!-- ===========================
                  画像
          ============================ -->
          <div
                  class="relative overflow-hidden image-hover"
                >

                  <img
                    v-if="task.image"
                    :src="task.image"
                    class="w-full object-cover cursor-pointer transition-all duration-700 hover:scale-105"
                    @click="$router.push({
                      path:'/pag_image',
                      query:{
                        all_no:task.all_no,
                        page:page
                      }
                    })"
                  >

                  <!-- 画像内に表示（短いコメントだけ） -->
                  <div
                    v-if="(task.comment?.length ?? 0) < 100"
                    class="absolute left-3 bottom-6 text-white"
                  >
                    <div
                      class="text-[20px] font-black tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,1)]"
                    >
                      {{ task.comment }}
                    </div>
                  </div>

                </div>

                <!-- 長いコメントは画像の下 -->
                <div
                  v-if="(task.comment?.length ?? 0) >= 100"
                  class="p-6 text-xl font-bold text-slate-800 dark:text-white"
                >
                  {{ task.comment }}
        </div>

          <!-- ===========================
                  コメント
          ============================ -->

        
          <!-- ===========================
                フッター
          ============================ -->

          
        </article>

      </div>

    </div>

  </div>

</template>




<script setup lang="ts">

import {
  ref,
  computed,
  onMounted,
  onUnmounted
} from "vue";

import {
  useRoute
} from "vue-router";

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";

import * as animationData from "~/assets/animation/sakana.json";



/* =====================================
    Route
===================================== */

const route = useRoute();


const queryDate = computed(() =>
  route.query.date
);


const queryName = computed(() =>
  route.query.name
);


const totalNo = computed(() =>
  route.query.total_no
);


const page = computed(() =>
  route.query.page
);



/* =====================================
    Lottie
===================================== */

const defaultOptions = {

  animationData

};



/* =====================================
    型定義
===================================== */


interface FishingPost {

  all_no:number;

  image?:string;

  comment?:string;

  like?:number;

  view?:number;

}



/* =====================================
    Firestore Data
===================================== */


const lists = ref<FishingPost[]>([]);



const get_data = async()=>{


  if(!totalNo.value){

    return;

  }


  try{


    const firestore = getFirestore();



    const q = query(

      collection(
        firestore,
        "users"
      ),

      where(
        "total_no",
        "==",
        Number(totalNo.value)
      ),

      orderBy(
        "id",
        "asc"
      )

    );



    const snapshot = await getDocs(q);



    lists.value =
      snapshot.docs.map(doc=>({

        ...doc.data()

      })) as FishingPost[];



  }catch(error){


    console.error(
      "Firestore Error:",
      error
    );


  }


};





/* =====================================
    Intersection Observer
===================================== */


let observer:
IntersectionObserver | null = null;



const setupObserver =()=>{


  observer =
    new IntersectionObserver(

      (entries)=>{


        entries.forEach(entry=>{


          if(entry.isIntersecting){


            entry.target.classList.remove(
              "opacity-0",
              "translate-y-10"
            );


            entry.target.classList.add(
              "opacity-100",
              "translate-y-0"
            );


            observer?.unobserve(
              entry.target
            );


          }


        });


      },

      {

        threshold:0.15

      }

    );



  document
    .querySelectorAll(
      ".fishing-card"
    )
    .forEach(card=>{


      observer?.observe(
        card
      );


    });


};




/* =====================================
    TOPボタン
===================================== */


const showTopButton =
  ref(false);



const handleScroll =()=>{


  showTopButton.value =
    window.scrollY > 300;


};



let animationId:number;



const loop =()=>{


  handleScroll();


  animationId =
    requestAnimationFrame(
      loop
    );


};



const scrollToTop =()=>{


  window.scrollTo({

    top:0,

    behavior:"smooth"

  });


};





/* =====================================
    Like Animation
===================================== */


const liked =
  ref<number[]>([]);



const toggleLike=(id:number)=>{


  const index =
    liked.value.indexOf(id);



  if(index >=0){


    liked.value.splice(
      index,
      1
    );


  }else{


    liked.value.push(
      id
    );


  }


};





const isLiked=(id:number)=>{


  return liked.value.includes(
    id
  );


};

/* =====================================
    Dark Mode
===================================== */


const isDark =
  ref(false);



const setDarkMode =()=>{


  const html =
    document.documentElement;



  if(isDark.value){


    html.classList.add(
      "dark"
    );


    localStorage.setItem(
      "theme",
      "dark"
    );


  }else{


    html.classList.remove(
      "dark"
    );


    localStorage.setItem(
      "theme",
      "light"
    );


  }


};



const toggleDarkMode =()=>{


  isDark.value =
    !isDark.value;


  setDarkMode();


};




const initDarkMode =()=>{


  const saved =
    localStorage.getItem(
      "theme"
    );



  if(saved === "dark"){


    isDark.value =
      true;


  }
  else if(saved === "light"){


    isDark.value =
      false;


  }
  else{


    // OS設定取得

    isDark.value =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;


  }



  setDarkMode();


};





/* =====================================
    Like
    Firestore保存準備
===================================== */


const likeAnimation =
  ref<number | null>(null);



const animateLike=(id:number)=>{


  likeAnimation.value =
    id;



  setTimeout(()=>{


    likeAnimation.value =
      null;


  },500);


};




const addLike = async(
  task:FishingPost
)=>{


  try{


    task.like =
      (task.like ?? 0) + 1;



    animateLike(
      task.all_no
    );


    /*
      ここでFirestore更新

      updateDoc(
        doc(
          firestore,
          "users",
          id
        ),
        {
          like:task.like
        }
      )

    */


  }
  catch(error){


    console.error(
      error
    );


  }


};





/* =====================================
    View Count
===================================== */


const viewed =
  ref<number[]>([]);



const addView = async(
  task:FishingPost
)=>{


  if(
    viewed.value.includes(
      task.all_no
    )
  ){

    return;

  }



  viewed.value.push(
    task.all_no
  );



  task.view =
    (task.view ?? 0) + 1;



  /*
      Firestore更新例

      updateDoc(
        doc(
          firestore,
          "users",
          id
        ),
        {
          view:task.view
        }
      )

  */


};





/* =====================================
    Image Loading
===================================== */


const imageLoaded = ref<number[]>([]);



const onImageLoad=(
  id:number
)=>{


  imageLoaded.value.push(
    id
  );


};



const isImageLoaded=(
  id:number
)=>{


  return imageLoaded.value.includes(
    id
  );


};





/* =====================================
    Share
===================================== */


const sharePage=async()=>{


  const url =
    window.location.href;



  if(
    navigator.share
  ){


    await navigator.share({

      title:
        String(queryName.value),

      text:
        "Fishing Log",

      url


    });


  }
  else{


    await navigator.clipboard.writeText(
      url
    );


    alert(
      "URLをコピーしました"
    );


  }


};



/* =====================================
    Lifecycle
===================================== */


onMounted(async()=>{


  await get_data();


  // DOM生成後
  setTimeout(()=>{


    setupObserver();


  },300);



  loop();



});




onUnmounted(()=>{


  cancelAnimationFrame(
    animationId
  );


  observer?.disconnect();


});



</script>

<style scoped>

/* =====================================
   全体スクロール
===================================== */

html {
  scroll-behavior: smooth;
}


/* =====================================
   Fishing Card
===================================== */


.fishing-card {

  position: relative;

  transform:
    translateY(40px);

  opacity:0;

  transition:

    opacity .8s ease,

    transform .8s ease,

    box-shadow .4s ease;

}



.fishing-card:hover {

  transform:

    translateY(-8px);

  box-shadow:

    0 25px 50px rgba(
      0,
      0,
      0,
      .18
    );

}





/* =====================================
   表示アニメーション
===================================== */


.opacity-100 {

  opacity:1 !important;

}


.translate-y-0 {

  transform:
    translateY(0) !important;

}





/* =====================================
   ガラスカード
===================================== */


.glass {

  background:

    rgba(
      255,
      255,
      255,
      .65
    );


  backdrop-filter:

    blur(20px);


  border:

    1px solid

    rgba(
      255,
      255,
      255,
      .4
    );

}



/* =====================================
   画像
===================================== */


.image-hover {

  overflow:hidden;

}



.image-hover img {

  transition:

    transform .7s ease,

    filter .7s ease;

}



.image-hover:hover img {


  transform:

    scale(1.08);


  filter:

    brightness(1.08);


}



/* =====================================
   コメント吹き出し
===================================== */


.comment-box {


 position:relative;


 background:


 white;


 color:#334155;


 padding:

 25px;


 border-radius:

 25px;


 font-size:

 1.1rem;


 line-height:

 2;


 box-shadow:


 0 10px 30px rgba(

  0,

  0,

  0,

  .08

 );



}



.comment-box::after {


 content:"";


 position:absolute;


 bottom:-18px;


 left:40px;


 border-width:

 10px;


 border-style:solid;


 border-color:


 white transparent transparent transparent;



}




/* ダークモード */

:global(.dark)
.comment-box {


 background:#1e293b;


 color:#e2e8f0;



}



:global(.dark)
.comment-box::after {


 border-color:

 #1e293b transparent transparent transparent;


}




/* =====================================
   Like Animation
===================================== */


.like-button {


 transition:

 transform .25s ease;



}



.like-button:hover {


 transform:

 scale(1.25);


}



.like-button:active {


 transform:

 scale(.85);


}





/* =====================================
   TOP Button
===================================== */


button {


 cursor:pointer;


}





/* =====================================
   Pinterest風
===================================== */


@media(min-width:1024px){


.fishing-card:nth-child(even){


 margin-top:60px;


}



}




/* =====================================
   Scroll Bar
===================================== */


::-webkit-scrollbar {


 width:10px;


}



::-webkit-scrollbar-track {


 background:

 #e2e8f0;


}



::-webkit-scrollbar-thumb {


 background:

 #38bdf8;


 border-radius:

 999px;


}



::-webkit-scrollbar-thumb:hover {


 background:

 #0284c7;


}





/* =====================================
   スマホ調整
===================================== */


@media(max-width:640px){


.fishing-card {


 border-radius:

 25px;


}



.comment-box {


 font-size:

 1rem;


 padding:

 20px;


}



}



</style>


