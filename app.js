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

// Navigation Interne
const showView = (id) => {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
};

// --- AUTH ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        showView('view-chat');
        document.getElementById('nav-name').innerText = user.displayName || "Utilisateur";
        if (user.photoURL) document.getElementById('nav-avatar').src = user.photoURL;
        loadMessages();
    } else {
        showView('view-login');
    }
});

document.getElementById('btn-signup').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const pseudo = document.getElementById('pseudo').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: pseudo });
        location.reload();
    } catch (e) { alert(e.message); }
};

document.getElementById('btn-login').onclick = () => {
    signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value).catch(e => alert(e.message));
};

// --- CHAT ---
document.getElementById('message-input').onkeypress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== "") {
        push(ref(db, 'messages'), {
            uid: auth.currentUser.uid,
            user: auth.currentUser.displayName,
            photo: auth.currentUser.photoURL || "",
            text: e.target.value
        });
        e.target.value = "";
    }
};

function loadMessages() {
    onValue(query(ref(db, 'messages'), limitToLast(50)), (snap) => {
        const box = document.getElementById('messages');
        box.innerHTML = "";
        snap.forEach(c => {
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

// Navigation Interne
const showView = (id) => {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
};

// --- AUTH ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        showView('view-chat');
        document.getElementById('nav-name').innerText = user.displayName || "Utilisateur";
        if (user.photoURL) document.getElementById('nav-avatar').src = user.photoURL;
        loadMessages();
    } else {
        showView('view-login');
    }
});

document.getElementById('btn-signup').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const pseudo = document.getElementById('pseudo').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: pseudo });
        location.reload();
    } catch (e) { alert(e.message); }
};

document.getElementById('btn-login').onclick = () => {
    signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value).catch(e => alert(e.message));
};

// --- CHAT ---
document.getElementById('message-input').onkeypress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== "") {
        push(ref(db, 'messages'), {
            uid: auth.currentUser.uid,
            user: auth.currentUser.displayName,
            photo: auth.currentUser.photoURL || "",
            text: e.target.value
        });
        e.target.value = "";
    }
};

function loadMessages() {
    onValue(query(ref(db, 'messages'), limitToLast(50)), (snap) => {
        const box = document.getElementById('messages');
        box.innerHTML = "";
        snap.forEach(c => {
            const m = c.val();
            const isMe = m.uid === auth.currentUser.uid;
            const div = document.createElement('div');
            div.className = `m-item ${isMe ? 'sent' : 'received'}`;
            div.innerHTML = `<span class="u">${m.user}</span>${m.text}`;
            box.appendChild(div);
        });
        box.scrollTop = box.scrollHeight;
    });
}

// --- NAVIGATION & PROFIL ---
document.getElementById('go-to-profile').onclick = () => {
    showView('view-profile');
    document.getElementById('new-pseudo').value = auth.currentUser.displayName;
    if(auth.currentUser.photoURL) document.getElementById('profile-preview').src = auth.currentUser.photoURL;
};
document.getElementById('back-to-chat').onclick = () => showView('view-chat');
document.getElementById('btn-logout-head').onclick = () => signOut(auth);

document.getElementById('btn-save').onclick = async () => {
    const file = document.getElementById('file-input').files[0];
    let url = auth.currentUser.photoURL;
    if(file) {
        const s = sRef(storage, `pics/${auth.currentUser.uid}`);
        await uploadBytes(s, file);
        url = await getDownloadURL(s);
    }
    await updateProfile(auth.currentUser, { displayName: document.getElementById('new-pseudo').value, photoURL: url });
    alert("Profil mis à jour !");
    location.reload();
};

