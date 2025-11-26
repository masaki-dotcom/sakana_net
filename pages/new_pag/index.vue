
<template>
  <div>
      <!-- 通常表示 -->
      <div v-if="authStore.start_position=='normal'">
              <div class="fixed01 pt-4">
                      <button class="bg-gray-400  text-black font-bold hover:text-white text-sm rounded px-3 mt-2 ml-2 mb-2 h-6" 
                      @click="$router.push('/')"  >戻る
                      </button>

                      <h1 class="ml-2 mb-2 text-2xl font-bold ">登録リスト</h1>

                      <button class="shadow-md bg-blue-500 hover:bg-blue-800 shadow-gray-500/50 text-white rounded px-3 ml-3" @click="change_position('add')">新規 追加</button>

                      <div class="flex ml-3 mt-2">
                          <!-- <div class="line_top bom1A flex items-center justify-center bg-zinc-100">id</div>    -->
                          <div class="line_top bom1A flex items-center justify-center bg-zinc-100">ID</div>
                          <!-- <div class="line_top bom1A flex items-center justify-center bg-zinc-100">total_no</div> -->
                          <div class="line_top bom2A flex items-center justify-center bg-zinc-100">日付</div>                    
                          <div class="line_top bom3A flex items-center justify-center bg-zinc-100">TitleName</div>
                          <div class="line_top bom1A flex items-center justify-center bg-zinc-100">表示</div>
                          <div class="line_top bom1A flex items-center justify-center bg-zinc-100">編集</div>
                          <div class="line_top bom1A flex items-center justify-center bg-zinc-100">削除</div>                                                       
                      </div> 
              </div> 
                      <div class="mb-3">
                          <div class="flex ml-3" v-for="list,index in lists" :kye="index">
                              <!-- <div class="out_line bom1 flex items-center justify-center">{{list.id}}</div> -->
                              <div class="out_line bom1 flex items-center justify-center text-blue-700 cursor-pointer" @click="blog_link(list.all_no,list.total_no,list.date,list.name,list.id,list.display)">{{list.all_no}}</div>
                              <!-- <div class="out_line bom1 flex items-center justify-center">{{list.total_no}}</div> -->
                              <div class="out_line bom2 flex items-center justify-center">{{list.date}}</div>
                              <!-- <div class="out_line bom3 flex items-center justify-center">-</div> -->
                              <div class="out_line bom3 flex items-center justify-center">{{list.name}}</div>
                              <div class="out_line bom1 flex items-center justify-center">{{list.display}}</div>
                              <div class="out_line bom1 flex items-center justify-center text-blue-700 cursor-pointer" @click="update(list.date,list.name,list.all_no)">編集</div>
                              <div class="out_line bom1 flex items-center justify-center text-red-500 cursor-pointer" @click="DeleteTask(list.total_no,list.image)">削除</div>
                          </div>
                      </div>
      
      </div>

      <!-- 新規追加 -->
      <div v-if="authStore.start_position=='add' || authStore.start_position=='update'" class="mt-4">
                      <button class="shadow-md bg-blue-500 hover:bg-blue-800 shadow-gray-500/50 text-white rounded px-3 ml-4" @click="registerData()" v-if="authStore.start_position=='add'">追加</button>
                      <button class="shadow-md bg-green-600 hover:bg-green-800 shadow-gray-500/50 text-white rounded px-3 ml-4" @click="updateData()" v-if=" authStore.start_position=='update'">変更</button>
                      <button class="shadow-md bg-yellow-500 hover:bg-yellow-800 shadow-gray-500/50 text-white rounded px-3 ml-3" @click="change_position('normal')">キャンセル</button>
                      <div class="flex ml-3 mt-2"> 
                          <div class="line_top bom2A flex items-center justify-center bg-zinc-100">日付</div>                    
                          <div class="line_top bom3A flex items-center justify-center bg-zinc-100">TitleName</div> 
                          <div class="line_top bom2A flex items-center justify-center bg-zinc-100"  v-if=" authStore.start_position=='update'">表示</div>                                                                                 
                      </div> 

                      <div class="flex ml-3">                                
                              <div class="out_line bom2 flex items-center justify-center"><input @click="showModal = true" class="input_box w-full h-full text-center" type="text" v-model="nowDate" ></div>
                              <div class="out_line bom3 flex items-center justify-center"><input class="input_box w-full h-full text-center" type="text" v-model="title" ></div>
                              <div class="out_line bom2 flex items-center justify-center" v-if=" authStore.start_position=='update'">
                                      <select v-model="display_data"                            
                                          class=" selecttBox w-full hover:bg-zinc-300 focus:bg-white h-full" >
                                          <option  disabled value="">選択</option>
                                          <option  value="-"></option>                                                       
                                          <option  value="表示">表示</option>
                                      </select>
                              </div>
                      </div>

                      <!-- モーダル設定 -->
                      <Modal v-model:show="showModal">
                          <Datepicker v-model="date" format="yyyy-MM-dd" @update:model-value="selectDate()" locale="jp" inline auto-apply></Datepicker>
                      </Modal>
      </div>

      <!-- ブログの本編の編集 -->
      <div v-if="authStore.start_position=='update2'" class="mt-4">         
         <basetemplate  :all_no="blog_all_no" :total_no="blog_total_no" :TitleName="blog_name" :date_id="blog_date" :id="blog_id" :display="blog_display" ></basetemplate>          
     </div>
      

  </div>
