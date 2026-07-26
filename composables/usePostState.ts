import {
  getDocs,
  collection,
  where,
  query,
  orderBy,
  limit,
  startAfter,
  getCountFromServer
} from 'firebase/firestore'

import type {
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore'

let lastDocs: QueryDocumentSnapshot<DocumentData>[] = []

import { firestore } from '~/lib/firebase'

export const usePostState = () => {
 
  async function getPosts(page: number, pageSize: number) {

  // 1ページ目
  if (page === 1) {
    lastDocs = []
  }

  // 必要なカーソルが無い場合
  while (lastDocs.length < page - 1) {

    let q

    if (lastDocs.length === 0) {
      q = query(
        collection(firestore, "users"),
        where("id", "==", 1),
        where("display", "==", "表示"),
        orderBy("date", "desc"),
        limit(pageSize)
      )
    } else {
      q = query(
        collection(firestore, "users"),
        where("id", "==", 1),
        where("display", "==", "表示"),
        orderBy("date", "desc"),
        startAfter(lastDocs[lastDocs.length - 1]),
        limit(pageSize)
      )
    }

    const snap = await getDocs(q)

    lastDocs.push(snap.docs[snap.docs.length - 1])
  }

  let q

  if (page === 1) {
    q = query(
      collection(firestore, "users"),
      where("id", "==", 1),
      where("display", "==", "表示"),
      orderBy("date", "desc"),
      limit(pageSize)
    )
  } else {
    q = query(
      collection(firestore, "users"),
      where("id", "==", 1),
      where("display", "==", "表示"),
      orderBy("date", "desc"),
      startAfter(lastDocs[page - 2]),
      limit(pageSize)
    )
  }

  const snapshot = await getDocs(q)

  const res: any[] = []

  snapshot.forEach(doc => {
    res.push(doc.data())
  })

  lastDocs[page - 1] = snapshot.docs[snapshot.docs.length - 1]

  return res
}

  async function getAllPosts() {
    const res_json:any[] = []
    const _query = query(
      collection(firestore, 'users'),
      where("id", "==", 1),
      orderBy('date', 'desc')
    )
    const sanpshot = await getDocs(_query)
    for (const doc of sanpshot.docs) {
      res_json.push({
        ...doc.data()
      })
    }
    return res_json
  }

 async function getPostCount() {
  const q = query(
    collection(firestore, 'users'),
    where("id", "==", 1),
    where("display", "==", "表示")
  )
  const count = await getCountFromServer(q)
  return count.data().count
}



  return {
    getPosts,
    getAllPosts,
    getPostCount,
  }
}