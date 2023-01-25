import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { DocumentData } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/authContext";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import tw from "twin.macro";
import css from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faEnvelope,
  faIdCard,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [currentUser, serCurrentUser] = useState<DocumentData | null>(null);
  const [msg, setMsg] = useState("");
  const [allMsg, setAllMsg] = useState<{ id: string }[]>();
  const [msgValue, setMsgValue] = useState("");
  const [usersOpen, setUsersOpen] = useState(false);

  const navigation = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigation("/login");
    console.log("log out!");
  };
  const { user, allUser }: any = useContext(UserContext);

  useEffect(() => {
    !user && navigation("/login");

    if (user != null) {
      const currentUserRef = doc(db, "users", user.uid);
      getDoc(currentUserRef).then((documentSnapshot) => {
        const userData = documentSnapshot.data();
        userData && serCurrentUser(userData);
      });
    }

    const allMsgRef = collection(db, "messages");
    const q = query(allMsgRef, orderBy("createdAt"));
    onSnapshot(q, (querySnapshot) => {
      setAllMsg(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  const sendMsg = async (event: any) => {
    event.preventDefault();
    setMsgValue("");
    const msgRef = collection(db, "messages");
    await addDoc(msgRef, {
      message: msg,
      userName: currentUser && currentUser.userName,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    setMsg("");
  };

  const deleteMsg = async (msgId: string) => {
    const msgRef = doc(db, "messages", msgId);
    await deleteDoc(msgRef);
  };

  return (
    <div>
      <h1 tw="text-blue-400 text-center text-5xl">Chat Practice</h1>
      <section tw="max-w-xl mx-auto mt-9 relative">
        <div tw="">
          <div tw="flex text-center">
            <div tw="text-2xl">
              I'm{" "}
              <span tw="font-bold">{currentUser && currentUser.userName}</span>
            </div>
            <button
              onClick={handleLogout}
              tw="bg-blue-400 text-white h-7 w-20 px-0.5 rounded ml-4"
            >
              Log out
            </button>
          </div>

          <div>
            <FontAwesomeIcon icon={faEnvelope} />
            <span tw="pl-2">{currentUser && currentUser.userEmail}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faIdCard} />
            <span tw="pl-2">{currentUser && user.uid}</span>
          </div>

          <div tw="absolute top-0 right-0 w-32">
            <button onClick={() => setUsersOpen(!usersOpen)}>
              <FontAwesomeIcon icon={faUsers} tw="h-7" />
            </button>
            <div css={!usersOpen && tw`hidden`} tw="h-20 bg-gray-200 rounded">
              <div tw="h-20 overflow-scroll px-3">
                {allUser &&
                  allUser.map((eachUser: any) => (
                    <div key={eachUser.id}> {eachUser.userName}</div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div tw="mt-9">
          <form onSubmit={sendMsg}>
            <div tw="flex flex-col w-80 mx-auto">
              <textarea
                name="message"
                value={msgValue}
                placeholder=" Message..."
                onChange={(event) => {
                  setMsg(event.target.value);
                  setMsgValue(event.target.value);
                }}
                tw="h-40 border-solid border-2 rounded border-blue-400 "
              />
              <button tw="bg-blue-400 text-white h-9 px-2 rounded">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div tw="block mt-9 mx-auto">
          {allMsg ? (
            allMsg.map((msg: any) => {
              if (msg.createdAt != null) {
                const date = msg.createdAt.toDate();
                return (
                  <div key={msg.id}>
                    <div tw="flex">
                      <div tw="font-bold">{msg.userName}</div>
                      <div tw="pl-4">
                        {msg.message}

                        <span tw="pl-4 text-xs text-gray-400">
                          {date.getMonth() + 1}月{date.getDate()}日{" "}
                          {date.getHours()}:
                          {date.getMinutes() <= 9
                            ? "0" + date.getMinutes()
                            : date.getMinutes()}
                        </span>

                        {msg.userId == user.uid && (
                          <button onClick={() => deleteMsg(msg.id)}>
                            <FontAwesomeIcon icon={faTrashCan} tw="pl-2 " />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div>ロード中......</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
