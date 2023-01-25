import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

export const UserContext = createContext<any[]>([]);

export const AuthContext = ({ children }: any) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true); //unSubができるまでloadingをtrueにしておき、childrenにreturnさせない。つまり、userにデータが入る前にreturnするのを防ぐ。
  const [allUser, setAllUser] = useState<{ id: string }[]>();
  const value: any = { user, allUser };

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      setUser(user);
      setLoading(false);
    });

    const allUserRef = collection(db, "users");
    onSnapshot(allUserRef, (querySnapshot) => {
      setAllUser(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    // const allMsgRef = collection(db, "messages");
    // const q = query(allMsgRef, orderBy("createdAt"));
    // onSnapshot(q, (querySnapshot) => {
    //   setAllMsg(
    //     querySnapshot.docs.map((doc) => ({
    //       ...doc.data(),
    //       id: doc.id,
    //     }))
    //   );
    // });
  }, []);

  console.log(loading);

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
