// 使用 Firebase v9 Modular 版

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

// Google 登入按鈕
document.getElementById('google-login-btn').addEventListener('click', googleLogin);

// Google 登入功能
function googleLogin() {
    signInWithPopup(auth, provider) // <--- 就是這一行
      .then((result) => {
        console.log("User signed in:", result.user);
        showUserInfo(result.user);
      })
      .catch((error) => {
        console.error("Error during Google login:", error);
      });
}  

// 監聽登入狀態
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user);
    showUserInfo(user);
  } else {
    console.log("No user logged in.");
  }
});

// 顯示使用者資訊
function showUserInfo(user) {
  document.getElementById('user-info').innerHTML = `
    <p>Welcome, ${user.displayName}!</p>
    <p>Email: ${user.email}</p>
  `;
}

// ----------------------
// 以下是你的本地驗證、語言切換功能
// ----------------------

let username = '';
let password = '';
let isChinese = false;

const langData = {
  en: {
    langText: "Switch Language",
    nameLabel: "Enter Your Name",
    passwordLabel: "Enter Password",
    createBtn: "Create Your First Schedule",
    howItWorks: "How It Works",
    nameError: "Please enter your name.",
    passwordError: "Please enter a password.",
    bothError: "Please enter both name and password!",
    greeting: "Hello, ",
    howItWorksText: "How It Works: Enter your name and password, then create a schedule!"
  },
  zh: {
    langText: "切換語言",
    nameLabel: "輸入您的姓名",
    passwordLabel: "輸入密碼",
    createBtn: "創建您的第一個日程",
    howItWorks: "如何使用",
    nameError: "請輸入您的姓名。",
    passwordError: "請輸入密碼。",
    bothError: "請同時輸入姓名和密碼！",
    greeting: "你好，",
    howItWorksText: "如何使用：輸入您的姓名和密碼，然後創建日程！"
  }
};

window.switchLanguage = function() {
  isChinese = !isChinese;
  const lang = isChinese ? langData.zh : langData.en;
  document.getElementById('lang-text').textContent = lang.langText;
  document.getElementById('name-label').textContent = lang.nameLabel;
  document.getElementById('password-label').textContent = lang.passwordLabel;
  document.getElementById('create-btn').textContent = lang.createBtn;
  document.querySelector('.how-it-works').textContent = lang.howItWorks;
};

window.confirmName = function() {
  username = document.getElementById('name').value.trim();
  const feedback = document.getElementById('name-feedback');
  if (username) {
    document.getElementById('name').classList.remove('is-invalid');
    feedback.textContent = '';
    alert((isChinese ? langData.zh.greeting : langData.en.greeting) + username + '!');
  } else {
    document.getElementById('name').classList.add('is-invalid');
    feedback.textContent = isChinese ? langData.zh.nameError : langData.en.nameError;
  }
};

window.confirmPassword = function() {
  password = document.getElementById('password').value.trim();
  const feedback = document.getElementById('password-feedback');
  if (password) {
    document.getElementById('password').classList.remove('is-invalid');
    feedback.textContent = '';
  } else {
    document.getElementById('password').classList.add('is-invalid');
    feedback.textContent = isChinese ? langData.zh.passwordError : langData.en.passwordError;
  }
};

window.createSchedule = function() {
  confirmName();
  confirmPassword();
  if (username && password) {
    localStorage.setItem('timepick_user', JSON.stringify({ username, password }));
    window.location.href = 'choose.html';
  } else {
    alert(isChinese ? langData.zh.bothError : langData.en.bothError);
  }
};

window.howItWorks = function() {
  alert(isChinese ? langData.zh.howItWorksText : langData.en.howItWorksText);
};
