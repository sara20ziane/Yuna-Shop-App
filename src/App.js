import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  Package,
  Users,
  LayoutDashboard,
  Plus,
  Phone,
  Clock,
  Trash2,
  X,
  Edit3,
  TrendingUp,
  Globe,
  Euro,
  DollarSign,
  Megaphone,
  MessageCircle,
  User,
  Star,
  Sparkles,
  BrainCircuit,
  Wand2,
  AlertTriangle,
  Settings2,
  RotateCcw,
  MapPin,
  Home,
  Store,
  Building2,
  PieChart,
  Receipt,
  Lightbulb,
  Calculator,
  Truck,
  Search,
  Filter,
  Bell,
  Download,
  Printer,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  Scale,
  Copy
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- DATA ---
const WILAYAS_58 = [
  "01 Adrar","02 Chlef","03 Laghouat","04 Oum El Bouaghi","05 Batna",
  "06 Béjaïa","07 Biskra","08 Béchar","09 Blida","10 Bouira",
  "11 Tamanrasset","12 Tébessa","13 Tlemcen","14 Tiaret","15 Tizi Ouzou",
  "16 Alger","17 Djelfa","18 Jijel","19 Sétif","20 Saïda","21 Skikda",
  "22 Sidi Bel Abbès","23 Annaba","24 Guelma","25 Constantine","26 Médéa",
  "27 Mostaganem","28 M'Sila","29 Mascara","30 Ouargla","31 Oran",
  "32 El Bayadh","33 Illizi","34 Bordj Bou Arreridj","35 Boumerdès",
  "36 El Tarf","37 Tindouf","38 Tissemsilt","39 El Oued","40 Khenchela",
  "41 Souk Ahras","42 Tipaza","43 Mila","44 Aïn Defla","45 Naâma",
  "46 Aïn Témouchent","47 Ghardaïa","48 Relizane","49 El M'Ghair",
  "50 El Meniaa","51 Ouled Djellal","52 Bordj Baji Mokhtar","53 Béni Abbès",
  "54 Timimoun","55 Touggourt","56 Djanet","57 In Salah","58 In Guezzam",
];

const DELIVERY_TARIFFS = {
  Alger: { dom: 500, stop: 400 },
  Blida: { dom: 650, stop: 500 },
  Boumerdès: { dom: 650, stop: 500 },
  Tipaza: { dom: 650, stop: 500 },
  Chlef: { dom: 800, stop: 550 },
  "Oum El Bouaghi": { dom: 800, stop: 550 },
  Batna: { dom: 800, stop: 550 },
  Béjaïa: { dom: 800, stop: 550 },
  Bouira: { dom: 800, stop: 550 },
  Tlemcen: { dom: 800, stop: 550 },
  Tiaret: { dom: 800, stop: 550 },
  "Tizi Ouzou": { dom: 800, stop: 550 },
  Sétif: { dom: 800, stop: 550 },
  Saïda: { dom: 800, stop: 550 },
  Skikda: { dom: 800, stop: 550 },
  "Sidi Bel Abbès": { dom: 800, stop: 550 },
  Annaba: { dom: 800, stop: 550 },
  Guelma: { dom: 800, stop: 550 },
  Constantine: { dom: 800, stop: 550 },
  Médéa: { dom: 800, stop: 550 },
  Mostaganem: { dom: 800, stop: 550 },
  "M'Sila": { dom: 800, stop: 550 },
  Mascara: { dom: 800, stop: 550 },
  Oran: { dom: 800, stop: 550 },
  "Bordj Bou Arreridj": { dom: 800, stop: 550 },
  "El Tarf": { dom: 800, stop: 550 },
  Tissemsilt: { dom: 800, stop: 550 },
  Khenchela: { dom: 800, stop: 550 },
  "Souk Ahras": { dom: 800, stop: 550 },
  Mila: { dom: 800, stop: 550 },
  "Aïn Defla": { dom: 800, stop: 550 },
  "Aïn Témouchent": { dom: 800, stop: 550 },
  Relizane: { dom: 800, stop: 550 },
  Laghouat: { dom: 900, stop: 650 },
  Biskra: { dom: 900, stop: 650 },
  Béchar: { dom: 900, stop: 650 },
  Tébessa: { dom: 900, stop: 650 },
  Djelfa: { dom: 900, stop: 650 },
  Jijel: { dom: 900, stop: 650 },
  Ouargla: { dom: 1000, stop: 700 },
  "El Oued": { dom: 1000, stop: 700 },
  Ghardaïa: { dom: 1000, stop: 700 },
  "Ouled Djellal": { dom: 1000, stop: 700 },
  Touggourt: { dom: 1000, stop: 700 },
  "El M'Ghair": { dom: 1000, stop: 700 },
  "El Meniaa": { dom: 1000, stop: 700 },
  Adrar: { dom: 1300, stop: 900 },
  "El Bayadh": { dom: 1300, stop: 900 },
  Naâma: { dom: 1300, stop: 900 },
  Timimoun: { dom: 1300, stop: 900 },
  "Bordj Baji Mokhtar": { dom: 1300, stop: 1300 },
  "Béni Abbès": { dom: 1300, stop: 900 },
  Tamanrasset: { dom: 1700, stop: 1300 },
  Illizi: { dom: 1700, stop: 1300 },
  Tindouf: { dom: 1700, stop: 1300 },
  "In Salah": { dom: 1700, stop: 1300 },
  "In Guezzam": { dom: 1700, stop: 1700 },
  Djanet: { dom: 1700, stop: 1300 },
};

const orderStatusesList = [
  "A commander","Réservée","Payée une partie","Payée",
  "En cours de livraison","Livrée sans paiement","Payée et livrée","Annulée",
];

const SUGGESTED_COMMUNES = {
  "16 Alger": [
    "Alger Centre","Sidi M'Hamed","Kouba","Birtouta","Bab Ezzouar",
    "Dely Ibrahim","Chéraga","Zeralda","Hydra","Bir Mourad Raïs",
    "El Biar","Bachidjerrah","Dar El Beïda","Bordj El Kiffan",
    "Rouiba","Reghaïa","Ain Taya",
  ],
  "09 Blida": [
    "Blida","Boufarik","Ouled Yaïch","Beni Mered","Bougara",
    "Meftah","Larbaa","Chréa",
  ],
  "31 Oran": [
    "Oran","Bir El Djir","Es Sénia","Arzew","Gdyel",
    "Mers El Kébir","Boutlélis",
  ],
};

// --- FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBn2UV3ilolO7Rqj2bo4dm_vQsn3v_6Ia4",
  authDomain: "yunas-shop-app.firebaseapp.com",
  projectId: "yunas-shop-app",
  storageBucket: "yunas-shop-app.appspot.com",
  messagingSenderId: "584178390864",
  appId: "1:584178390864:web:40c32f3de1acdae2793e55",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appId = "yunas-shop-crm";

// --- HELPERS STORAGE (Version ImgBB - Sans Firebase Storage) ---
const uploadFile = async (file, path) => {
  if (!file) return null;
  
  // Prépare l'image pour l'envoi
  const formData = new FormData();
  formData.append("image", file);

  // Remplace "TA_CLE_API" par la clé que tu as copiée sur le site ImgBB
  const API_KEY = "f160f234add3f81b6647dfd8dbdabf6b"; 

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Retourne le lien direct de l'image (Firebase Firestore va sauvegarder ce lien texte)
      return data.data.url; 
    } else {
      console.error("Erreur ImgBB:", data);
      return null;
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return null;
  }
};

const deleteFile = async (fileUrl) => {
  // ImgBB garde les images, on retire juste le lien de la base de données
  // Pas besoin de logique complexe ici !
  console.log("Image détachée de la base de données :", fileUrl);
};