</template>
<script setup lang="ts"> 
import basetemplate from '~/components/basetemplate.vue' 
 
  definePageMeta({
      requiresAuth: true,//認証の制御
      middleware: 'auth',
  })

  import { usePostState } from "~/composables/usePostState";
  const lists = ref()
  lists.value=await usePostState().getPosts()

  //スタートポジションの変更
  const authStore = useAuthStore();//ストアーを抽出
  const change_position=(item:string)=>{
      authStore.setStart_posi(item)//スタートポジションの変更
  }

  //タイトル設定
  const title=ref<string>('')

  //デートピッカーの設定
  import Datepicker from '~/components/InputDate.vue'
  const date = ref(new Date())
  //日付設定
  const nowDate=ref<string>()
  const selectDate=()=>{
          const year = date.value.getFullYear()
          const month = String(date.value.getMonth() + 1).padStart(2, '0') // 月は0から始まるので+1
          const day = String(date.value.getDate()).padStart(2, '0')
          nowDate.value=`${year}-${month}-${day}`
  };
  
  //モーダル設定
  import Modal from '~/components/modal.vue';  
  const showModal = ref(false);

  // Firestore v9+ で記入
  //新規追加・削除
  import { useNuxtApp } from '#app';
  import { collection, addDoc, orderBy, limit, query, where, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
  import { getStorage, ref as storageRef, deleteObject} from 'firebase/storage';
  
  // Firestoreのインスタンスを取得
  const { $firestore } = useNuxtApp();

  //新規追加機能
  const blog_id = ref<number>(1);
  const blog_all_no = ref<number>();
  const blog_total_no = ref<number>();
  const blog_date = ref<string>('');
  const blog_name = ref<string>('');
  const blog_image = ref<string>('');
  const blog_display = ref<string>('');
  const blog_comment = ref<string>('');
  const blog_error = ref<string>('');  
  const registerData = async () => {
  try {
    // `all_no`の最大値を取得する
    const q = query(
      collection($firestore, 'users'),
      orderBy('all_no', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);  
    let newAllNo = 1; // デフォルト値

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      newAllNo = (data.all_no || 0) + 1;
    }

    // `total_no`の最大値を取得する
    const q2 = query(
      collection($firestore, 'users'),
      orderBy('total_no', 'desc'),
      limit(1)
    );
    const snapshot2 = await getDocs(q2);  
    let newAllNo2 = 1; // デフォルト値  
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      newAllNo2 = (data.total_no || 0) + 1;
    }

    // Firestoreにデータを登録する
    await addDoc(collection($firestore, 'users'), {
      id: blog_id.value,
      total_no: newAllNo2,
      all_no: newAllNo,
      date: nowDate.value,
      name: title.value,
      image: blog_image.value,
      display: blog_display.value,
      comment: blog_comment.value,
    });  
    lists.value=await usePostState().getPosts();
    change_position('normal');//フォームを閉じる
    nowDate.value=''//初期化
    title.value=''//初期化
    
  } catch (err:any) {
    blog_error.value = err.message;
  }
  };

  //編集アップデート   
 const display_data=ref<string>('')
 const update=(date:string,name:string,all_no:number)=>{
      change_position('update')
      nowDate.value=date;
      title.value=name; 
      blog_all_no.value= all_no;      
 };
 
 const updateData= async()=>{
  try {
    // `all_no`が344のドキュメントを取得するクエリを作成
    const q = query(
      collection($firestore, 'users'),
      where('all_no', '==', blog_all_no.value)
    );  
    // クエリを実行してドキュメントのスナップショットを取得
    const snapshot = await getDocs(q);  
    // ドキュメントをアップデート
    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const docRef = doc($firestore, 'users', docSnap.id);
      return updateDoc(docRef, {
        date: nowDate.value,
        name: title.value,
        display:display_data.value,
      });
    });

    // 全てのアップデート処理が完了するのを待つ
    await Promise.all(updatePromises);
    lists.value=await usePostState().getPosts();
    change_position('normal');//フォームを閉じる
    nowDate.value=''//初期化
    title.value=''//初期化
    blog_all_no.value=0//初期化
    blog_display.value=''//初期化

   
  } catch (err:any) {
    blog_error.value = err.message;
  }

  // console.log(nowDate.value)
  // console.log(title.value)
  // console.log(all_No.value)
  // change_position('normal');//フォームを閉じる
 };

  //削除機能
  const DeleteTask= async(item:number,image:string)=> {
      let checkSaveFlg: boolean = window.confirm('データを削除しますか?');  
      if (checkSaveFlg) {        
          console.log(item)
          console.log(image)
          if(image){
              // 正規表現を使ってファイル名を抽出するして
              const filename:any = image.match(/\/([^\/]+\.[a-zA-Z0-9]+)\?/);
              // 抽出したファイル名をデコードして表示する(%2F は / のURLエンコードです)
              const decodedFileName = decodeURIComponent(filename[1]);
              //一旦画像を削除
              await deleteFile(decodedFileName)//画像を削除
          }
          
            await deleteData(item);//DBから削除
      }
      }
  //Dbからデータの削除
  const deleteData = async (total_no:number) => {
              try {
              // `all_no`が344のドキュメントを取得するクエリを作成
              const q = query(
                  collection($firestore, 'users'),
                  where('total_no', '==', total_no)
              );
          
              // クエリを実行してドキュメントのスナップショットを取得
              const snapshot = await getDocs(q);
          
              // 取得したドキュメントを削除
              const deletePromises = snapshot.docs.map(async (docSnap) => {
                  const docRef = doc($firestore, 'users', docSnap.id);
                  return deleteDoc(docRef);
              });            
              // 全ての削除処理が完了するのを待つ
              await Promise.all(deletePromises);
              lists.value=await usePostState().getPosts()
          
              
              } catch (err:any) {
                blog_error.value = err.message;
              }
          };
  //画像データを削除
