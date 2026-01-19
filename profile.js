import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyArmsKWg0D_375M5TZFsNw4ckamVsWZcoo",
    authDomain: "wave-1b878.firebaseapp.com",
    databaseURL: "https://wave-1b878-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "wave-1b878",
    storageBucket: "wave-1b878.firebasestorage.app", // Très important pour les photos
    messagingSenderId: "737324012239",
    appId: "1:737324012239:web:ceb581d9f134b98690ddba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

let selectedFile;

// 1. Charger les infos de l'utilisateur
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('profile-email').value = user.email;
        document.getElementById('profile-pseudo').value = user.displayName || "";
        if (user.photoURL) {
            document.getElementById('profile-img-preview').src = user.photoURL;
        }
    } else {
        window.location.href = "index.html"; // Rediriger si non connecté
    }
});

// 2. Prévisualiser l'image sélectionnée
document.getElementById('file-input').onchange = (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('profile-img-preview').src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    }
};

// 3. Enregistrer les modifications
document.getElementById('btn-save-profile').onclick = async () => {
    const user = auth.currentUser;
    const newPseudo = document.getElementById('profile-pseudo').value;
    const status = document.getElementById('status-msg');
    status.innerText = "Mise à jour en cours...";

    try {
        let photoUrl = user.photoURL;

        // Si une nouvelle image est choisie, on l'upload sur Firebase Storage
        if (selectedFile) {
            const storageRef = sRef(storage, 'profile_pics/' + user.uid);
            await uploadBytes(storageRef, selectedFile);
            photoUrl = await getDownloadURL(storageRef);
        }

        // Mise à jour du profil Firebase
        await updateProfile(user, {
            displayName: newPseudo,
            photoURL: photoUrl
        });

        status.style.color = "green";
        status.innerText = "Profil mis à jour !";
    } catch (error) {
        status.style.color = "red";
        status.innerText = "Erreur : " + error.message;
          
    }
};