// --- HELPERS ---
const formatDA = (val) =>
  (parseFloat(val) || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " DA";

const calculateReste = (order) => {
  if (order.status === "Payée" || order.status === "Payée et livrée") return 0;
  const totalItems = (order.items || []).reduce((sum, item) => {
    return sum + (item.status === "Retourné Fournisseur" ? 0 : (parseFloat(item.priceVente) || 0));
  }, 0);
  const totalOrder = totalItems + (parseFloat(order.shippingNational) || 0) - (parseFloat(order.discount) || 0);
  const netPaid = (parseFloat(order.advancePayment) || 0) - (parseFloat(order.refundAmount) || 0);
  return Math.max(0, totalOrder - netPaid);
};

// --- UI COMPONENTS ---
const SidebarItem = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-white to-[#F3E8E2]/40 shadow-md shadow-[#E8D5C4]/20 text-[#8D7B68] border border-white font-bold"
        : "text-[#B8A99A] hover:text-[#8D7B68] hover:bg-white/60 font-medium"
    }`}
  >
    <div className="flex items-center gap-4">
      <Icon size={18} />
      <span className="text-xs hidden md:inline">{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-red-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const PlatformIcon = ({ type, size = 14 }) => {
  if (type === "instagram") return <span className="text-pink-500 font-black text-[12px]">IG</span>;
  if (type === "facebook") return <span className="text-blue-600 font-black text-[12px]">FB</span>;
  if (type === "whatsapp") return <MessageCircle size={size} className="text-green-500" />;
  return <User size={size} className="text-gray-400" />;
};

const ModalHeader = ({ title, onClose }) => (
  <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b border-gray-50/50 shrink-0 print:hidden">
    <h3 className="text-sm font-serif text-[#8D7B68] tracking-widest uppercase font-bold">{title}</h3>
    <button
      type="button"
      onClick={onClose}
      className="p-2 text-gray-400 hover:text-red-400 bg-gray-50 hover:bg-red-50 rounded-full transition-all"
    >
      <X size={18} />
    </button>
  </div>
);

const StatCard = ({ label, value, subValue, color, highlight, icon: Icon, percentage, invertColor }) => (
  <div
    className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between ${
      highlight
        ? "bg-white shadow-md border border-[#E8D5C4]/40"
        : "bg-white/60 shadow-sm border border-transparent hover:border-[#E8D5C4]/30"
    }`}
  >
    <div className="flex justify-between items-start mb-2 md:mb-4">
      <p className="text-[9px] md:text-[10px] uppercase text-gray-400 font-bold tracking-widest flex-1 pr-2 leading-tight">{label}</p>
      {Icon && (
        <div className={`p-2 rounded-xl ${highlight ? "bg-[#FAF7F2]" : "bg-white"}`}>
          <Icon size={16} style={{ color }} />
        </div>
      )}
    </div>
    <div>
      <div className="text-lg md:text-2xl font-serif font-black tracking-tight" style={{ color }}>{value}</div>
      {(subValue || percentage != null) && (
        <div className="flex items-center gap-2 mt-1.5 md:mt-2">
          {percentage != null && (
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                invertColor
                  ? "bg-rose-50 text-rose-500"
                  : parseFloat(percentage) >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
              }`}
            >
              {parseFloat(percentage) > 0 && !invertColor ? "+" : ""}{percentage}%
            </span>
          )}
          {subValue && <span className="text-[10px] font-bold text-[#B8A99A]">{subValue}</span>}
        </div>
      )}
    </div>
  </div>
);

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 print:hidden ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <span className="text-xs font-bold">{msg}</span>
      <button onClick={onClose} className="opacity-80 hover:opacity-100"><X size={14} /></button>
    </div>
  );
};

const ImageUploader = ({ compact, value, onChange, path }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      if (value) await deleteFile(value);
      const url = await uploadFile(file, `${path}/${Date.now()}_${file.name}`);
      onChange(url);
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (value) await deleteFile(value);
    onChange("");
  };

  if (compact) {
    return (
      <div className="relative w-10 h-10 md:w-[38px] md:h-[38px] border border-dashed border-[#E8D5C4] rounded-lg flex items-center justify-center bg-white overflow-hidden shrink-0 group shadow-sm transition-all hover:border-[#D4B996]">
        {loading ? (
          <Loader2 size={14} className="animate-spin text-[#8D7B68]" />
        ) : value ? (
          <>
            <img src={value} alt="Article" className="w-full h-full object-cover" />
            <button type="button" onClick={handleRemove} className="absolute inset-0 bg-white/80 hidden group-hover:flex items-center justify-center text-red-400 transition-all">
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-[#FAF7F2] transition-colors">
            <ImageIcon size={14} className="text-[#B8A99A]" />
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white p-3 rounded-2xl border border-[#E8D5C4]/40 shadow-sm">
      <label className="text-[9px] text-[#B8A99A] font-bold uppercase tracking-widest mb-2 block">Reçu de versement (Global)</label>
      <div className="relative h-24 border border-dashed border-[#E8D5C4] rounded-xl flex items-center justify-center bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors overflow-hidden group">
        {loading ? (
          <div className="flex flex-col items-center text-[#8D7B68]"><Loader2 size={18} className="animate-spin mb-2" /><span className="text-[9px] font-bold uppercase tracking-widest">Envoi en cours...</span></div>
        ) : value ? (
          <>
            {value.includes(".pdf") ? (
               <div className="flex flex-col items-center gap-1 text-[#8D7B68]"><UploadCloud size={20} /><span className="text-[10px] font-bold">PDF Ajouté</span></div>
            ) : (
               <img src={value} alt="Reçu" className="h-full w-full object-contain p-1" />
            )}
            <div className="absolute inset-0 bg-white/90 hidden group-hover:flex items-center justify-center gap-4 backdrop-blur-sm">
               <label className="p-2.5 bg-[#FAF7F2] rounded-xl cursor-pointer text-[#8D7B68] hover:scale-105 shadow-sm border border-[#E8D5C4]"><Edit3 size={16} /><input type="file" accept="image/*,.pdf" className="hidden" onChange={handleUpload} /></label>
               <button type="button" onClick={handleRemove} className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:scale-105 shadow-sm border border-red-100"><Trash2 size={16} /></button>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center text-[#B8A99A] hover:text-[#8D7B68] transition-colors">
            <UploadCloud size={20} className="mb-2" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Joindre une image ou PDF</span>
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>
    </div>
  );
};

// --- LOGIN ---
function Login() {
  const [error, setError] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
      .catch(() => setError("Identifiants incorrects."));
  };
  return (
    <div style={{ height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"#FDFBF7",fontFamily:"sans-serif",padding:"20px" }}>
      <div style={{ padding:"30px",backgroundColor:"#FFFFFF",borderRadius:"24px",boxShadow:"0 4px 15px rgba(0,0,0,0.05)",textAlign:"center",width:"100%",maxWidth:"350px",border:"1px solid #EBE5D9" }}>
        <h2 style={{ color:"#8D7B68",fontWeight:"bold",marginBottom:"5px",fontSize:"20px",fontFamily:"serif",letterSpacing:"2px" }}>YUNA'S SHOP</h2>
        <p style={{ color:"#B8A99A",fontSize:"10px",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"20px",fontWeight:"bold" }}>Suite Elite de Sara</p>
        <form onSubmit={handleLogin} style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          <input name="email" type="email" placeholder="Email admin" required style={{ padding:"12px",border:"1px solid #EBE5D9",borderRadius:"12px",outline:"none",backgroundColor:"#FAF7F2",fontSize:"14px",color:"#4A3F35",fontWeight:"bold" }} />
          <input name="password" type="password" placeholder="Mot de passe" required style={{ padding:"12px",border:"1px solid #EBE5D9",borderRadius:"12px",outline:"none",backgroundColor:"#FAF7F2",fontSize:"14px",color:"#4A3F35",fontWeight:"bold" }} />
          <button type="submit" style={{ padding:"12px",backgroundColor:"#8D7B68",color:"white",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"12px",marginTop:"10px",textTransform:"uppercase",fontWeight:"bold",letterSpacing:"1px" }}>Accéder au CRM</button>
        </form>
        {error && <p style={{ color:"#EF4444",fontSize:"12px",marginTop:"10px",fontWeight:"bold" }}>{error}</p>}
      </div>
    </div>
  );
}
// --- COMPOSANT : STATION DE PESÉE RAPIDE ---
const StationDePesee = ({ orders, arrivages, showToast, onNewArrivage }) => {
  const [poidsSaisi, setPoidsSaisi] = useState("");
  const [arrivageActif, setArrivageActif] = useState(""); 
  const [indexActuel, setIndexActuel] = useState(0);
  const inputRef = React.useRef(null);

  // 1. Récupérer TOUS les articles en attente de pesée (peu importe l'arrivage)
  const articlesAPeser = React.useMemo(() => {
    let list = [];
    orders.forEach((o) => {
      if (o.status === "Annulée") return;
      (o.items || []).forEach((item) => {
        // On récupère les articles sans poids ou à 0
        if (item.status !== "Retourné Fournisseur" && (!item.weightG || parseFloat(item.weightG) === 0)) {
          list.push({ ...item, orderId: o.id, orderNumber: o.orderNumber, customerName: o.customerName, orderObj: o });
        }
      });
    });
    // Trier par date de commande (les plus anciens d'abord)
    return list.sort((a, b) => {
      const timeA = a.orderObj.date?.toMillis ? a.orderObj.date.toMillis() : new Date(a.orderObj.date || 0).getTime();
      const timeB = b.orderObj.date?.toMillis ? b.orderObj.date.toMillis() : new Date(b.orderObj.date || 0).getTime();
      return timeA - timeB;
    });
  }, [orders]);

  // Sécurité pour l'index si on pèse un article et que la liste rétrécit
  React.useEffect(() => {
    if (indexActuel >= articlesAPeser.length) setIndexActuel(0);
  }, [articlesAPeser.length, indexActuel]);

  // Forcer le focus sur l'input
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [indexActuel, articlesAPeser, arrivageActif]);

  const handleValiderPoids = async (e, currentItem) => {
    if (e.key === "Enter" && poidsSaisi !== "") {
      e.preventDefault();

      // SÉCURITÉ : On oblige à ouvrir un carton (Arrivage) avant de peser !
      if (!arrivageActif) {
        showToast("⚠️ Ouvre un Arrivage en haut avant de commencer à peser !", "error");
        return;
      }

      const poidsGrammes = poidsSaisi;
      setPoidsSaisi("");

      try {
        const orderRef = doc(db, "artifacts", appId, "public", "data", "orders", currentItem.orderId);
        
        const updatedItems = currentItem.orderObj.items.map(it => {
          if (it.id === currentItem.id) {
            let newStatus = it.status;
            if (!it.status || it.status === "En attente" || it.status === "A commander") {
              newStatus = "Reçu";
            }
            // L'ARTICLE EST ASSIGNÉ AU CARTON OUVERT INSTANTANÉMENT
            return { 
              ...it, 
              weightG: poidsGrammes, 
              status: newStatus, 
              arrivageId: arrivageActif 
            };
          }
          return it;
        });

        await updateDoc(orderRef, { items: updatedItems });
        showToast(`Pesée validée et assignée au carton ! (${poidsGrammes}g)`);
      } catch (error) {
        showToast("Erreur lors de la sauvegarde", "error");
      }
    }
  };

  const currentItem = articlesAPeser[indexActuel];

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-in zoom-in-95 mt-2 md:mt-4">
      
      {/* EN-TÊTE : Assignation Arrivage */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 bg-white p-4 rounded-[1.5rem] border border-[#E8D5C4]/40 shadow-sm">
        <div className="flex flex-col">
          <h3 className="font-serif text-[#8D7B68] text-sm md:text-lg font-bold flex items-center gap-2 uppercase tracking-widest shrink-0">
            <Scale size={20} className="text-[#D4B996]"/> Station Pesée
          </h3>
          <p className="text-[9px] font-bold text-gray-400 mt-1">Étape 1 : Choisis le carton que tu vas vider</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto flex-1 md:justify-end">
          
          {/* SÉLECTEUR D'ARRIVAGE (CRITIQUE) */}
          <div className="relative w-full md:w-72 flex gap-2">
            <select 
              value={arrivageActif} 
              onChange={(e) => setArrivageActif(e.target.value)}
              className={`flex-1 p-3 rounded-xl text-xs font-bold outline-none shadow-sm appearance-none transition-colors ${!arrivageActif ? "bg-red-50 text-red-500 border border-red-200 animate-pulse" : "bg-[#8D7B68] text-white border-transparent"}`}
            >
              <option value="">Sélectionner l'arrivage en cours...</option>
              {/* On trie pour avoir les plus récents en premier */}
              {[...(arrivages || [])].sort((a,b) => new Date(b.date) - new Date(a.date)).map(a => (
                <option key={a.id} value={a.id}>📦 Arrivage #{a.number} ({a.date})</option>
              ))}
            </select>
            
            <button 
              onClick={onNewArrivage}
              className="p-3 bg-[#FAF7F2] text-[#8D7B68] border border-[#E8D5C4] rounded-xl shadow-sm hover:scale-105 transition-transform shrink-0"
              title="Créer le nouvel arrivage du jour"
            >
              <Plus size={16} />
            </button>
          </div>

          <span className="bg-[#FAF7F2] border border-[#E8D5C4]/50 text-[#8D7B68] text-[10px] px-4 py-3 rounded-xl font-black uppercase shadow-sm shrink-0 hidden md:block">
            En attente : {articlesAPeser.length}
          </span>
        </div>
      </div>

      {articlesAPeser.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60 bg-white rounded-[2rem] border border-[#E8D5C4]/30 shadow-sm mt-4">
          <Scale size={64} className="text-[#D4B996] mb-4" />
          <h3 className="text-xl font-serif font-bold text-[#8D7B68]">Tout est pesé !</h3>
          <p className="text-sm font-bold text-[#B8A99A]">Il n'y a aucun article en attente dans tes commandes.</p>
        </div>
      ) : (
        <>
          {/* BANDEAU DE NAVIGATION DES ARTICLES */}
          <div className="flex overflow-x-auto gap-3 py-2 px-1 custom-scrollbar snap-x mt-2">
            {articlesAPeser.map((art, idx) => (
              <div 
                key={art.id} 
                onClick={() => setIndexActuel(idx)}
                className={`snap-start shrink-0 flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border ${indexActuel === idx ? "bg-white border-[#D4B996] shadow-md scale-105" : "bg-white/50 border-transparent hover:bg-white opacity-60 hover:opacity-100"}`}
                style={{ width: "220px" }}
              >
                <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] overflow-hidden flex items-center justify-center shrink-0 border border-[#E8D5C4]/30">
                  {art.itemImage ? <img src={art.itemImage} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-[#E8D5C4]"/>}
                </div>
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[10px] font-black text-[#8D7B68] truncate">{art.customerName}</span>
                  <span className="text-[9px] font-bold text-[#B8A99A] truncate">{art.orderNumber}</span>
                  <span className="text-[8px] text-gray-400 truncate mt-0.5">{art.name || "Sans nom"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CARTE PRINCIPALE DE PESÉE */}
          {currentItem && (
            <div className={`p-6 md:p-8 rounded-[2rem] shadow-xl border flex flex-col md:flex-row gap-6 md:gap-8 items-center relative overflow-hidden transition-colors ${arrivageActif ? "bg-white border-[#E8D5C4]/30" : "bg-red-50/20 border-red-200"}`}>
              
              {/* Bouton Précédent */}
              <div className="hidden md:flex flex-col items-center gap-4">
                 <button 
                   onClick={() => setIndexActuel(prev => Math.max(0, prev - 1))}
                   disabled={indexActuel === 0}
                   className="p-3 bg-[#FAF7F2] rounded-full text-[#8D7B68] hover:bg-[#E8D5C4] disabled:opacity-30 transition-all shadow-sm"
                 >
                   <span className="font-black text-sm">←</span>
                 </button>
              </div>

              {/* Photo */}
              <div className="w-32 h-32 md:w-56 md:h-56 rounded-2xl bg-[#FAF7F2] border border-[#E8D5C4]/50 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                {currentItem.itemImage ? (
                  <img src={currentItem.itemImage} alt={currentItem.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-[#E8D5C4]" />
                )}
              </div>

              {/* Informations et Saisie */}
              <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  <span className="bg-gray-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-gray-400 border border-gray-100">
                    CMD: {currentItem.orderNumber}
                  </span>
                  {currentItem.arrivageId && currentItem.arrivageId !== arrivageActif && (
                    <span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-orange-100">
                      Était prévu dans un autre arrivage
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl md:text-4xl font-serif font-black text-[#8D7B68] leading-tight mb-2">
                  {currentItem.customerName}
                </h2>
                
                <p className="text-sm font-bold text-[#B8A99A] mb-6">
                  {currentItem.name || "Article sans nom"} • {currentItem.category} • {currentItem.size} / {currentItem.color}
                </p>

                <div className={`w-full relative p-4 rounded-2xl transition-colors ${arrivageActif ? "bg-[#FAF7F2]/50 border border-[#E8D5C4]/40" : "bg-red-50 border border-red-200"}`}>
                  <label className={`text-[10px] uppercase font-bold mb-2 block tracking-widest ${arrivageActif ? "text-[#D4B996]" : "text-red-500"}`}>
                    {arrivageActif ? "Saisir Poids (en Grammes)" : "STOP : SÉLECTIONNEZ LE CARTON EN HAUT"}
                  </label>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <input
                      ref={inputRef}
                      type="number"
                      value={poidsSaisi}
                      onChange={(e) => setPoidsSaisi(e.target.value)}
                      onKeyDown={(e) => handleValiderPoids(e, currentItem)}
                      disabled={!arrivageActif}
                      placeholder="Ex: 250"
                      className="w-full md:w-48 p-4 md:p-5 text-2xl font-black text-center md:text-left text-[#4A3F35] bg-white rounded-2xl outline-none shadow-md border-2 border-transparent focus:border-[#D4B996] transition-all disabled:opacity-50"
                    />
                    <span className="text-[#B8A99A] font-black text-2xl hidden md:block">g</span>
                  </div>
                </div>
              </div>

              {/* Bouton Suivant / Passer */}
              <div className="md:flex flex-col items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                 <button 
                   onClick={() => setIndexActuel(prev => prev < articlesAPeser.length - 1 ? prev + 1 : 0)}
                   className="w-full md:w-auto px-4 py-3 md:p-4 bg-white border border-[#E8D5C4] shadow-sm rounded-xl md:rounded-full text-[#8D7B68] hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-2"
                 >
                   <span className="text-[10px] uppercase font-bold md:hidden">Article suivant</span>
                   <span className="font-black text-sm hidden md:block">→</span>
                 </button>
                 <p className="text-[8px] text-gray-400 uppercase font-bold hidden md:block mt-2">Passer</p>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
};
// --- MAIN APP ---
const MainApp = ({ user }) => {
  const [globalSearch, setGlobalSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterCommune, setFilterCommune] = useState("");
  const [filterDelivery, setFilterDelivery] = useState("");
  const [filterStopdesk, setFilterStopdesk] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [orderSortBy, setOrderSortBy] = useState("dateDesc"); // Par défaut : plus récent
  const [orderNumberFilter, setOrderNumberFilter] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [gallerySearch, setGallerySearch] = useState("");
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTariffs, setShowTariffs] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [arrivages, setArrivages] = useState([]);
  const [currencyRates, setCurrencyRates] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const defaultConfig = {
    categories: ["Mode Femme","Beauté","Chaussures","Kids","Maison","Accessoires"],
    sizes: ["XS","S","M","L","XL","2 ans","4 ans","Unique"],
    colors: ["Beige Nude","Rose Poudré","Blanc Cassé","Taupe","Marron Clair","Noir"],
  };

  const [config, setConfig] = useState(defaultConfig);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [dashboardNote, setDashboardNote] = useState("");

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showAddArrivage, setShowAddArrivage] = useState(false);
  const [showAddRate, setShowAddRate] = useState(false);
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showReceipt, setShowReceipt] = useState(null);
  const [showDeliverySlip, setShowDeliverySlip] = useState(null);
  const [showCostBreakdown, setShowCostBreakdown] = useState(null);
  const [showCustomerHistory, setShowCustomerHistory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingArrivage, setEditingArrivage] = useState(null);

  const [orderItems, setOrderItems] = useState([]);
  const [orderPayments, setOrderPayments] = useState([]);
  const [shippingNational, setShippingNational] = useState(0);
  const [orderStatus, setOrderStatus] = useState("En attente");
  const [orderDate, setOrderDate] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [arrivageNumber, setArrivageNumber] = useState("");
  const [arrivageDate, setArrivageDate] = useState("");
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [orderRefundAmount, setOrderRefundAmount] = useState(0);
  const [orderReceiptImage, setOrderReceiptImage] = useState("");
  
  // --- NOUVEAUX ÉTATS POUR LA SÉLECTION GALERIE ---
  const [isGallerySelectionMode, setIsGallerySelectionMode] = useState(false);
  const [selectedGalleryItems, setSelectedGalleryItems] = useState([]);
  // --- NOUVELLES FONCTIONNALITÉS COMMANDES ---
  const [selectedOrders, setSelectedOrders] = useState([]);

  // 1. Copier les infos pour le livreur
  const handleCopyCustomerInfo = (order) => {
    const c = customers.find(x => x.id === order.customerId);
    if (!c) {
      showToast("Cliente introuvable", "error");
      return;
    }
    const text = `${c.name} - ${c.phone}${c.phone2 ? ` / ${c.phone2}` : ""} - ${c.wilaya} - ${c.commune} - ${c.deliveryMode === "stopdesk" ? `Stopdesk: ${c.stopdeskName}` : "Domicile"}`;
    navigator.clipboard.writeText(text);
    showToast("Infos copiées pour le livreur ! 📋");
  };

  // 2. Encaissement éclair
  const handleQuickPayment = async (order) => {
    const amountStr = window.prompt(`Combien as-tu encaissé pour la commande de ${order.customerName} ?\nReste à payer : ${formatDA(calculateReste(order))}`);
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      showToast("Montant invalide", "error");
      return;
    }
    try {
      const newPayment = { id: Date.now(), amount, date: new Date().toISOString().split("T")[0], method: "Cash" };
      const updatedPayments = [...(order.payments || []), newPayment];
      await updateDoc(doc(db, "artifacts", appId, "public", "data", "orders", order.id), { payments: updatedPayments });
      showToast(`Paiement de ${formatDA(amount)} ajouté avec succès !`);
    } catch (error) {
      showToast("Erreur lors de l'encaissement", "error");
    }
  };

  // 3. Mise à jour groupée des statuts
  const handleBulkStatusUpdate = async (newStatus) => {
    if (!newStatus || selectedOrders.length === 0) return;
    try {
      for (const orderId of selectedOrders) {
        await updateDoc(doc(db, "artifacts", appId, "public", "data", "orders", orderId), { status: newStatus });
      }
      showToast(`${selectedOrders.length} commandes passées en "${newStatus}" !`);
      setSelectedOrders([]); // Vide la sélection après succès
    } catch (error) {
      showToast("Erreur de mise à jour groupée", "error");
    }
  };

  // --- FONCTION DE SUPPRESSION MULTIPLE GALERIE ---
  const handleDeleteSelectedImages = async () => {
    if (selectedGalleryItems.length === 0) return;
    
    try {
      // Regrouper les modifications par commande (orderId) pour minimiser les requêtes
      const updatesByOrder = {};
      
      selectedGalleryItems.forEach(selected => {
        if (!updatesByOrder[selected.orderId]) {
          const order = orders.find(o => o.id === selected.orderId);
          if (order) updatesByOrder[selected.orderId] = { ...order };
        }
        
        if (updatesByOrder[selected.orderId]) {
          updatesByOrder[selected.orderId].items = updatesByOrder[selected.orderId].items.map(it => {
            if (it.id === selected.itemId) {
              return { ...it, itemImage: "" }; // On vide l'URL de l'image
            }
            return it;
          });
        }
      });

      // Exécuter la mise à jour pour chaque commande impactée
      for (const orderId in updatesByOrder) {
        const orderRef = doc(db, "artifacts", appId, "public", "data", "orders", orderId);
        await updateDoc(orderRef, { items: updatesByOrder[orderId].items });
      }

      showToast(`${selectedGalleryItems.length} photo(s) retirée(s) avec succès`);
      setIsGallerySelectionMode(false);
      setSelectedGalleryItems([]);
    } catch (error) {
      console.error(error);
      showToast("Erreur lors de la suppression des photos", "error");
    }
  };

  // --- FONCTION DE MISE À JOUR RAPIDE DU STATUT ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "artifacts", appId, "public", "data", "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      showToast(`Statut passé à : ${newStatus}`);
    } catch (error) {
      console.error(error);
      showToast("Erreur lors de la mise à jour du statut", "error");
    }
  };

      // Exécuter la mise à jour pour chaque commande impactée
      for (const orderId in updatesByOrder) {
        const orderRef = doc(db, "artifacts", appId, "public", "data", "orders", orderId);
        await updateDoc(orderRef, { items: updatesByOrder[orderId].items });
      }

      showToast(`${selectedGalleryItems.length} photo(s) retirée(s) avec succès`);
      setIsGallerySelectionMode(false);
      setSelectedGalleryItems([]);
    } catch (error) {
      console.error(error);
      showToast("Erreur lors de la suppression des photos", "error");
    }
  };

  useEffect(() => {
    const path = (coll) => collection(db, "artifacts", appId, "public", "data", coll);
    const unsubC = onSnapshot(path("customers"), (s) => setCustomers(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubO = onSnapshot(path("orders"), (s) => setOrders(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubA = onSnapshot(path("arrivages"), (s) => setArrivages(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubR = onSnapshot(path("currencyRates"), (s) => setCurrencyRates(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubS = onSnapshot(path("sponsors"), (s) => setSponsors(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubE = onSnapshot(path("expenses"), (s) => setExpenses(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubConfig = onSnapshot(
      doc(db, "artifacts", appId, "public", "data", "config", "global"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig({ ...defaultConfig, ...data });
          setDashboardNote(data.dashboardNote || "");
        }
      }
    );
    return () => { unsubC(); unsubO(); unsubA(); unsubR(); unsubS(); unsubE(); unsubConfig(); };
  }, []);

  const saveConfig = async (newConfig) => {
    await setDoc(doc(db, "artifacts", appId, "public", "data", "config", "global"), newConfig);
    showToast("Configuration sauvegardée !");
  };

  const handleSaveNote = async () => {
    const newConfig = { ...config, dashboardNote };
    setConfig(newConfig);
    await saveConfig(newConfig);
  };

  const getRateForDate = (dateInput) => {
    if (!currencyRates.length) return 250;
    const targetDate =
      dateInput instanceof Date ? dateInput
      : dateInput?.toDate ? dateInput.toDate()
      : new Date(dateInput);
    const sorted = [...currencyRates].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted.find((r) => new Date(r.date) <= targetDate)?.rate || sorted[0]?.rate || 250;
  };

  const getArrivageStats = (arrivageId) => {
    const arr = arrivages.find((a) => a.id === arrivageId);
    if (!arr || !arr.totalShippingFee) return { rate: 0, weightKg: 0 };
    const weightKg = parseFloat(arr.totalWeightKg) || 1;
    const rate = parseFloat(arr.totalShippingFee) / weightKg;
    return { rate, weightKg };
  };

  const calculateTotals = (items, shipNat, orderDate) => {
    const rateEur = getRateForDate(orderDate || new Date());
    let venteTotal = 0, costOfGoods = 0;
    const processed = items?.map((it) => {
      const stats = getArrivageStats(it.arrivageId);
      let itAchatDA = (parseFloat(it.priceAchatEuro) || 0) * rateEur;
      const itLogInt = ((parseFloat(it.weightG) || 0) / 1000) * stats.rate;
      let itVente = parseFloat(it.priceVente) || 0;

      if (it.status === "Retourné Fournisseur") {
        if (it.sheinRembourse) itAchatDA = 0;
        if (it.responsableRetour === "cliente") {
          const fraisAChargeCliente = (parseFloat(it.fraisRetourLivreur) || 0) + (parseFloat(it.fraisRetourFournisseur) || 0);
          itVente = fraisAChargeCliente;
        } else {
          itVente = 0;
        }
      }

      venteTotal += itVente;
      costOfGoods += itAchatDA + itLogInt;

      return { ...it, itAchatDA, itLogInt, itBenefit: itVente - (itAchatDA + itLogInt) };
    }) || [];

    return { venteTotal, benefit: venteTotal - costOfGoods, processed };
  };

  const getCalculatedWeightForArrivage = (arrivageId) => {
    let totalG = 0;
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (item.arrivageId === arrivageId) totalG += parseFloat(item.weightG) || 0;
      });
    });
    return totalG / 1000;
  };

  const lateDeliveries = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      if (o.status !== "En cours de livraison") return false;
      const d = o.date?.toDate ? o.date.toDate() : new Date(o.date);
      const diffTime = Math.abs(now - d);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 7;
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const d = o.date?.toDate ? o.date.toDate() : new Date(o.date);
        const isSameMonth =
          d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth);
        const searchLower = (globalSearch || orderSearch).toLowerCase();
        const matchBasic =
          (o.orderNumber || "").toLowerCase().includes(searchLower) ||
          (o.customerName || "").toLowerCase().includes(searchLower);
        const matchItems = (o.items || []).some(
          (item) =>
            (item.name || "").toLowerCase().includes(searchLower) ||
            (item.color || "").toLowerCase().includes(searchLower) ||
            (item.size || "").toLowerCase().includes(searchLower) ||
            (item.category || "").toLowerCase().includes(searchLower)
        );
        const matchSearch = matchBasic || matchItems;
        const matchStatus = !orderStatusFilter || o.status === orderStatusFilter;
        
        // NOUVEAU : Le filtre strict sur le numéro de commande
        const matchOrderNumber = !orderNumberFilter || (o.orderNumber || "").toLowerCase().includes(orderNumberFilter.toLowerCase());

        return isSameMonth && matchSearch && matchStatus && matchOrderNumber;
      })
      .sort((a, b) => {
        const timeA = a.date?.toMillis ? a.date.toMillis() : new Date(a.date || 0).getTime();
        const timeB = b.date?.toMillis ? b.date.toMillis() : new Date(b.date || 0).getTime();
        
        const totalA = (parseFloat(a.totalVente) || 0) + (parseFloat(a.shippingNational) || 0);
        const totalB = (parseFloat(b.totalVente) || 0) + (parseFloat(b.shippingNational) || 0);

        switch (orderSortBy) {
          case "dateAsc": return timeA - timeB; 
          case "priceDesc": return totalB - totalA; 
          case "priceAsc": return totalA - totalB; 
          case "resteDesc": return calculateReste(b) - calculateReste(a); 
          case "dateDesc":
          default: return timeB - timeA; 
        }
      });
  // ATTENTION : J'ai ajouté orderNumberFilter à la fin de cette liste entre les crochets 👇
  }, [orders, filterYear, filterMonth, orderSearch, globalSearch, orderStatusFilter, orderSortBy, orderNumberFilter]);

  const filteredArrivages = useMemo(() => {
    return arrivages
      .filter((a) => {
        const d = new Date(a.date || new Date());
        return d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [arrivages, filterYear, filterMonth]);

  const totalWeightFilteredArrivages = useMemo(() => {
    return filteredArrivages.reduce((sum, arr) => sum + (parseFloat(arr.totalWeightKg) || 0), 0);
  }, [filteredArrivages]);

  const galleryItems = useMemo(() => {
    let allItems = [];
    orders.forEach(order => {
      const d = order.date?.toDate ? order.date.toDate() : new Date(order.date);
      const isSameMonth = d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth);
      
      if (isSameMonth && order.items) {
        order.items.forEach(item => {
          if (item.itemImage) { 
            allItems.push({
              ...item,
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              orderId: order.id,
              orderObj: order 
            });
          }
        });
      }
    });
    return allItems;
  }, [orders, filterYear, filterMonth]);

  const filteredGalleryItems = useMemo(() => {
    if (!gallerySearch) return galleryItems;
    
    const searchLower = gallerySearch.toLowerCase();
    return galleryItems.filter(item => 
      (item.customerName || "").toLowerCase().includes(searchLower) ||
      (item.orderNumber || "").toLowerCase().includes(searchLower) ||
      (item.name || "").toLowerCase().includes(searchLower) ||
      (item.status || "").toLowerCase().includes(searchLower)
    );
  }, [galleryItems, gallerySearch]);

  const stats = useMemo(() => {
    const dOrders = orders.filter((o) => {
      const d = o.date?.toDate ? o.date.toDate() : new Date(o.date);
      return d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth);
    });
    const filteredSponsors = sponsors.filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth);
    });
    const filteredExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth);
    });

    const totalRevenue = dOrders.reduce((sum, o) => sum + (parseFloat(o.totalVente) || 0), 0);
    const totalBenefitBrut = dOrders.reduce((sum, o) => sum + (parseFloat(o.benefit) || 0), 0);
    const totalSponsors = filteredSponsors.reduce((sum, s) => sum + (parseFloat(s.amountDA) || 0), 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amountDA) || 0), 0);
    const netBenefit = totalBenefitBrut - totalSponsors - totalExpenses;
    const ordersCount = dOrders.length;
    const netMarginPercentage = totalRevenue > 0 ? ((netBenefit / totalRevenue) * 100).toFixed(1) : 0;
    const brutMarginPercentage = totalRevenue > 0 ? ((totalBenefitBrut / totalRevenue) * 100).toFixed(1) : 0;
    const expensesPercentage = totalRevenue > 0 ? (((totalSponsors + totalExpenses) / totalRevenue) * 100).toFixed(1) : 0;
    const averageOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;

    const clientMap = {};
    dOrders.forEach((o) => {
      if (!clientMap[o.customerId]) clientMap[o.customerId] = { name: o.customerName, total: 0, count: 0 };
      clientMap[o.customerId].total += parseFloat(o.totalVente) || 0;
      clientMap[o.customerId].count += 1;
    });
    const topClients = Object.values(clientMap).sort((a, b) => b.total - a.total).slice(0, 5);

    return { totalRevenue, totalBenefitBrut, totalSponsors, totalExpenses, netBenefit, ordersCount, topClients, netMarginPercentage, brutMarginPercentage, expensesPercentage, averageOrderValue };
  }, [orders, sponsors, expenses, filterYear, filterMonth]);

  const chartData = useMemo(() => {
    const months = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
    return months.map((monthName, index) => {
      const monthNum = index + 1;
      const mOrders = orders.filter((o) => { const d = o.date?.toDate ? o.date.toDate() : new Date(o.date); return d.getFullYear() === filterYear && d.getMonth() + 1 === monthNum; });
      const mSponsors = sponsors.filter((s) => { const d = new Date(s.date); return d.getFullYear() === filterYear && d.getMonth() + 1 === monthNum; });
      const mExpenses = expenses.filter((e) => { const d = new Date(e.date); return d.getFullYear() === filterYear && d.getMonth() + 1 === monthNum; });
      const ca = mOrders.reduce((sum, o) => sum + (parseFloat(o.totalVente) || 0), 0);
      const benefBrut = mOrders.reduce((sum, o) => sum + (parseFloat(o.benefit) || 0), 0);
      const frais = mSponsors.reduce((sum, s) => sum + (parseFloat(s.amountDA) || 0), 0) + mExpenses.reduce((sum, e) => sum + (parseFloat(e.amountDA) || 0), 0);
      return { name: monthName, CA: ca, Net: benefBrut - frais };
    });
  }, [orders, sponsors, expenses, filterYear]);

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get("name"),
      profileName: fd.get("profileName") || "", // <-- NOUVELLE LIGNE ICI
      phone: fd.get("phone"),
      phone2: fd.get("phone2") || "",
      platform: fd.get("platform") || "instagram",
      wilaya: fd.get("wilaya"),
      commune: fd.get("commune"),
      deliveryMode: fd.get("deliveryMode") || "domicile",
      stopdeskName: fd.get("stopdeskName") || "",
      walletDA: parseFloat(fd.get("walletDA")) || 0,
    };
    try {
      if (editingCustomer) {
        await updateDoc(doc(db, "artifacts", appId, "public", "data", "customers", editingCustomer.id), data);
        showToast("Cliente modifiée avec succès");
      } else {
        await addDoc(collection(db, "artifacts", appId, "public", "data", "customers"), {
          ...data,
          createdAt: Timestamp.now(),
        });
        showToast("Cliente ajoutée avec succès");
      }
      setShowAddCustomer(false);
      setEditingCustomer(null);
    } catch (err) {
      showToast("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleSaveOrder = async (e, setIsSaving) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.target);
      const customerId = formData.get("customerId");
      const customer = customers.find((c) => c.id === customerId);
      const selectedDate = new Date(formData.get("orderDate") || new Date());
      const t = calculateTotals(orderItems, shippingNational, selectedDate);
      const totalAdvance = orderPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      // 1. GESTION DU RETOUR FOURNISSEUR
      let finalItems = [...t.processed];
      for (let i = 0; i < finalItems.length; i++) {
        let item = finalItems[i];
        if (item.status === "Retourné Fournisseur" && !item.fraisRetourComptabilises) {
          if (parseFloat(item.fraisRetourLivreur) > 0) {
            await addDoc(collection(db, "artifacts", appId, "public", "data", "expenses"), {
              label: `Retour Livreur - CMD ${formData.get("orderNumber")}`,
              amountDA: parseFloat(item.fraisRetourLivreur),
              date: new Date().toISOString().split("T")[0],
            });
          }
          if (parseFloat(item.fraisRetourFournisseur) > 0) {
            await addDoc(collection(db, "artifacts", appId, "public", "data", "expenses"), {
              label: `Retour Frs - CMD ${formData.get("orderNumber")}`,
              amountDA: parseFloat(item.fraisRetourFournisseur),
              date: new Date().toISOString().split("T")[0],
            });
          }
          finalItems[i].fraisRetourComptabilises = true;
        }
      }

      // 2. CALCUL AUTOMATIQUE DU PORTEFEUILLE 
      const oldWalletUsed = editingOrder?.payments?.filter(p => p.method === "Portefeuille").reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      const newWalletUsed = orderPayments.filter(p => p.method === "Portefeuille").reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      const walletDiff = newWalletUsed - oldWalletUsed;

      if (walletDiff !== 0 && customerId) {
        const customerRef = doc(db, "artifacts", appId, "public", "data", "customers", customerId);
        const currentWallet = customer?.walletDA || 0;
        await updateDoc(customerRef, { walletDA: currentWallet - walletDiff });
      }

      // 3. PRÉPARATION DES DONNÉES DE LA COMMANDE
      const data = {
        orderNumber: formData.get("orderNumber"),
        customerId,
        customerName: customer?.name || "Inconnue",
        items: finalItems,
        payments: orderPayments,
        shippingNational: parseFloat(shippingNational) || 0,
        advancePayment: totalAdvance, 
        totalVente: t.venteTotal,
        benefit: t.benefit,
        status: orderStatus,
        date: Timestamp.fromDate(selectedDate),
        discount: parseFloat(orderDiscount) || 0,
        refundAmount: parseFloat(orderRefundAmount) || 0,
        receiptImage: orderReceiptImage, 
      };

      // 4. AJOUT D'EXCÉDENT AU PORTEFEUILLE 
      const totalVenteEtLivraison = t.venteTotal + (parseFloat(shippingNational) || 0) - (parseFloat(orderDiscount) || 0);
      const totalRemboursement = parseFloat(orderRefundAmount) || 0;
      const cashPayments = orderPayments.filter(p => p.method !== "Portefeuille").reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const netCashPayments = cashPayments - totalRemboursement; 
      
      const resteAvantCash = totalVenteEtLivraison - newWalletUsed;

      if (netCashPayments > resteAvantCash && customerId) {
        const excedent = netCashPayments - resteAvantCash;
        const customerRef = doc(db, "artifacts", appId, "public", "data", "customers", customerId);
        const updatedWallet = (customer?.walletDA || 0) - walletDiff;
        await updateDoc(customerRef, { walletDA: updatedWallet + excedent });
        showToast(`Excédent de ${excedent} DA ajouté au portefeuille cliente`);
      }

      // 5. SAUVEGARDE EN BASE DE DONNÉES
      if (editingOrder) {
        await updateDoc(doc(db, "artifacts", appId, "public", "data", "orders", editingOrder.id), data);
        showToast("Commande modifiée avec succès");
      } else {
        await addDoc(collection(db, "artifacts", appId, "public", "data", "orders"), data);
        showToast("Commande ajoutée avec succès");
      }
      setShowAddOrder(false);
      setEditingOrder(null);
    } catch (err) {
      showToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveArrivage = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      number: fd.get("number"),
      country: fd.get("country"),
      date: fd.get("date"),
      totalShippingFee: parseFloat(fd.get("totalShippingFee")) || 0,
      totalWeightKg: parseFloat(fd.get("totalWeightKg")) || 0,
      createdAt: editingArrivage ? editingArrivage.createdAt : Timestamp.now(),
    };
    if (editingArrivage) {
      await updateDoc(doc(db, "artifacts", appId, "public", "data", "arrivages", editingArrivage.id), data);
      showToast("Arrivage modifié");
    } else {
      await addDoc(collection(db, "artifacts", appId, "public", "data", "arrivages"), data);
      showToast("Arrivage ajouté");
    }
    setShowAddArrivage(false);
    setEditingArrivage(null);
  };

  const handleSaveSponsor = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const amountEur = parseFloat(fd.get("amountEur"));
    const date = fd.get("date");
    await addDoc(collection(db, "artifacts", appId, "public", "data", "sponsors"), {
      amountEur,
      amountDA: amountEur * getRateForDate(date),
      date,
      createdAt: Timestamp.now(),
    });
    showToast("Sponsor ajouté");
    setShowAddSponsor(false);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await addDoc(collection(db, "artifacts", appId, "public", "data", "expenses"), {
      label: fd.get("label"),
      amountDA: parseFloat(fd.get("amountDA")),
      date: fd.get("date"),
      createdAt: Timestamp.now(),
    });
    showToast("Dépense ajoutée");
    setShowAddExpense(false);
  };

  const performDelete = async () => {
    if (!deleteTarget) return;
    await deleteDoc(doc(db, "artifacts", appId, "public", "data", deleteTarget.collection, deleteTarget.id));
    showToast("Élément supprimé", "error");
    setDeleteTarget(null);
  };

  const exportCSV = () => {
    if (filteredOrders.length === 0) { showToast("Aucune donnée à exporter", "error"); return; }
    const headers = ["N° Commande","Date","Cliente","Statut","Total DA","Avance DA","Reste DA"];
    const rows = filteredOrders.map((o) => {
      const d = o.date?.toDate ? o.date.toDate().toLocaleDateString("fr-FR") : new Date(o.date).toLocaleDateString("fr-FR");
      const total = (parseFloat(o.totalVente) || 0) + (parseFloat(o.shippingNational) || 0);
      const reste = calculateReste(o);
      return [o.orderNumber, d, o.customerName, o.status, total.toFixed(2), parseFloat(o.advancePayment || 0).toFixed(2), reste.toFixed(2)];
    });
    let csvContent = "\uFEFF" + headers.join(";") + "\n" + rows.map((e) => e.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Commandes_Yunas_Shop_${filterMonth}_${filterYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV généré !");
  };

  const handleAiAnalysis = async () => {
    setAiLoading(true);
    setAiAnalysis("Connexion à l'IA en cours...");
    try {
      setTimeout(() => {
        setAiAnalysis(
          `Analyse du mois : Ton panier moyen est de ${parseFloat(stats.totalRevenue / (stats.ordersCount || 1)).toFixed(2)} DA, c'est super ! 1. Tente de faire de l'upsell (proposer un accessoire) pour augmenter ce panier. 2. Tes frais publicitaires représentent ${parseFloat((stats.totalSponsors / (stats.totalRevenue || 1)) * 100).toFixed(2)}% du CA, surveille ce ratio. 3. Relance tes clientes fidèles avec un petit code promo pour écouler le stock restant.`
        );
        setAiLoading(false);
      }, 2000);
    } catch (err) {
      setAiAnalysis("Erreur de connexion à l'IA.");
      setAiLoading(false);
    }
  };

  const openOrderForEdit = (o) => {
    setEditingOrder(o);
    setOrderItems(o.items || []);
    setShippingNational(o.shippingNational || 0);
    setOrderDiscount(o.discount || 0);
    setOrderRefundAmount(o.refundAmount || 0);
    const existingDate = o.date?.toDate
      ? o.date.toDate().toISOString().split("T")[0]
      : new Date(o.date || Date.now()).toISOString().split("T")[0];
    setOrderPayments(
      o.payments || (o.advancePayment ? [{ id: Date.now(), amount: o.advancePayment, date: existingDate }] : [])
    );
    setOrderStatus(o.status);
    setOrderDate(existingDate);
    setOrderNumber(o.orderNumber);
    setOrderReceiptImage(o.receiptImage || "");
    setShowAddOrder(true);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#FDFBF7] text-[#4A3F35] print:block print:h-auto print:overflow-visible print:bg-white">
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <datalist id="catList">{config.categories?.map((c) => <option key={c} value={c} />)}</datalist>
      <datalist id="sizeList">{config.sizes?.map((s) => <option key={s} value={s} />)}</datalist>
      <datalist id="colorList">{config.colors?.map((c) => <option key={c} value={c} />)}</datalist>

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-[#E8D5C4]/30 p-6 flex-col gap-6 bg-white/50 backdrop-blur-md z-10 shadow-sm print:hidden">
        <div className="px-2 text-center">
          <h1 className="text-xl font-serif tracking-widest text-[#8D7B68] font-bold">YUNA'S SHOP</h1>
          <p className="text-[9px] uppercase tracking-tighter opacity-50 font-bold italic">Suite Elite de Sara ✨</p>
        </div>
        <nav className="flex-1 space-y-2 mt-4">
          <SidebarItem active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={LayoutDashboard} label="Tableau de bord" />
          <SidebarItem active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={Package} label="Commandes" badge={lateDeliveries.length} />
          <SidebarItem active={activeTab === "pesee"} onClick={() => setActiveTab("pesee")} icon={Scale} label="Station Pesée" />
          <SidebarItem active={activeTab === "gallery"} onClick={() => setActiveTab("gallery")} icon={ImageIcon} label="Galerie" />
          <SidebarItem active={activeTab === "customers"} onClick={() => setActiveTab("customers")} icon={Users} label="Base Clientes" />
          <SidebarItem active={activeTab === "arrivages"} onClick={() => setActiveTab("arrivages")} icon={Globe} label="Arrivages (Logistique)" />
          <SidebarItem active={activeTab === "finances"} onClick={() => setActiveTab("finances")} icon={Euro} label="Trésorerie" />
        </nav>
        <button onClick={() => setShowConfig(true)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-[#8D7B68] transition-all bg-white/60 shadow-sm">
          <Settings2 size={18} /><span className="text-xs font-bold uppercase tracking-widest">Options</span>
        </button>
        <button onClick={() => signOut(auth)} className="w-full mt-2 py-2 text-[10px] uppercase font-bold text-gray-400 hover:text-red-400 transition-all">Déconnexion</button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 relative custom-scrollbar bg-[#FDFBF7] print:hidden">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto justify-between">
            <div className="flex items-center gap-2">
              <div className="md:hidden w-8 h-8 bg-[#8D7B68] rounded-xl flex items-center justify-center text-white shadow-sm">
                <Star size={16} />
              </div>
              <h2 className="text-lg md:text-2xl font-serif text-[#8D7B68] capitalize font-bold flex items-center gap-3">
                {activeTab}
                {activeTab === "orders" && lateDeliveries.length > 0 && (
                  <span className="bg-red-100 text-red-500 text-[10px] px-2 py-1 rounded-full font-black animate-pulse flex items-center gap-1">
                    <AlertTriangle size={12} /> {lateDeliveries.length} retard(s)
                  </span>
                )}
              </h2>
            </div>
            <div className="flex gap-2 md:hidden">
              <button onClick={() => setShowTariffs(true)} className="p-2.5 text-[#8D7B68] bg-white rounded-xl shadow-sm border border-[#E8D5C4]/30 hover:bg-[#FAF7F2]">
                <Truck size={16} />
              </button>
              <button onClick={() => setShowCalculator(true)} className="p-2.5 text-white bg-[#8D7B68] rounded-xl shadow-sm hover:scale-105 transition-transform">
                <Calculator size={16} />
              </button>
              <button onClick={() => setShowConfig(true)} className="p-2.5 text-[#8D7B68] bg-white rounded-xl shadow-sm border border-[#E8D5C4]/30">
                <Settings2 size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <button onClick={() => setShowTariffs(true)} className="hidden md:flex px-4 py-2.5 text-[#8D7B68] bg-white border border-[#E8D5C4]/50 rounded-full shadow-sm hover:-translate-y-1 transition-transform items-center gap-2 font-bold text-xs">
              <Truck size={14} /> Tarifs
            </button>
            <button onClick={() => setShowCalculator(true)} className="hidden md:flex px-4 py-2.5 text-white bg-[#8D7B68] rounded-full shadow-sm hover:-translate-y-1 transition-transform items-center gap-2 font-bold text-xs">
              <Calculator size={14} /> Simulateur
            </button>
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Recherche globale..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white rounded-full text-xs font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/40 focus:border-[#8D7B68]" />
            </div>
            <div className="flex gap-1 bg-white/80 p-1.5 rounded-xl shadow-sm border border-[#E8D5C4]/20 w-full md:w-auto justify-center">
              <select value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))} className="text-[10px] md:text-xs font-bold outline-none bg-transparent text-[#8D7B68]">
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
              <span className="text-gray-300">|</span>
              <select value={filterMonth} onChange={(e) => setFilterMonth(parseInt(e.target.value))} className="text-[10px] md:text-xs font-bold outline-none bg-transparent text-[#8D7B68]">
                {["Tous","Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"].map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 md:space-y-8 animate-in fade-in">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <StatCard label="Chiffre d'Affaires" value={formatDA(stats.totalRevenue)} subValue={`${stats.ordersCount} ventes`} color="#8D7B68" highlight icon={TrendingUp} />
              <StatCard label="Panier Moyen" value={formatDA(stats.averageOrderValue)} color="#D4B996" icon={Package} />
              <StatCard label="Marge Brute" value={formatDA(stats.totalBenefitBrut)} percentage={stats.brutMarginPercentage} color="#22C55E" icon={PieChart} />
              <StatCard label="Dépenses & Pubs" value={formatDA(stats.totalSponsors + stats.totalExpenses)} percentage={stats.expensesPercentage} invertColor={true} color="#EF4444" icon={Megaphone} />
              <StatCard label="Bénéfice Net" value={formatDA(stats.netBenefit)} percentage={stats.netMarginPercentage} color={stats.netBenefit > 0 ? "#22C55E" : "#EF4444"} highlight icon={DollarSign} />
            </div>

            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20 h-80">
              <h3 className="font-serif text-sm md:text-base text-[#8D7B68] mb-4 font-bold flex items-center gap-2">
                <TrendingUp size={16} /> Évolution Annuelle ({filterYear})
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#B8A99A" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#B8A99A" }} width={60} />
                  <RechartsTooltip formatter={(value) => [formatDA(value)]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="CA" stroke="#8D7B68" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Net" stroke="#22C55E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white/80 p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-sm md:text-lg text-[#8D7B68] flex items-center gap-2">
                    <Star size={16} className="text-[#D4B996]" /> Top Clientes
                  </h3>
                </div>
                <div className="space-y-2 md:space-y-4">
                  {stats.topClients.map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-3 md:p-4 bg-[#FAF7F2]/30 rounded-xl md:rounded-2xl border border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#E8D5C4] flex items-center justify-center text-[10px] font-bold text-white">{c.name[0]}</div>
                        <div>
                          <p className="text-[11px] md:text-xs font-bold text-[#4A3F35]">{c.name}</p>
                          <p className="text-[8px] text-[#B8A99A] uppercase font-black">{c.count} cmd</p>
                        </div>
                      </div>
                      <span className="text-[11px] md:text-xs font-black text-[#8D7B68]">{formatDA(c.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF7F2]/80 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/30 flex flex-col relative">
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="font-serif text-sm md:text-lg text-[#8D7B68] flex items-center gap-2">
                    <Edit3 size={16} className="text-[#D4B996]" /> Notes & Tâches
                  </h3>
                  <button onClick={handleSaveNote} className="px-3 py-1.5 bg-[#8D7B68] text-white rounded-lg text-[9px] font-bold uppercase shadow-sm hover:scale-105 transition-transform">Sauvegarder</button>
                </div>
                <textarea value={dashboardNote} onChange={(e) => setDashboardNote(e.target.value)} placeholder="Un rappel, une tâche urgente, une idée pour la boutique..." className="flex-1 w-full bg-transparent border-none outline-none resize-none text-xs md:text-sm text-[#6B5A4B] font-medium custom-scrollbar min-h-[120px]" />
              </div>

              <div className="bg-gradient-to-br from-white to-[#FAF7F2] p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/30 relative overflow-hidden group">
                <BrainCircuit size={80} className="absolute -right-5 -bottom-5 text-[#D4B996] opacity-10" />
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="font-serif text-sm md:text-lg text-[#8D7B68] flex items-center gap-2">
                    <Sparkles size={16} className="text-[#D4B996]" /> Analyse IA Experte
                  </h3>
                  <button onClick={handleAiAnalysis} disabled={aiLoading} className="px-3 py-1.5 md:px-4 md:py-2 bg-[#8D7B68] text-white rounded-lg md:rounded-full text-[9px] font-bold uppercase flex items-center gap-1 shadow-sm">
                    {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Analyser
                  </button>
                </div>
                <div className="min-h-[80px] md:min-h-[150px] text-[10px] md:text-xs leading-relaxed font-medium text-[#6B5A4B] relative z-10">
                  {aiAnalysis ? (
                    <div className="bg-white/90 p-4 rounded-xl shadow-sm border border-[#E8D5C4]">{aiAnalysis}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                      <Lightbulb size={24} className="mb-2" />
                      <p>Cliquez pour générer des conseils basés sur vos vrais chiffres.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-3 md:space-y-6 animate-in slide-in-from-bottom-4">
            
            {/* BARRE DE RECHERCHE ET FILTRES */}
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Recherche Globale */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A99A]" />
                <input type="text" placeholder="Chercher (nom, article)..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="w-full pl-12 pr-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30" />
              </div>

              {/* NOUVEAU : Champ dédié au Numéro de Commande */}
              <div className="relative w-full md:w-36 shrink-0">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A99A] font-black text-[10px] uppercase">N°</span>
                <input 
                  type="text" 
                  placeholder="Ex: 2604-001" 
                  value={orderNumberFilter} 
                  onChange={(e) => setOrderNumberFilter(e.target.value)} 
                  className="w-full pl-9 pr-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30" 
                />
              </div>
              
              {/* FILTRE PAR STATUT (existant) */}
              <div className="relative w-full md:w-56 shrink-0">
                <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A99A]" />
                <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="w-full pl-12 pr-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30 appearance-none">
                  <option value="">Tous les statuts</option>
                  {orderStatusesList.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              {/* TRI PAR ORDRE */}
              <div className="relative w-full md:w-56 shrink-0">
                <select 
                  value={orderSortBy} 
                  onChange={(e) => setOrderSortBy(e.target.value)} 
                  className="w-full px-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30 appearance-none"
                >
                  <option value="dateDesc">📅 Plus récentes d'abord</option>
                  <option value="dateAsc">📅 Plus anciennes d'abord</option>
                  <option value="priceDesc">💰 Montant: + Élevé</option>
                  <option value="priceAsc">💰 Montant: + Bas</option>
                  <option value="resteDesc">⚠️ Reste à payer</option>
                </select>
              </div>

              {/* Les boutons Export et Nouvelle Vente restent ici... */}
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={exportCSV} className="px-4 py-2.5 rounded-full text-[#8D7B68] bg-white border border-[#E8D5C4] text-sm font-bold shadow-sm hover:-translate-y-1 transition-all flex items-center gap-2">
                  <Download size={16} /><span className="hidden md:inline">Export</span>
                </button>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    const prefix = `${today.slice(2, 4)}${today.slice(5, 7)}-`;
                    const monthOrders = orders.filter((o) => o.orderNumber?.startsWith(prefix));
                    const nextNum = monthOrders.length === 0 ? 1 : Math.max(...monthOrders.map((o) => parseInt(o.orderNumber.split("-")[1]) || 0)) + 1;
                    setOrderNumber(`${prefix}${String(nextNum).padStart(3, "0")}`);
                    setOrderDate(today);
                    setOrderItems([{ id: Date.now(), name: "", category: "", size: "", color: "", weightG: 0, priceAchatEuro: 0, priceVente: 0, arrivageId: "", status: "A commander" }]);
                    setOrderPayments([]);
                    setShippingNational(0);
                    setOrderStatus("A commander");
                    setOrderDiscount(0);
                    setOrderRefundAmount(0);
                    setOrderReceiptImage("");
                    setShowAddOrder(true);
                    setEditingOrder(null);
                  }}
                  className="flex-1 md:w-auto px-6 py-4 md:py-2.5 rounded-2xl md:rounded-full text-white bg-[#8D7B68] text-sm font-bold shadow-md hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
                >
                  <Plus size={16} /> Nouvelle Vente
                </button>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block relative">
              
              {/* BARRE D'ACTIONS GROUPÉES */}
              {selectedOrders.length > 0 && (
                <div className="bg-[#8D7B68] p-3 rounded-2xl mb-4 flex items-center justify-between gap-3 animate-in slide-in-from-top-2 shadow-lg text-white absolute -top-16 left-0 right-0 z-20">
                  <span className="text-xs font-bold pl-4">{selectedOrders.length} commande(s) sélectionnée(s)</span>
                  <div className="flex gap-2">
                    <select 
                      onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                      className="w-48 px-3 py-2 rounded-xl text-xs font-bold text-[#8D7B68] outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Changer le statut en...</option>
                      {orderStatusesList.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <button onClick={() => setSelectedOrders([])} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"><X size={16} /></button>
                  </div>
                </div>
              )}

              <div className="bg-white/80 rounded-[2rem] shadow-sm overflow-auto max-h-[65vh] custom-scrollbar border border-[#E8D5C4]/30 relative">
                <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                  <thead className="bg-[#FAF7F2] border-b border-[#E8D5C4]/20 text-[#B8A99A] font-bold uppercase tracking-widest text-[9px] sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="p-4 w-10">
                        <input type="checkbox" onChange={(e) => setSelectedOrders(e.target.checked ? filteredOrders.map(o => o.id) : [])} checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} className="w-4 h-4 cursor-pointer accent-[#8D7B68] rounded" />
                      </th>
                      <th className="p-4">N°</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4 text-center">État</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-right">Reste</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[11px]">
                    {filteredOrders.map((o) => {
                      const total = (parseFloat(o.totalVente) || 0) + (parseFloat(o.shippingNational) || 0);
                      const reste = calculateReste(o);
                      const isLate = o.status === "En cours de livraison" && lateDeliveries.find((late) => late.id === o.id);
                      const isSelected = selectedOrders.includes(o.id);
                      
                      // CODE COULEUR INTELLIGENT
                      let resteColor = "text-green-500";
                      if (reste > 0) {
                        if (o.status.includes("Livrée")) resteColor = "text-red-500 font-black animate-pulse"; // Urgence !
                        else resteColor = "text-orange-500"; // En attente
                      }

                      return (
                        <tr key={o.id} className={`group transition-colors ${isLate ? "bg-red-50/40 hover:bg-red-50/60" : isSelected ? "bg-[#FAF7F2] border-l-4 border-l-[#D4B996]" : "hover:bg-[#FAF7F2]/50 border-l-4 border-l-transparent"}`}>
                          <td className="p-4">
                            <input type="checkbox" checked={isSelected} onChange={(e) => { if(e.target.checked) setSelectedOrders([...selectedOrders, o.id]); else setSelectedOrders(selectedOrders.filter(id => id !== o.id)); }} className="w-4 h-4 cursor-pointer accent-[#8D7B68] rounded" />
                          </td>
                          <td className="p-4 font-bold text-[#8D7B68]">
                            {o.orderNumber}
                            {isLate && <AlertTriangle size={12} className="inline ml-2 text-red-500 animate-pulse" title="En livraison depuis +7 jours" />}
                          </td>
                          <td className="p-4 font-medium text-[#4A3F35]">
                            <div className="flex items-center gap-2">
                              {o.customerName}
                              <button onClick={() => handleCopyCustomerInfo(o)} title="Copier les infos pour le livreur" className="text-gray-300 hover:text-[#8D7B68] transition-colors"><Copy size={14}/></button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className={`px-2 py-1 bg-white rounded-md text-[9px] uppercase font-bold shadow-sm border outline-none cursor-pointer hover:bg-gray-50 transition-colors appearance-none text-center ${isLate ? "border-red-300 text-red-500" : "border-gray-200 text-[#8D7B68]"}`}
                            >
                              {orderStatusesList.map((st) => <option key={st} value={st}>{st}</option>)}
                            </select>
                          </td>
                          <td className="p-4 text-right font-black text-[#8D7B68]">{formatDA(total)}</td>
                          <td className="p-4">
                            <div className={`flex items-center justify-end gap-2 font-black ${resteColor}`}>
                              {reste > 0 ? (
                                <>
                                  {formatDA(reste)}
                                  <button onClick={() => handleQuickPayment(o)} title="Encaissement rapide" className="p-1 bg-white border border-[#E8D5C4] rounded text-[#8D7B68] hover:bg-[#8D7B68] hover:text-white transition-colors shadow-sm"><Plus size={12} /></button>
                                </>
                              ) : "Réglé"}
                            </div>
                          </td>
                          <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => setShowCostBreakdown(o)} className="text-blue-400 p-1.5 hover:bg-blue-50 rounded-lg"><Calculator size={16} /></button>
                            <button onClick={() => setShowDeliverySlip(o)} className="text-[#8D7B68] p-1.5 hover:bg-[#FAF7F2] rounded-lg"><Truck size={16} /></button>
                            <button onClick={() => setShowReceipt(o)} className="text-[#D4B996] p-1.5 hover:bg-[#FAF7F2] rounded-lg"><Receipt size={16} /></button>
                            <button onClick={() => openOrderForEdit(o)} className="text-gray-400 p-1.5 hover:bg-gray-100 rounded-lg"><Edit3 size={16} /></button>
                            <button onClick={() => setDeleteTarget({ id: o.id, collection: "orders", label: o.orderNumber })} className="text-red-300 p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 touch-pan-y relative">
              
              {/* BARRE D'ACTIONS GROUPÉES MOBILE */}
              {selectedOrders.length > 0 && (
                <div className="sticky top-0 z-20 bg-[#8D7B68] p-3 rounded-2xl mb-2 flex items-center justify-between gap-2 shadow-lg text-white">
                  <span className="text-[10px] font-bold pl-1">{selectedOrders.length} sélectionnées</span>
                  <select onChange={(e) => handleBulkStatusUpdate(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-[#8D7B68] outline-none" defaultValue="">
                    <option value="" disabled>Statut...</option>
                    {orderStatusesList.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <button onClick={() => setSelectedOrders([])} className="p-1.5 bg-white/20 rounded-lg"><X size={14} /></button>
                </div>
              )}

              {filteredOrders.map((o) => {
                const total = (parseFloat(o.totalVente) || 0) + (parseFloat(o.shippingNational) || 0);
                const reste = calculateReste(o);
                const isLate = o.status === "En cours de livraison" && lateDeliveries.find((late) => late.id === o.id);
                const isSelected = selectedOrders.includes(o.id);
                
                let resteColor = "text-green-500";
                if (reste > 0) {
                  if (o.status.includes("Livrée")) resteColor = "text-red-500 font-black animate-pulse";
                  else resteColor = "text-orange-500";
                }

                return (
                  <div key={o.id} className={`p-4 rounded-2xl shadow-sm border flex flex-col gap-3 ${isLate ? "bg-red-50/40 border-red-200" : isSelected ? "bg-[#FAF7F2] border-[#D4B996] ring-1 ring-[#D4B996]" : "bg-white border-[#E8D5C4]/30"}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <input type="checkbox" checked={isSelected} onChange={(e) => { if(e.target.checked) setSelectedOrders([...selectedOrders, o.id]); else setSelectedOrders(selectedOrders.filter(id => id !== o.id)); }} className="w-4 h-4 mt-1 cursor-pointer accent-[#8D7B68] rounded" />
                        <div>
                          <span className="text-[10px] text-[#B8A99A] font-bold uppercase">{o.orderNumber} {isLate && <AlertTriangle size={12} className="inline ml-1 text-red-500" />}</span>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[#4A3F35] text-sm">{o.customerName}</h4>
                            <button onClick={() => handleCopyCustomerInfo(o)} className="text-gray-300 hover:text-[#8D7B68]"><Copy size={12}/></button>
                          </div>
                        </div>
                      </div>
                      <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)} className="px-2 py-1 bg-white rounded-lg text-[9px] uppercase font-bold text-[#8D7B68] border border-[#E8D5C4]/50 shadow-sm outline-none cursor-pointer text-right appearance-none" style={{ direction: "rtl" }}>
                        {orderStatusesList.map((st) => <option key={st} value={st} style={{ direction: "ltr" }}>{st}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-between items-center bg-[#FAF7F2]/50 p-2.5 rounded-xl border border-transparent">
                      <div><p className="text-[8px] uppercase text-gray-400 font-bold">Total</p><p className="font-black text-[#8D7B68] text-xs">{formatDA(total)}</p></div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase text-gray-400 font-bold">Reste</p>
                        <div className={`flex items-center justify-end gap-1 font-black text-xs ${resteColor}`}>
                          {reste > 0 ? (
                            <>
                              {formatDA(reste)}
                              <button onClick={() => handleQuickPayment(o)} className="p-1 bg-white border border-[#E8D5C4] rounded text-[#8D7B68] shadow-sm"><Plus size={10} /></button>
                            </>
                          ) : "Payé"}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex gap-1">
                        <button onClick={() => setShowCostBreakdown(o)} className="text-blue-400 p-1.5"><Calculator size={16} /></button>
                        <button onClick={() => setShowDeliverySlip(o)} className="text-[#8D7B68] p-1.5"><Truck size={16} /></button>
                        <button onClick={() => setShowReceipt(o)} className="text-[#D4B996] p-1.5"><Receipt size={16} /></button>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openOrderForEdit(o)} className="text-gray-400 p-1.5"><Edit3 size={16} /></button>
                        <button onClick={() => setDeleteTarget({ id: o.id, collection: "orders", label: o.orderNumber })} className="text-red-300 p-1.5"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
{/* ONGLET STATION DE PESÉE */}
        {activeTab === "pesee" && (
          <StationDePesee 
            orders={orders} 
            arrivages={arrivages} 
            showToast={showToast}
            onNewArrivage={() => {
              const today = new Date().toISOString().split("T")[0];
              const prefix = `A${today.slice(2, 4)}${today.slice(5, 7)}-`;
              const monthArrivages = arrivages.filter((a) => a.number?.startsWith(prefix));
              const nextNum = monthArrivages.length === 0 ? 1 : Math.max(...monthArrivages.map((a) => parseInt(a.number.split("-")[1]) || 0)) + 1;
              setArrivageNumber(`${prefix}${String(nextNum).padStart(2, "0")}`);
              setArrivageDate(today);
              setEditingArrivage(null);
              setShowAddArrivage(true);
            }}
          />
        )}
        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4">
            
            {/* EN-TÊTE AVEC RECHERCHE ET BOUTONS DE SÉLECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FAF7F2]/80 p-4 rounded-2xl md:rounded-[2rem] border border-[#E8D5C4]/30 shadow-sm">
               <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="p-2 bg-white rounded-full shadow-sm shrink-0">
                   <ImageIcon size={18} className="text-[#8D7B68]" />
                 </div>
                 <h3 className="font-serif font-bold text-[#8D7B68] text-sm md:text-base tracking-widest uppercase">Galerie Visuelle</h3>
                 <span className="text-[10px] md:text-xs font-black text-[#B8A99A] uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm ml-auto md:ml-0">
                   {filteredGalleryItems.length} article(s)
                 </span>
               </div>
               
               <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                 
                 {/* --- BOUTONS MODE SÉLECTION --- */}
                 {isGallerySelectionMode ? (
                   <div className="flex gap-2 w-full md:w-auto">
                     <button
                       onClick={handleDeleteSelectedImages}
                       disabled={selectedGalleryItems.length === 0}
                       className="flex-1 md:flex-none px-4 py-2.5 bg-red-400 text-white rounded-full text-xs font-bold shadow-sm disabled:opacity-50 hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                     >
                       <Trash2 size={14} /> Supprimer ({selectedGalleryItems.length})
                     </button>
                     <button
                       onClick={() => {
                         setIsGallerySelectionMode(false);
                         setSelectedGalleryItems([]);
                       }}
                       className="flex-1 md:flex-none px-4 py-2.5 bg-white text-[#8D7B68] border border-[#E8D5C4]/50 rounded-full text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors"
                     >
                       Annuler
                     </button>
                   </div>
                 ) : (
                   <button
                     onClick={() => setIsGallerySelectionMode(true)}
                     className="w-full md:w-auto px-4 py-2.5 bg-white text-[#8D7B68] border border-[#E8D5C4]/50 rounded-full text-xs font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-[#FAF7F2] transition-colors"
                   >
                     <Edit3 size={14} /> Sélectionner
                   </button>
                 )}

                 <div className="relative w-full md:w-72">
                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A99A]" />
                   <input 
                     type="text" 
                     placeholder="Chercher cliente, article, N°..." 
                     value={gallerySearch} 
                     onChange={(e) => setGallerySearch(e.target.value)} 
                     className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full text-xs font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/40 focus:border-[#D4B996]" 
                   />
                 </div>
               </div>
            </div>

            {filteredGalleryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <ImageIcon size={48} className="text-[#D4B996] mb-4" />
                <p className="text-sm font-bold text-[#8D7B68]">
                  {gallerySearch ? "Aucun résultat pour cette recherche." : "Aucune photo pour ce mois."}
                </p>
                {!gallerySearch && <p className="text-xs text-[#B8A99A] mt-1">Ajoute des photos aux articles dans tes commandes.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 pb-4">
                {filteredGalleryItems.map((item, idx) => {
                  const isSelected = selectedGalleryItems.some(s => s.itemId === item.id && s.orderId === item.orderId);
                  
                  return (
                    <div 
                      key={`${item.id}-${idx}`} 
                      onClick={() => {
                        if (isGallerySelectionMode) {
                          if (isSelected) {
                            setSelectedGalleryItems(prev => prev.filter(s => !(s.itemId === item.id && s.orderId === item.orderId)));
                          } else {
                            setSelectedGalleryItems(prev => [...prev, { itemId: item.id, orderId: item.orderId }]);
                          }
                        } else {
                          openOrderForEdit(item.orderObj);
                        }
                      }}
                      className={`bg-white rounded-2xl p-2 border shadow-sm transition-all cursor-pointer group flex flex-col ${
                        isGallerySelectionMode && isSelected 
                          ? "border-red-400 bg-red-50/30 scale-95 ring-2 ring-red-400" 
                          : "border-[#E8D5C4]/30 hover:shadow-md hover:-translate-y-1"
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-2 relative bg-[#FAF7F2]/50">
                        <img 
                          src={item.itemImage} 
                          alt={item.name} 
                          className={`w-full h-full object-cover transition-transform duration-500 ${!isGallerySelectionMode && "group-hover:scale-105"} ${isSelected && "opacity-60 grayscale-[50%]"}`}
                          loading="lazy"
                        />
                        
                        {/* Indicateur de sélection ou Statut */}
                        {isGallerySelectionMode ? (
                          <div className={`absolute top-2 right-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors bg-white/90 shadow-sm z-10 ${isSelected ? "border-red-400" : "border-gray-300"}`}>
                            {isSelected && <div className="w-3 h-3 bg-red-400 rounded-sm" />}
                          </div>
                        ) : (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm shadow-sm border border-white/50 text-[8px] font-black uppercase tracking-wider text-[#8D7B68]">
                            {item.status}
                          </div>
                        )}
                      </div>
                      
                      <div className="px-1 flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-[#8D7B68]">{item.orderNumber}</span>
                        <span className="text-[11px] font-bold text-[#4A3F35] truncate w-full" title={item.customerName}>
                          {item.customerName}
                        </span>
                        <span className="text-[9px] text-[#B8A99A] font-medium truncate w-full mt-1" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" placeholder="Rechercher (nom, tél)..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} className="w-full md:flex-1 px-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30" />
              <button onClick={() => { setEditingCustomer(null); setShowAddCustomer(true); }} className="w-full md:w-auto px-6 py-4 md:py-2.5 rounded-2xl md:rounded-full text-white bg-[#8D7B68] text-sm font-bold shadow-md flex justify-center items-center gap-2">
                <Plus size={16} className="md:hidden" /> Nouvelle Cliente
              </button>
            </div>
            <div className="flex overflow-x-auto gap-2 md:gap-3 pb-2 md:pb-0 custom-scrollbar md:p-4 md:bg-white/60 md:rounded-[1.5rem] md:shadow-sm md:border md:border-[#E8D5C4]/30">
              <select value={filterWilaya} onChange={(e) => { setFilterWilaya(e.target.value); setFilterCommune(""); setFilterStopdesk(""); }} className="shrink-0 min-w-[110px] px-3 py-2.5 md:py-2 bg-white rounded-xl text-[10px] md:text-[11px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 shadow-sm outline-none">
                <option value="">Wilayas</option>
                {[...new Set(customers.map((c) => c.wilaya))].filter(Boolean).sort().map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {filterWilaya && (
                <select value={filterCommune} onChange={(e) => setFilterCommune(e.target.value)} className="shrink-0 min-w-[110px] px-3 py-2.5 md:py-2 bg-white rounded-xl text-[10px] md:text-[11px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 shadow-sm outline-none">
                  <option value="">Communes</option>
                  {[...new Set(customers.filter((c) => c.wilaya === filterWilaya).map((c) => c.commune))].filter(Boolean).sort().map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              <select value={filterDelivery} onChange={(e) => { setFilterDelivery(e.target.value); setFilterStopdesk(""); }} className="shrink-0 min-w-[110px] px-3 py-2.5 md:py-2 bg-white rounded-xl text-[10px] md:text-[11px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 shadow-sm outline-none">
                <option value="">Mode Liv.</option>
                <option value="domicile">Domicile</option>
                <option value="stopdesk">Stopdesk</option>
              </select>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {customers.filter((c) => {
                const searchStr = (globalSearch || customerSearch).toLowerCase();
                return (c.name.toLowerCase().includes(searchStr) || c.phone.includes(searchStr) || (c.profileName && c.profileName.toLowerCase().includes(searchStr))) &&
                  (!filterWilaya || c.wilaya === filterWilaya) &&
                  (!filterCommune || c.commune === filterCommune) &&
                  (!filterDelivery || c.deliveryMode === filterDelivery) &&
                  (!filterStopdesk || c.stopdeskName === filterStopdesk);
              }).map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8D5C4]/30 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
  <PlatformIcon type={c.platform} size={14} />
  <div className="flex flex-col">
    <span className="font-bold text-[#8D7B68] text-sm leading-tight">{c.name}</span>
    {c.profileName && <span className="text-[10px] text-[#B8A99A] font-medium">{c.profileName}</span>}
  </div>
</div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowCustomerHistory(c)} className="text-blue-400 p-1.5 bg-blue-50 rounded-lg"><Clock size={14} /></button>
                      <button onClick={() => { setEditingCustomer(c); setShowAddCustomer(true); }} className="text-[#D4B996] p-1.5 bg-gray-50 rounded-lg"><Edit3 size={14} /></button>
                      <button onClick={() => setDeleteTarget({ id: c.id, collection: "customers", label: c.name })} className="text-red-300 p-1.5 bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#4A3F35] font-medium"><Phone size={10} className="text-[#D4B996]" /> {c.phone}</div>
                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-gray-50 text-gray-500">
                    <span>{c.wilaya}</span>
                    <div className="flex items-center gap-2">
                      {c.walletDA > 0 && <span className="text-green-600 font-black px-2 py-0.5 bg-green-50 rounded-md border border-green-100">💰 {formatDA(c.walletDA)}</span>}
                      <span className="font-bold text-[#8D7B68]">{c.deliveryMode === "domicile" ? "Domicile" : "Stopdesk"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white/80 rounded-[2rem] shadow-sm overflow-x-auto border border-[#E8D5C4]/30">
              <table className="w-full text-xs text-left min-w-[600px]">
                <thead className="bg-[#FAF7F2]/50 border-b border-[#E8D5C4]/20 text-[#B8A99A] font-bold uppercase tracking-widest text-[9px]">
                  <tr>
                    <th className="p-5">Cliente</th>
                    <th className="p-5">Contact</th>
                    <th className="p-5">Livraison</th>
                    <th className="p-5">Portefeuille</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.filter((c) => {
                    const searchStr = (globalSearch || customerSearch).toLowerCase();
                    return (c.name.toLowerCase().includes(searchStr) || c.phone.includes(searchStr) || (c.profileName && c.profileName.toLowerCase().includes(searchStr))) &&
                      (!filterWilaya || c.wilaya === filterWilaya) &&
                      (!filterCommune || c.commune === filterCommune) &&
                      (!filterDelivery || c.deliveryMode === filterDelivery) &&
                      (!filterStopdesk || c.stopdeskName === filterStopdesk);
                  }).map((c) => (
                    <tr key={c.id} className="group hover:bg-[#FAF7F2]/50">
                      <td className="p-5">
  <div className="flex items-center gap-3">
    <PlatformIcon type={c.platform} size={16} />
    <div className="flex flex-col">
      <span className="font-bold text-[#8D7B68] text-sm leading-tight">{c.name}</span>
      {c.profileName && <span className="text-[10px] text-[#B8A99A] font-medium">{c.profileName}</span>}
    </div>
  </div>
</td>
                      <td className="p-5 space-y-1"><div className="flex items-center gap-2 text-[#4A3F35] font-medium"><Phone size={12} className="text-[#D4B996]" /> {c.phone}</div></td>
                      <td className="p-5 space-y-1">
                        <div className="flex items-center gap-2 text-[#4A3F35] font-medium">
                          {c.deliveryMode === "domicile" ? <><Home size={12} className="text-[#D4B996]" /> Domicile</> : <><Store size={12} className="text-[#D4B996]" /> {c.stopdeskName || "Stopdesk"}</>}
                        </div>
                        <div className="text-[10px] text-gray-500 pl-5">{c.wilaya} - {c.commune}</div>
                      </td>
                      <td className="p-5">
                        {c.walletDA > 0 ? <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[10px] font-black">{formatDA(c.walletDA)}</span> : <span className="text-gray-300 text-[10px] font-bold">0 DA</span>}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setShowCustomerHistory(c)} className="text-blue-300 hover:text-blue-500 hover:scale-110" title="Historique"><Clock size={16} /></button>
                          <button onClick={() => { setEditingCustomer(c); setShowAddCustomer(true); }} className="text-[#D4B996] hover:scale-110"><Edit3 size={16} /></button>
                          <button onClick={() => setDeleteTarget({ id: c.id, collection: "customers", label: c.name })} className="text-red-200 hover:text-red-400 hover:scale-110"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ARRIVAGES TAB */}
        {activeTab === "arrivages" && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl md:rounded-[2rem] border border-[#E8D5C4]/30 shadow-sm flex justify-between items-center mb-4">
              <span className="text-[10px] md:text-xs uppercase font-bold text-[#B8A99A] tracking-widest">Poids Total Facturé {filterMonth !== 0 && `(Mois ${filterMonth})`}</span>
              <span className="text-lg md:text-xl font-black text-[#8D7B68]">{totalWeightFilteredArrivages.toFixed(2)} kg</span>
            </div>
            <button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                const prefix = `A${today.slice(2, 4)}${today.slice(5, 7)}-`;
                const monthArrivages = arrivages.filter((a) => a.number?.startsWith(prefix));
                const nextNum = monthArrivages.length === 0 ? 1 : Math.max(...monthArrivages.map((a) => parseInt(a.number.split("-")[1]) || 0)) + 1;
                setArrivageNumber(`${prefix}${String(nextNum).padStart(2, "0")}`);
                setArrivageDate(today);
                setEditingArrivage(null);
                setShowAddArrivage(true);
              }}
              className="w-full md:w-auto px-6 py-4 md:py-2.5 rounded-2xl md:rounded-full text-white bg-[#8D7B68] text-sm font-bold shadow-md flex justify-center items-center gap-2 mb-2 md:mb-4"
            >
              <Plus size={16} className="md:hidden" /> Nouveau Dossier
            </button>
            {filteredArrivages.map((arr) => {
              const arrStats = getArrivageStats(arr.id);
              const calculatedWeight = getCalculatedWeightForArrivage(arr.id);
              return (
                <div key={arr.id} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 shadow-sm border border-[#E8D5C4]/30">
                  <div className="flex justify-between w-full md:w-auto items-center">
                    <div>
                      <h4 className="font-serif font-bold text-[#8D7B68] text-base md:text-lg">#{arr.number}</h4>
                      <p className="text-[9px] md:text-[10px] text-[#B8A99A] uppercase font-bold">{arr.date}</p>
                    </div>
                    <div className="flex gap-2 md:hidden">
                      <button onClick={() => { setEditingArrivage(arr); setArrivageNumber(arr.number); setArrivageDate(arr.date || new Date().toISOString().split("T")[0]); setShowAddArrivage(true); }} className="text-[#D4B996] p-2 bg-gray-50 rounded-lg"><Edit3 size={14} /></button>
                      <button onClick={() => setDeleteTarget({ id: arr.id, collection: "arrivages", label: `Arrivage #${arr.number}` })} className="text-red-300 p-2 bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex w-full md:w-auto justify-between md:justify-end items-center gap-2 md:gap-8 pt-3 md:pt-0 border-t md:border-none border-gray-100">
                    <div className="text-left md:text-right flex-1 md:flex-none">
                      <p className="text-[8px] text-gray-400 uppercase font-bold mb-1">Poids (Facturé | Articles)</p>
                      <div className="font-bold text-[#4A3F35] text-xs md:text-sm bg-gray-50 px-2 md:px-3 py-1 rounded-lg border border-gray-100 text-center flex items-center justify-center md:justify-end gap-2">
                        <span>{parseFloat(arr.totalWeightKg || 0).toFixed(2)} kg</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[#8D7B68]">{calculatedWeight.toFixed(2)} kg</span>
                      </div>
                    </div>
                    <div className="text-left md:text-right flex-1 md:flex-none">
                      <p className="text-[8px] text-[#D4B996] uppercase font-bold mb-1">Coût Kilo</p>
                      <div className="font-bold text-[#8D7B68] text-xs md:text-sm bg-[#FAF7F2] px-2 md:px-3 py-1 rounded-lg border border-[#E8D5C4]/30 text-center md:text-right">{parseFloat(arrStats.rate).toFixed(2)} DA/Kg</div>
                    </div>
                    <div className="hidden md:flex gap-2">
                      <button onClick={() => { setEditingArrivage(arr); setArrivageNumber(arr.number); setArrivageDate(arr.date || new Date().toISOString().split("T")[0]); setShowAddArrivage(true); }} className="text-[#D4B996] p-2 hover:scale-110 transition-transform"><Edit3 size={18} /></button>
                      <button onClick={() => setDeleteTarget({ id: arr.id, collection: "arrivages", label: `Arrivage #${arr.number}` })} className="text-red-200 hover:text-red-400 hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FINANCES TAB */}
        {activeTab === "finances" && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="font-serif text-[#8D7B68] text-sm md:text-lg font-bold flex items-center gap-2"><Megaphone size={16} className="text-[#D4B996]" /> Sponsors</h3>
                  <button onClick={() => setShowAddSponsor(true)} className="p-2 md:p-2.5 bg-[#8D7B68] text-white rounded-xl md:rounded-full shadow-sm"><Plus size={14} /></button>
                </div>
                <div className="max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-orange-50/50 text-[#B8A99A] font-bold uppercase sticky top-0 text-[9px] md:text-xs">
                      <tr><th className="p-3">Date</th><th className="p-3 text-right">Euro</th><th className="p-3 text-right">DA</th><th className="p-3 text-right"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {sponsors.filter((s) => { const d = new Date(s.date); return d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth); }).sort((a, b) => new Date(a.date) - new Date(b.date)).map((s) => (
                        <tr key={s.id}>
                          <td className="p-3 font-bold text-gray-400">{s.date}</td>
                          <td className="p-3 text-right font-bold text-orange-400">{parseFloat(s.amountEur).toFixed(2)} €</td>
                          <td className="p-3 text-right font-black text-[#8D7B68]">{formatDA(s.amountDA)}</td>
                          <td className="p-3 text-right"><button onClick={() => setDeleteTarget({ id: s.id, collection: "sponsors", label: "Sponsor" })} className="text-red-300 md:text-red-200 md:hover:text-red-400"><Trash2 size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="font-serif text-[#8D7B68] text-sm md:text-lg font-bold flex items-center gap-2"><Receipt size={16} className="text-red-300" /> Frais Divers</h3>
                  <button onClick={() => setShowAddExpense(true)} className="p-2 md:p-2.5 bg-red-400 text-white rounded-xl md:rounded-full shadow-sm"><Plus size={14} /></button>
                </div>
                <div className="space-y-2 md:space-y-3 max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  {expenses.filter((e) => { const d = new Date(e.date); return d.getFullYear() === filterYear && (filterMonth === 0 || d.getMonth() + 1 === filterMonth); }).map((e) => (
                    <div key={e.id} className="flex justify-between p-3 md:p-4 bg-red-50/30 rounded-xl border border-red-50">
                      <div><p className="text-[10px] font-black uppercase text-red-400">{e.label}</p><p className="text-[8px] text-gray-400 font-bold">{e.date}</p></div>
                      <div className="flex gap-3 md:gap-4 items-center">
                        <p className="font-black text-[#8D7B68] text-xs md:text-sm">{formatDA(e.amountDA)}</p>
                        <button onClick={() => setDeleteTarget({ id: e.id, collection: "expenses", label: e.label })} className="text-red-300 md:text-red-200 md:hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20 md:col-span-2">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="font-serif text-[#8D7B68] text-sm md:text-lg font-bold flex items-center gap-2"><Euro size={16} className="text-[#D4B996]" /> Taux Euro</h3>
                  <button onClick={() => setShowAddRate(true)} className="p-2 md:p-2.5 bg-[#D4B996] text-white rounded-xl md:rounded-full shadow-sm"><Plus size={14} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {currencyRates.sort((a, b) => new Date(b.date) - new Date(a.date)).map((r) => (
                    <div key={r.id} className="flex justify-between items-center p-3 bg-[#FAF7F2]/50 rounded-xl border border-[#E8D5C4]/20">
                      <span className="text-[10px] md:text-xs font-bold text-[#B8A99A] uppercase">{r.date}</span>
                      <div className="flex items-center gap-3 md:gap-4 font-black text-[#8D7B68] text-sm">
                        {parseFloat(r.rate).toFixed(2)} DA
                        <button onClick={() => setDeleteTarget({ id: r.id, collection: "currencyRates", label: "Taux" })} className="text-red-300 md:text-red-200"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#E8D5C4]/50 flex justify-around items-center px-2 pt-2 pb-[max(16px,env(safe-area-inset-bottom))] z-[900] shadow-[0_-10px_40px_rgba(141,123,104,0.1)] print:hidden">
        {[
          { tab: "dashboard", icon: LayoutDashboard, label: "Bord" },
          { tab: "orders", icon: Package, label: "Ventes" },
          { tab: "pesee", icon: Scale, label: "Pesée" },
          { tab: "gallery", icon: ImageIcon, label: "Galerie" }, 
          { tab: "customers", icon: Users, label: "Clientes" },
          { tab: "arrivages", icon: Globe, label: "Arrivages" },
          { tab: "finances", icon: Euro, label: "Tréso" },
        ].map(({ tab, icon: Icon, label }) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === tab ? "text-[#8D7B68]" : "text-[#B8A99A]"}`}>
            <Icon size={20} />
            {tab === "orders" && lateDeliveries.length > 0 && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
            <span className="text-[8px] font-bold">{label}</span>
          </button>
        ))}
      </nav>

      {/* MODALS */}
      {showAddCustomer && (
        <CustomerModal
          editingCustomer={editingCustomer}
          handleSaveCustomer={handleSaveCustomer}
          onClose={() => { setShowAddCustomer(false); setEditingCustomer(null); }}
        />
      )}
      {showAddOrder && (
        <OrderModal
          editingOrder={editingOrder}
          customers={customers}
          orders={orders}
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          orderPayments={orderPayments}
          setOrderPayments={setOrderPayments}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          orderDate={orderDate}
          setOrderDate={setOrderDate}
          orderNumber={orderNumber}
          setOrderNumber={setOrderNumber}
          config={config}
          arrivages={arrivages}
          handleSaveOrder={handleSaveOrder}
          formatDA={formatDA}
          calculateTotals={calculateTotals}
          shippingNational={shippingNational}
          setShippingNational={setShippingNational}
          orderDiscount={orderDiscount}
          setOrderDiscount={setOrderDiscount}
          orderRefundAmount={orderRefundAmount}
          setOrderRefundAmount={setOrderRefundAmount}
          orderReceiptImage={orderReceiptImage}
          setOrderReceiptImage={setOrderReceiptImage} 
          onClose={() => { setShowAddOrder(false); setEditingOrder(null); }}
        />
      )}
      {showAddArrivage && (
        <ArrivageModal
          editingArrivage={editingArrivage}
          arrivageNumber={arrivageNumber}
          setArrivageNumber={setArrivageNumber}
          arrivageDate={arrivageDate}
          setArrivageDate={setArrivageDate}
          handleSaveArrivage={handleSaveArrivage}
          onClose={() => { setShowAddArrivage(false); setEditingArrivage(null); }}
        />
      )}
      {showCostBreakdown && <CostBreakdownModal order={showCostBreakdown} onClose={() => setShowCostBreakdown(null)} formatDA={formatDA} calculateTotals={calculateTotals} />}
      {showReceipt && <ReceiptModal order={showReceipt} onClose={() => setShowReceipt(null)} formatDA={formatDA} />}
      {showDeliverySlip && <DeliverySlipModal order={showDeliverySlip} customers={customers} onClose={() => setShowDeliverySlip(null)} formatDA={formatDA} />}
      {showCustomerHistory && (
        <CustomerHistoryModal
          customer={showCustomerHistory}
          orders={orders}
          formatDA={formatDA}
          onClose={() => setShowCustomerHistory(null)}
          onOpenOrder={(o) => { setShowCustomerHistory(null); openOrderForEdit(o); }}
        />
      )}
      {showCalculator && <PriceCalculatorModal onClose={() => setShowCalculator(false)} currencyRates={currencyRates} formatDA={formatDA} />}
      {showTariffs && <DeliveryTariffModal onClose={() => setShowTariffs(false)} formatDA={formatDA} />} 

      {showAddSponsor && (
        <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-sm rounded-t-[2rem] md:rounded-[2rem] p-6 pb-10 md:pb-6 shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95">
            <ModalHeader title="Sponsor" onClose={() => setShowAddSponsor(false)} />
            <form onSubmit={handleSaveSponsor} className="space-y-4">
              <input name="amountEur" type="number" step="0.01" required autoFocus placeholder="Montant en Euro" className="w-full p-4 rounded-xl bg-[#FAF7F2] text-center text-lg font-black text-orange-400 outline-none" />
              <input name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required className="w-full p-3 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none" />
              <button type="submit" className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase text-[10px] shadow-lg">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
      {showAddExpense && (
        <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-sm rounded-t-[2rem] md:rounded-[2rem] p-6 pb-10 md:pb-6 shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95">
            <ModalHeader title="Dépense" onClose={() => setShowAddExpense(false)} />
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <input name="label" placeholder="Motif (ex: Taxi, Emballage)" required className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none" />
              <input name="amountDA" type="number" placeholder="Montant DA" required className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none font-bold text-red-400" />
              <input name="date" type="date" required className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none" />
              <button type="submit" className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase text-[10px] shadow-lg">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
      {showAddRate && (
        <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-xs rounded-t-[2rem] md:rounded-[2rem] p-6 pb-10 md:pb-6 shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95">
            <ModalHeader title="Taux Euro" onClose={() => setShowAddRate(false)} />
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              await addDoc(collection(db, "artifacts", appId, "public", "data", "currencyRates"), { rate: parseFloat(fd.get("rate")), date: fd.get("date"), createdAt: Timestamp.now() });
              setShowAddRate(false);
              showToast("Taux mis à jour");
            }} className="space-y-4">
              <input name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none" />
              <input name="rate" type="number" step="0.01" placeholder="Valeur 1€ en DA" required className="w-full p-4 rounded-xl bg-[#FAF7F2] text-center font-black text-lg text-[#8D7B68] outline-none" />
              <button type="submit" className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase text-[10px] shadow-lg">Valider</button>
            </form>
          </div>
        </div>
      )}
      {showConfig && <ConfigModal config={config} saveConfig={saveConfig} setConfig={setConfig} onClose={() => setShowConfig(false)} />}
      {deleteTarget && <DeleteModal deleteTarget={deleteTarget} performDelete={performDelete} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); setLoading(false); });
    return () => unsubscribe();
  }, []);
  if (loading) return <div style={{ height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"#FDFBF7",color:"#8D7B68",fontFamily:"serif" }}>Chargement...</div>;
  return user ? <MainApp user={user} /> : <Login />;
}

// --- SUB-COMPONENTS ---

const OrderModal = ({
  editingOrder, customers, orders, orderItems, setOrderItems,
  orderPayments, setOrderPayments, orderStatus, setOrderStatus,
  orderDate, setOrderDate, orderNumber, setOrderNumber,
  config, arrivages, handleSaveOrder, formatDA, calculateTotals,
  shippingNational, setShippingNational, onClose,
  orderDiscount, setOrderDiscount, orderRefundAmount, setOrderRefundAmount,
  orderReceiptImage, setOrderReceiptImage,
}) => {
  const [defaultArrivage, setDefaultArrivage] = useState(editingOrder ? orderItems[0]?.arrivageId || "" : "");
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentDate, setNewPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(editingOrder?.customerId || "");

  useEffect(() => {
    let hasChanges = false;
    const correctedItems = orderItems.map((item) => {
      if (parseFloat(item.weightG) > 0 && (!item.status || item.status === "En attente" || item.status === "A commander")) {
        hasChanges = true;
        return { ...item, status: "Reçu" };
      }
      return item;
    });
    if (hasChanges) setOrderItems(correctedItems);
  }, []);

  const updateOrderNumber = (selectedDate) => {
    if (editingOrder) return;
    const prefix = `${selectedDate.slice(2, 4)}${selectedDate.slice(5, 7)}-`;
    const monthOrders = orders.filter((o) => o.orderNumber?.startsWith(prefix) && o.id !== editingOrder?.id);
    const nextNum = monthOrders.length === 0 ? 1 : Math.max(...monthOrders.map((o) => parseInt(o.orderNumber.split("-")[1]) || 0)) + 1;
    setOrderNumber(`${prefix}${String(nextNum).padStart(3, "0")}`);
  };

  const sortedWilayas = Object.keys(customers.reduce((acc, c) => { const w = c.wilaya || "Autre"; if (!acc[w]) acc[w] = []; acc[w].push(c); return acc; }, {})).sort();
  const groupedCustomers = customers.reduce((acc, c) => { const w = c.wilaya || "Autre"; if (!acc[w]) acc[w] = []; acc[w].push(c); return acc; }, {});
  Object.keys(groupedCustomers).forEach((w) => groupedCustomers[w].sort((a, b) => a.name.localeCompare(b.name)));

  const totalAdvance = orderPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const netAdvance = totalAdvance - (parseFloat(orderRefundAmount) || 0);
  const totalVenteEtLivraison = calculateTotals(orderItems, 0, new Date()).venteTotal + (parseFloat(shippingNational) || 0) - (parseFloat(orderDiscount) || 0);
  const montantEnAlgerie = orderItems.filter((item) => item.status === "Reçu" || item.status === "Livré" || parseFloat(item.weightG) > 0).reduce((sum, i) => sum + (parseFloat(i.priceVente) || 0), 0);
  const isFullyPaidStatus = orderStatus === "Payée" || orderStatus === "Payée et livrée";
  const resteToPay = isFullyPaidStatus ? 0 : Math.max(0, totalVenteEtLivraison - netAdvance);

  const currentCustomer = customers.find(c => c.id === selectedCustomerId);
  const oldWalletUsed = editingOrder?.payments?.filter(p => p.method === "Portefeuille").reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
  const currentWalletUsed = orderPayments.filter(p => p.method === "Portefeuille").reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
  const realAvailableWallet = (currentCustomer?.walletDA || 0) + oldWalletUsed - currentWalletUsed;

  const handleUseWallet = () => {
    if (realAvailableWallet <= 0 || resteToPay <= 0) return;
    const amountToUse = Math.min(realAvailableWallet, resteToPay);
    
    setOrderPayments([...orderPayments, {
      id: Date.now(),
      amount: amountToUse,
      date: new Date().toISOString().split("T")[0],
      method: "Portefeuille",
    }]);
  };

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden pt-10">
      <div className="bg-white w-full h-[92vh] md:h-auto md:max-h-[95vh] md:max-w-6xl rounded-t-[2rem] md:rounded-[2rem] p-4 md:p-6 shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 md:zoom-in-95">
        <ModalHeader title={editingOrder ? "Modifier Vente" : "Nouvelle Vente"} onClose={onClose} />
        <form onSubmit={(e) => handleSaveOrder(e, setIsSaving)} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-4">
            
            {/* EN-TÊTE */}
            <div className="bg-[#FAF7F2]/80 p-4 rounded-2xl md:rounded-[1.5rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 shrink-0 border border-[#E8D5C4]/30">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">Date</label>
                <input type="date" name="orderDate" value={orderDate} onChange={(e) => { setOrderDate(e.target.value); updateOrderNumber(e.target.value); }} required className="w-full p-3 md:p-2.5 rounded-xl text-xs font-bold bg-white outline-none text-[#4A3F35] shadow-sm border border-gray-100" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">N° Commande</label>
                <input name="orderNumber" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required className="w-full p-3 md:p-2.5 rounded-xl text-xs font-bold bg-white outline-none text-[#4A3F35] shadow-sm border border-gray-100" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">Cliente</label>
                <select name="customerId" value={selectedCustomerId} onChange={(e) => { 
                  setSelectedCustomerId(e.target.value);
                  const c = customers.find((x) => x.id === e.target.value); 
                  if (c && c.wilaya) { 
                    const tariff = DELIVERY_TARIFFS[c.wilaya.substring(3).trim()]; 
                    if (tariff) setShippingNational(c.deliveryMode === "stopdesk" && tariff.stop ? tariff.stop : tariff.dom); 
                  } 
                }} required className="w-full p-3 md:p-2.5 rounded-xl bg-white text-xs font-bold text-[#8D7B68] outline-none shadow-sm border border-gray-100">
                  <option value="">Sélectionner...</option>
                  {sortedWilayas.map((w) => (
                    <optgroup key={w} label={w} className="bg-gray-50">
                      {groupedCustomers[w].map((c) => <option key={c.id} value={c.id}>{c.name} • {c.deliveryMode === "stopdesk" ? "Stopdesk" : "Dom"}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#D4B996]">Arrivage (Défaut)</label>
                <select value={defaultArrivage} onChange={(e) => { const val = e.target.value; setDefaultArrivage(val); setOrderItems(orderItems.map((item) => ({ ...item, arrivageId: val }))); }} className="w-full p-3 md:p-2.5 rounded-xl bg-white text-xs font-bold text-[#8D7B68] outline-none shadow-sm border border-[#E8D5C4]">
                  <option value="">Choisir...</option>
                  {arrivages.map((a) => <option key={a.id} value={a.id}>#{a.number}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">Statut</label>
                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full p-3 md:p-2.5 rounded-xl bg-white text-xs font-bold text-[#4A3F35] outline-none shadow-sm border border-gray-100">
                  <option value="A commander">A commander</option>
                  <option value="Réservée">Réservée</option>
                  <option value="Payée une partie">Payée partiel</option>
                  <option value="Payée">Payée</option>
                  <option value="En cours de livraison">En livraison</option>
                  <option value="Livrée sans paiement">Livrée (non payé)</option>
                  <option value="Payée et livrée">Livrée ✅</option>
                  <option value="Annulée">Annulée ❌</option>
                </select>
              </div>
            </div>

            {/* ARTICLES */}
            <div className="flex flex-col shrink-0">
              <h4 className="text-xs font-bold text-[#8D7B68] uppercase px-2 mb-2 shrink-0">Panier d'articles</h4>
              <div className="space-y-3 pr-1 pb-2">
                {orderItems.map((item, index) => (
                  <div key={item.id} className="bg-white border border-[#E8D5C4]/60 p-4 md:p-3 rounded-2xl shadow-sm flex flex-col gap-3 md:gap-2 relative pl-8 pt-6 md:pt-3 shrink-0">
                    <div className="absolute left-2 top-3 md:top-1/2 md:-translate-y-1/2 w-5 h-5 bg-[#FAF7F2] border border-[#E8D5C4] rounded-full flex items-center justify-center text-[9px] font-black text-[#8D7B68]">{index + 1}</div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input placeholder="Désignation exacte..." className="w-full md:flex-[2] p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35]" value={item.name} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, name: e.target.value } : oi))} />
                      <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
                        <input list="catList" placeholder="Catégorie" className="col-span-2 md:col-span-1 md:flex-1 p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35]" value={item.category} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, category: e.target.value } : oi))} />
                        <input list="sizeList" placeholder="Taille" className="col-span-1 md:w-20 p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35] text-center" value={item.size} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, size: e.target.value } : oi))} />
                        <input list="colorList" placeholder="Couleur" className="col-span-1 md:w-24 p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35] text-center" value={item.color} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, color: e.target.value } : oi))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:flex flex-wrap md:flex-nowrap gap-2 items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                      <select className="col-span-2 md:col-span-1 w-full md:w-auto md:flex-1 p-2 md:p-1.5 rounded-lg bg-white border border-gray-100 outline-none text-[11px] md:text-[10px] font-bold text-[#8D7B68] shadow-sm" value={item.arrivageId || ""} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, arrivageId: e.target.value } : oi))}>
                        <option value="">Lié à l'arrivage...</option>
                        {arrivages.map((a) => <option key={a.id} value={a.id}>#{a.number}</option>)}
                      </select>
                      <select className="col-span-2 md:col-span-1 w-full md:w-auto md:flex-1 p-2 md:p-1.5 rounded-lg bg-white border border-gray-100 outline-none text-[11px] md:text-[10px] font-bold text-[#8D7B68] shadow-sm" value={item.status || "En attente"} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, status: e.target.value } : oi))}>
                        <option value="En attente">En attente (Chine)</option>
                        <option value="Reçu">Reçu (Algérie)</option>
                        <option value="Livré">Livré cliente</option>
                        <option value="Retourné Fournisseur">Retourné (Fournisseur)</option>
                      </select>
                      <div className="col-span-1 flex items-center gap-1 bg-white px-2 py-2 md:py-1.5 rounded-lg shadow-sm border border-gray-100 md:w-24">
                        <span className="text-[9px] font-bold text-gray-400 hidden lg:inline">Poids(g)</span>
                        <input type="number" placeholder="g" className="w-full outline-none text-xs font-bold text-center md:text-right bg-transparent" value={item.weightG}
                          onChange={(e) => { const val = e.target.value; setOrderItems(orderItems.map((oi) => { if (oi.id === item.id) { let newStatus = oi.status; if (parseFloat(val) > 0 && (!oi.status || oi.status === "En attente" || oi.status === "A commander")) { newStatus = "Reçu"; } else if ((!val || parseFloat(val) === 0) && oi.status === "Reçu") { newStatus = "En attente"; } return { ...oi, weightG: val, status: newStatus }; } return oi; })); }} />
                      </div>
                      <div className="col-span-1 flex items-center gap-1 bg-white px-2 py-2 md:py-1.5 rounded-lg shadow-sm border border-gray-100 md:w-24">
                        <span className="text-[9px] font-bold text-gray-400 hidden lg:inline">Achat(€)</span>
                        <input type="number" step="0.01" placeholder="€" className="w-full outline-none text-xs font-bold text-center md:text-right bg-transparent" value={item.priceAchatEuro} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, priceAchatEuro: e.target.value } : oi))} />
                      </div>
                      <div className="col-span-2 flex items-center gap-2 mt-1 md:mt-0">
                        <div className="flex items-center gap-1 bg-[#F3E8E2]/40 px-3 py-2.5 md:py-1.5 rounded-lg shadow-sm border border-[#E8D5C4]/60 flex-1">
                          <span className="text-[9px] font-bold text-[#D4B996] uppercase">Vente DA</span>
                          <input type="number" className="w-full outline-none text-sm md:text-xs font-black text-[#8D7B68] text-right bg-transparent" value={item.priceVente} onChange={(e) => setOrderItems(orderItems.map((oi) => oi.id === item.id ? { ...oi, priceVente: e.target.value } : oi))} />
                        </div>
                        <ImageUploader 
                          compact 
                          value={item.itemImage} 
                          path={`orders/${orderNumber}/items`} 
                          onChange={(url) => setOrderItems(orderItems.map(oi => oi.id === item.id ? { ...oi, itemImage: url } : oi))} 
                        />
                        <button type="button" onClick={() => setOrderItems(orderItems.filter((oi) => oi.id !== item.id))} className="text-red-400 bg-red-50 hover:bg-red-100 p-2.5 md:p-1.5 rounded-lg transition-colors shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    {item.status === "Retourné Fournisseur" && (
                      <div className="flex flex-col gap-3 mt-3 p-3 md:p-4 bg-red-50/50 rounded-xl border border-red-100 animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-red-100">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-1">Responsable du retour</label>
                            <select className="w-full p-2.5 rounded-lg text-xs font-bold outline-none border border-transparent focus:border-red-200 bg-white text-[#4A3F35]" value={item.responsableRetour || "boutique"} onChange={(e) => setOrderItems(orderItems.map(oi => oi.id === item.id ? { ...oi, responsableRetour: e.target.value } : oi))}>
                              <option value="boutique">Erreur Yuna's Shop / Shein</option>
                              <option value="cliente">Changement d'avis (Cliente)</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-red-100">
                            <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Remboursé par Shein ?</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={item.sheinRembourse || false} onChange={(e) => setOrderItems(orderItems.map(oi => oi.id === item.id ? { ...oi, sheinRembourse: e.target.checked } : oi))} />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-red-400 uppercase tracking-widest ml-1">Frais Retour Livreur (DA)</label>
                            <input type="number" placeholder="Ex: 400" className="w-full p-2.5 rounded-lg text-xs font-bold outline-none border border-transparent focus:border-red-200 bg-white" value={item.fraisRetourLivreur || ""} onChange={(e) => setOrderItems(orderItems.map(oi => oi.id === item.id ? { ...oi, fraisRetourLivreur: e.target.value } : oi))} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-red-400 uppercase tracking-widest ml-1">Frais Retour Fournisseur (DA)</label>
                            <input type="number" placeholder="Ex: 0" className="w-full p-2.5 rounded-lg text-xs font-bold outline-none border border-transparent focus:border-red-200 bg-white" value={item.fraisRetourFournisseur || ""} onChange={(e) => setOrderItems(orderItems.map(oi => oi.id === item.id ? { ...oi, fraisRetourFournisseur: e.target.value } : oi))} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setOrderItems([...orderItems, { id: Date.now(), name: "", category: "", size: "", color: "", weightG: 0, priceAchatEuro: 0, priceVente: 0, arrivageId: defaultArrivage, status: "En attente" }])} className="w-full mt-3 shrink-0 py-4 md:py-3 border border-dashed border-[#E8D5C4] text-[#8D7B68] hover:bg-[#FAF7F2] rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-white/50 shadow-sm">
                <Plus size={16} /> Ajouter un article
              </button>
            </div>

            {/* PAIEMENTS & RÉSUMÉ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-[#E8D5C4]/40 flex flex-col h-full shadow-sm">
                <h4 className="text-[10px] text-[#B8A99A] font-bold uppercase tracking-widest mb-3 border-b border-gray-50 pb-2">Historique des Versements</h4>
                
                {/* WIDGET PORTEFEUILLE */}
                {realAvailableWallet > 0 && resteToPay > 0 && (
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-200 mb-3 animate-in fade-in">
                    <div>
                      <span className="text-xs font-bold text-green-700">Portefeuille disponible</span>
                      <p className="text-[10px] font-black text-green-800">{formatDA(realAvailableWallet)}</p>
                    </div>
                    <button type="button" onClick={handleUseWallet} className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-bold uppercase shadow-sm transition-colors">
                      Utiliser
                    </button>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-2 mb-3 min-h-[80px] custom-scrollbar">
                  {orderPayments.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic text-center pt-4">Aucun versement enregistré.</p>
                  ) : (
                    orderPayments.map((p) => (
                      <div key={p.id} className="flex justify-between items-center bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                          {p.date} 
                          {p.method === "Portefeuille" && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md uppercase tracking-wider text-[8px]">Portefeuille</span>}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black ${p.method === "Portefeuille" ? "text-green-600" : "text-[#8D7B68]"}`}>{formatDA(p.amount)}</span>
                          <button type="button" onClick={() => setOrderPayments(orderPayments.filter((pay) => pay.id !== p.id))} className="text-red-300 hover:text-red-500"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <ImageUploader
                  value={orderReceiptImage}
                  path={`orders/${orderNumber}/receipts`}
                  onChange={setOrderReceiptImage}
                />
                <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100 mt-auto">
                  <input type="date" value={newPaymentDate} onChange={(e) => setNewPaymentDate(e.target.value)} className="w-24 p-2 rounded-lg text-[10px] outline-none text-gray-600 font-bold border border-transparent focus:border-[#E8D5C4]" />
                  <input type="number" placeholder="Montant DA (Cash/CCP)" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)} className="flex-1 p-2 rounded-lg text-xs outline-none font-bold text-[#8D7B68] border border-transparent focus:border-[#E8D5C4]" />
                  <button type="button" onClick={() => { if (newPaymentAmount) { setOrderPayments([...orderPayments, { id: Date.now(), amount: parseFloat(newPaymentAmount), date: newPaymentDate, method: "Cash" }]); setNewPaymentAmount(""); } }} className="bg-[#8D7B68] text-white p-2 rounded-lg shadow-sm"><Plus size={16} /></button>
                </div>
              </div>

              <div className="bg-[#FAF7F2]/60 p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-[#E8D5C4]/40 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3 md:mb-2">
                    <span className="text-[10px] text-[#B8A99A] font-bold uppercase tracking-widest">Livraison</span>
                    <div className="flex items-center gap-2 bg-white px-3 md:px-2 py-1.5 md:py-1 rounded-lg border border-[#E8D5C4]/50 shadow-sm">
                      <span className="text-xs font-bold text-[#8D7B68]">+</span>
                      <input type="number" value={shippingNational} onChange={(e) => setShippingNational(e.target.value)} className="w-16 outline-none text-right font-bold text-sm md:text-xs text-[#8D7B68]" placeholder="0.00" />
                      <span className="text-[9px] font-bold text-[#D4B996]">DA</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-1.5 mb-4 overflow-x-auto pb-1 custom-scrollbar">
                    {[0, 400, 600, 800, 1000].map((p) => (
                      <button key={p} type="button" onClick={() => setShippingNational(p)} className="shrink-0 text-[10px] font-bold bg-white border border-[#E8D5C4]/60 px-3 md:px-2 py-1.5 md:py-1 rounded-lg text-[#8D7B68] shadow-sm">{p === 0 ? "Gratuit" : p}</button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#B8A99A] font-bold uppercase tracking-widest">Remise Commerciale</span>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E8D5C4]/50 shadow-sm">
                        <span className="text-xs font-bold text-green-500">-</span>
                        <input type="number" value={orderDiscount} onChange={(e) => setOrderDiscount(e.target.value)} className="w-16 outline-none text-right font-bold text-sm text-green-500" placeholder="0.00" />
                        <span className="text-[9px] font-bold text-[#D4B996]">DA</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#B8A99A] font-bold uppercase tracking-widest">Remboursé à la cliente</span>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm">
                        <span className="text-xs font-bold text-red-400">+</span>
                        <input type="number" value={orderRefundAmount} onChange={(e) => setOrderRefundAmount(e.target.value)} className="w-16 outline-none text-right font-bold text-sm text-red-400" placeholder="0.00" />
                        <span className="text-[9px] font-bold text-[#D4B996]">DA</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-[11px] font-bold text-blue-600/80 bg-blue-50/50 p-2 rounded-lg border border-blue-100 mb-2">
                    <span>Montant des articles en Algérie :</span><span>{formatDA(montantEnAlgerie)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-500"><span>Total Panier + Liv :</span><span>{formatDA(totalVenteEtLivraison)}</span></div>
                  <div className="flex justify-between text-xs font-bold text-green-600"><span>Total Avances :</span><span>- {formatDA(totalAdvance)}</span></div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#E8D5C4]/40 mt-2">
                    <span className="text-[11px] text-[#8D7B68] font-black uppercase tracking-widest">Reste à Payer</span>
                    <span className={`text-2xl font-serif font-bold ${resteToPay > 0 ? "text-[#8D7B68]" : "text-green-500"}`}>{formatDA(resteToPay)}</span>
                  </div>
                  {isFullyPaidStatus && <p className="text-[9px] text-green-500 font-bold text-right italic">Mis à 0 automatiquement car statut Payée.</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 pt-2 pb-2">
            <button type="submit" disabled={isSaving} className="w-full flex justify-center items-center gap-3 py-4 rounded-xl md:rounded-[1.5rem] text-white font-serif text-lg md:text-xl bg-[#8D7B68] shadow-lg font-bold uppercase tracking-widest transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
              {isSaving && <Loader2 size={24} className="animate-spin" />}
              {isSaving ? "Sauvegarde..." : "Valider la commande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerModal = ({ editingCustomer, handleSaveCustomer, onClose }) => {
  const [wilaya, setWilaya] = useState(editingCustomer?.wilaya || "");
  const [commune, setCommune] = useState(editingCustomer?.commune || "");
  const [isCustomCommune, setIsCustomCommune] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState(editingCustomer?.deliveryMode || "domicile");
  const [platform, setPlatform] = useState(editingCustomer?.platform || "instagram");
  const [wallet, setWallet] = useState(editingCustomer?.walletDA || 0);

  const availableCommunes = wilaya ? (SUGGESTED_COMMUNES[wilaya] || []) : [];

  useEffect(() => {
    if (editingCustomer?.wilaya && editingCustomer?.commune) {
      const sugg = SUGGESTED_COMMUNES[editingCustomer.wilaya] || [];
      if (sugg.length > 0 && !sugg.includes(editingCustomer.commune)) {
        setIsCustomCommune(true);
      }
    }
  }, [editingCustomer]);

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden pt-10">
      <div className="bg-white w-full max-h-[90vh] md:max-h-[90vh] md:max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-4 flex flex-col">
        <ModalHeader title={editingCustomer ? "Modifier Cliente" : "Nouvelle Cliente"} onClose={onClose} />
        <form onSubmit={handleSaveCustomer} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pb-4 pr-1">

            {/* Plateforme */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-[#B8A99A] tracking-wider ml-1">Plateforme</label>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {["instagram","facebook","whatsapp","direct"].map((plat) => (
                  <label key={plat} onClick={() => setPlatform(plat)} className={`flex flex-col items-center p-3 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all ${platform === plat ? "bg-white border-[#E8D5C4] shadow-sm" : "bg-[#FAF7F2]/50 border-transparent"}`}>
                    <input type="radio" name="platform" value={plat} checked={platform === plat} readOnly className="hidden" />
                    <PlatformIcon type={plat} size={20} />
                    <span className={`text-[8px] uppercase font-bold mt-2 truncate w-full text-center ${platform === plat ? "text-[#8D7B68]" : "text-[#B8A99A]"}`}>{plat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nom */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Nom complet (Livraison)</label>
              <input autoFocus name="name" defaultValue={editingCustomer?.name || ""} required className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]" />
            </div>

            {/* Pseudo Réseaux Sociaux */}
            <div className="space-y-1 mt-3">
              <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Nom du profil (Emojis, Pseudo exact)</label>
              <input name="profileName" defaultValue={editingCustomer?.profileName || ""} placeholder="Ex: 𝒴𝓊𝓃𝒶 🌸" className="w-full p-3.5 rounded-xl bg-[#FAF7F2] text-sm font-bold text-[#8D7B68] outline-none border border-transparent focus:border-[#E8D5C4]" />
            </div>

            {/* Téléphones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Téléphone 1</label>
                <input name="phone" defaultValue={editingCustomer?.phone || ""} required type="tel" className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Téléphone 2</label>
                <input name="phone2" defaultValue={editingCustomer?.phone2 || ""} type="tel" placeholder="Optionnel" className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-medium text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]" />
              </div>
            </div>

            {/* Wilaya & Commune */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Wilaya</label>
                <select name="wilaya" required value={wilaya} onChange={(e) => { setWilaya(e.target.value); setCommune(""); setIsCustomCommune(false); }} className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]">
                  <option value="">Sélectionner</option>
                  {WILAYAS_58.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Commune</label>
                {availableCommunes.length > 0 && !isCustomCommune ? (
                  <div className="flex gap-2">
                    <select name="commune" required value={commune} onChange={(e) => { if (e.target.value === "custom") { setIsCustomCommune(true); setCommune(""); } else { setCommune(e.target.value); } }} className="flex-1 p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]">
                      <option value="">Choisir...</option>
                      {availableCommunes.map((c) => <option key={c} value={c}>{c}</option>)}
                      <option value="custom">Autre...</option>
                    </select>
                    <button type="button" onClick={() => setIsCustomCommune(true)} className="p-3 text-[#D4B996] bg-gray-50 rounded-xl hover:bg-gray-200"><RotateCcw size={16} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input name="commune" placeholder="Saisir commune" value={commune} onChange={(e) => setCommune(e.target.value)} required className="flex-1 p-3.5 rounded-xl bg-white border border-[#E8D5C4] text-sm font-bold text-[#8D7B68] outline-none" />
                    {availableCommunes.length > 0 && <button type="button" onClick={() => setIsCustomCommune(false)} className="p-3 text-gray-400 bg-gray-50 rounded-xl hover:bg-gray-200"><RotateCcw size={16} /></button>}
                  </div>
                )}
              </div>
            </div>

            {/* Livraison */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-[#B8A99A] tracking-wider ml-1">Livraison</label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF7F2]/80 rounded-2xl border border-[#E8D5C4]/30">
                <label onClick={() => setDeliveryMode("domicile")} className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all text-xs font-bold border ${deliveryMode === "domicile" ? "bg-white shadow-sm text-[#8D7B68] border-[#E8D5C4]/50" : "text-[#B8A99A] border-transparent"}`}>
                  <input type="radio" name="deliveryMode" value="domicile" checked={deliveryMode === "domicile"} readOnly className="hidden" />
                  <Home size={14} /> Domicile
                </label>
                <label onClick={() => setDeliveryMode("stopdesk")} className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all text-xs font-bold border ${deliveryMode === "stopdesk" ? "bg-white shadow-sm text-[#8D7B68] border-[#E8D5C4]/50" : "text-[#B8A99A] border-transparent"}`}>
                  <input type="radio" name="deliveryMode" value="stopdesk" checked={deliveryMode === "stopdesk"} readOnly className="hidden" />
                  <Store size={14} /> Stopdesk
                </label>
              </div>
              {deliveryMode === "stopdesk" && (
                <div className="mt-3 animate-in slide-in-from-top-2">
                  <label className="text-[9px] uppercase font-bold text-[#D4B996] ml-1">Bureau Stopdesk</label>
                  <div className="relative mt-1">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4B996]" />
                    <input name="stopdeskName" placeholder="Ex: Yalidine Kouba" defaultValue={editingCustomer?.stopdeskName || ""} required className="w-full p-3.5 pl-12 rounded-xl bg-white border border-[#E8D5C4] text-sm font-bold text-[#8D7B68] outline-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Portefeuille Contrôlé */}
            <div className="space-y-1 mt-4 p-3 bg-green-50/30 rounded-xl border border-green-100">
              <label className="text-[9px] uppercase font-bold text-green-600 ml-1">Correction Portefeuille (DA)</label>
              <input name="walletDA" type="number" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="Ex: 0 pour vider" className="w-full p-3.5 rounded-xl bg-white text-sm font-bold text-green-600 outline-none border border-transparent focus:border-green-200 shadow-sm" />
            </div>

          </div>
          <div className="shrink-0 pt-4">
            <button type="submit" className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg">Enregistrer la cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ArrivageModal = ({ editingArrivage, arrivageNumber, setArrivageNumber, arrivageDate, setArrivageDate, handleSaveArrivage, onClose }) => (
  <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
    <div className="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-4">
      <ModalHeader title={editingArrivage ? "Modifier Arrivage" : "Nouveau Dossier Arrivage"} onClose={onClose} />
      <form onSubmit={handleSaveArrivage} className="space-y-4 pb-4 md:pb-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">N°</label>
            <input name="number" value={arrivageNumber} onChange={(e) => setArrivageNumber(e.target.value)} required className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold outline-none border border-transparent focus:border-[#E8D5C4]" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Date</label>
            <input name="date" type="date" value={arrivageDate} onChange={(e) => setArrivageDate(e.target.value)} required className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none border border-transparent focus:border-[#E8D5C4]" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Pays</label>
          <select name="country" className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#8D7B68] outline-none"><option value="France">France</option></select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Poids Facturé (Kg)</label>
            <input name="totalWeightKg" type="number" step="0.01" defaultValue={editingArrivage?.totalWeightKg || ""} required placeholder="Ex: 12.5" className="w-full p-3.5 rounded-xl bg-white border border-[#E8D5C4] text-sm font-black text-[#8D7B68] outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Frais Total (DA)</label>
            <input name="totalShippingFee" type="number" step="0.01" defaultValue={editingArrivage?.totalShippingFee} required placeholder="Ex: 15000" className="w-full p-3.5 rounded-xl bg-white border border-[#E8D5C4] text-sm font-black text-[#8D7B68] outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full py-4 mt-2 bg-[#8D7B68] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg">Enregistrer</button>
      </form>
    </div>
  </div>
);

const ConfigModal = ({ config, saveConfig, setConfig, onClose }) => {
  const sections = [{ k: "categories", l: "Catégories" }, { k: "sizes", l: "Tailles" }, { k: "colors", l: "Couleurs" }];
  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full h-[85vh] md:h-auto md:max-h-[90vh] md:max-w-5xl rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl flex flex-col animate-in slide-in-from-bottom-4">
        <ModalHeader title="Options Boutique" onClose={onClose} />
        <div className="overflow-y-auto flex-1 pb-10 md:pb-4 custom-scrollbar pr-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sections.map((s) => (
              <div key={s.k} className="space-y-4 bg-[#FAF7F2]/50 p-5 rounded-[1.5rem] border border-[#E8D5C4]/30">
                <h4 className="text-xs uppercase font-bold text-[#8D7B68]">{s.l}</h4>
                <div className="flex gap-2">
                  <input id={`input-${s.k}`} className="flex-1 p-3 bg-white rounded-xl text-xs outline-none shadow-sm border border-transparent focus:border-[#D4B996]" placeholder="Ajouter..." />
                  <button type="button" onClick={() => { const val = document.getElementById(`input-${s.k}`).value; if (val && !(config[s.k] || []).includes(val)) { const nc = { ...config, [s.k]: [...(config[s.k] || []), val] }; setConfig(nc); saveConfig(nc); document.getElementById(`input-${s.k}`).value = ""; } }} className="bg-[#8D7B68] text-white p-3 rounded-xl"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(config[s.k] || []).map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white rounded-lg text-[10px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 flex items-center gap-2 shadow-sm">
                      {item} <X size={12} className="cursor-pointer text-[#E8D5C4] hover:text-red-400" onClick={() => { const nc = { ...config, [s.k]: config[s.k].filter((_, i) => i !== idx) }; setConfig(nc); saveConfig(nc); }} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CostBreakdownModal = ({ order, onClose, formatDA, calculateTotals }) => {
  const { processed } = calculateTotals(order.items || [], order.shippingNational, order.date);
  const totals = processed.reduce((acc, item) => {
    acc.euro += parseFloat(item.priceAchatEuro) || 0;
    acc.achatDA += parseFloat(item.itAchatDA) || 0;
    acc.logDA += parseFloat(item.itLogInt) || 0;
    acc.cout += (parseFloat(item.itAchatDA) || 0) + (parseFloat(item.itLogInt) || 0);
    acc.vente += parseFloat(item.priceVente) || 0;
    acc.benefit += parseFloat(item.itBenefit) || 0;
    return acc;
  }, { euro: 0, achatDA: 0, logDA: 0, cout: 0, vente: 0, benefit: 0 });

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1010] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-[#FAF7F2] w-full h-[85vh] md:h-auto md:max-h-[90vh] md:max-w-4xl rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-[#8D7B68] z-10"><X size={18} /></button>
        <div className="p-6 md:p-8 pb-4 shrink-0">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[#8D7B68] tracking-widest mb-1">ANALYSE DES COÛTS</h2>
          <p className="text-[10px] md:text-xs font-bold text-[#4A3F35] uppercase">Commande #{order.orderNumber} • {order.customerName}</p>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-8 pt-0 custom-scrollbar pb-10 md:pb-8">
          <div className="bg-white rounded-xl border border-[#E8D5C4]/30 overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left min-w-[600px]">
              <thead className="bg-[#FAF7F2]/50 border-b border-[#E8D5C4]/20 text-[#B8A99A] font-bold uppercase text-[9px]">
                <tr>
                  <th className="p-4">Article</th>
                  <th className="p-4 text-right">Achat (€)</th>
                  <th className="p-4 text-right">Achat (DA)</th>
                  <th className="p-4 text-right text-orange-400">Logistique</th>
                  <th className="p-4 text-right font-black text-[#8D7B68]">Coût Total</th>
                  <th className="p-4 text-right text-green-500">Marge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[11px]">
                {processed.map((item, idx) => {
                  const cout = (parseFloat(item.itAchatDA) || 0) + (parseFloat(item.itLogInt) || 0);
                  return (
                    <tr key={idx} className="hover:bg-[#FAF7F2]/30">
                      <td className="p-4 font-medium text-[#4A3F35] max-w-[150px] truncate">{item.name || "Article"}</td>
                      <td className="p-4 text-right">{parseFloat(item.priceAchatEuro || 0).toFixed(2)} €</td>
                      <td className="p-4 text-right text-gray-500">{formatDA(item.itAchatDA)}</td>
                      <td className="p-4 text-right text-orange-400 font-medium">+{formatDA(item.itLogInt)}</td>
                      <td className="p-4 text-right font-black text-[#8D7B68] bg-[#FAF7F2]/30">{formatDA(cout)}</td>
                      <td className="p-4 text-right font-bold text-green-500">{formatDA(item.itBenefit)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-[#FAF7F2] border-t border-[#E8D5C4]/40 font-black">
                <tr>
                  <td className="p-4 text-[#8D7B68]">TOTAL</td>
                  <td className="p-4 text-right">{totals.euro.toFixed(2)} €</td>
                  <td className="p-4 text-right text-gray-500">{formatDA(totals.achatDA)}</td>
                  <td className="p-4 text-right text-orange-400">+{formatDA(totals.logDA)}</td>
                  <td className="p-4 text-right text-[#8D7B68] text-sm">{formatDA(totals.cout)}</td>
                  <td className="p-4 text-right text-green-500 text-sm">{formatDA(totals.benefit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceCalculatorModal = ({ onClose, currencyRates, formatDA }) => {
  const latestRate = currencyRates?.length ? [...currencyRates].sort((a, b) => new Date(b.date) - new Date(a.date))[0].rate : 250;
  const [priceEur, setPriceEur] = useState("");
  const [rate, setRate] = useState(latestRate);
  const [logMode, setLogMode] = useState("poids");
  const [weightG, setWeightG] = useState("");
  const [fraisFixe, setFraisFixe] = useState("");

  const pEur = parseFloat(priceEur) || 0;
  const r = parseFloat(rate) || 0;
  const w = parseFloat(weightG) || 0;
  const f = parseFloat(fraisFixe) || 0;
  let coeff = 1.3;
  if (pEur >= 15 && pEur < 30) coeff = 1.25;
  if (pEur >= 30) coeff = 1.2;
  const achatDA = pEur * r;
  const venteBaseDA = achatDA * coeff;
  const logDA = logMode === "poids" ? (w / 1000) * 2200 : f;
  const finalPrice = venteBaseDA + logDA;
  const benefit = finalPrice - achatDA - logDA;

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[2000] flex items-end md:items-center justify-center p-0 md:p-4 pb-4">
      <div className="bg-[#FDFBF7] w-full md:max-w-md rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-[#E8D5C4]/30 flex justify-between items-center bg-white rounded-t-[2rem]">
          <h3 className="text-lg font-serif text-[#8D7B68] font-bold flex items-center gap-2 tracking-widest uppercase"><Calculator size={20} className="text-[#D4B996]" /> Simulateur</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Prix Achat (€)</label>
                <input type="number" step="0.01" autoFocus value={priceEur} onChange={(e) => setPriceEur(e.target.value)} className="w-full p-4 rounded-2xl bg-white text-lg font-black text-[#8D7B68] outline-none shadow-sm border border-[#E8D5C4]/50 focus:border-[#D4B996] text-center" placeholder="0.00" />
              </div>
              <div className="w-24 space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Taux Actuel</label>
                <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full p-4 rounded-2xl bg-[#FAF7F2] text-sm font-bold text-gray-500 outline-none border border-transparent text-center" />
              </div>
            </div>
            {pEur > 0 && (
              <div className="flex justify-between items-center px-4 py-2 bg-white rounded-xl border border-gray-100 text-[11px] font-medium text-gray-500 shadow-sm">
                <span>Coeff. appliqué : <strong className="text-[#D4B996]">x{coeff}</strong></span>
                <span>= {formatDA(achatDA)} (Achat)</span>
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8D5C4]/30 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase font-bold text-[#8D7B68] tracking-widest">Logistique Estimée</label>
              <div className="flex bg-[#FAF7F2] p-1 rounded-lg">
                <button type="button" onClick={() => setLogMode("poids")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${logMode === "poids" ? "bg-white text-[#8D7B68] shadow-sm" : "text-[#B8A99A]"}`}>Au Poids</button>
                <button type="button" onClick={() => setLogMode("fixe")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${logMode === "fixe" ? "bg-white text-[#8D7B68] shadow-sm" : "text-[#B8A99A]"}`}>Prix Fixe</button>
              </div>
            </div>
            {logMode === "poids" ? (
              <div className="flex gap-2 items-center">
                <input type="number" value={weightG} onChange={(e) => setWeightG(e.target.value)} placeholder="Poids en grammes (ex: 250)" className="flex-1 p-3 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none focus:bg-white focus:border-[#E8D5C4] border border-transparent" />
                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 p-3 rounded-xl">2200 DA/Kg</span>
              </div>
            ) : (
              <input type="number" value={fraisFixe} onChange={(e) => setFraisFixe(e.target.value)} placeholder="Montant fixe en DA" className="w-full p-3 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none focus:bg-white focus:border-[#E8D5C4] border border-transparent" />
            )}
          </div>
          <div className="bg-[#8D7B68] p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10"><Sparkles size={80} /></div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">Prix de vente conseillé</p>
            <p className="text-3xl font-serif font-black mb-3">{formatDA(finalPrice)}</p>
            <div className="flex justify-between items-center pt-3 border-t border-white/20">
              <span className="text-[11px] font-medium opacity-90">Bénéfice Net Estimé</span>
              <span className="text-sm font-black text-[#D4B996] bg-white/10 px-3 py-1 rounded-lg">{formatDA(benefit)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliverySlipModal = ({ order, customers, onClose, formatDA }) => {
  const customer = customers.find((c) => c.id === order.customerId);
  const items = order.items || [];
  let calculatedSubtotal = 0;
  let validItemCount = 0;
  let validWeight = 0;
  items.forEach((item) => {
    if (item.status === "Retourné Fournisseur") {
      if (item.responsableRetour === "cliente") calculatedSubtotal += (parseFloat(item.fraisRetourLivreur) || 0) + (parseFloat(item.fraisRetourFournisseur) || 0);
    } else {
      calculatedSubtotal += parseFloat(item.priceVente) || 0;
      validItemCount += 1;
      validWeight += parseFloat(item.weightG) || 0;
    }
  });
  const totalWeight = validWeight / 1000;
  const itemCount = validItemCount;
  const subtotal = calculatedSubtotal;
  const shipping = parseFloat(order.shippingNational) || 0;
  const advance = parseFloat(order.advancePayment) || 0;
  const discount = parseFloat(order.discount) || 0;
  const refund = parseFloat(order.refundAmount) || 0;
  const isFullyPaidStatus = order.status === "Payée" || order.status === "Payée et livrée";
  const totalToPay = isFullyPaidStatus ? 0 : Math.max(0, subtotal + shipping - discount - advance + refund);

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1010] flex items-center justify-center p-4 print:absolute print:inset-0 print:bg-white print:p-0 print:z-[9999] print:block print:h-auto">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden print:w-full print:max-w-full print:max-h-none print:shadow-none print:rounded-none print:animate-none print:transform-none print:border-none print:h-auto print:overflow-visible">
        <div className="absolute top-4 right-4 flex gap-2 z-20 print:hidden">
          <button onClick={() => window.print()} className="p-2 bg-gray-50/90 backdrop-blur-md rounded-full hover:bg-[#8D7B68] hover:text-white text-[#8D7B68] transition-colors shadow-sm"><Printer size={18} /></button>
          <button onClick={onClose} className="p-2 bg-gray-50/90 backdrop-blur-md rounded-full hover:bg-gray-200 text-gray-600 transition-colors shadow-sm"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto custom-scrollbar flex-1 pb-8 print:overflow-visible print:pb-0 print:h-auto">
          <div className="bg-[#FAF7F2] p-8 pt-10 border-b border-[#E8D5C4]/40 text-center relative print:bg-white print:border-b-2 print:border-black print:p-4">
            <Truck size={32} className="mx-auto mb-3 text-[#8D7B68] print:text-black" />
            <h2 className="font-serif text-2xl font-bold text-[#8D7B68] tracking-widest mb-1 print:text-black">BORDEREAU</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#B8A99A] font-bold print:text-gray-800">Commande #{order.orderNumber}</p>
          </div>
          <div className="p-8 space-y-6 print:p-4 print:space-y-4">
            <div>
              <h4 className="text-[9px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100 pb-2 mb-3 print:text-gray-800 print:border-black">Destinataire</h4>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-[#4A3F35] text-base print:text-black">{order.customerName}</p>
                <p className="text-[#8D7B68] font-medium flex items-center gap-2 print:text-black"><Phone size={12} /> {customer?.phone} {customer?.phone2 && `/ ${customer?.phone2}`}</p>
                <div className="bg-gray-50 p-3 rounded-xl mt-2 text-xs text-gray-600 border border-gray-100 print:bg-white print:border print:border-black print:text-black print:p-2">
                  <p className="font-bold text-[#4A3F35] mb-1 print:text-black">{customer?.wilaya} - {customer?.commune}</p>
                  <p className="flex items-center gap-1.5 font-bold"><MapPin size={12} className="text-[#D4B996] print:text-black" /> {customer?.deliveryMode === "stopdesk" ? `Stopdesk: ${customer?.stopdeskName}` : "Livraison à Domicile"}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100 pb-2 mb-3 print:text-gray-800 print:border-black">Détails du colis</h4>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#E8D5C4]/30 text-center print:bg-white print:border print:border-black print:p-2">
                  <p className="text-[10px] text-[#B8A99A] uppercase font-bold mb-1 print:text-gray-800">Articles Valides</p>
                  <p className="font-black text-[#8D7B68] text-lg print:text-black">{itemCount}</p>
                </div>
                <div className="flex-1 bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#E8D5C4]/30 text-center print:bg-white print:border print:border-black print:p-2">
                  <p className="text-[10px] text-[#B8A99A] uppercase font-bold mb-1 print:text-gray-800">Poids Total</p>
                  <p className="font-black text-[#8D7B68] text-lg print:text-black">{totalWeight.toFixed(2)} <span className="text-xs">Kg</span></p>
                </div>
              </div>
              <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100 print:bg-white print:border print:border-black print:p-2">
                {items.map((item, idx) => {
                  const isReturned = item.status === "Retourné Fournisseur";
                  return (
                    <div key={idx} className={`flex flex-col border-b border-gray-200/50 last:border-0 pb-2 last:pb-0 print:border-gray-300 ${isReturned ? "opacity-50" : ""}`}>
                      <div className="flex justify-between items-start text-xs">
                        <span className={`text-[#4A3F35] font-bold pr-2 print:text-black ${isReturned ? "line-through" : ""}`}>• {item.name || "Article"} {isReturned && <span className="text-red-500 text-[10px] ml-1 no-underline">(Annulé)</span>}</span>
                        <span className="text-gray-500 text-[10px] whitespace-nowrap font-bold print:text-black">{item.size} / {item.color}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[#8D7B68] p-5 rounded-2xl text-white text-center shadow-md relative overflow-hidden print:bg-white print:border-2 print:border-black print:text-black print:shadow-none print:p-3">
              <p className="text-[10px] uppercase tracking-widest font-bold mb-1 print:text-gray-800">Montant à encaisser</p>
              <p className="text-3xl font-serif font-black print:text-black">{totalToPay > 0 ? formatDA(totalToPay) : "PAYÉ"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceiptModal = ({ order, onClose, formatDA }) => {
  const items = order.items || [];
  let calculatedSubtotal = 0;
  items.forEach((item) => {
    if (item.status === "Retourné Fournisseur") {
      if (item.responsableRetour === "cliente") calculatedSubtotal += (parseFloat(item.fraisRetourLivreur) || 0) + (parseFloat(item.fraisRetourFournisseur) || 0);
    } else {
      calculatedSubtotal += parseFloat(item.priceVente) || 0;
    }
  });
  const subtotal = calculatedSubtotal;
  const shipping = parseFloat(order.shippingNational) || 0;
  const advance = parseFloat(order.advancePayment) || 0;
  const discount = parseFloat(order.discount) || 0;
  const refund = parseFloat(order.refundAmount) || 0;
  const isFullyPaidStatus = order.status === "Payée" || order.status === "Payée et livrée";
  const total = isFullyPaidStatus ? 0 : Math.max(0, subtotal + shipping - discount - advance + refund);

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1010] flex items-center justify-center p-4 print:absolute print:inset-0 print:bg-white print:p-0 print:z-[9999] print:block print:h-auto">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden print:w-full print:max-w-full print:max-h-none print:shadow-none print:rounded-none print:animate-none print:transform-none print:border-none print:h-auto print:bg-white print:overflow-visible">
        <div className="absolute top-4 right-4 flex gap-2 z-20 print:hidden">
          <button onClick={() => window.print()} className="p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white text-[#8D7B68] transition-colors shadow-sm"><Printer size={18} /></button>
          <button onClick={onClose} className="p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white text-[#8D7B68] transition-colors shadow-sm"><X size={18} /></button>
        </div>
        <div className="p-8 md:p-10 pt-12 md:pt-12 text-center overflow-y-auto custom-scrollbar flex-1 print:overflow-visible print:p-4 print:h-auto print:pt-4">
          <div className="mb-6 md:mb-8">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#8D7B68] tracking-widest mb-1 print:text-black">YUNA'S SHOP</h2>
            <div className="h-px w-8 bg-[#D4B996] mx-auto mb-2 print:bg-black"></div>
            <p className="text-[8px] uppercase tracking-[0.4em] text-[#B8A99A] font-bold print:text-black">Bon de Commande</p>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E8D5C4]/30 text-left mb-6 md:mb-8 relative overflow-hidden shadow-sm print:bg-white print:border print:border-black print:shadow-none print:p-4">
            <p className="text-xs font-bold text-[#8D7B68] mb-1 print:text-black">{order.customerName}</p>
            <p className="text-[9px] text-[#B8A99A] uppercase tracking-wider mb-3 md:mb-4 print:text-gray-800 font-bold">CMD #{order.orderNumber}</p>
            <div className="space-y-3 print:space-y-2">
              {items.map((item, idx) => {
                const isReturned = item.status === "Retourné Fournisseur";
                const isCustomerFault = isReturned && item.responsableRetour === "cliente";
                const customerFees = isCustomerFault ? (parseFloat(item.fraisRetourLivreur) || 0) + (parseFloat(item.fraisRetourFournisseur) || 0) : 0;
                return (
                  <div key={idx} className={`flex flex-col border-b border-gray-100 last:border-0 pb-2 last:pb-0 print:border-gray-300 ${isReturned ? "opacity-60" : ""}`}>
                    <div className="flex justify-between items-start text-xs">
                      <span className={`text-[#4A3F35] font-bold pr-2 print:text-black ${isReturned ? "line-through" : ""}`}>{item.name || "Article"} {isReturned && <span className="text-red-400 text-[9px] ml-1 no-underline uppercase">Annulé</span>}</span>
                      <div className="text-right">
                        {isReturned ? (
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-gray-400 line-through text-[10px] print:text-gray-500">{formatDA(item.priceVente)}</span>
                            {customerFees > 0 && <span className="font-black text-red-400 text-[10px] mt-0.5 print:text-black">Frais: {formatDA(customerFees)}</span>}
                          </div>
                        ) : (
                          <span className="font-black text-[#8D7B68] print:text-black whitespace-nowrap">{formatDA(item.priceVente)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[10px]">
                      <span className="text-[#B8A99A] uppercase font-bold tracking-wider print:text-gray-600">{item.category || "Catégorie"}</span>
                      <span className="text-gray-400 font-medium print:text-gray-600">{item.size} / {item.color}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-2 md:space-y-3 text-xs bg-white/50 p-4 md:p-5 rounded-2xl border border-[#E8D5C4]/20 print:bg-transparent print:border-none print:p-0">
            <div className="flex justify-between text-[#8D7B68]/70 font-bold print:text-black print:font-medium"><span>Sous-total</span><span>{formatDA(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600/80 font-bold print:text-black"><span>Remise commerciale</span><span>- {formatDA(discount)}</span></div>}
            <div className="flex justify-between text-[#8D7B68]/70 font-bold print:text-black print:font-medium"><span>Livraison</span><span>{formatDA(shipping)}</span></div>
            <div className="flex justify-between text-[#8D7B68]/70 font-bold print:text-black"><span>Avance perçue</span><span>- {formatDA(advance)}</span></div>
            {refund > 0 && <div className="flex justify-between text-red-400 font-bold print:text-black"><span>Remboursement</span><span>+ {formatDA(refund)}</span></div>}
            <div className="h-px bg-[#E8D5C4] my-2 md:my-3 opacity-50 print:bg-black print:opacity-100 print:my-2"></div>
            <div className="flex justify-between font-serif font-bold text-lg md:text-xl text-[#8D7B68] print:text-black"><span>Reste à payer</span><span>{total > 0 ? formatDA(total) : "0.00 DA"}</span></div>
          </div>
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-[#E8D5C4]/30 print:border-black print:mt-4 print:pt-4">
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#D4B996] font-bold print:text-black">Merci pour votre confiance ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ deleteTarget, performDelete, onClose }) => (
  <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1050] flex items-end md:items-center justify-center p-0 md:p-4 pb-4">
    <div className="bg-white w-full md:max-w-xs rounded-[2rem] p-6 text-center shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95 pb-10 md:pb-6">
      <div className="w-12 h-12 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><AlertTriangle size={24} /></div>
      <h3 className="text-lg font-serif text-[#4A3F35] mb-1">Supprimer ?</h3>
      <p className="text-[11px] text-[#B8A99A] mb-6">Effacer définitivement <span className="font-bold text-[#8D7B68]">{deleteTarget?.label}</span> ? Irréversible.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 bg-[#FAF7F2] text-[#8D7B68] rounded-xl font-bold text-[10px] uppercase transition-colors shadow-sm">Annuler</button>
        <button onClick={performDelete} className="flex-1 py-3 bg-red-400 text-white rounded-xl font-bold text-[10px] uppercase shadow-md">Supprimer</button>
      </div>
    </div>
  </div>
);

const CustomerHistoryModal = ({ customer, orders, formatDA, onClose, onOpenOrder }) => {
  const history = orders.filter((o) => o.customerId === customer.id).sort((a, b) => {
    const tA = a.date?.toMillis ? a.date.toMillis() : new Date(a.date || 0).getTime();
    const tB = b.date?.toMillis ? b.date.toMillis() : new Date(b.date || 0).getTime();
    return tB - tA;
  });
  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 pb-4">
      <div className="bg-white w-full h-[85vh] md:h-auto md:max-h-[85vh] md:max-w-3xl rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4">
        <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-serif text-[#8D7B68] font-bold uppercase tracking-widest">Historique</h3>
            <p className="text-xs text-[#4A3F35] font-bold mt-1">{customer.name} • {history.length} commande(s)</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-400"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-3">
          {history.length === 0 ? (
            <p className="text-center text-sm text-gray-400 font-medium py-10">Aucune commande pour cette cliente.</p>
          ) : (
            history.map((o) => {
              const d = o.date?.toDate ? o.date.toDate().toLocaleDateString("fr-FR") : new Date(o.date).toLocaleDateString("fr-FR");
              const reste = calculateReste(o);
              const total = (parseFloat(o.totalVente) || 0) + (parseFloat(o.shippingNational) || 0);
              return (
                <div key={o.id} className="bg-[#FAF7F2]/50 p-4 rounded-2xl border border-[#E8D5C4]/30 flex flex-col md:flex-row justify-between md:items-center gap-3 hover:bg-[#FAF7F2] transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#8D7B68]">{o.orderNumber}</span>
                      <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-gray-100 text-gray-500 font-bold uppercase">{o.status}</span>
                    </div>
                    <p className="text-[10px] text-[#B8A99A] font-bold uppercase">{d}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right justify-between w-full md:w-auto">
                    <div className="flex items-center gap-4">
                      <div><p className="text-[9px] uppercase text-gray-400 font-bold mb-0.5">Total</p><p className="font-black text-[#8D7B68] text-sm">{formatDA(total)}</p></div>
                      <div className="pl-4 border-l border-[#E8D5C4]/40"><p className="text-[9px] uppercase text-gray-400 font-bold mb-0.5">Reste</p><p className={`font-black text-sm ${reste > 0 ? "text-red-400" : "text-green-500"}`}>{reste > 0 ? formatDA(reste) : "Payé"}</p></div>
                    </div>
                    <button onClick={() => onOpenOrder(o)} className="p-2.5 bg-white rounded-xl text-[#D4B996] shadow-sm hover:scale-105 transition-transform ml-2"><Edit3 size={16} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const DeliveryTariffModal = ({ onClose, formatDA }) => {
  const [selectedWilaya, setSelectedWilaya] = useState("");

  const wilayaNum = selectedWilaya ? selectedWilaya.substring(0, 2) : "--";
  const wilayaName = selectedWilaya ? selectedWilaya.substring(3).trim() : "Sélectionnez une wilaya";
  
  const tariffs = selectedWilaya && DELIVERY_TARIFFS[wilayaName] ? DELIVERY_TARIFFS[wilayaName] : null;

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[2000] flex items-end md:items-center justify-center p-0 md:p-4 pb-4">
      <div className="bg-[#FDFBF7] w-full md:max-w-md rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4">
        
        {/* EN-TÊTE */}
        <div className="p-6 border-b border-[#E8D5C4]/30 flex justify-between items-center bg-white rounded-t-[2rem]">
          <h3 className="text-lg font-serif text-[#8D7B68] font-bold flex items-center gap-2 tracking-widest uppercase">
            <Truck size={20} className="text-[#D4B996]" /> Tarifs Livraison
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* CONTENU */}
        <div className="p-6 space-y-6">
          
          {/* Sélecteur de Wilaya */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Destination</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4B996]" />
              <select 
                value={selectedWilaya} 
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-sm font-bold text-[#8D7B68] outline-none shadow-sm border border-[#E8D5C4]/50 focus:border-[#D4B996] appearance-none"
              >
                <option value="">Choisir une Wilaya...</option>
                {WILAYAS_58.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          {/* Affichage des Tarifs */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E8D5C4]/30 space-y-5 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
               <MapPin size={100} />
            </div>

            {/* Titre dynamique */}
            <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
              <span className="w-10 h-10 bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl flex items-center justify-center text-[#8D7B68] font-black text-lg shadow-sm">
                {wilayaNum}
              </span>
              <span className="font-serif text-xl font-bold text-[#4A3F35] tracking-wide truncate">
                {wilayaName}
              </span>
            </div>

            {/* Tarifs */}
            {selectedWilaya ? (
              tariffs ? (
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="bg-[#FAF7F2]/80 p-4 rounded-xl border border-[#E8D5C4]/40 flex flex-col items-center justify-center gap-1 text-center hover:-translate-y-1 transition-transform">
                    <Home size={18} className="text-[#8D7B68] mb-1" />
                    <span className="text-[9px] uppercase font-bold text-[#B8A99A] tracking-widest">À Domicile</span>
                    <span className="text-lg font-black text-[#8D7B68]">{formatDA(tariffs.dom)}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E8D5C4]/40 flex flex-col items-center justify-center gap-1 text-center shadow-sm hover:-translate-y-1 transition-transform">
                    <Store size={18} className="text-[#D4B996] mb-1" />
                    <span className="text-[9px] uppercase font-bold text-[#B8A99A] tracking-widest">Stopdesk</span>
                    <span className="text-lg font-black text-[#8D7B68]">{formatDA(tariffs.stop)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-sm font-bold text-red-400 bg-red-50 rounded-xl border border-red-100">
                  Tarif non défini pour cette wilaya.
                </div>
              )
            ) : (
              <div className="p-6 text-center text-xs font-bold text-gray-300">
                Sélectionnez une wilaya pour voir les tarifs.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
