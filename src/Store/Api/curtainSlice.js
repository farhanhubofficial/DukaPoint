import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";
import {db} from "../../firebase-config"
const curtainsCollection = collection(db, "curtains");

export const curtainsApi = createApi({
  reducerPath: "curtainsApi",
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    fetchCurtains: builder.query({
      async queryFn() {
        const querySnapshot = await getDocs(curtainsCollection);
        const curtains = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return { data: curtains };
      },
    }),
    addCurtain: builder.mutation({
      async queryFn(newCurtain) {
        await addDoc(curtainsCollection, newCurtain);
        return { data: "Curtain added" };
      },
    }),
    updateCurtain: builder.mutation({
      async queryFn({ id, updatedCurtain }) {
        const curtainDoc = doc(db, "curtains", id);
        await updateDoc(curtainDoc, updatedCurtain);
        return { data: "Curtain updated" };
      },
    }),
    deleteCurtain: builder.mutation({
      async queryFn(id) {
        const curtainDoc = doc(db, "curtains", id);
        await deleteDoc(curtainDoc);
        return { data: "Curtain deleted" };
      },
    }),
  }),
});

export const {
  useFetchCurtainsQuery,
  useAddCurtainMutation,
  useUpdateCurtainMutation,
  useDeleteCurtainMutation,
} = curtainsApi;
