import {
  getDocs,
  collection,
  where,
  query,
  orderBy,
} from 'firebase/firestore'

import { firestore } from '~/lib/firebase'

export const usePostState = () => {

  async function getPosts() {

    const res_json:any[] = []

    const _query = query(
      collection(firestore, 'users'),
      where("id", "==", 1),
      where("display", "==", "表示"),
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

  return {
    getPosts,
    getAllPosts,
  }
}