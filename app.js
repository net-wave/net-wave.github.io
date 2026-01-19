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
    const pass = document.getElementById('password').value;
    const name = document.getElementById('username').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: name });
        location.reload();
    } catch (e) { alert(e.message); }
};

// Connexion
document.getElementById('btnLogin').onclick = () => {
    signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value)
    .catch(e => alert("Erreur : " + e.message));
};

// Publier
document.getElementById('btnPost').onclick = () => {
    const content = document.getElementById('postContent').value;
    if (content.trim()) {
        push(ref(db, 'posts'), {
            text: content,
            author: auth.currentUser.displayName,
            date: serverTimestamp()
        });
        document.getElementById('postContent').value = "";
    }
};

// Observer l'état
onAuthStateChanged(auth, (user) => {
    const authSec = document.getElementById('authSection');
    const mainSec = document.getElementById('mainSection');
    const userStatus = document.getElementById('userStatus');

    if (user) {
        authSec.classList.add('d-none');
        mainSec.classList.remove('d-none');
        userStatus.innerHTML = `<span class="text-white me-3">Salut, <b>${user.displayName}</b></span> 
                                <button id="out" class="btn btn-sm btn-outline-light">Sortir</button>`;
        document.getElementById('out').onclick = () => signOut(auth);
    } else {
        authSec.classList.remove('d-none');
        mainSec.classList.add('d-none');
        userStatus.innerHTML = "";
    }
});

// Charger les posts
onValue(ref(db, 'posts'), (snap) => {
    const container = document.getElementById('postsContainer');
    container.innerHTML = "";
    const data = snap.val();
    if (data) {
        Object.values(data).reverse().forEach(post => {
            container.innerHTML += `
                <div class="post-item shadow-sm">
                    <span class="post-user">@${post.author}</span>
                    <span class="post-date">${post.date ? new Date(post.date).toLocaleDateString() : 'À l\'instant'}</span>
                    <div class="post-text">${post.text}</div>
                </div>`;
        });
    }
});

