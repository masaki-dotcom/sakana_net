import{
    getFirestore,
      getDocs,
      collection,
      where,
      query,
      orderBy,  
  } from 'firebase/firestore'

export const usePostState = () =>{
    const firestore=getFirestore()

    async function getPosts() {
        return await new Promise<any>(async(resolve,rejects) =>{
            const res_json=[];
            const _query = query(
              collection(firestore,'users'),
             where("id", "==", 1) ,
             where("display", "==", "表示"),
             orderBy(`date`,`desc`)
            );
            const sanpshot=await getDocs(_query);
            for (const doc of sanpshot.docs){
                res_json.push(
                  { ...doc.data()})
            };

            // `date` フィールドでソートする
            // res_json.sort((a, b) => {                
            //     // `date`をDateオブジェクトに変換し、ミリ秒で比較
            //     const dateA = new Date(a.date).getTime();
            //     const dateB = new Date(b.date).getTime();
            //     return dateB - dateA; // 降順
            // });

            resolve(res_json)
        })

    };

   
   

    return{
        getPosts,
      
    };

}
