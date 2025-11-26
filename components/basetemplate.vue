
<template>
  <div class="container p-4 m-4 flex flex-col sm:flex-row h-screen overflow-hidden" style="height: 96vh;">
    <!-- textInputBoxA を中央配置 -->
    <div class="textInputBoxA bg-white shadow-lg sm:basis-1/4 flex-shrink-0 flex flex-col items-start justify-center overflow-hidden" style="height: 400px;">
      <button
        class="bg-gray-400 text-black font-bold hover:text-white text-sm rounded px-3 mt-2 ml-2 mb-2 h-6"
        @click="change_position('normal')"
      >
        戻る
      </button>

      <h3 class="text-lg font-semibold mt-3 ml-2">コメント入力：</h3>
      <textarea
        class="m-2 bg-blue-100 p-2 border border-gray-300 rounded w-11/12"
        v-model="comment"
        id="comment"
        rows="4"
        required
        placeholder="コメントを入力してください。"
      ></textarea>

      <h3 class="text-lg font-semibold mt-3 ml-2">画像選択：</h3>
      <input
        type="file"
        name="file1"
        id="sFiles"
        class="mb-1 ml-2"
        @change="updateFile"
        ref="fileInput"
      />

      <div class="flex mt-4 mb-2">
        <button
          class="bg-gray-600 text-white py-1 px-4 rounded hover:bg-gray-700 ml-2"
          @click="addTask()"
        >
          新規 保存
        </button>
        <button
          class="ml-3 bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
          @click="editTask()"
        >
          上書 保存
        </button>
      </div>
    </div>

    <!-- textInputBoxB を中央配置 -->
    <div class="textInputBoxB sm:basis-3/4 overflow-y-auto flex-1 flex flex-col items-start">
      <!-- タイトルを表示 -->
      <div class="text-2xl bg-gray-700 text-white py-2 px-5 rounded mb-4">
        {{ props.date_id }}-{{ props.TitleName }}
      </div>

      <ul class="list-group space-y-4 max-w-5xl w-full">
        <li
          v-for="(task, index) in lists"
          :key="index"
          class="bg-white shadow-md p-4 rounded border border-gray-200 w-full flex flex-col items-start"
        >
          <div class="flex items-center mb-4">
            <button
              v-if="index !== 0"
              @click="deleteTask(task.comment,task.all_no,task.image)"
              class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 mr-3"
            >
              削除{{ index }}
            </button>
            <button
              @click="edit_but(task.comment,task.all_no,task.image)"
              class="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
            >
              編集{{ task.id }}
            </button>
          </div>

          <h5 class="text-lg mb-2">{{ task.comment }}</h5>
          <img
            :src="task.image"
            v-if="task.image"
            class="mt-1 max-w-full h-auto rounded shadow"
          />
        </li>
      </ul>
    </div>
  </div>
</template>













<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { getFirestore, addDoc, collection, query, where, getDocs, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL ,deleteObject} from 'firebase/storage'; // Correctly import from firebase/storage

// `input` 要素のリファレンス
const fileInput = ref<HTMLInputElement | null>(null)  

//スタートポジションの変更
const authStore = useAuthStore();//ストアーを抽出
  const change_position=(item:string)=>{
      authStore.setStart_posi(item)//スタートポジションの変更
  };

// プロップスの設定
const props = defineProps({
  id:Number,
  all_no: Number,
  total_no: Number,
  TitleName: String,
  date_id: String,    
  display: String,
});
const lists = ref<Array<any>>([]);
const comment = ref('');

//データを所得
const get_data=async()=>{
  const firestore=getFirestore();
  const res_json=[];
  const _query = query(
  collection(firestore,'users'),
  where("total_no", "==", props.total_no),
  orderBy('id', 'asc')
  );
  const sanpshot=await getDocs(_query);
  for (const doc of sanpshot.docs){
      res_json.push(
      { ...doc.data()})
  };

  lists.value=res_json
  // console.log(res_json)
};

//編集ボタンをクリックしたとき
const edit_allno=ref<number | null>()
const edit_image=ref<string>('')
const edit_but=(edit_comment:string, allno:number | null, image:string)=>{
comment.value=edit_comment
edit_allno.value=allno
edit_image.value=image

// console.log( comment.value)
// console.log( edit_allno.value)
// console.log( edit_image.value)
};

//インプットボックスからファイル名の所得
const fileName = ref<File | null>(null);
const updateFile = (e: Event) => {
const target = e.target as HTMLInputElement
if (target.files && target.files.length > 0) {
  fileName.value = target.files[0]
}
}
//データ削除
const deleteTask=async(comment:string, allno:number | null, image:string)=>{
  // console.log(comment)
  // console.log(allno)
  // console.log(image)
  //画像ファイルの削除
  
  let checkSaveFlg: boolean = window.confirm('データを削除しますか?');  
  if (checkSaveFlg) {
      //DBから削除
      if(allno!==null) {
        await deleteData(allno);
      }  
    //画像ファイルの削除
      await deleteFile(image);      
      get_data();
  };
};

