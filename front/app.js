// Firebase 設定
const firebaseConfig = {
    apiKey: "AIzaSyCq7lE6EK9hmCd8SDSTbvAZxrozVGXQZpo",
    authDomain: "timepick-for-test.firebaseapp.com", // 預設格式：<專案ID>.firebaseapp.com
    projectId: "timepick-for-test",
    storageBucket: "timepick-for-test.appspot.com", // 預設格式：<專案ID>.appspot.com
    messagingSenderId: "14150496366",
    appId: "1:14150496366:web:45cbdc5752a3dc1e43f67f" // 你需要從 Firebase 控制台獲取 appId
};


// 初始化 Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Google 登入按鈕事件
document.getElementById('google-login-btn').addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then((result) => {
            // 登入成功後的處理邏輯
            console.log('User signed in:', result.user);
        })
        .catch((error) => {
            // 登入錯誤處理
            console.error('Error during Google login:', error);
        });
});

// Google 登入提供者
const googleProvider = new firebase.auth.GoogleAuthProvider();

// 設置登入功能
function googleLogin() {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            // 登入成功後，取得使用者資料
            const user = result.user;
            console.log("User signed in: ", user);
            // 這裡可以進行進一步的處理，比如顯示用戶資料或更新UI等
        })
        .catch((error) => {
            // 處理錯誤
            console.error("Error during sign in: ", error);
        });
}

// 監聽登入狀態的變化
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in:", user);
        // 顯示使用者的資料，或是執行登入後的功能
    } else {
        console.log("User logged out");
        // 顯示登入按鈕等
    }
});

if (user) {
    document.getElementById("user-info").innerHTML = `
        <p>Welcome, ${user.displayName}!</p>
        <p>Email: ${user.email}</p>
    `;
}
