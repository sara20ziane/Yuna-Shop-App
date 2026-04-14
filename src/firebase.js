import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Ajoute cette ligne

const firebaseConfig = {
  /* Tes clés Firebase */
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // C'est ta "serrure"
