import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Ta configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
  authDomain: "wave-1b878.firebaseapp.com",
  databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wave-1b878",
  storageBucket: "wave-1b878.firebasestorage.app",
  messagingSenderId: "737324012239",
  appId: "1:737324012239:web:3f15dacc58598f2390ddba",
  measurementId: "G-W85TM9G8KS"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Éléments DOM
const postInput = document.getElementById('post-input');
const postBtn = document.getElementById('post-btn');
const postsContainer = document.getElementById('posts-container');
const authSection = document.getElementById('auth-status');

// --- 1. PUBLIER UN MESSAGE ---
postBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    const text = postInput.value.trim();

    if (!user) {
        alert("Tu dois être connecté pour publier !");
        return;
    }

    if (text !== "") {
        const postsRef = ref(db, 'posts');
        push(postsRef, {
            username: user.displayName || "Anonyme",
            content: text,
            timestamp: serverTimestamp(),
            uid: user.uid
        });
        postInput.value = ""; // Vide le champ après envoi
    }
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
  authDomain: "wave-1b878.firebaseapp.com",
  databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wave-1b878",
  storageBucket: "wave-1b878.firebasestorage.app",
  messagingSenderId: "737324012239",
  appId: "1:737324012239:web:3f15dacc58598f2390ddba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Switch Login/Signup
const switchAuth = document.getElementById('switchAuth');
let isLogin = true;

switchAuth.onclick = (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    document.getElementById('username').classList.toggle('d-none', isLogin);
    document.getElementById('btnLogin').classList.toggle('d-none', !isLogin);
    document.getElementById('btnSignup').classList.toggle('d-none', isLogin);
    document.getElementById('authTitle').innerText = isLogin ? "Bienvenue sur Net-Wave" : "Créer un compte";
};

// Inscription & Connexion (simples)
document.getElementById('btnSignup').onclick = async () => {
    const user = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await updateProfile(user.user, { displayName: username.value });
    location.reload();
};
document.getElementById('btnLogin').onclick = () => signInWithEmailAndPassword(auth, email.value, password.value);
document.getElementById('btnLogout').onclick = () => signOut(auth);

// Envoi de message
document.getElementById('btnPost').onclick = sendMessage;
document.getElementById('postContent').onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };

function sendMessage() {
    const text = document.getElementById('postContent').value;
    if(text.trim()) {
        push(ref(db, 'messages'), {
            text: text,
            author: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
            time: serverTimestamp()
        });
        document.getElementById('postContent').value = "";
    }
}

// Interface Temps Réel
onAuthStateChanged(auth, (user) => {
    document.getElementById('authSection').classList.toggle('d-none', user);
    document.getElementById('mainSection').classList.toggle('d-none', !user);
    if(user) {
        document.getElementById('currentUserName').innerText = user.displayName;
        document.getElementById('userAvatar').innerText = user.displayName.charAt(0).toUpperCase();
    }
});

// Affichage des bulles
onValue(ref(db, 'messages'), (snap) => {
    const container = document.getElementById('postsContainer');
    container.innerHTML = "";
    const data = snap.val();
    if(data) {
        Object.values(data).forEach(msg => {
            const isMe = msg.uid === auth.currentUser?.uid;
            container.innerHTML += `
                <div class="msg-wrapper ${isMe ? 'msg-me' : 'msg-other'}">
                    <span class="msg-author">${isMe ? 'Moi' : msg.author}</span>
                    <div class="bubble">${msg.text}</div>
                </div>`;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
  authDomain: "wave-1b878.firebaseapp.com",
  databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wave-1b878",
  storageBucket: "wave-1b878.firebasestorage.app",
  messagingSenderId: "737324012239",
  appId: "1:737324012239:web:3f15dacc58598f2390ddba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Switch Login/Signup
const switchAuth = document.getElementById('switchAuth');
let isLogin = true;

switchAuth.onclick = (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    document.getElementById('username').classList.toggle('d-none', isLogin);
    document.getElementById('btnLogin').classList.toggle('d-none', !isLogin);
    document.getElementById('btnSignup').classList.toggle('d-none', isLogin);
    document.getElementById('authTitle').innerText = isLogin ? "Bienvenue sur Net-Wave" : "Créer un compte";
};

// Inscription & Connexion (simples)
document.getElementById('btnSignup').onclick = async () => {
    const user = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await updateProfile(user.user, { displayName: username.value });
    location.reload();
};
document.getElementById('btnLogin').onclick = () => signInWithEmailAndPassword(auth, email.value, password.value);
document.getElementById('btnLogout').onclick = () => signOut(auth);

// Envoi de message
document.getElementById('btnPost').onclick = sendMessage;
document.getElementById('postContent').onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };

function sendMessage() {
    const text = document.getElementById('postContent').value;
    if(text.trim()) {
        push(ref(db, 'messages'), {
            text: text,
            author: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
            time: serverTimestamp()
        });
        document.getElementById('postContent').value = "";
    }
}

// Interface Temps Réel
onAuthStateChanged(auth, (user) => {
    document.getElementById('authSection').classList.toggle('d-none', user);
    document.getElementById('mainSection').classList.toggle('d-none', !user);
    if(user) {
        document.getElementById('currentUserName').innerText = user.displayName;
        document.getElementById('userAvatar').innerText = user.displayName.charAt(0).toUpperCase();
    }
});

// Affichage des bulles
onValue(ref(db, 'messages'), (snap) => {
    const container = document.getElementById('postsContainer');
    container.innerHTML = "";
    const data = snap.val();
    if(data) {
        Object.values(data).forEach(msg => {
            const isMe = msg.uid === auth.currentUser?.uid;
            container.innerHTML += `
                <div class="msg-wrapper ${isMe ? 'msg-me' : 'msg-other'}">
                    <span class="msg-author">${isMe ? 'Moi' : msg.author}</span>
                    <div class="bubble">${msg.text}</div>
                </div>`;
        });
        // Scroll en bas automatique
        const win = document.getElementById('chatWindow');
        win.scrollTop = win.scrollHeight;
    }
});

        });
        // Scroll en bas automatique
        const win = document.getElementById('chatWindow');
        win.scrollTop = win.scrollHeight;
    }
});

});

// --- 2. LIRE LES MESSAGES EN TEMPS RÉEL ---
const postsRef = ref(db, 'posts');
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
  authDomain: "wave-1b878.firebaseapp.com",
  databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wave-1b878",
  storageBucket: "wave-1b878.firebasestorage.app",
  messagingSenderId: "737324012239",
  appId: "1:737324012239:web:3f15dacc58598f2390ddba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Basculer Inscription / Connexion
let isLoginMode = true;
const switchBtn = document.getElementById('switchAuth');

switchBtn.onclick = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('authTitle').innerText = isLoginMode ? "Content de vous revoir" : "Rejoindre l'aventure";
    document.getElementById('username').classList.toggle('d-none', isLoginMode);
    document.getElementById('btnLogin').classList.toggle('d-none', !isLoginMode);
    document.getElementById('btnSignup').classList.toggle('d-none', isLoginMode);
    switchBtn.innerText = isLoginMode ? "Rejoindre la vague" : "Déjà membre ?";
};

// Inscription
document.getElementById('btnSignup').onclick = async () => {
    const email = document.getElementById('email').value;
