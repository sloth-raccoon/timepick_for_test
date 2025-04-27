// 使用 Firebase v9 Modular 版
// 匯入 Firebase Authentication 模組中需要用到的函數
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,               // 獲取 Authentication 服務實例
  signInWithRedirect,    // <--- 主要變更：使用頁面跳轉方式登入
  GoogleAuthProvider,    // Google 登入提供者
  onAuthStateChanged,    // <--- 核心：監聽登入狀態變化
  getRedirectResult,     // <--- 主要變更：獲取頁面跳轉回來的登入結果
  signOut                // <--- 新增：登出功能
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Firebase 設定 (保持不變)
const firebaseConfig = {
    apiKey: "AIzaSyCq7lE6EK9hmCd8SDSTbvAZxrozVGXQZpo",
    authDomain: "timepick-for-test.firebaseapp.com",
    projectId: "timepick-for-test",
    storageBucket: "timepick-for-test.firebasestorage.app",
    messagingSenderId: "14150496366",
    appId: "1:14150496366:web:45cbdc5752a3dc1e43f67f",
    measurementId: "G-51J471CXLQ"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // 獲取 Authentication 服務
const provider = new GoogleAuthProvider(); // 創建 Google 登入提供者實例

// --- DOM 元素獲取 ---
// 獲取 HTML 中的 Google 登入按鈕和顯示使用者資訊的 div
const googleLoginBtn = document.getElementById('google-login-btn');
const userInfoDiv = document.getElementById('user-info');

// --- 登入/登出邏輯 ---

/**
 * @function googleLogin
 * @description 觸發 Google 登入流程 (使用頁面跳轉)。
 *              點擊按鈕後，頁面會跳轉到 Google 登入頁面。
 */
function googleLogin() {
  signInWithRedirect(auth, provider) // <--- 執行頁面跳轉登入
    .catch((error) => {
      // 處理啟動跳轉時可能發生的錯誤 (例如網路問題、設定錯誤)
      console.error("Error starting Google redirect login:", error);
      // 顯示錯誤訊息給使用者
      alert(`登入時發生錯誤: ${error.message}`);
    });
}

/**
 * @function googleLogout
 * @description 執行登出操作。
 */
function googleLogout() {
  signOut(auth).then(() => {
    // 登出成功
    console.log("User signed out.");
    // UI 的更新會由下面的 onAuthStateChanged 監聽器自動處理
  }).catch((error) => {
    // 處理登出時可能發生的錯誤
    console.error("Error signing out:", error);
    alert(`登出時發生錯誤: ${error.message}`);
  });
}

// --- UI 更新 ---

/**
 * @function updateUI
 * @description 根據傳入的 user 物件 (登入狀態) 更新頁面 UI。
 * @param {firebase.User | null} user - Firebase Auth 的使用者物件，如果未登入則為 null。
 */
function updateUI(user) {
  if (user) {
    // --- 使用者已登入 ---
    console.log("User logged in:", user);

    // 1. 隱藏 Google 登入按鈕
    if (googleLoginBtn) {
        googleLoginBtn.style.display = 'none';
    }

    // 2. 顯示使用者頭像區域，並填入內容
    if (userInfoDiv) {
      // 使用模板字串建立頭像圖片 HTML
      userInfoDiv.innerHTML = `
        <img
          src="${user.photoURL || './default-avatar.png'}" // 使用者頭像 URL，若無則用預設圖片
          alt="${user.displayName || 'User'}"             // 圖片替代文字 (用於無障礙)
          class="user-avatar"                             // CSS class 用於樣式設定 (圓形等)
          title="已登入: ${user.displayName} (${user.email})\n點擊以登出" // 滑鼠懸停提示
        >
      `;
      // 找到剛剛插入的圖片元素
      const avatarImg = userInfoDiv.querySelector('.user-avatar');
      if (avatarImg) {
        // 為頭像圖片添加點擊事件監聽器，點擊時觸發登出
        avatarImg.addEventListener('click', googleLogout);
      }
      // 確保頭像容器是可見的
      userInfoDiv.style.display = 'block';
    }

    // (可選) 根據需求，可以在登入後禁用本地登入的輸入框和按鈕
    // document.getElementById('name').disabled = true;
    // document.getElementById('password').disabled = true;
    // document.getElementById('create-btn').disabled = true;

  } else {
    // --- 使用者未登入 ---
    console.log("No user logged in.");

    // 1. 顯示 Google 登入按鈕
    if (googleLoginBtn) {
        googleLoginBtn.style.display = 'block'; // 或 'inline-block' 根據你的佈局需求
    }

    // 2. 清空並隱藏使用者資訊 (頭像) 區域
    if (userInfoDiv) {
      userInfoDiv.innerHTML = ''; // 清空內容
      // 移除可能存在的舊監聽器 (雖然在此情境下清空 innerHTML 通常已足夠)
      const oldAvatar = userInfoDiv.querySelector('.user-avatar');
      if (oldAvatar) {
          oldAvatar.removeEventListener('click', googleLogout);
      }
      userInfoDiv.style.display = 'none'; // 隱藏容器
    }

    // (可選) 確保本地登入的輸入框和按鈕是可用的
    // document.getElementById('name').disabled = false;
    // document.getElementById('password').disabled = false;
    // document.getElementById('create-btn').disabled = false;
  }
}

// --- 事件監聽與狀態處理 ---

// 1. 為 Google 登入按鈕添加點擊事件監聽器
if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', googleLogin);
} else {
  // 如果找不到按鈕，在控制台輸出錯誤，方便除錯
  console.error("Google login button element (#google-login-btn) not found!");
}

