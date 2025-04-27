// 使用 Firebase v9 Modular 版
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, getRedirectResult, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"; // <--- 引入 getRedirectResult 和 signOut

// Firebase 設定 (保持不變)
const firebaseConfig = {
  apiKey: "AIzaSyCq7lE6EK9hmCd8SDSTbvAZxrozVGXQZpo", // 請務必確認這是你的真實且安全的 API Key
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

// --- DOM 元素獲取 ---
const googleLoginBtn = document.getElementById('google-login-btn');
const userInfoDiv = document.getElementById('user-info');

// --- 登入/登出邏輯 ---

// Google 登入功能 (使用 Redirect)
function googleLogin() {
  signInWithRedirect(auth, provider)
    .catch((error) => {
      // 處理啟動跳轉時可能發生的錯誤
      console.error("Error starting Google redirect login:", error);
      alert(`登入時發生錯誤: ${error.message}`); // 提供用戶反饋
    });
}

// 登出功能 (可選，點擊頭像時觸發)
function googleLogout() {
  signOut(auth).then(() => {
    console.log("User signed out.");
    // UI 更新會由 onAuthStateChanged 處理
  }).catch((error) => {
    console.error("Error signing out:", error);
    alert(`登出時發生錯誤: ${error.message}`);
  });
}

// --- UI 更新 ---

// 根據登入狀態更新 UI
function updateUI(user) {
  if (user) {
    // --- 使用者已登入 ---
    console.log("User logged in:", user);

    // 隱藏登入按鈕
    if (googleLoginBtn) googleLoginBtn.style.display = 'none';

    // 顯示使用者頭像
    if (userInfoDiv) {
      userInfoDiv.innerHTML = `
        <img src="${user.photoURL || './default-avatar.png'}" alt="${user.displayName || 'User'}" class="user-avatar" title="已登入: ${user.displayName} (${user.email})\n點擊以登出">
      `;
      // 讓頭像可以點擊登出
      const avatarImg = userInfoDiv.querySelector('.user-avatar');
      if (avatarImg) {
        avatarImg.addEventListener('click', googleLogout);
      }
      userInfoDiv.style.display = 'block'; // 確保容器可見
    }

    // (可選) 登入後，也許禁用或隱藏本地名稱/密碼輸入？
    // document.getElementById('name').disabled = true;
    // document.getElementById('password').disabled = true;
    // document.getElementById('create-btn').disabled = true; // 或改變按鈕文字/功能

  } else {
    // --- 使用者未登入 ---
    console.log("No user logged in.");

    // 顯示登入按鈕
    if (googleLoginBtn) googleLoginBtn.style.display = 'block'; // 或 'inline-block' 等

    // 清除並隱藏使用者資訊區域
    if (userInfoDiv) {
      userInfoDiv.innerHTML = '';
      userInfoDiv.style.display = 'none'; // 隱藏容器
    }

    // (可選) 確保本地輸入可用
    // document.getElementById('name').disabled = false;
    // document.getElementById('password').disabled = false;
    // document.getElementById('create-btn').disabled = false;
  }
}

// --- 事件監聽與狀態處理 ---

// 監聽 Google 登入按鈕點擊
if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', googleLogin);
} else {
  console.error("Google login button not found!");
}

// 頁面載入時檢查是否有從 Google 登入跳轉回來
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      // 成功從 Google 跳轉回來並取得使用者資訊
      console.log("Redirect result obtained:", result.user);
      // 注意：此時 onAuthStateChanged 也會觸發，
      // 所以 UI 更新主要由 onAuthStateChanged 處理即可，這裡可以不用重複調用 updateUI
    } else {
      // 不是從 Google 登入跳轉回來，可能是直接載入頁面或刷新
      console.log("No redirect result found. Checking existing session.");
    }
  })
  .catch((error) => {
    // 處理獲取跳轉結果時的錯誤
    console.error("Error getting redirect result:", error);
    alert(`處理登入資訊時發生錯誤: ${error.message}`);
    // 即使這裡出錯，onAuthStateChanged 仍可能根據緩存狀態更新 UI
  })
  .finally(() => {
    // 無論成功或失敗，都確保 onAuthStateChanged 監聽器被設置
    // （實際上 Firebase SDK 會自動處理，這裡只是說明流程）
  });


// 監聽 Firebase 身份驗證狀態的變化 (核心！)
// 這個函數會在以下情況觸發：
// 1. getRedirectResult 成功處理後
// 2. 頁面載入時，如果用戶已有登入狀態 (來自上次會話)
// 3. 用戶登入或登出時
onAuthStateChanged(auth, (user) => {
  updateUI(user); // 使用獲取到的 user 對象更新 UI
});


// ----------------------
// 以下是你的本地驗證、語言切換功能 (保持不變)
// 確保這些函數仍然暴露在全局作用域 (如果 HTML onclick 直接調用)
// ----------------------

let username = '';
let password = '';
let isChinese = false;

const langData = { /* ... 保持不變 ... */ };

window.switchLanguage = function() { /* ... 保持不變 ... */ };
window.confirmName = function() { /* ... 保持不變 ... */ };
window.confirmPassword = function() { /* ... 保持不變 ... */ };
window.createSchedule = function() { /* ... 保持不變 ... */ };
window.howItWorks = function() { /* ... 保持不變 ... */ };

// (可選) 如果需要，在 createSchedule 中加入檢查，
// 如果用戶已透過 Google 登入，可能不需要再驗證本地 name/password
// window.createSchedule = function() {
//   const currentUser = auth.currentUser;
//   if (currentUser) {
//      console.log("Google user logged in, proceeding to choose.html");
//      window.location.href = 'choose.html';
//   } else {
//      // 原來的本地驗證邏輯
//      confirmName();
//      confirmPassword();
//      if (username && password) {
//        localStorage.setItem('timepick_user', JSON.stringify({ username, password }));
//        window.location.href = 'choose.html';
//      } else {
//        alert(isChinese ? langData.zh.bothError : langData.en.bothError);
//      }
//   }
// };
