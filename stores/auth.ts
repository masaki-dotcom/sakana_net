import type { RouteLocationNormalized } from "vue-router";


export const useAuthStore = defineStore(
  "auth",
  () => {
    //パスワード設定
    const password = ref<string>("");   
    //ログインの設定
    const isLogin = computed<boolean>(() => !!password.value);
    const validateRoute = (route: RouteLocationNormalized) => {
      if (route.meta.requiresAuth && !isLogin.value) {
        return "/login";
      }
    };
    const setPassword = (newPass: string) => {
        password.value = newPass;
    };

    //スタートポジション設定
     const start_position=ref<string>("normal");
     const setStart_posi=(newPass: string)=>{
        start_position.value=newPass
     };

    //currentPagelNoの所得
    const currentPagelNo = ref<number>(1); // ref を使って初期値を設定
    
   
    //画像を選択したとのURL
    const ImageURL=ref<string>("");
    
    const selectImage = (newImage: string, pageNo: number) => {
      ImageURL.value = newImage;
      currentPagelNo.value = pageNo;
    }


    return {
      password,
      setPassword,   
      validateRoute,
      start_position,
      setStart_posi,
      currentPagelNo,
      ImageURL,
      selectImage,
    };
    
  },
 
 
);

  

