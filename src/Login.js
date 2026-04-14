import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function Login() {
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert("Erreur de connexion")
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#F9F6F2",
        padding: "50px",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#5D5D5D" }}>Connexion CRM - Yuna's Shop</h2>
      <form onSubmit={handleLogin}>
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          required
        />
        <button type="submit">Entrer</button>
      </form>
    </div>
  );
}
