import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const messagesRef = ref(db, 'messages');

// Envoyer un message
const form = document.getElementById('message-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    push(messagesRef, {
        user: document.getElementById('name-input').value,
        text: document.getElementById('message-input').value
    });
    form.reset();
});

// Écouter en temps réel
onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    for (let id in data) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${data[id].user} :</strong> ${data[id].text}`;
        messagesDiv.appendChild(p);
    }
});
