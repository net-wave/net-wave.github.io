import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// --- AUTHENTIFICATION ---

// Inscription avec Pseudo
document.getElementById('btn-signup').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const pseudo = document.getElementById('pseudo').value;

    if (!pseudo) return alert("Choisis un pseudo !");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        // Mise à jour du pseudo dans le profil Firebase
        await updateProfile(userCredential.user, { displayName: pseudo });
        alert("Compte créé avec succès !");
    } catch (error) {
        alert("Erreur : " + error.message);
    }
};

// Connexion
document.getElementById('btn-login').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => alert("Erreur : " + err.message));
};

// Déconnexion
document.getElementById('btn-logout').onclick = () => signOut(auth);

// Surveiller l'état de connexion
onAuthStateChanged(auth, (user) => {
    const authForm = document.getElementById('auth-form');
    const userInfo = document.getElementById('user-info');
    const chatApp = document.getElementById('chat-app');

    if (user) {
        authForm.style.display = 'none';
        userInfo.style.display = 'block';
        chatApp.style.display = 'block';
        document.getElementById('current-pseudo').innerText = user.displayName || "Anonyme";
        loadMessages();
    } else {
        authForm.style.display = 'block';
        userInfo.style.display = 'none';
        chatApp.style.display = 'none';
    }
});

// --- CHAT ---

function loadMessages() {
    const messagesRef = ref(db, 'messages');
    const q = query(messagesRef, limitToLast(50));

    onValue(q, (snapshot) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        snapshot.forEach(child => {
            const msg = child.val();
            const p = document.createElement('div');
            p.innerHTML = `<strong>${msg.user}</strong> : ${msg.text}`;
            messagesDiv.appendChild(p);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

document.getElementById('message-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    if (auth.currentUser && input.value.trim() !== "") {
        push(ref(db, 'messages'), {
            user: auth.currentUser.displayName,
            text: input.value,
            timestamp: Date.now()
        });
        input.value = '';
    }
};