//上書き保存
const editTask=async()=>{
if(!fileName.value){//画像の上書きがない場合
    //DBの更新
    if(edit_allno.value !==null && edit_allno.value !==undefined){
      await updateData(edit_allno.value,comment.value,edit_image.value)
      get_data();
    }
}else{//画像の上書きがある場合
  // 正規表現を使ってファイル名を抽出するして
  const filename:any = edit_image.value.match(/\/([^\/]+\.[a-zA-Z0-9]+)\?/);
  // 抽出したファイル名をデコードして表示する(%2F は / のURLエンコードです)
  const decodedFileName = decodeURIComponent(filename[1]);
  //一旦画像を削除
    await deleteFile(decodedFileName)
  //新しい画像をアップロード
   await uploadFile()// uploadFileの完了を待つ
  //DBの更新
  if(edit_allno.value !==null && edit_allno.value !==undefined){   
    await updateData(edit_allno.value,comment.value,fileURL.value)
    get_data();  
  } 
}
}; 

//  新規保存
const addTask=async()=>{
    //total_noの数を把握する
    const firestore=getFirestore();
    const q = query(
      collection(firestore, 'users'),
      where('total_no', '==', props.total_no)        
    );
    const res = await getDocs(q);
    const size = res.size;

    // `all_no`の最大値を取得する
    const q_max = query(
      collection(firestore, 'users'),
      orderBy('all_no', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q_max);  
    let maxAllNo = 1; // デフォルト値

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      maxAllNo = (data.all_no || 0) ;
    }

// console.log('fileName'+fileURL.value)
// console.log('image:'+lists.value[res.size-1].image)
// console.log('id:'+res.size)
// console.log('all_no:'+maxAllNo)
// console.log('date:'+props.date_id)
// console.log('total_no:'+props.total_no)
// console.log('name:'+props.TitleName)
// console.log('display:')
// console.log('comment:'+comment.value)
    
      if( lists.value[res.size-1].image=='' && res.size==1){
        //画像の保存
        await  uploadFile()// uploadFileの完了を待つ
        //DBの更新
        await updateData(maxAllNo,comment.value,fileURL.value)
        get_data();
      }else{
        //画像の保存
        await  uploadFile()// uploadFileの完了を待つ
        //DBの更新
        if (props.total_no !== undefined && props.date_id !==undefined && props.TitleName !==undefined) {
            addData(res.size+1,props.total_no, maxAllNo+1, props.date_id, props.TitleName, fileURL.value, comment.value);
          }
        get_data();
      }     
 
};


//画像を保存
const fileURL = ref<string | null>(null)
const storage = getStorage()
const uploadFile = async () => {
if (fileName.value) {
  const fileRef = storageRef(storage, `images/${fileName.value.name}`);
  const uploadTask = uploadBytesResumable(fileRef, fileName.value);
  return new Promise<void>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        fileURL.value = await getDownloadURL(uploadTask.snapshot.ref);       
        // console.log("File available at", fileURL.value);   
        if (fileInput.value) {
          fileInput.value.value = '' // `input` の選択をリセット
        }    
        resolve(); // 完了したことを通知
      }
    );
  });
}
};

//DBを更新
const updateData= async(all_no:number, comment:string, image:string|null)=>{
try {
    const firestore=getFirestore();
    const q = query(
      collection(firestore, 'users'),
      where('all_no', '==', all_no)
    );  
    // クエリを実行してドキュメントのスナップショットを取得
    const snapshot = await getDocs(q);  
    // ドキュメントをアップデート
    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const docRef = doc(firestore, 'users', docSnap.id);
      return updateDoc(docRef, {
        comment: comment,
        image: image,
      });
    });
    // 全てのアップデート処理が完了するのを待つ
    await Promise.all(updatePromises);
  } catch (err:any) {
    console.log(err.message);
  }
  
  };

//DBを新規登録
const addData=async (id:number, total_no:Number, all_no:number , date:string, name:string, image:string|null, comment:string) => {
try {     
    // Firestoreにデータを登録する
    const firestore=getFirestore();
    await addDoc(collection(firestore, 'users'), {
      id: id,
      total_no: total_no,
      all_no: all_no,
      date: date,
      name: name,
      image: image,
      display: '',
      comment: comment,
    }); 
    
  } catch (err:any) {
    console.log(err.message);
  }
  };

//画像データを削除
const deleteFile = async (imgeName: string) => {
  if (fileName.value) {
    try {
      const fileRef = storageRef(storage, imgeName);
      await deleteObject(fileRef); // `await` で非同期処理を待つ      
      console.log("File deleted successfully");
      fileURL.value = null; // 削除成功後にURLをリセット
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }
};

//DBの削除
const deleteData = async (all_no:number) => {
        try {
        // `all_no`が344のドキュメントを取得するクエリを作成
        const firestore=getFirestore();
        const q = query(
            collection(firestore, 'users'),
            where('all_no', '==', all_no)
        );
    
        // クエリを実行してドキュメントのスナップショットを取得
        const snapshot = await getDocs(q);
    
        // 取得したドキュメントを削除
        const deletePromises = snapshot.docs.map(async (docSnap) => {
            const docRef = doc(firestore, 'users', docSnap.id);
            return deleteDoc(docRef);
        });            
        // 全ての削除処理が完了するのを待つ
        await Promise.all(deletePromises);
        lists.value=await usePostState().getPosts()
    
        
        } catch (err:any) {
          console.log(err.message);
        }
    };



onMounted(() => {
    get_data();
});

</script>



<style scoped>
.container { 
  max-width: 1920px;
  margin: 10px auto;
}

.textInputBoxA {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左寄せ */
}

.textInputBoxB {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左寄せ */
  margin-left: 10px;
  margin-top: 10px;
}

.textInputBoxB .list-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左寄せ */
}
</style>
