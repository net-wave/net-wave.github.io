import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
  authDomain: "wave-1b878.firebaseapp.com",
  databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wave-1b878",
  storageBucket: "wave-1b878.firebasestorage.app",
  messagingSenderId: "737324012239",
  appId: "1:737324012239:web:ceb581d9f134b98690ddba",
  measurementId: "G-JSZ3VJKKDJ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const chatContainer = document.getElementById('chat-container');
const userInfo = document.getElementById('user-info');

// --- GESTION DE L'UTILISATEUR ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Utilisateur connecté
        loginBtn.style.display = 'none';
        userInfo.style.display = 'block';
        chatContainer.style.display = 'block';
        document.getElementById('user-name').innerText = user.displayName;
        document.getElementById('user-pic').src = user.photoURL;
    } else {
        // Utilisateur déconnecté
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
        chatContainer.style.display = 'none';
    }
});

loginBtn.onclick = () => signInWithPopup(auth, provider);
logoutBtn.onclick = () => signOut(auth);

// --- ENVOI DE MESSAGE ---
const form = document.getElementById('message-form');
form.onsubmit = (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    push(ref(db, 'messages'), {
        user: user.displayName,
        photo: user.photoURL,
        text: document.getElementById('message-input').value,
        timestamp: Date.now()
    });
    form.reset();
};

// --- AFFICHAGE DES MESSAGES ---
onValue(ref(db, 'messages'), (snapshot) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    snapshot.forEach((child) => {
        const msg = child.val();
        const p = document.createElement('div');
        p.style.marginBottom = "10px";
        p.innerHTML = `
            <img src="${msg.photo}" style="width:20px; border-radius:50%"> 
            <strong>${msg.user}:</strong> ${msg.text}
        `;
        messagesDiv.appendChild(p);
    });
});
