import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = { 
  apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
  authDomain: "wave-1b878.firebaseapp.com",
  databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wave-1b878",
  storageBucket: "wave-1b878.firebasestorage.app",
  messagingSenderId: "737324012239",
  appId: "1:737324012239:web:ceb581d9f134b98690ddba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Éléments
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const chatApp = document.getElementById('chat-app');
const loginForm = document.getElementById('login-form');

// --- AUTHENTIFICATION ---

// Inscription
document.getElementById('btn-signup').onclick = () => {
    createUserWithEmailAndPassword(auth, emailInput.value, passInput.value)
        .catch(error => alert("Erreur inscription : " + error.message));
};

// Connexion
document.getElementById('btn-login').onclick = () => {
    signInWithEmailAndPassword(auth, emailInput.value, passInput.value)
        .catch(error => alert("Erreur connexion : " + error.message));
};

// Déconnexion
document.getElementById('btn-logout').onclick = () => signOut(auth);

// Surveiller l'état (Connecté ou non)
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginForm.style.display = 'none';
        chatApp.style.display = 'block';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('display-email').innerText = user.email;
        loadMessages();
    } else {
        loginForm.style.display = 'block';
        chatApp.style.display = 'none';
        document.getElementById('user-info').style.display = 'none';
    }
});

// --- CHAT ---

function loadMessages() {
    onValue(ref(db, 'messages'), (snapshot) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        snapshot.forEach(child => {
            const msg = child.val();
            messagesDiv.innerHTML += `<p><strong>${msg.user}</strong>: ${msg.text}</p>`;
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

document.getElementById('message-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    push(ref(db, 'messages'), {
        user: auth.currentUser.email,
        text: input.value
    });
    input.value = '';
};