const storage = getStorage()
const deleteFile = async (imgeName: string) => {
  if (imgeName) {
    try {
      const fileRef = storageRef(storage, imgeName);
      await deleteObject(fileRef); // `await` で非同期処理を待つ     
      console.log("File deleted successfully");     
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }
};

 //ブログの本編にリンク
 const prop_value=reactive({
  all_No:'',
  total_no:'',
  date:'',
  name:'',
  id:'',
  

 })
 const blog_link=(all_no:number,total_no:number,date:string,name:string,id:number,display:string)=>{
  blog_all_no.value=all_no;
  blog_total_no.value=total_no;
  blog_date.value=date;
  blog_name.value=name;
  blog_id.value=id;
  blog_display.value=display; 
  change_position('update2')
 }
  
</script>

<style scoped>

.selecttBox {  
border:none;
outline: none;
text-align: center;
}
.input_box{
  outline: none;
}
.fixed01{
  position: sticky;
  top: 0;
  left: 0;
  color: rgb(0, 0, 0);
  background-color: white;
  
  /* border: 1px solid #ccc; */
 }
 .fixed01:before{
    content: "";
    position: absolute;    
  }
.fixed01{
  z-index: 1;
}
.out_line {
border: 1px solid #9e9e9e;

}
.line_top{
  border: 1px solid #9e9e9e;
}
.out_line + .out_line,
.line_top + .line_top{
  border-left: 0;
}
.out_line:not(:first-child),
.out_line:first-child{
  border-top: 0;
}
.bom1 , .bom1A{
  width: 80px;
}
.bom2, .bom2A{
  width: 150px;
}
.bom3, .bom3A{
  width: 200px;
}
.bom4, .bom4A{
  width: 800px;
}
</style>


