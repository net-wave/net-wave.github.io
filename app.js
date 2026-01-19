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

document.getElementById('btn-signup').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const pseudo = document.getElementById('pseudo').value;

    if (!pseudo) return alert("Indique un pseudo !");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        // On enregistre le pseudo dans le profil Firebase
        await updateProfile(userCredential.user, { displayName: pseudo });
        // Recharger la page ou forcer la mise à jour pour être sûr que le pseudo est pris en compte
        window.location.reload(); 
    } catch (error) {
        alert("Erreur : " + error.message);
    }
};

document.getElementById('btn-login').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => alert("Erreur de connexion"));
};

document.getElementById('btn-logout').onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    const authForm = document.getElementById('auth-form');
    const userInfo = document.getElementById('user-info');
    const chatApp = document.getElementById('chat-app');
    const currentPseudoSpan = document.getElementById('current-pseudo');

    if (user) {
        if (authForm) authForm.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (chatApp) chatApp.style.display = 'block';
        
        // On affiche UNIQUEMENT le displayName
        currentPseudoSpan.innerText = user.displayName || "Utilisateur...";
        loadMessages();
    } else {
        if (authForm) authForm.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (chatApp) chatApp.style.display = 'none';
    }
});

// --- CHAT ---

function loadMessages() {
    const messagesRef = ref(db, 'messages');
    const q = query(messagesRef, limitToLast(50));

    onValue(q, (snapshot) => {
        const messagesDiv = document.getElementById('messages');
        if (!messagesDiv) return;
        
        messagesDiv.innerHTML = ''; // On vide la zone
        
        snapshot.forEach(child => {
            const msg = child.val();
            
            // Création de la bulle de message
            const div = document.createElement('div');
            div.className = "msg-container";

            // Création de l'élément pour le Pseudo (Sécurisé)
            const nameElement = document.createElement('strong');
            nameElement.textContent = msg.user; // Sécurise contre le XSS

            // Création de l'élément pour le Texte (Sécurisé)
            const textElement = document.createElement('span');
            textElement.textContent = msg.text; // Sécurise contre le XSS

            // Assemblage
            div.appendChild(nameElement);
            div.appendChild(textElement);
            messagesDiv.appendChild(div);
        });
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

document.getElementById('message-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    
    if (auth.currentUser && input.value.trim() !== "") {
        // On envoie le displayName dans la base de données
        push(ref(db, 'messages'), {
            user: auth.currentUser.displayName || "Anonyme",
            text: input.value,
            timestamp: Date.now()
        });
        input.value = '';
    }
};
