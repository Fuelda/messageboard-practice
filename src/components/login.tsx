import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { useContext } from "react";
import { UserContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import tw from "twin.macro";

const Login = () => {
  const [doLogin, setDoLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigation = useNavigate();

  const loginSubmit = async (event: any) => {
    try {
      event.preventDefault();
      await signInWithEmailAndPassword(auth, email, password);
      navigation("/");
      console.log("sign in!");
    } catch (error: any) {
      alert(error.message);
    }
  };
  const registerSubmit = async (event: any) => {
    try {
      event.preventDefault();
      console.log(email);
      await createUserWithEmailAndPassword(auth, email, password);
      await onAuthStateChanged(auth, (user: any) => {
        user && console.log(user.uid);
        const registerRef = doc(db, "users", user.uid);
        setDoc(registerRef, { userName: name, userEmail: email });
      });

      navigation("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    user && navigation("/");
  }, []);

  const { user }: any = useContext(UserContext);

  return (
    <div>
      <h1 tw="text-blue-400 text-center text-5xl">
        {doLogin ? "Login" : "Register"}
      </h1>
      <section tw="max-w-xl mx-auto mt-9">
        <form onSubmit={doLogin ? loginSubmit : registerSubmit}>
          <table tw="mx-auto">
            <tr>
              <th> {!doLogin && <label>ユーザー名</label>}</th>
              <td tw="pl-4">
                {!doLogin && (
                  <input
                    name="name"
                    type="text"
                    placeholder="xxxx xxxx"
                    onChange={(event) => setName(event.target.value)}
                    tw="border-solid border-2 rounded border-blue-400"
                  />
                )}
              </td>
            </tr>
            <tr>
              <th>メールアドレス</th>
              <td tw="pl-4">
                <input
                  name="email"
                  type="email"
                  placeholder="xxxx@gmail.com"
                  onChange={(event) => setEmail(event.target.value)}
                  tw="border-solid border-2 rounded border-blue-400"
                />
              </td>
            </tr>
            <tr>
              <th>パスワード</th>
              <td tw="pl-4">
                {" "}
                <input
                  name="password"
                  type="password"
                  placeholder="xxxxxxxx"
                  onChange={(event) => setPassword(event.target.value)}
                  tw="border-solid border-2 rounded border-blue-400"
                />
              </td>
            </tr>
          </table>

          <div tw="text-center mt-2">
            <button tw="bg-blue-400 text-white h-9  px-2 rounded">
              {doLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
        <div tw="text-center mt-4">
          <button
            onClick={() => setDoLogin(!doLogin)}
            tw="bg-blue-400 text-white h-9  px-2 rounded"
          >
            {doLogin ? "Registerへ" : "Loginへ"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Login;
