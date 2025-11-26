<template>
    <div class="login-form">  
        <div class="flex flex-col">
            <input type="text" v-model="user" autocomplete="off" placeholder="ユーザー" @change="login(user)" name="user" ref="userInput"
                class="
                        px-3  w-44 mb-2
                        text-base font-normal
                        text-gray-700 bg-white bg-clip-padding
                        border border-solid border-gray-600                
                        focus:text-gray-700 focus:bg-white  focus:outline-none
                "/>
            <input type="password" v-model="password" autocomplete="off" placeholder="password" name="password"
                class="
                        px-3  w-44 mb-2
                        text-base font-normal
                        text-gray-700 bg-white bg-clip-padding
                        border border-solid border-gray-600                
                        focus:text-gray-700 focus:bg-white  focus:outline-none
                "/>
        </div>
 

        <button class="shadow-md bg-blue-500 hover:bg-blue-800 shadow-gray-500/50 text-white rounded px-3 mt-1 ml-1" @click="login(user)">ログイン</button>
     
    </div>
</template>

<script setup lang="ts">
const user=ref<string>('')
const password=ref<string>('')

//ストアーを抽出
const authStore = useAuthStore();
const router = useRouter();


const login=(user:string)=>{
    //ストアーのパスワードを変更
    authStore.setPassword(user)
    if(authStore.password=='352'){
        router.push("/new_pag");
    }
}

const userInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
   // フォーカスに移動 
   if (userInput.value) {
        userInput.value.focus();
    }
});

</script>


<style scoped>
.login-form{
    margin-top: 10px;
    margin-left: 10px;
    border: 1px;
}

</style>