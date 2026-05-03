import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO: cole aqui as configurações do seu projeto no Firebase Console
// Acesse: https://console.firebase.google.com → seu projeto → Configurações do projeto → Seus aplicativos
const firebaseConfig = {
  apiKey: "AIzaSyAjSCcBjSJ9R2r3YzM0Ot34FgrZFetWHVk",
  authDomain: "tcc-quilometragem.firebaseapp.com",
  projectId: "tcc-quilometragem",
  storageBucket: "tcc-quilometragem.firebasestorage.app",
  messagingSenderId: "622251860275",
  appId: "1:622251860275:web:e24fd37e493ecf7a9a5e46"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
