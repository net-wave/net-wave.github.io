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

// ... (garder le début identique : imports et config) ...

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-form').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('chat-app').style.display = 'flex';
        document.getElementById('current-pseudo').innerText = user.displayName || "Utilisateur";
        
        // Mise à jour de la petite photo dans la barre de navigation
        if(user.photoURL) document.getElementById('nav-profile-pic').src = user.photoURL;
        
        loadMessages();
    } else {
        document.getElementById('auth-form').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('chat-app').style.display = 'none';
    }
});

function loadMessages() {
    const messagesRef = ref(db, 'messages');
    const q = query(messagesRef, limitToLast(50));

    onValue(q, (snapshot) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        
        snapshot.forEach(child => {
            const msg = child.val();
            const div = document.createElement('div');
            // Si c'est notre message, on ajoute une classe "mine" pour le mettre à droite
            const isMine = msg.uid === auth.currentUser?.uid;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage(app);

// --- REDIRECTION AUTOMATIQUE ---
onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    if (!user && !path.includes("login.html")) {
        window.location.href = "login.html";
    } else if (user && path.includes("login.html")) {
        window.location.href = "index.html";
    }
    
    // Update nav avatar
    const navAv = document.getElementById('nav-avatar');
    if(user && navAv && user.photoURL) navAv.src = user.photoURL;
});

// --- PAGE LOGIN ---
const btnSignup = document.getElementById('btn-signup');
if(btnSignup) {
    btnSignup.onclick = async () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const pseudo = document.getElementById('pseudo').value;
        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(res.user, { displayName: pseudo });
            window.location.href = "index.html";
        } catch (e) { alert(e.message); }
    };
    document.getElementById('btn-login').onclick = () => {
        signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value)
        .catch(e => alert("Erreur de connexion"));
    };
}

// --- PAGE CHAT (index.html) ---
const msgInput = document.getElementById('message-input');
if(msgInput) {
    // Envoi sur touche ENTREE
    msgInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && msgInput.value.trim() !== "") {
            const user = auth.currentUser;
            push(ref(db, 'messages'), {
                uid: user.uid,
                user: user.displayName || "Anonyme",
                photo: user.photoURL || "",
                text: msgInput.value
            });
            msgInput.value = "";
        }
    });

    onValue(query(ref(db, 'messages'), limitToLast(50)), (snap) => {
        const div = document.getElementById('messages');
        div.innerHTML = "";
        snap.forEach(child => {
            const m = child.val();
            const isMine = m.uid === auth.currentUser?.uid;
            div.innerHTML += `
                <div class="msg ${isMine ? 'sent' : 'received'}">
                    <span class="author">${m.user}</span>
                    ${m.text}
                </div>`;
        });
        div.scrollTop = div.scrollHeight;
    });
}

// --- PAGE PROFIL ---
const btnSave = document.getElementById('btn-save');
if(btnSave) {
    const fileIn = document.getElementById('file-input');
    const preview = document.getElementById('profile-preview');
    
    // Preview image
    fileIn.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = (ev) => preview.src = ev.target.result;
        reader.readAsDataURL(e.target.files[0]);
    };

    btnSave.onclick = async () => {
        const user = auth.currentUser;
        let url = user.photoURL;
        if(fileIn.files[0]) {
            const s = sRef(storage, `pics/${user.uid}`);
            await uploadBytes(s, fileIn.files[0]);
            url = await getDownloadURL(s);
        }
        await updateProfile(user, { 
            displayName: document.getElementById('new-pseudo').value || user.displayName,
            photoURL: url
        });
        alert("Profil mis à jour !");
    };
    document.getElementById('btn-logout').onclick = () => signOut(auth).then(() => window.location.href = "login.html");
}

