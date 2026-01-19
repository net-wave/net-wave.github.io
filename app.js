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
onValue(postsRef, (snapshot) => {
    postsContainer.innerHTML = ""; // On vide pour reconstruire proprement
    const data = snapshot.val();
    
    if (data) {
        // Transformer l'objet en tableau et trier par date (plus récent en haut)
        const entries = Object.entries(data).reverse();
        
        entries.forEach(([key, post]) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-card');
            postElement.innerHTML = `
                <strong>${post.username}</strong>
                <p>${post.content}</p>
                <small>${post.timestamp ? new Date(post.timestamp).toLocaleString() : ''}</small>
            `;
            postsContainer.appendChild(postElement);
        });
    } else {
        postsContainer.innerHTML = "<p>Aucun message pour le moment. Soyez le premier !</p>";
    }
});

// --- 3. GÉRER L'AFFICHAGE SELON LA CONNEXION ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        authSection.innerHTML = `Connecté en tant que : <b>${user.displayName}</b> <button id="logout-btn">Déconnexion</button>`;
        document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
    } else {
        authSection.innerHTML = `<a href="login.html">Se connecter / S'inscrire</a>`;
    }
});
