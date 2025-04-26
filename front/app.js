// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Firebase 設定
const firebaseConfig = {
    apiKey: "AIzaSyCq7lE6EK9hmCd8SDSTbvAZxrozVGXQZpo",
    authDomain: "timepick-for-test.firebaseapp.com",
    projectId: "timepick-for-test",
    storageBucket: "timepick-for-test.appspot.com",
    messagingSenderId: "14150496366",
    appId: "1:14150496366:web:45cbdc5752a3dc1e43f67f"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 登入功能
window.googleLogin = function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("登入成功:", user);
            document.getElementById("user-info").innerHTML = `
                <p>Welcome, ${user.displayName}!</p>
                <p>Email: ${user.email}</p>
            `;
        })
        .catch((error) => {
            console.error("登入失敗:", error);
        });
};

// 監聽登入狀態
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("使用者已登入", user);
        document.getElementById("user-info").innerHTML = `
            <p>Welcome back, ${user.displayName}!</p>
            <p>Email: ${user.email}</p>
        `;
    } else {
        console.log("尚未登入");
    }
});
