import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Éléments du DOM
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const chatContainer = document.getElementById('chat-container');
const userInfo = document.getElementById('user-info');
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');

// --- GESTION DE L'AUTHENTIFICATION ---

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Utilisateur connecté:", user.displayName);
        loginBtn.style.display = 'none';
        userInfo.style.display = 'block';
        chatContainer.style.display = 'flex'; // ou block selon ton CSS
        document.getElementById('user-name').innerText = user.displayName;
        document.getElementById('user-pic').src = user.photoURL;
        loadMessages();
    } else {
        console.log("Utilisateur déconnecté");
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
        chatContainer.style.display = 'none';
        messagesDiv.innerHTML = '';
    }
});

loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider).catch(err => console.error("Erreur Login:", err));
});

logoutBtn.addEventListener('click', () => {
    signOut(auth).catch(err => console.error("Erreur Logout:", err));
});

// --- GESTION DES MESSAGES ---

function loadMessages() {
    const messagesRef = ref(db, 'messages');
    // On limite l'affichage aux 50 derniers messages
    const recentMessagesQuery = query(messagesRef, limitToLast(50));

    onValue(recentMessagesQuery, (snapshot) => {
        messagesDiv.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(msg => {
                const div = document.createElement('div');
                div.classList.add('message-item');
                div.innerHTML = `
                    <img src="${msg.photo}" style="width:25px; border-radius:50%; margin-right:5px;">
                    <strong>${msg.user}:</strong> ${msg.text}
                `;
                messagesDiv.appendChild(div);
            });
            // Scroll automatique vers le bas
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    });
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const user = auth.currentUser;

    if (user && input.value.trim() !== "") {
        push(ref(db, 'messages'), {
            user: user.displayName,
            photo: user.photoURL,
            text: input.value,
            timestamp: Date.now()
        });
        input.value = '';
    }
});
