import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Ta configuration Firebase
const firebaseConfig = { 
  apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
  authDomain: "wave-1b878.firebaseapp.com",
  databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wave-1b878",
  storageBucket: "wave-1b878.firebasestorage.app",
  messagingSenderId: "737324012239",
  appId: "1:737324012239:web:ceb581d9f134b98690ddba"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Éléments du DOM
const usernameInput = document.getElementById('username');
const passInput = document.getElementById('password');
const chatApp = document.getElementById('chat-app');
const loginForm = document.getElementById('login-form');
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const displayUsername = document.getElementById('display-username');

// Fonction pour transformer l'identifiant en format email accepté par Firebase
const formatEmail = (id) => `${id.trim().toLowerCase()}@wave.chat`;

// --- AUTHENTIFICATION ---

// Inscription
document.getElementById('btn-signup').onclick = () => {
    const id = usernameInput.value;
    const pass = passInput.value;

    if (id.length < 3) return alert("Identifiant trop court (min 3 car.)");
    if (pass.length < 6) return alert("Le mot de passe doit faire au moins 6 caractères");

    createUserWithEmailAndPassword(auth, formatEmail(id), pass)
        .then((userCredential) => {
            // On enregistre le vrai pseudo dans le profil pour l'affichage
            updateProfile(userCredential.user, { displayName: id });
        })
        .catch(error => alert("Erreur d'inscription : " + error.message));
};

// Connexion
document.getElementById('btn-login').onclick = () => {
    const id = usernameInput.value;
    const pass = passInput.value;

    signInWithEmailAndPassword(auth, formatEmail(id), pass)
        .catch(error => alert("Identifiant ou mot de passe incorrect."));
};

// Déconnexion
document.getElementById('btn-logout').onclick = () => signOut(auth);

// Surveiller la connexion
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginForm.style.display = 'none';
        chatApp.style.display = 'block';
        document.getElementById('user-info').style.display = 'block';
        // On utilise displayName ou la partie avant le @
        displayUsername.innerText = user.displayName || user.email.split('@')[0];
        loadMessages();
    } else {
        loginForm.style.display = 'block';
        chatApp.style.display = 'none';
        document.getElementById('user-info').style.display = 'none';
    }
});

// --- GESTION DU CHAT ---

function loadMessages() {
    const messagesRef = ref(db, 'messages');
    // On ne récupère que les 50 derniers messages pour la performance
    const lastMessagesQuery = query(messagesRef, limitToLast(50));

    onValue(lastMessagesQuery, (snapshot) => {
        messagesDiv.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(msg => {
                const p = document.createElement('p');
                p.className = "message-text";
                p.innerHTML = `<strong>${msg.user}</strong> : ${msg.text}`;
                messagesDiv.appendChild(p);
            });
            // Toujours scroller vers le bas
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    });
}

// Envoi d'un message
messageForm.onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const user = auth.currentUser;

    if (user && input.value.trim() !== "") {
        push(ref(db, 'messages'), {
            user: user.displayName || user.email.split('@')[0],
            text: input.value,
            timestamp: Date.now()
        });
        input.value = '';
    }
};
