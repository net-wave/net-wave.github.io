import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const auth = getAuth(app);
const db = getDatabase(app);

// --- AUTHENTIFICATION ---
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');

btnSignup.onclick = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value).catch(alert);
};

btnLogin.onclick = () => {
    signInWithEmailAndPassword(auth, email.value, password.value).catch(alert);
};

document.getElementById('btnLogout').onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authSection').classList.add('d-none');
        document.getElementById('mainSection').classList.remove('d-none');
        document.getElementById('btnLogout').classList.remove('d-none');
        chargerPosts();
    } else {
        document.getElementById('authSection').classList.remove('d-none');
        document.getElementById('mainSection').classList.add('d-none');
        document.getElementById('btnLogout').classList.add('d-none');
    }
});

// --- GESTION DES POSTS ---
const btnPost = document.getElementById('btnPost');
const postContent = document.getElementById('postContent');

btnPost.onclick = () => {
    if (postContent.value.trim() !== "") {
        const postsRef = ref(db, 'posts');
        push(postsRef, {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            content: postContent.value,
            timestamp: serverTimestamp()
        });
        postContent.value = "";
    }
};

function chargerPosts() {
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
        const container = document.getElementById('postsContainer');
        container.innerHTML = "";
        const data = snapshot.val();
        
        // Convertir en tableau et inverser pour avoir le plus récent en premier
        if (data) {
            Object.values(data).reverse().forEach(post => {
                const card = `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">${post.email}</h6>
                            <p class="card-text">${post.content}</p>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        }

    });
                   }