// 2. 處理從 Google 登入頁面跳轉回來的情況 (頁面載入時執行一次)
getRedirectResult(auth)
  .then((result) => {
    // 這個 .then 會在頁面載入時執行
    if (result) {
      // 如果 result 存在，表示使用者是剛剛從 Google 登入頁面跳轉回來的
      // result.user 包含登入的使用者資訊
      console.log("Redirect result obtained:", result.user);
      // **重要提示：** 即使在這裡拿到了 result，Firebase Auth 的狀態也已經改變，
      // 下面的 onAuthStateChanged 監聽器同樣會被觸發。
      // 因此，UI 的更新主要依賴 onAuthStateChanged 即可，這裡不需要重複調用 updateUI。
      // 這個區塊主要用於獲取額外的登入資訊 (如果需要的話)，例如 OAuth access token (result.credential.accessToken)。
    } else {
      // 如果 result 為 null，表示使用者不是從 Google 跳轉回來的
      // (可能是直接打開頁面、刷新頁面，或是上次登入的 session 仍然有效)
      console.log("No redirect result found. Checking existing session via onAuthStateChanged.");
    }
  })
  .catch((error) => {
    // 處理在獲取跳轉結果過程中發生的錯誤
    console.error("Error getting redirect result:", error);
    // 例如：網路問題、Firebase 設定問題等
    alert(`處理登入資訊時發生錯誤: ${error.message}`);
    // 即使這裡出錯，onAuthStateChanged 仍然會嘗試根據本地緩存的狀態來更新 UI
  });
  // .finally(() => { ... }) // finally 不是必須的，因為 onAuthStateChanged 會確保監聽

// 3. 監聽 Firebase Authentication 狀態的變化 (最核心的部分)
// 這個回調函數會在以下幾種情況下自動執行：
//    a. 頁面載入時，檢查目前是否有使用者登入 (檢查本地儲存的 session/token)。
//    b. 當 getRedirectResult 成功處理完跳轉結果後。
//    c. 當使用者透過任何方式登入成功時 (signInWithRedirect, signInWithPopup, signInWithEmailAndPassword 等)。
//    d. 當使用者登出時 (signOut)。
onAuthStateChanged(auth, (user) => {
  // `user` 參數：如果使用者已登入，則為 Firebase User 物件；如果未登入，則為 null。
  console.log("Auth state changed. User:", user);
  // 調用 updateUI 函數，根據目前的登入狀態來更新頁面顯示
  updateUI(user);
});


// ----------------------
// 以下是你原有的本地驗證、語言切換等功能 (保持不變)
// 確保這些函數仍然暴露在全局作用域，以便 HTML 中的 onclick 可以調用它們
// ----------------------

let username = '';
let password = '';
let isChinese = false;

// 假設 langData 已定義
const langData = {
    en: { /* ... */ nameLabel: "Enter Your Name", passwordLabel: "Enter Password", createBtn: "Create Your First Schedule", bothError: "Please confirm both name and password.", nameError: "Please confirm your name.", passwordError: "Please confirm your password.", langSwitch: "切換語言", howItWorks: "How It Works", googleLogin: "Login with Google" },
    zh: { /* ... */ nameLabel: "輸入你的名字", passwordLabel: "輸入密碼", createBtn: "創建你的第一個行程", bothError: "請確認姓名和密碼。", nameError: "請確認你的名字。", passwordError: "請確認你的密碼。", langSwitch: "Switch Language", howItWorks: "如何運作", googleLogin: "使用 Google 登入" }
};

// 將函數掛載到 window 物件上，使其成為全局函數
window.switchLanguage = function() {
    isChinese = !isChinese;
    const lang = isChinese ? langData.zh : langData.en;
    document.getElementById('name-label').textContent = lang.nameLabel;
    document.getElementById('password-label').textContent = lang.passwordLabel;
    document.getElementById('create-btn').textContent = lang.createBtn;
    document.getElementById('lang-text').textContent = lang.langSwitch;
    document.getElementById('how-it-works').textContent = lang.howItWorks;
    // 更新 Google 登入按鈕文字 (如果按鈕還可見)
    if (googleLoginBtn && googleLoginBtn.style.display !== 'none') {
        googleLoginBtn.textContent = lang.googleLogin;
    }
    // 更新輸入框的 placeholder (如果需要)
    document.getElementById('name').placeholder = isChinese ? "你的名字" : "Your Name";
    document.getElementById('password').placeholder = isChinese ? "你的密碼" : "Your Password";

    // 清除之前的驗證訊息
    document.getElementById('name-feedback').textContent = '';
    document.getElementById('password-feedback').textContent = '';
    document.getElementById('name').classList.remove('is-invalid');
    document.getElementById('password').classList.remove('is-invalid');
};

window.confirmName = function() {
    const nameInput = document.getElementById('name');
    const nameFeedback = document.getElementById('name-feedback');
    username = nameInput.value.trim();
    if (username) {
        nameInput.classList.remove('is-invalid');
        nameFeedback.textContent = '';
        return true; // 表示驗證通過
    } else {
        nameInput.classList.add('is-invalid');
        nameFeedback.textContent = isChinese ? langData.zh.nameError : langData.en.nameError;
        return false; // 表示驗證失敗
    }
};

window.confirmPassword = function() {
    const passwordInput = document.getElementById('password');
    const passwordFeedback = document.getElementById('password-feedback');
    password = passwordInput.value; // 密碼通常不需要 trim()
    if (password) { // 可以加入更複雜的密碼規則驗證
        passwordInput.classList.remove('is-invalid');
        passwordFeedback.textContent = '';
        return true; // 表示驗證通過
    } else {
        passwordInput.classList.add('is-invalid');
        passwordFeedback.textContent = isChinese ? langData.zh.passwordError : langData.en.passwordError;
        return false; // 表示驗證失敗
    }
};

window.createSchedule = function() {
    const currentUser = auth.currentUser; // 檢查是否有 Google 登入的使用者

    if (currentUser) {
        // 如果使用者已透過 Google 登入，直接跳轉
        console.log("Google user logged in, proceeding to choose.html. User:", currentUser.uid);
        // 可以考慮將 Google 使用者的資訊 (如 UID) 傳遞給下一頁
        // 例如：window.location.href = `choose.html?uid=${currentUser.uid}`;
        window.location.href = 'choose.html';
    } else {
        // 如果沒有 Google 登入，執行本地的姓名和密碼驗證
        const isNameValid = window.confirmName(); // 調用驗證函數並獲取結果
        const isPasswordValid = window.confirmPassword(); // 調用驗證函數並獲取結果

        if (isNameValid && isPasswordValid) {
            // 只有當姓名和密碼都通過驗證時才跳轉
            console.log("Local user validated, proceeding to choose.html");
            // 將本地使用者資訊存儲到 localStorage (注意安全性考量，密碼不應明文儲存)
            // 更好的做法是後端驗證，這裡僅作示例
            localStorage.setItem('timepick_user', JSON.stringify({ username: username /*, password: password // 不建議儲存密碼 */ }));
            window.location.href = 'choose.html';
        } else {
            // 如果有任何一個驗證失敗，提示使用者
            // alert(isChinese ? langData.zh.bothError : langData.en.bothError); // 這個提示可能不夠精確，因為 feedback 區域已經顯示具體錯誤
            console.log("Local validation failed.");
        }
    }
};

window.howItWorks = function() {
    // 實現 "How It Works" 按鈕的功能，例如顯示一個彈出視窗或跳轉到說明頁面
    alert("How It Works: [Explain the process here]");
};

// 初始化語言 (可以根據瀏覽器語言或 localStorage 決定預設語言)
window.switchLanguage(); // 初始設置為英文
// 如果你想預設是中文，可以調用兩次或修改 isChinese 初始值
// isChinese = true; window.switchLanguage();
