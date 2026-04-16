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
  "01 Adrar",
  "02 Chlef",
  "03 Laghouat",
  "04 Oum El Bouaghi",
  "05 Batna",
  "06 Béjaïa",
  "07 Biskra",
  "08 Béchar",
  "09 Blida",
  "10 Bouira",
  "11 Tamanrasset",
  "12 Tébessa",
  "13 Tlemcen",
  "14 Tiaret",
  "15 Tizi Ouzou",
  "16 Alger",
  "17 Djelfa",
  "18 Jijel",
  "19 Sétif",
  "20 Saïda",
  "21 Skikda",
  "22 Sidi Bel Abbès",
  "23 Annaba",
  "24 Guelma",
  "25 Constantine",
  "26 Médéa",
  "27 Mostaganem",
  "28 M'Sila",
  "29 Mascara",
  "30 Ouargla",
  "31 Oran",
  "32 El Bayadh",
  "33 Illizi",
  "34 Bordj Bou Arreridj",
  "35 Boumerdès",
  "36 El Tarf",
  "37 Tindouf",
  "38 Tissemsilt",
  "39 El Oued",
  "40 Khenchela",
  "41 Souk Ahras",
  "42 Tipaza",
  "43 Mila",
  "44 Aïn Defla",
  "45 Naâma",
  "46 Aïn Témouchent",
  "47 Ghardaïa",
  "48 Relizane",
  "49 El M'Ghair",
  "50 El Meniaa",
  "51 Ouled Djellal",
  "52 Bordj Baji Mokhtar",
  "53 Béni Abbès",
  "54 Timimoun",
  "55 Touggourt",
  "56 Djanet",
  "57 In Salah",
  "58 In Guezzam",
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
  "A commander",
  "Réservée",
  "Payée une partie",
  "Payée",
  "En cours de livraison",
  "Livrée sans paiement",
  "Payée et livrée",
  "Annulée",
];
const SUGGESTED_COMMUNES = {
  "16 Alger": [
    "Alger Centre",
    "Sidi M'Hamed",
    "Kouba",
    "Birtouta",
    "Bab Ezzouar",
    "Dely Ibrahim",
    "Chéraga",
    "Zeralda",
    "Hydra",
    "Bir Mourad Raïs",
    "El Biar",
    "Bachidjerrah",
    "Dar El Beïda",
    "Bordj El Kiffan",
    "Rouiba",
    "Reghaïa",
    "Ain Taya",
  ],
  "09 Blida": [
    "Blida",
    "Boufarik",
    "Ouled Yaïch",
    "Beni Mered",
    "Bougara",
    "Meftah",
    "Larbaa",
    "Chréa",
  ],
  "31 Oran": [
    "Oran",
    "Bir El Djir",
    "Es Sénia",
    "Arzew",
    "Gdyel",
    "Mers El Kébir",
    "Boutlélis",
  ],
};

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBn2UV3ilolO7Rqj2bo4dm_vQsn3v_6Ia4",
  authDomain: "yunas-shop-app.firebaseapp.com",
  projectId: "yunas-shop-app",
  storageBucket: "yunas-shop-app.firebasestorage.app",
  messagingSenderId: "584178390864",
  appId: "1:584178390864:web:40c32f3de1acdae2793e55",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "yunas-shop-crm";

// --- HELPERS ---
const formatDA = (val) =>
  (parseFloat(val) || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " DA";

const calculateReste = (order) => {
  if (order.status === "Payée" || order.status === "Payée et livrée") return 0;
  const total =
    (parseFloat(order.totalVente) || 0) +
    (parseFloat(order.shippingNational) || 0);
  return Math.max(0, total - (parseFloat(order.advancePayment) || 0));
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
      <Icon size={18} />{" "}
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
  if (type === "instagram")
    return <span className="text-pink-500 font-black text-[12px]">IG</span>;
  if (type === "facebook")
    return <span className="text-blue-600 font-black text-[12px]">FB</span>;
  if (type === "whatsapp")
    return <MessageCircle size={size} className="text-green-500" />;
  return <User size={size} className="text-gray-400" />;
};

const ModalHeader = ({ title, onClose }) => (
  <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b border-gray-50/50 shrink-0 print:hidden">
    <h3 className="text-sm font-serif text-[#8D7B68] tracking-widest uppercase font-bold">
      {title}
    </h3>
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
      <p className="text-[9px] md:text-[10px] uppercase text-gray-400 font-bold tracking-widest flex-1 pr-2 leading-tight">
        {label}
      </p>
      {Icon && (
        <div className={`p-2 rounded-xl ${highlight ? 'bg-[#FAF7F2]' : 'bg-white'}`}>
          <Icon size={16} style={{ color }} />
        </div>
      )}
    </div>
    <div>
      <div
        className="text-lg md:text-2xl font-serif font-black tracking-tight"
        style={{ color }}
      >
        {value}
      </div>
      {(subValue || percentage != null) && (
        <div className="flex items-center gap-2 mt-1.5 md:mt-2">
          {percentage != null && (
            <span 
              className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                invertColor 
                  ? 'bg-rose-50 text-rose-500' // Pour les dépenses (rouge)
                  : parseFloat(percentage) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500' // Pour les marges (vert si +, rouge si -)
              }`}
            >
              {parseFloat(percentage) > 0 && !invertColor ? '+' : ''}{percentage}%
            </span>
          )}
          {subValue && (
            <span className="text-[10px] font-bold text-[#B8A99A]">
              {subValue}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);

// --- TOAST COMPONENT ---
const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 print:hidden ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <span className="text-xs font-bold">{msg}</span>
      <button onClick={onClose} className="opacity-80 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
};

// --- COMPOSANT DE CONNEXION ---
function Login() {
  const [error, setError] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      e.target.email.value,
      e.target.password.value
    ).catch(() => setError("Identifiants incorrects."));
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FDFBF7",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          padding: "30px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          textAlign: "center",
          width: "100%",
          maxWidth: "350px",
          border: "1px solid #EBE5D9",
        }}
      >
        <h2
          style={{
            color: "#8D7B68",
            fontWeight: "bold",
            marginBottom: "5px",
            fontSize: "20px",
            fontFamily: "serif",
            letterSpacing: "2px",
          }}
        >
          YUNA'S SHOP
        </h2>
        <p
          style={{
            color: "#B8A99A",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Suite Elite de Sara
        </p>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            name="email"
            type="email"
            placeholder="Email admin"
            required
            style={{
              padding: "12px",
              border: "1px solid #EBE5D9",
              borderRadius: "12px",
              outline: "none",
              backgroundColor: "#FAF7F2",
              fontSize: "14px",
              color: "#4A3F35",
              fontWeight: "bold",
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            required
            style={{
              padding: "12px",
              border: "1px solid #EBE5D9",
              borderRadius: "12px",
              outline: "none",
              backgroundColor: "#FAF7F2",
              fontSize: "14px",
              color: "#4A3F35",
              fontWeight: "bold",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#8D7B68",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "12px",
              marginTop: "10px",
              textTransform: "uppercase",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            Accéder au CRM
          </button>
        </form>
        {error && (
          <p
            style={{
              color: "#EF4444",
              fontSize: "12px",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// --- LE CRM COMPLET ---
const MainApp = ({ user }) => {
  const [globalSearch, setGlobalSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterCommune, setFilterCommune] = useState("");
  const [filterDelivery, setFilterDelivery] = useState("");
  const [filterStopdesk, setFilterStopdesk] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);

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
    categories: [
      "Mode Femme",
      "Beauté",
      "Chaussures",
      "Kids",
      "Maison",
      "Accessoires",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2 ans", "4 ans", "Unique"],
    colors: [
      "Beige Nude",
      "Rose Poudré",
      "Blanc Cassé",
      "Taupe",
      "Marron Clair",
      "Noir",
    ],
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

  useEffect(() => {
    const path = (coll) =>
      collection(db, "artifacts", appId, "public", "data", coll);
    const unsubC = onSnapshot(path("customers"), (s) =>
      setCustomers(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubO = onSnapshot(path("orders"), (s) =>
      setOrders(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubA = onSnapshot(path("arrivages"), (s) =>
      setArrivages(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubR = onSnapshot(path("currencyRates"), (s) =>
      setCurrencyRates(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubS = onSnapshot(path("sponsors"), (s) =>
      setSponsors(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubE = onSnapshot(path("expenses"), (s) =>
      setExpenses(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
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
    return () => {
      unsubC();
      unsubO();
      unsubA();
      unsubR();
      unsubS();
      unsubE();
      unsubConfig();
    };
  }, []);

  const saveConfig = async (newConfig) => {
    await setDoc(
      doc(db, "artifacts", appId, "public", "data", "config", "global"),
      newConfig
    );
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
      dateInput instanceof Date
        ? dateInput
        : dateInput?.toDate
        ? dateInput.toDate()
        : new Date(dateInput);
    const sorted = [...currencyRates].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return (
      sorted.find((r) => new Date(r.date) <= targetDate)?.rate ||
      sorted[0]?.rate ||
      250
    );
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
    let venteTotal = 0,
      costOfGoods = 0;
    const processed =
      items?.map((it) => {
        const stats = getArrivageStats(it.arrivageId);
        const itAchatDA = (parseFloat(it.priceAchatEuro) || 0) * rateEur;
        const itLogInt = ((parseFloat(it.weightG) || 0) / 1000) * stats.rate;
        venteTotal += parseFloat(it.priceVente) || 0;
        costOfGoods += itAchatDA + itLogInt;
        return {
          ...it,
          itAchatDA,
          itLogInt,
          itBenefit: (parseFloat(it.priceVente) || 0) - (itAchatDA + itLogInt),
        };
      }) || [];
    return { venteTotal, benefit: venteTotal - costOfGoods, processed };
  };

  const getCalculatedWeightForArrivage = (arrivageId) => {
    let totalG = 0;
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (item.arrivageId === arrivageId)
          totalG += parseFloat(item.weightG) || 0;
      });
    });
    return totalG / 1000;
  };

  // Alertes Retards de livraison (> 7 jours)
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
          d.getFullYear() === filterYear &&
          (filterMonth === 0 || d.getMonth() + 1 === filterMonth);
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
        const matchStatus =
          !orderStatusFilter || o.status === orderStatusFilter;
        return isSameMonth && matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const timeA = a.date?.toMillis
          ? a.date.toMillis()
          : new Date(a.date || 0).getTime();
        const timeB = b.date?.toMillis
          ? b.date.toMillis()
          : new Date(b.date || 0).getTime();
        return timeB - timeA;
      });
  }, [
    orders,
    filterYear,
    filterMonth,
    orderSearch,
    globalSearch,
    orderStatusFilter,
  ]);

  const filteredArrivages = useMemo(() => {
    return arrivages
      .filter((a) => {
        const d = new Date(a.date || new Date());
        return (
          d.getFullYear() === filterYear &&
          (filterMonth === 0 || d.getMonth() + 1 === filterMonth)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [arrivages, filterYear, filterMonth]);

  const totalWeightFilteredArrivages = useMemo(() => {
    return filteredArrivages.reduce(
      (sum, arr) => sum + (parseFloat(arr.totalWeightKg) || 0),
      0
    );
  }, [filteredArrivages]);

  const stats = useMemo(() => {
    const dOrders = orders.filter((o) => {
      const d = o.date?.toDate ? o.date.toDate() : new Date(o.date);
      return (
        d.getFullYear() === filterYear &&
        (filterMonth === 0 || d.getMonth() + 1 === filterMonth)
      );
    });
    const filteredSponsors = sponsors.filter((s) => {
      const d = new Date(s.date);
      return (
        d.getFullYear() === filterYear &&
        (filterMonth === 0 || d.getMonth() + 1 === filterMonth)
      );
    });
    const filteredExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === filterYear &&
        (filterMonth === 0 || d.getMonth() + 1 === filterMonth)
      );
    });

    const totalRevenue = dOrders.reduce((sum, o) => sum + (parseFloat(o.totalVente) || 0), 0);
    const totalBenefitBrut = dOrders.reduce((sum, o) => sum + (parseFloat(o.benefit) || 0), 0);
    const totalSponsors = filteredSponsors.reduce((sum, s) => sum + (parseFloat(s.amountDA) || 0), 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amountDA) || 0), 0);

    const netBenefit = totalBenefitBrut - totalSponsors - totalExpenses;
    const ordersCount = dOrders.length;

    // --- NOUVEAUX CALCULS DES POURCENTAGES ---
    const netMarginPercentage = totalRevenue > 0 ? ((netBenefit / totalRevenue) * 100).toFixed(1) : 0;
    const brutMarginPercentage = totalRevenue > 0 ? ((totalBenefitBrut / totalRevenue) * 100).toFixed(1) : 0;
    const expensesPercentage = totalRevenue > 0 ? (((totalSponsors + totalExpenses) / totalRevenue) * 100).toFixed(1) : 0;
    const averageOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;

    const clientMap = {};
    dOrders.forEach((o) => {
      if (!clientMap[o.customerId])
        clientMap[o.customerId] = { name: o.customerName, total: 0, count: 0 };
      clientMap[o.customerId].total += parseFloat(o.totalVente) || 0;
      clientMap[o.customerId].count += 1;
    });
    const topClients = Object.values(clientMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      totalRevenue,
      totalBenefitBrut,
      totalSponsors,
      totalExpenses,
      netBenefit,
      ordersCount,
      topClients,
      netMarginPercentage,
      brutMarginPercentage,
      expensesPercentage,
      averageOrderValue
    };
  }, [orders, sponsors, expenses, filterYear, filterMonth]);

  // Données pour le Graphique Mensuel (12 mois)
  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    return months.map((monthName, index) => {
      const monthNum = index + 1;
      const mOrders = orders.filter((o) => {
        const d = o.date?.toDate ? o.date.toDate() : new Date(o.date);
        return d.getFullYear() === filterYear && d.getMonth() + 1 === monthNum;
      });
      const mSponsors = sponsors.filter((s) => {
        const d = new Date(s.date);
        return d.getFullYear() === filterYear && d.getMonth() + 1 === monthNum;
      });
      const mExpenses = expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === filterYear && d.getMonth() + 1 === monthNum;
      });

      const ca = mOrders.reduce(
        (sum, o) => sum + (parseFloat(o.totalVente) || 0),
        0
      );
      const benefBrut = mOrders.reduce(
        (sum, o) => sum + (parseFloat(o.benefit) || 0),
        0
      );
      const frais =
        mSponsors.reduce((sum, s) => sum + (parseFloat(s.amountDA) || 0), 0) +
        mExpenses.reduce((sum, e) => sum + (parseFloat(e.amountDA) || 0), 0);
      const net = benefBrut - frais;

      return { name: monthName, CA: ca, Net: net };
    });
  }, [orders, sponsors, expenses, filterYear]);

  const handleSaveOrder = async (e, setIsSaving) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.target);
      const customer = customers.find(
        (c) => c.id === formData.get("customerId")
      );
      const selectedDate = new Date(formData.get("orderDate") || new Date());
      const t = calculateTotals(orderItems, shippingNational, selectedDate);
      const totalAdvance = orderPayments.reduce(
        (sum, p) => sum + parseFloat(p.amount || 0),
        0
      );

      const data = {
        orderNumber: formData.get("orderNumber"),
        customerId: formData.get("customerId"),
        customerName: customer?.name || "Inconnue",
        items: t.processed,
        payments: orderPayments,
        shippingNational: parseFloat(shippingNational) || 0,
        advancePayment: totalAdvance,
        totalVente: t.venteTotal,
        benefit: t.benefit,
        status: orderStatus,
        date: Timestamp.fromDate(selectedDate),
      };

      if (editingOrder) {
        await updateDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "orders",
            editingOrder.id
          ),
          data
        );
        showToast("Commande modifiée avec succès");
      } else {
        await addDoc(
          collection(db, "artifacts", appId, "public", "data", "orders"),
          data
        );
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

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      phone2: formData.get("phone2") || "",
      wilaya: formData.get("wilaya"),
      commune: formData.get("commune"),
      deliveryMode: formData.get("deliveryMode"),
      stopdeskName: formData.get("stopdeskName") || "",
      platform: formData.get("platform"),
      createdAt: editingCustomer ? editingCustomer.createdAt : Timestamp.now(),
    };
    if (editingCustomer) {
      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "customers",
          editingCustomer.id
        ),
        data
      );
      showToast("Cliente modifiée");
    } else {
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "customers"),
        data
      );
      showToast("Nouvelle cliente ajoutée");
    }
    setShowAddCustomer(false);
    setEditingCustomer(null);
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
      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "arrivages",
          editingArrivage.id
        ),
        data
      );
      showToast("Arrivage modifié");
    } else {
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "arrivages"),
        data
      );
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
    await addDoc(
      collection(db, "artifacts", appId, "public", "data", "sponsors"),
      {
        amountEur,
        amountDA: amountEur * getRateForDate(date),
        date,
        createdAt: Timestamp.now(),
      }
    );
    showToast("Sponsor ajouté");
    setShowAddSponsor(false);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await addDoc(
      collection(db, "artifacts", appId, "public", "data", "expenses"),
      {
        label: fd.get("label"),
        amountDA: parseFloat(fd.get("amountDA")),
        date: fd.get("date"),
        createdAt: Timestamp.now(),
      }
    );
    showToast("Dépense ajoutée");
    setShowAddExpense(false);
  };

  const performDelete = async () => {
    if (!deleteTarget) return;
    await deleteDoc(
      doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        deleteTarget.collection,
        deleteTarget.id
      )
    );
    showToast("Élément supprimé", "error");
    setDeleteTarget(null);
  };

  const exportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast("Aucune donnée à exporter", "error");
      return;
    }
    const headers = [
      "N° Commande",
      "Date",
      "Cliente",
      "Statut",
      "Total DA",
      "Avance DA",
      "Reste DA",
    ];
    const rows = filteredOrders.map((o) => {
      const d = o.date?.toDate
        ? o.date.toDate().toLocaleDateString("fr-FR")
        : new Date(o.date).toLocaleDateString("fr-FR");
      const total =
        (parseFloat(o.totalVente) || 0) + (parseFloat(o.shippingNational) || 0);
      const reste = calculateReste(o);
      return [
        o.orderNumber,
        d,
        o.customerName,
        o.status,
        total.toFixed(2),
        parseFloat(o.advancePayment || 0).toFixed(2),
        reste.toFixed(2),
      ];
    });

    let csvContent =
      "\uFEFF" +
      headers.join(";") +
      "\n" +
      rows.map((e) => e.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Commandes_Yunas_Shop_${filterMonth}_${filterYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV généré !");
  };

  const handleAiAnalysis = async () => {
    setAiLoading(true);
    setAiAnalysis("Connexion à l'IA en cours...");

    try {
      const prompt = `Analyse ces résultats pour ma boutique e-commerce algérienne (Shein). CA: ${stats.totalRevenue} DA. Marge brute: ${stats.totalBenefitBrut} DA. Bénéfice net: ${stats.netBenefit} DA. Nombre de commandes: ${stats.ordersCount}. Donne-moi 3 conseils d'experte très courts et encourageants.`;

      // Simulation d'une vraie analyse en attendant ton backend :
      setTimeout(() => {
        setAiAnalysis(
          `Analyse du mois : Ton panier moyen est de ${parseFloat(
            stats.totalRevenue / stats.ordersCount || 0
          ).toFixed(
            2
          )} DA, c'est super ! 1. Tente de faire de l'upsell (proposer un accessoire) pour augmenter ce panier. 2. Tes frais publicitaires représentent ${parseFloat(
            (stats.totalSponsors / stats.totalRevenue) * 100 || 0
          ).toFixed(
            2
          )}% du CA, surveille ce ratio. 3. Relance tes clientes fidèles avec un petit code promo pour écouler le stock restant.`
        );
        setAiLoading(false);
      }, 2000);
    } catch (err) {
      setAiAnalysis("Erreur de connexion à l'IA. Vérifie ta clé API.");
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#FDFBF7] text-[#4A3F35] print:block print:h-auto print:overflow-visible print:bg-white">
      <Toast
        msg={toast?.msg}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
      <datalist id="catList">
        {config.categories?.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <datalist id="sizeList">
        {config.sizes?.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <datalist id="colorList">
        {config.colors?.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <aside className="hidden md:flex w-64 border-r border-[#E8D5C4]/30 p-6 flex-col gap-6 bg-white/50 backdrop-blur-md z-10 shadow-sm print:hidden">
        <div className="px-2 text-center">
          <h1 className="text-xl font-serif tracking-widest text-[#8D7B68] font-bold">
            YUNA'S SHOP
          </h1>
          <p className="text-[9px] uppercase tracking-tighter opacity-50 font-bold italic">
            Suite Elite de Sara ✨
          </p>
        </div>
        <nav className="flex-1 space-y-2 mt-4">
          <SidebarItem
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            icon={LayoutDashboard}
            label="Tableau de bord"
          />
          <SidebarItem
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            icon={Package}
            label="Commandes"
            badge={lateDeliveries.length}
          />
          <SidebarItem
            active={activeTab === "customers"}
            onClick={() => setActiveTab("customers")}
            icon={Users}
            label="Base Clientes"
          />
          <SidebarItem
            active={activeTab === "arrivages"}
            onClick={() => setActiveTab("arrivages")}
            icon={Globe}
            label="Arrivages (Logistique)"
          />
          <SidebarItem
            active={activeTab === "finances"}
            onClick={() => setActiveTab("finances")}
            icon={Euro}
            label="Trésorerie"
          />
        </nav>
        <button
          onClick={() => setShowConfig(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-[#8D7B68] transition-all bg-white/60 shadow-sm"
        >
          <Settings2 size={18} />{" "}
          <span className="text-xs font-bold uppercase tracking-widest">
            Options
          </span>
        </button>
        <button
          onClick={() => signOut(auth)}
          className="w-full mt-2 py-2 text-[10px] uppercase font-bold text-gray-400 hover:text-red-400 transition-all"
        >
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 relative custom-scrollbar bg-[#FDFBF7] print:hidden">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Bloc de Gauche : Titre et Boutons Mobiles */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between">
            <div className="flex items-center gap-2">
              <div className="md:hidden w-8 h-8 bg-[#8D7B68] rounded-xl flex items-center justify-center text-white shadow-sm">
                <Star size={16} />
              </div>
              <h2 className="text-lg md:text-2xl font-serif text-[#8D7B68] capitalize font-bold flex items-center gap-3">
                {activeTab}
                {activeTab === "orders" && lateDeliveries.length > 0 && (
                  <span className="bg-red-100 text-red-500 text-[10px] px-2 py-1 rounded-full font-black animate-pulse flex items-center gap-1">
                    <AlertTriangle size={12} /> {lateDeliveries.length}{" "}
                    retard(s)
                  </span>
                )}
              </h2>
            </div>
            
            {/* Boutons visibles uniquement sur Mobile */}
            <div className="flex gap-2 md:hidden">
              <button
                onClick={() => setShowCalculator(true)}
                className="p-2.5 text-white bg-[#8D7B68] rounded-xl shadow-sm hover:scale-105 transition-transform"
                title="Simulateur de prix"
              >
                <Calculator size={16} />
              </button>
              <button
                onClick={() => setShowConfig(true)}
                className="p-2.5 text-[#8D7B68] bg-white rounded-xl shadow-sm border border-[#E8D5C4]/30"
              >
                <Settings2 size={16} />
              </button>
            </div>
          </div>

          {/* Bloc de Droite : Bouton PC, Recherche et Filtres */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {/* Bouton Calculatrice visible uniquement sur PC */}
            <button
              onClick={() => setShowCalculator(true)}
              className="hidden md:flex px-4 py-2.5 text-white bg-[#8D7B68] rounded-full shadow-sm hover:-translate-y-1 transition-transform items-center gap-2 font-bold text-xs"
              title="Simulateur de prix"
            >
              <Calculator size={14} /> Simulateur
            </button>

            {/* Barre de Recherche Globale */}
            <div className="relative w-full md:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Recherche globale..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-full text-xs font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/40 focus:border-[#8D7B68]"
              />
            </div>
            
            {/* Filtres par Date */}
            <div className="flex gap-1 bg-white/80 p-1.5 rounded-xl shadow-sm border border-[#E8D5C4]/20 w-full md:w-auto justify-center">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="text-[10px] md:text-xs font-bold outline-none bg-transparent text-[#8D7B68]"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
              <span className="text-gray-300">|</span>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                className="text-[10px] md:text-xs font-bold outline-none bg-transparent text-[#8D7B68]"
              >
                {[
                  "Tous", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
                ].map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-4 md:space-y-8 animate-in fade-in">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <StatCard
                label="Chiffre d'Affaires"
                value={formatDA(stats.totalRevenue)}
                subValue={`${stats.ordersCount} ventes`}
                color="#8D7B68"
                highlight
                icon={TrendingUp}
              />
              <StatCard
                label="Panier Moyen"
                value={formatDA(stats.averageOrderValue)}
                color="#D4B996"
                icon={Package}
              />
              <StatCard
                label="Marge Brute"
                value={formatDA(stats.totalBenefitBrut)}
                percentage={stats.brutMarginPercentage}
                color="#22C55E"
                icon={PieChart}
              />
              <StatCard
                label="Dépenses & Pubs"
                value={formatDA(stats.totalSponsors + stats.totalExpenses)}
                percentage={stats.expensesPercentage}
                invertColor={true} 
                color="#EF4444"
                icon={Megaphone}
              />
              <StatCard
                label="Bénéfice Net"
                value={formatDA(stats.netBenefit)}
                percentage={stats.netMarginPercentage}
                color={stats.netBenefit > 0 ? "#22C55E" : "#EF4444"}
                highlight
                icon={DollarSign}
              />
            </div>

            {/* Nouveau Graphique 12 Mois */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20 h-80">
              <h3 className="font-serif text-sm md:text-base text-[#8D7B68] mb-4 font-bold flex items-center gap-2">
                <TrendingUp size={16} /> Évolution Annuelle ({filterYear})
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#B8A99A" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#B8A99A" }}
                    width={60}
                  />
                  <RechartsTooltip
                    formatter={(value) => [formatDA(value)]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="CA"
                    stroke="#8D7B68"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Net"
                    stroke="#22C55E"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
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
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 md:p-4 bg-[#FAF7F2]/30 rounded-xl md:rounded-2xl border border-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#E8D5C4] flex items-center justify-center text-[10px] font-bold text-white">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="text-[11px] md:text-xs font-bold text-[#4A3F35]">
                            {c.name}
                          </p>
                          <p className="text-[8px] text-[#B8A99A] uppercase font-black">
                            {c.count} cmd
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] md:text-xs font-black text-[#8D7B68]">
                        {formatDA(c.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FAF7F2]/80 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/30 flex flex-col relative">
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="font-serif text-sm md:text-lg text-[#8D7B68] flex items-center gap-2">
                    <Edit3 size={16} className="text-[#D4B996]" /> Notes &
                    Tâches
                  </h3>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 bg-[#8D7B68] text-white rounded-lg text-[9px] font-bold uppercase shadow-sm hover:scale-105 transition-transform"
                  >
                    Sauvegarder
                  </button>
                </div>
                <textarea
                  value={dashboardNote}
                  onChange={(e) => setDashboardNote(e.target.value)}
                  placeholder="Un rappel, une tâche urgente, une idée pour la boutique..."
                  className="flex-1 w-full bg-transparent border-none outline-none resize-none text-xs md:text-sm text-[#6B5A4B] font-medium custom-scrollbar min-h-[120px]"
                />
              </div>
              <div className="bg-gradient-to-br from-white to-[#FAF7F2] p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/30 relative overflow-hidden group">
                <BrainCircuit
                  size={80}
                  className="absolute -right-5 -bottom-5 text-[#D4B996] opacity-10"
                />
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="font-serif text-sm md:text-lg text-[#8D7B68] flex items-center gap-2">
                    <Sparkles size={16} className="text-[#D4B996]" /> Analyse IA
                    Experte
                  </h3>
                  <button
                    onClick={handleAiAnalysis}
                    disabled={aiLoading}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-[#8D7B68] text-white rounded-lg md:rounded-full text-[9px] font-bold uppercase flex items-center gap-1 shadow-sm"
                  >
                    {aiLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Wand2 size={12} />
                    )}{" "}
                    Analyser
                  </button>
                </div>
                <div className="min-h-[80px] md:min-h-[150px] text-[10px] md:text-xs leading-relaxed font-medium text-[#6B5A4B] relative z-10">
                  {aiAnalysis ? (
                    <div className="bg-white/90 p-4 rounded-xl shadow-sm border border-[#E8D5C4]">
                      {aiAnalysis}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                      <Lightbulb size={24} className="mb-2" />
                      <p>
                        Cliquez pour générer des conseils basés sur vos vrais
                        chiffres.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-3 md:space-y-6 animate-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A99A]"
                />
                <input
                  type="text"
                  placeholder="Chercher (n° commande, nom, article)..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30"
                />
              </div>
              <div className="relative w-full md:w-56">
                <Filter
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A99A]"
                />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30 appearance-none"
                >
                  <option value="">Tous les statuts</option>
                  {orderStatusesList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={exportCSV}
                  className="px-4 py-2.5 rounded-full text-[#8D7B68] bg-white border border-[#E8D5C4] text-sm font-bold shadow-sm hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  <Download size={16} />{" "}
                  <span className="hidden md:inline">Export</span>
                </button>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    const prefix = `${today.slice(2, 4)}${today.slice(5, 7)}-`;
                    const monthOrders = orders.filter((o) =>
                      o.orderNumber?.startsWith(prefix)
                    );
                    const nextNum =
                      monthOrders.length === 0
                        ? 1
                        : Math.max(
                            ...monthOrders.map(
                              (o) => parseInt(o.orderNumber.split("-")[1]) || 0
                            )
                          ) + 1;
                    setOrderNumber(
                      `${prefix}${String(nextNum).padStart(3, "0")}`
                    );
                    setOrderDate(today);
                    setOrderItems([
                      {
                        id: Date.now(),
                        name: "",
                        category: "",
                        size: "",
                        color: "",
                        weightG: 0,
                        priceAchatEuro: 0,
                        priceVente: 0,
                        arrivageId: "",
                        status: "A commander",
                      },
                    ]);
                    setOrderPayments([]);
                    setShippingNational(0);
                    setOrderStatus("A commander");
                    setShowAddOrder(true);
                    setEditingOrder(null);
                  }}
                  className="flex-1 md:w-auto px-6 py-4 md:py-2.5 rounded-2xl md:rounded-full text-white bg-[#8D7B68] text-sm font-bold shadow-md hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
                >
                  <Plus size={16} /> Nouvelle Vente
                </button>
              </div>
            </div>

            <div className="hidden md:block bg-white/80 rounded-[2rem] shadow-sm overflow-auto max-h-[65vh] custom-scrollbar border border-[#E8D5C4]/30 relative">
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                <thead className="bg-[#FAF7F2] border-b border-[#E8D5C4]/20 text-[#B8A99A] font-bold uppercase tracking-widest text-[9px] sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4">N°</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">État</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-right">Reste</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[11px]">
                  {filteredOrders.map((o) => {
                    const total =
                      (parseFloat(o.totalVente) || 0) +
                      (parseFloat(o.shippingNational) || 0);
                    const reste = calculateReste(o);

                    const isLate =
                      o.status === "En cours de livraison" &&
                      lateDeliveries.find((late) => late.id === o.id);

                    return (
                      <tr
                        key={o.id}
                        className={`group transition-colors ${
                          isLate
                            ? "bg-red-50/40 hover:bg-red-50/60"
                            : "hover:bg-[#FAF7F2]/50"
                        }`}
                      >
                        <td className="p-4 font-bold text-[#8D7B68]">
                          {o.orderNumber}
                          {isLate && (
                            <AlertTriangle
                              size={12}
                              className="inline ml-2 text-red-500 animate-pulse"
                              title="En livraison depuis +7 jours"
                            />
                          )}
                        </td>
                        <td className="p-4 font-medium text-[#4A3F35]">
                          {o.customerName}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 bg-white rounded-md text-[9px] uppercase font-bold shadow-sm border ${
                              isLate
                                ? "border-red-300 text-red-500"
                                : "border-gray-100 text-gray-500"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right font-black text-[#8D7B68]">
                          {formatDA(total)}
                        </td>
                        <td
                          className={`p-4 text-right font-black ${
                            reste > 0 ? "text-[#EF4444]" : "text-green-500"
                          }`}
                        >
                          {reste > 0 ? formatDA(reste) : "Réglé"}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => setShowCostBreakdown(o)}
                            className="text-blue-400 p-1.5 hover:bg-blue-50 rounded-lg"
                          >
                            <Calculator size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeliverySlip(o)}
                            className="text-[#8D7B68] p-1.5 hover:bg-[#FAF7F2] rounded-lg"
                          >
                            <Truck size={16} />
                          </button>
                          <button
                            onClick={() => setShowReceipt(o)}
                            className="text-[#D4B996] p-1.5 hover:bg-[#FAF7F2] rounded-lg"
                          >
                            <Receipt size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrder(o);
                              setOrderItems(o.items || []);
                              setShippingNational(o.shippingNational || 0);
                              const existingDate = o.date?.toDate
                                ? o.date.toDate().toISOString().split("T")[0]
                                : new Date(o.date || Date.now())
                                    .toISOString()
                                    .split("T")[0];
                              setOrderPayments(
                                o.payments ||
                                  (o.advancePayment
                                    ? [
                                        {
                                          id: Date.now(),
                                          amount: o.advancePayment,
                                          date: existingDate,
                                        },
                                      ]
                                    : [])
                              );
                              setOrderStatus(o.status);
                              setOrderDate(existingDate);
                              setOrderNumber(o.orderNumber);
                              setShowAddOrder(true);
                            }}
                            className="text-gray-400 p-1.5 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                id: o.id,
                                collection: "orders",
                                label: o.orderNumber,
                              })
                            }
                            className="text-red-300 p-1.5 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Footer Totaux */}
              <div className="sticky bottom-0 bg-white border-t border-[#E8D5C4]/50 p-4 flex justify-end gap-8 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-gray-400">
                    Total CA Filtré
                  </p>
                  <p className="text-sm font-black text-[#8D7B68]">
                    {formatDA(
                      filteredOrders.reduce(
                        (sum, o) =>
                          sum +
                          (parseFloat(o.totalVente) || 0) +
                          (parseFloat(o.shippingNational) || 0),
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-gray-400">
                    Total Reste Client
                  </p>
                  <p className="text-sm font-black text-red-500">
                    {formatDA(
                      filteredOrders.reduce(
                        (sum, o) => sum + calculateReste(o),
                        0
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:hidden space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 touch-pan-y">
              {filteredOrders.map((o) => {
                const total =
                  (parseFloat(o.totalVente) || 0) +
                  (parseFloat(o.shippingNational) || 0);
                const reste = calculateReste(o);
                const isLate =
                  o.status === "En cours de livraison" &&
                  lateDeliveries.find((late) => late.id === o.id);

                return (
                  <div
                    key={o.id}
                    className={`p-4 rounded-2xl shadow-sm border flex flex-col gap-3 ${
                      isLate
                        ? "bg-red-50/40 border-red-200"
                        : "bg-white border-[#E8D5C4]/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-[#B8A99A] font-bold uppercase">
                          {o.orderNumber}{" "}
                          {isLate && (
                            <AlertTriangle
                              size={12}
                              className="inline ml-1 text-red-500"
                            />
                          )}
                        </span>
                        <h4 className="font-bold text-[#4A3F35] text-sm">
                          {o.customerName}
                        </h4>
                      </div>
                      <span className="px-2 py-1 bg-gray-50 rounded-lg text-[9px] uppercase font-bold text-gray-500 border border-gray-100">
                        {o.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#FAF7F2]/50 p-2.5 rounded-xl border border-transparent">
                      <div>
                        <p className="text-[8px] uppercase text-gray-400 font-bold">
                          Total
                        </p>
                        <p className="font-black text-[#8D7B68] text-xs">
                          {formatDA(total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase text-gray-400 font-bold">
                          Reste
                        </p>
                        <p
                          className={`font-black text-xs ${
                            reste > 0 ? "text-red-400" : "text-green-500"
                          }`}
                        >
                          {reste > 0 ? formatDA(reste) : "Payé"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setShowCostBreakdown(o)}
                          className="text-blue-400 p-1.5"
                        >
                          <Calculator size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeliverySlip(o)}
                          className="text-[#8D7B68] p-1.5"
                        >
                          <Truck size={16} />
                        </button>
                        <button
                          onClick={() => setShowReceipt(o)}
                          className="text-[#D4B996] p-1.5"
                        >
                          <Receipt size={16} />
                        </button>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingOrder(o);
                            setOrderItems(o.items || []);
                            setShippingNational(o.shippingNational || 0);
                            const existingDate = o.date?.toDate
                              ? o.date.toDate().toISOString().split("T")[0]
                              : new Date(o.date || Date.now())
                                  .toISOString()
                                  .split("T")[0];
                            setOrderPayments(
                              o.payments ||
                                (o.advancePayment
                                  ? [
                                      {
                                        id: Date.now(),
                                        amount: o.advancePayment,
                                        date: existingDate,
                                      },
                                    ]
                                  : [])
                            );
                            setOrderStatus(o.status);
                            setOrderDate(existingDate);
                            setOrderNumber(o.orderNumber);
                            setShowAddOrder(true);
                          }}
                          className="text-gray-400 p-1.5"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: o.id,
                              collection: "orders",
                              label: o.orderNumber,
                            })
                          }
                          className="text-red-300 p-1.5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Rechercher (nom, tél)..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full md:flex-1 px-4 py-3.5 md:py-2.5 bg-white/80 rounded-2xl md:rounded-full text-sm font-bold shadow-sm outline-none text-[#8D7B68] border border-[#E8D5C4]/30"
              />
              <button
                onClick={() => {
                  setEditingCustomer(null);
                  setShowAddCustomer(true);
                }}
                className="w-full md:w-auto px-6 py-4 md:py-2.5 rounded-2xl md:rounded-full text-white bg-[#8D7B68] text-sm font-bold shadow-md flex justify-center items-center gap-2"
              >
                <Plus size={16} className="md:hidden" /> Nouvelle Cliente
              </button>
            </div>
            <div className="flex overflow-x-auto gap-2 md:gap-3 pb-2 md:pb-0 custom-scrollbar md:p-4 md:bg-white/60 md:rounded-[1.5rem] md:shadow-sm md:border md:border-[#E8D5C4]/30">
              <select
                value={filterWilaya}
                onChange={(e) => {
                  setFilterWilaya(e.target.value);
                  setFilterCommune("");
                  setFilterStopdesk("");
                }}
                className="shrink-0 min-w-[110px] px-3 py-2.5 md:py-2 bg-white rounded-xl text-[10px] md:text-[11px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 shadow-sm outline-none"
              >
                <option value="">Wilayas</option>
                {[...new Set(customers.map((c) => c.wilaya))]
                  .filter(Boolean)
                  .sort()
                  .map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
              </select>
              {filterWilaya && (
                <select
                  value={filterCommune}
                  onChange={(e) => setFilterCommune(e.target.value)}
                  className="shrink-0 min-w-[110px] px-3 py-2.5 md:py-2 bg-white rounded-xl text-[10px] md:text-[11px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 shadow-sm outline-none"
                >
                  <option value="">Communes</option>
                  {[
                    ...new Set(
                      customers
                        .filter((c) => c.wilaya === filterWilaya)
                        .map((c) => c.commune)
                    ),
                  ]
                    .filter(Boolean)
                    .sort()
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              )}
              <select
                value={filterDelivery}
                onChange={(e) => {
                  setFilterDelivery(e.target.value);
                  setFilterStopdesk("");
                }}
                className="shrink-0 min-w-[110px] px-3 py-2.5 md:py-2 bg-white rounded-xl text-[10px] md:text-[11px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 shadow-sm outline-none"
              >
                <option value="">Mode Liv.</option>
                <option value="domicile">Domicile</option>
                <option value="stopdesk">Stopdesk</option>
              </select>
            </div>
            <div className="md:hidden space-y-3">
              {customers
                .filter((c) => {
                  const searchStr = (
                    globalSearch || customerSearch
                  ).toLowerCase();
                  const matchSearch =
                    c.name.toLowerCase().includes(searchStr) ||
                    c.phone.includes(searchStr);
                  return (
                    matchSearch &&
                    (!filterWilaya || c.wilaya === filterWilaya) &&
                    (!filterCommune || c.commune === filterCommune) &&
                    (!filterDelivery || c.deliveryMode === filterDelivery) &&
                    (!filterStopdesk || c.stopdeskName === filterStopdesk)
                  );
                })
                .map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8D5C4]/30 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <PlatformIcon type={c.platform} size={14} />
                        <span className="font-bold text-[#8D7B68] text-sm">
                          {c.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowCustomerHistory(c)}
                          className="text-blue-400 p-1.5 bg-blue-50 rounded-lg"
                        >
                          <Clock size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCustomer(c);
                            setShowAddCustomer(true);
                          }}
                          className="text-[#D4B996] p-1.5 bg-gray-50 rounded-lg"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: c.id,
                              collection: "customers",
                              label: c.name,
                            })
                          }
                          className="text-red-300 p-1.5 bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#4A3F35] font-medium">
                      <Phone size={10} className="text-[#D4B996]" /> {c.phone}
                    </div>
                    <div className="flex justify-between items-center text-[10px] pt-2 border-t border-gray-50 text-gray-500">
                      <span>{c.wilaya}</span>
                      <span className="font-bold text-[#8D7B68]">
                        {c.deliveryMode === "domicile"
                          ? "Domicile"
                          : "Stopdesk"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="hidden md:block bg-white/80 rounded-[2rem] shadow-sm overflow-x-auto border border-[#E8D5C4]/30">
              <table className="w-full text-xs text-left min-w-[600px]">
                <thead className="bg-[#FAF7F2]/50 border-b border-[#E8D5C4]/20 text-[#B8A99A] font-bold uppercase tracking-widest text-[9px]">
                  <tr>
                    <th className="p-5">Cliente</th>
                    <th className="p-5">Contact</th>
                    <th className="p-5">Livraison</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers
                    .filter((c) => {
                      const searchStr = (
                        globalSearch || customerSearch
                      ).toLowerCase();
                      const matchSearch =
                        c.name.toLowerCase().includes(searchStr) ||
                        c.phone.includes(searchStr);
                      return (
                        matchSearch &&
                        (!filterWilaya || c.wilaya === filterWilaya) &&
                        (!filterCommune || c.commune === filterCommune) &&
                        (!filterDelivery ||
                          c.deliveryMode === filterDelivery) &&
                        (!filterStopdesk || c.stopdeskName === filterStopdesk)
                      );
                    })
                    .map((c) => (
                      <tr key={c.id} className="group hover:bg-[#FAF7F2]/50">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <PlatformIcon type={c.platform} size={16} />
                            <span className="font-bold text-[#8D7B68] text-sm">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 space-y-1">
                          <div className="flex items-center gap-2 text-[#4A3F35] font-medium">
                            <Phone size={12} className="text-[#D4B996]" />{" "}
                            {c.phone}
                          </div>
                        </td>
                        <td className="p-5 space-y-1">
                          <div className="flex items-center gap-2 text-[#4A3F35] font-medium">
                            {c.deliveryMode === "domicile" ? (
                              <>
                                <Home size={12} className="text-[#D4B996]" />{" "}
                                Domicile
                              </>
                            ) : (
                              <>
                                <Store size={12} className="text-[#D4B996]" />{" "}
                                {c.stopdeskName || "Stopdesk"}
                              </>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 pl-5">
                            {c.wilaya} - {c.commune}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => setShowCustomerHistory(c)}
                              className="text-blue-300 hover:text-blue-500 hover:scale-110"
                              title="Historique"
                            >
                              <Clock size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingCustomer(c);
                                setShowAddCustomer(true);
                              }}
                              className="text-[#D4B996] hover:scale-110"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  id: c.id,
                                  collection: "customers",
                                  label: c.name,
                                })
                              }
                              className="text-red-200 hover:text-red-400 hover:scale-110"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "arrivages" && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl md:rounded-[2rem] border border-[#E8D5C4]/30 shadow-sm flex justify-between items-center mb-4">
              <span className="text-[10px] md:text-xs uppercase font-bold text-[#B8A99A] tracking-widest">
                Poids Total Facturé{" "}
                {filterMonth !== 0 && `(Mois ${filterMonth})`}
              </span>
              <span className="text-lg md:text-xl font-black text-[#8D7B68]">
                {totalWeightFilteredArrivages.toFixed(2)} kg
              </span>
            </div>
            <button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                const prefix = `A${today.slice(2, 4)}${today.slice(5, 7)}-`;
                const monthArrivages = arrivages.filter((a) =>
                  a.number?.startsWith(prefix)
                );
                const nextNum =
                  monthArrivages.length === 0
                    ? 1
                    : Math.max(
                        ...monthArrivages.map(
                          (a) => parseInt(a.number.split("-")[1]) || 0
                        )
                      ) + 1;
                setArrivageNumber(
                  `${prefix}${String(nextNum).padStart(2, "0")}`
                );
                setArrivageDate(today);
                setEditingArrivage(null);
                setShowAddArrivage(true);
              }}
              className="w-full md:w-auto px-6 py-4 md:py-2.5 rounded-2xl md:rounded-full text-white bg-[#8D7B68] text-sm font-bold shadow-md flex justify-center items-center gap-2 mb-2 md:mb-4"
            >
              <Plus size={16} className="md:hidden" /> Nouveau Dossier
            </button>
            {filteredArrivages.map((arr) => {
              const stats = getArrivageStats(arr.id);
              const calculatedWeight = getCalculatedWeightForArrivage(arr.id);
              return (
                <div
                  key={arr.id}
                  className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 shadow-sm border border-[#E8D5C4]/30"
                >
                  <div className="flex justify-between w-full md:w-auto items-center">
                    <div>
                      <h4 className="font-serif font-bold text-[#8D7B68] text-base md:text-lg">
                        #{arr.number}
                      </h4>
                      <p className="text-[9px] md:text-[10px] text-[#B8A99A] uppercase font-bold">
                        {arr.date}
                      </p>
                    </div>
                    <div className="flex gap-2 md:hidden">
                      <button
                        onClick={() => {
                          setEditingArrivage(arr);
                          setArrivageNumber(arr.number);
                          setArrivageDate(
                            arr.date || new Date().toISOString().split("T")[0]
                          );
                          setShowAddArrivage(true);
                        }}
                        className="text-[#D4B996] p-2 bg-gray-50 rounded-lg"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            id: arr.id,
                            collection: "arrivages",
                            label: `Arrivage #${arr.number}`,
                          })
                        }
                        className="text-red-300 p-2 bg-red-50 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex w-full md:w-auto justify-between md:justify-end items-center gap-2 md:gap-8 pt-3 md:pt-0 border-t md:border-none border-gray-100">
                    <div className="text-left md:text-right flex-1 md:flex-none">
                      <p className="text-[8px] text-gray-400 uppercase font-bold mb-1">
                        Poids (Facturé | Articles)
                      </p>
                      <div className="font-bold text-[#4A3F35] text-xs md:text-sm bg-gray-50 px-2 md:px-3 py-1 rounded-lg border border-gray-100 text-center flex items-center justify-center md:justify-end gap-2">
                        <span>
                          {parseFloat(arr.totalWeightKg || 0).toFixed(2)} kg
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[#8D7B68]">
                          {calculatedWeight.toFixed(2)} kg
                        </span>
                      </div>
                    </div>
                    <div className="text-left md:text-right flex-1 md:flex-none">
                      <p className="text-[8px] text-[#D4B996] uppercase font-bold mb-1">
                        Coût Kilo
                      </p>
                      <div className="font-bold text-[#8D7B68] text-xs md:text-sm bg-[#FAF7F2] px-2 md:px-3 py-1 rounded-lg border border-[#E8D5C4]/30 text-center md:text-right">
                        {parseFloat(stats.rate).toFixed(2)} DA/Kg
                      </div>
                    </div>
                    <div className="hidden md:flex gap-2">
                      <button
                        onClick={() => {
                          setEditingArrivage(arr);
                          setArrivageNumber(arr.number);
                          setArrivageDate(
                            arr.date || new Date().toISOString().split("T")[0]
                          );
                          setShowAddArrivage(true);
                        }}
                        className="text-[#D4B996] p-2 hover:scale-110 transition-transform"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            id: arr.id,
                            collection: "arrivages",
                            label: `Arrivage #${arr.number}`,
                          })
                        }
                        className="text-red-200 hover:text-red-400 hover:scale-110 transition-transform"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "finances" && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="font-serif text-[#8D7B68] text-sm md:text-lg font-bold flex items-center gap-2">
                    <Megaphone size={16} className="text-[#D4B996]" /> Sponsors
                  </h3>
                  <button
                    onClick={() => setShowAddSponsor(true)}
                    className="p-2 md:p-2.5 bg-[#8D7B68] text-white rounded-xl md:rounded-full shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-orange-50/50 text-[#B8A99A] font-bold uppercase sticky top-0 text-[9px] md:text-xs">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Euro</th>
                        <th className="p-3 text-right">DA</th>
                        <th className="p-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {sponsors
                        .filter((s) => {
                          const d = new Date(s.date);
                          return (
                            d.getFullYear() === filterYear &&
                            (filterMonth === 0 ||
                              d.getMonth() + 1 === filterMonth)
                          );
                        })
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((s) => (
                          <tr key={s.id}>
                            <td className="p-3 font-bold text-gray-400">
                              {s.date}
                            </td>
                            <td className="p-3 text-right font-bold text-orange-400">
                              {parseFloat(s.amountEur).toFixed(2)} €
                            </td>
                            <td className="p-3 text-right font-black text-[#8D7B68]">
                              {formatDA(s.amountDA)}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    id: s.id,
                                    collection: "sponsors",
                                    label: `Sponsor`,
                                  })
                                }
                                className="text-red-300 md:text-red-200 md:hover:text-red-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="font-serif text-[#8D7B68] text-sm md:text-lg font-bold flex items-center gap-2">
                    <Receipt size={16} className="text-red-300" /> Frais Divers
                  </h3>
                  <button
                    onClick={() => setShowAddExpense(true)}
                    className="p-2 md:p-2.5 bg-red-400 text-white rounded-xl md:rounded-full shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-2 md:space-y-3 max-h-[250px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  {expenses
                    .filter((e) => {
                      const d = new Date(e.date);
                      return (
                        d.getFullYear() === filterYear &&
                        (filterMonth === 0 || d.getMonth() + 1 === filterMonth)
                      );
                    })
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between p-3 md:p-4 bg-red-50/30 rounded-xl border border-red-50"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase text-red-400">
                            {e.label}
                          </p>
                          <p className="text-[8px] text-gray-400 font-bold">
                            {e.date}
                          </p>
                        </div>
                        <div className="flex gap-3 md:gap-4 items-center">
                          <p className="font-black text-[#8D7B68] text-xs md:text-sm">
                            {formatDA(e.amountDA)}
                          </p>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                id: e.id,
                                collection: "expenses",
                                label: e.label,
                              })
                            }
                            className="text-red-300 md:text-red-200 md:hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-white/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E8D5C4]/20 md:col-span-2">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="font-serif text-[#8D7B68] text-sm md:text-lg font-bold flex items-center gap-2">
                    <Euro size={16} className="text-[#D4B996]" /> Taux Euro
                  </h3>
                  <button
                    onClick={() => setShowAddRate(true)}
                    className="p-2 md:p-2.5 bg-[#D4B996] text-white rounded-xl md:rounded-full shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {currencyRates
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((r) => (
                      <div
                        key={r.id}
                        className="flex justify-between items-center p-3 bg-[#FAF7F2]/50 rounded-xl border border-[#E8D5C4]/20"
                      >
                        <span className="text-[10px] md:text-xs font-bold text-[#B8A99A] uppercase">
                          {r.date}
                        </span>
                        <div className="flex items-center gap-3 md:gap-4 font-black text-[#8D7B68] text-sm">
                          {parseFloat(r.rate).toFixed(2)} DA{" "}
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                id: r.id,
                                collection: "currencyRates",
                                label: `Taux`,
                              })
                            }
                            className="text-red-300 md:text-red-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#E8D5C4]/50 flex justify-around items-center px-2 pt-2 pb-[max(16px,env(safe-area-inset-bottom))] z-[900] shadow-[0_-10px_40px_rgba(141,123,104,0.1)] print:hidden">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            activeTab === "dashboard" ? "text-[#8D7B68]" : "text-[#B8A99A]"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[8px] font-bold">Bord</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`relative flex flex-col items-center gap-1 p-2 transition-colors ${
            activeTab === "orders" ? "text-[#8D7B68]" : "text-[#B8A99A]"
          }`}
        >
          <Package size={20} />
          {lateDeliveries.length > 0 && (
            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
          <span className="text-[8px] font-bold">Ventes</span>
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            activeTab === "customers" ? "text-[#8D7B68]" : "text-[#B8A99A]"
          }`}
        >
          <Users size={20} />
          <span className="text-[8px] font-bold">Clientes</span>
        </button>
        <button
          onClick={() => setActiveTab("arrivages")}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${
            activeTab === "arrivages" ? "text-[#8D7B68]" : "text-[#B8A99A]"
          }`}
        >
          <Globe size={20} />
          <span className="text-[8px] font-bold">Arrivages</span>
        </button>
      </nav>

      {/* --- MODALS --- */}
      {showAddCustomer && (
        <CustomerModal
          editingCustomer={editingCustomer}
          handleSaveCustomer={handleSaveCustomer}
          onClose={() => {
            setShowAddCustomer(false);
            setEditingCustomer(null);
          }}
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
          onClose={() => {
            setShowAddOrder(false);
            setEditingOrder(null);
          }}
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
          onClose={() => {
            setShowAddArrivage(false);
            setEditingArrivage(null);
          }}
        />
      )}
      {showCostBreakdown && (
        <CostBreakdownModal
          order={showCostBreakdown}
          onClose={() => setShowCostBreakdown(null)}
          formatDA={formatDA}
          calculateTotals={calculateTotals}
        />
      )}
      {showReceipt && (
        <ReceiptModal
          order={showReceipt}
          onClose={() => setShowReceipt(null)}
          formatDA={formatDA}
        />
      )}
      {showDeliverySlip && (
        <DeliverySlipModal
          order={showDeliverySlip}
          customers={customers}
          onClose={() => setShowDeliverySlip(null)}
          formatDA={formatDA}
        />
      )}
      {showCustomerHistory && (
        <CustomerHistoryModal
          customer={showCustomerHistory}
          orders={orders}
          formatDA={formatDA}
          onClose={() => setShowCustomerHistory(null)}
          onOpenOrder={(o) => {
            setShowCustomerHistory(null);
            setEditingOrder(o);
            setOrderItems(o.items || []);
            setShippingNational(o.shippingNational || 0);
            const existingDate = o.date?.toDate
              ? o.date.toDate().toISOString().split("T")[0]
              : new Date(o.date || Date.now()).toISOString().split("T")[0];
            setOrderPayments(
              o.payments ||
                (o.advancePayment
                  ? [
                      {
                        id: Date.now(),
                        amount: o.advancePayment,
                        date: existingDate,
                      },
                    ]
                  : [])
            );
            setOrderStatus(o.status);
            setOrderDate(existingDate);
            setOrderNumber(o.orderNumber);
            setShowAddOrder(true);
          }}
        />
      )}
      {showCalculator && (
        <PriceCalculatorModal
          onClose={() => setShowCalculator(false)}
          currencyRates={currencyRates}
          formatDA={formatDA}
        />
      )}

      {showAddSponsor && (
        <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-sm rounded-t-[2rem] md:rounded-[2rem] p-6 pb-10 md:pb-6 shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95">
            <ModalHeader
              title="Sponsor"
              onClose={() => setShowAddSponsor(false)}
            />
            <form onSubmit={handleSaveSponsor} className="space-y-4">
              <input
                name="amountEur"
                type="number"
                step="0.01"
                required
                autoFocus
                placeholder="Montant en Euro"
                className="w-full p-4 rounded-xl bg-[#FAF7F2] text-center text-lg font-black text-orange-400 outline-none"
              />
              <input
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="w-full p-3 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase text-[10px] shadow-lg"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
      {showAddExpense && (
        <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-sm rounded-t-[2rem] md:rounded-[2rem] p-6 pb-10 md:pb-6 shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95">
            <ModalHeader
              title="Dépense"
              onClose={() => setShowAddExpense(false)}
            />
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <input
                name="label"
                placeholder="Motif (ex: Taxi, Emballage)"
                required
                className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none"
              />
              <input
                name="amountDA"
                type="number"
                placeholder="Montant DA"
                required
                className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none font-bold text-red-400"
              />
              <input
                name="date"
                type="date"
                required
                className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase text-[10px] shadow-lg"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
      {showAddRate && (
        <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-xs rounded-t-[2rem] md:rounded-[2rem] p-6 pb-10 md:pb-6 shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95">
            <ModalHeader
              title="Taux Euro"
              onClose={() => setShowAddRate(false)}
            />
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                await addDoc(
                  collection(
                    db,
                    "artifacts",
                    appId,
                    "public",
                    "data",
                    "currencyRates"
                  ),
                  {
                    rate: parseFloat(fd.get("rate")),
                    date: fd.get("date"),
                    createdAt: Timestamp.now(),
                  }
                );
                setShowAddRate(false);
                showToast("Taux mis à jour");
              }}
              className="space-y-4"
            >
              <input
                name="date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none"
              />
              <input
                name="rate"
                type="number"
                step="0.01"
                placeholder="Valeur 1€ en DA"
                required
                className="w-full p-4 rounded-xl bg-[#FAF7F2] text-center font-black text-lg text-[#8D7B68] outline-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase text-[10px] shadow-lg"
              >
                Valider
              </button>
            </form>
          </div>
        </div>
      )}
      {showConfig && (
        <ConfigModal
          config={config}
          saveConfig={saveConfig}
          setConfig={setConfig}
          onClose={() => setShowConfig(false)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          deleteTarget={deleteTarget}
          performDelete={performDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FDFBF7",
          color: "#8D7B68",
          fontFamily: "serif",
        }}
      >
        Chargement...
      </div>
    );
  return user ? <MainApp user={user} /> : <Login />;
}

// --- SUB COMPONENTS (MODALS) ---
const OrderModal = ({
  editingOrder,
  customers,
  orders,
  orderItems,
  setOrderItems,
  orderPayments,
  setOrderPayments,
  orderStatus,
  setOrderStatus,
  orderDate,
  setOrderDate,
  orderNumber,
  setOrderNumber,
  config,
  arrivages,
  handleSaveOrder,
  formatDA,
  calculateTotals,
  shippingNational,
  setShippingNational,
  onClose,
}) => {
  const [defaultArrivage, setDefaultArrivage] = useState(
    editingOrder ? orderItems[0]?.arrivageId || "" : ""
  );
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentDate, setNewPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSaving, setIsSaving] = useState(false);

  // --- NOUVEAUTÉ : AUTO-CORRECTION À L'OUVERTURE ---
  // Dès que la fenêtre s'ouvre, on vérifie si des articles anciens ont un poids
  // mais sont restés bloqués sur "En attente". Si oui, on les passe en "Reçu".
  useEffect(() => {
    let hasChanges = false;
    const correctedItems = orderItems.map((item) => {
      if (
        parseFloat(item.weightG) > 0 &&
        (!item.status || item.status === "En attente" || item.status === "A commander")
      ) {
        hasChanges = true;
        return { ...item, status: "Reçu" };
      }
      return item;
    });

    if (hasChanges) {
      setOrderItems(correctedItems);
    }
  }, []); 
  // --------------------------------------------------

  const updateOrderNumber = (selectedDate) => {
    if (editingOrder) return;
    const prefix = `${selectedDate.slice(2, 4)}${selectedDate.slice(5, 7)}-`;
    const monthOrders = orders.filter(
      (o) => o.orderNumber?.startsWith(prefix) && o.id !== editingOrder?.id
    );
    const nextNum =
      monthOrders.length === 0
        ? 1
        : Math.max(
            ...monthOrders.map(
              (o) => parseInt(o.orderNumber.split("-")[1]) || 0
            )
          ) + 1;
    setOrderNumber(`${prefix}${String(nextNum).padStart(3, "0")}`);
  };

  const sortedWilayas = Object.keys(
    customers.reduce((acc, c) => {
      const w = c.wilaya || "Autre";
      if (!acc[w]) acc[w] = [];
      acc[w].push(c);
      return acc;
    }, {})
  ).sort();
  const groupedCustomers = customers.reduce((acc, c) => {
    const w = c.wilaya || "Autre";
    if (!acc[w]) acc[w] = [];
    acc[w].push(c);
    return acc;
  }, {});
  Object.keys(groupedCustomers).forEach((w) =>
    groupedCustomers[w].sort((a, b) => a.name.localeCompare(b.name))
  );

  const totalAdvance = orderPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount || 0),
    0
  );
  const totalVenteEtLivraison =
    calculateTotals(orderItems, 0, new Date()).venteTotal +
    (parseFloat(shippingNational) || 0);

  const montantEnAlgerie = orderItems
    .filter(
      (item) =>
        item.status === "Reçu" ||
        item.status === "Livré" ||
        parseFloat(item.weightG) > 0
    )
    .reduce((sum, i) => sum + (parseFloat(i.priceVente) || 0), 0);

  const isFullyPaidStatus =
    orderStatus === "Payée" || orderStatus === "Payée et livrée";
  const resteToPay = isFullyPaidStatus
    ? 0
    : Math.max(0, totalVenteEtLivraison - totalAdvance);

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden pt-10">
      <div className="bg-white w-full h-[92vh] md:h-auto md:max-h-[95vh] md:max-w-6xl rounded-t-[2rem] md:rounded-[2rem] p-4 md:p-6 shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 md:zoom-in-95">
        <ModalHeader
          title={editingOrder ? "Modifier Vente" : "Nouvelle Vente"}
          onClose={onClose}
        />
        <form
          onSubmit={(e) => handleSaveOrder(e, setIsSaving)}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-4">
            <div className="bg-[#FAF7F2]/80 p-4 rounded-2xl md:rounded-[1.5rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 shrink-0 border border-[#E8D5C4]/30">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">
                  Date
                </label>
                <input
                  type="date"
                  name="orderDate"
                  value={orderDate}
                  onChange={(e) => {
                    setOrderDate(e.target.value);
                    updateOrderNumber(e.target.value);
                  }}
                  required
                  className="w-full p-3 md:p-2.5 rounded-xl text-xs font-bold bg-white outline-none text-[#4A3F35] shadow-sm border border-gray-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">
                  N° Commande
                </label>
                <input
                  name="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                  className="w-full p-3 md:p-2.5 rounded-xl text-xs font-bold bg-white outline-none text-[#4A3F35] shadow-sm border border-gray-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">
                  Cliente
                </label>
                <select
                  name="customerId"
                  defaultValue={editingOrder?.customerId}
                  onChange={(e) => {
                    const c = customers.find((x) => x.id === e.target.value);
                    if (c && c.wilaya) {
                      const tariff =
                        DELIVERY_TARIFFS[c.wilaya.substring(3).trim()];
                      if (tariff)
                        setShippingNational(
                          c.deliveryMode === "stopdesk" && tariff.stop
                            ? tariff.stop
                            : tariff.dom
                        );
                    }
                  }}
                  required
                  className="w-full p-3 md:p-2.5 rounded-xl bg-white text-xs font-bold text-[#8D7B68] outline-none shadow-sm border border-gray-100"
                >
                  <option value="">Sélectionner...</option>
                  {sortedWilayas.map((w) => (
                    <optgroup key={w} label={w} className="bg-gray-50">
                      {groupedCustomers[w].map((c) => (
                        <option
                          key={c.id}
                          value={c.id}
                          className="text-[#4A3F35]"
                        >
                          {c.name} •{" "}
                          {c.deliveryMode === "stopdesk" ? "Stopdesk" : "Dom"}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#D4B996]">
                  Arrivage (Défaut)
                </label>
                <select
                  value={defaultArrivage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDefaultArrivage(val);
                    setOrderItems(
                      orderItems.map((item) => ({ ...item, arrivageId: val }))
                    );
                  }}
                  className="w-full p-3 md:p-2.5 rounded-xl bg-white text-xs font-bold text-[#8D7B68] outline-none shadow-sm border border-[#E8D5C4]"
                >
                  <option value="">Choisir...</option>
                  {arrivages.map((a) => (
                    <option key={a.id} value={a.id}>
                      #{a.number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold ml-1 text-[#B8A99A]">
                  Statut
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full p-3 md:p-2.5 rounded-xl bg-white text-xs font-bold text-[#4A3F35] outline-none shadow-sm border border-gray-100"
                >
                  <option value="A commander">A commander</option>
                  <option value="Réservée">Réservée</option>
                  <option value="Payée une partie">Payée partiel</option>
                  <option value="Payée">Payée</option>
                  <option value="En cours de livraison">En livraison</option>
                  <option value="Livrée sans paiement">
                    Livrée (non payé)
                  </option>
                  <option value="Payée et livrée">Livrée ✅</option>
                  <option value="Annulée">Annulée ❌</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col shrink-0">
              <h4 className="text-xs font-bold text-[#8D7B68] uppercase px-2 mb-2 shrink-0">
                Panier d'articles
              </h4>
              <div className="space-y-3 pr-1 pb-2">
                {orderItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E8D5C4]/60 p-4 md:p-3 rounded-2xl shadow-sm flex flex-col gap-3 md:gap-2 relative pl-8 pt-6 md:pt-3 shrink-0"
                  >
                    <div className="absolute left-2 top-3 md:top-1/2 md:-translate-y-1/2 w-5 h-5 bg-[#FAF7F2] border border-[#E8D5C4] rounded-full flex items-center justify-center text-[9px] font-black text-[#8D7B68]">
                      {index + 1}
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        placeholder="Désignation exacte..."
                        className="w-full md:flex-[2] p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35]"
                        value={item.name}
                        onChange={(e) =>
                          setOrderItems(
                            orderItems.map((oi) =>
                              oi.id === item.id
                                ? { ...oi, name: e.target.value }
                                : oi
                            )
                          )
                        }
                      />
                      <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
                        <input
                          list="catList"
                          placeholder="Catégorie"
                          className="col-span-2 md:col-span-1 md:flex-1 p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35]"
                          value={item.category}
                          onChange={(e) =>
                            setOrderItems(
                              orderItems.map((oi) =>
                                oi.id === item.id
                                  ? { ...oi, category: e.target.value }
                                  : oi
                              )
                            )
                          }
                        />
                        <input
                          list="sizeList"
                          placeholder="Taille"
                          className="col-span-1 md:w-20 p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35] text-center"
                          value={item.size}
                          onChange={(e) =>
                            setOrderItems(
                              orderItems.map((oi) =>
                                oi.id === item.id
                                  ? { ...oi, size: e.target.value }
                                  : oi
                              )
                            )
                          }
                        />
                        <input
                          list="colorList"
                          placeholder="Couleur"
                          className="col-span-1 md:w-24 p-3 md:p-2.5 bg-[#FAF7F2]/50 border border-transparent focus:border-[#D4B996] rounded-xl outline-none text-xs font-bold text-[#4A3F35] text-center"
                          value={item.color}
                          onChange={(e) =>
                            setOrderItems(
                              orderItems.map((oi) =>
                                oi.id === item.id
                                  ? { ...oi, color: e.target.value }
                                  : oi
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:flex flex-wrap md:flex-nowrap gap-2 items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                      <select
                        className="col-span-2 md:col-span-1 w-full md:w-auto md:flex-1 p-2 md:p-1.5 rounded-lg bg-white border border-gray-100 outline-none text-[11px] md:text-[10px] font-bold text-[#8D7B68] shadow-sm"
                        value={item.arrivageId || ""}
                        onChange={(e) =>
                          setOrderItems(
                            orderItems.map((oi) =>
                              oi.id === item.id
                                ? { ...oi, arrivageId: e.target.value }
                                : oi
                            )
                          )
                        }
                      >
                        <option value="">Lié à l'arrivage...</option>
                        {arrivages.map((a) => (
                          <option key={a.id} value={a.id}>
                            #{a.number}
                          </option>
                        ))}
                      </select>
                      <select
                        className="col-span-2 md:col-span-1 w-full md:w-auto md:flex-1 p-2 md:p-1.5 rounded-lg bg-white border border-gray-100 outline-none text-[11px] md:text-[10px] font-bold text-[#8D7B68] shadow-sm"
                        value={item.status || "En attente"}
                        onChange={(e) =>
                          setOrderItems(
                            orderItems.map((oi) =>
                              oi.id === item.id
                                ? { ...oi, status: e.target.value }
                                : oi
                            )
                          )
                        }
                      >
                        <option value="En attente">En attente (Chine)</option>
                        <option value="Reçu">Reçu (Algérie)</option>
                        <option value="Livré">Livré cliente</option>
                      </select>
                      <div className="col-span-1 flex items-center gap-1 bg-white px-2 py-2 md:py-1.5 rounded-lg shadow-sm border border-gray-100 md:w-24">
                        <span className="text-[9px] font-bold text-gray-400 hidden lg:inline">
                          Poids(g)
                        </span>
                        <input
                          type="number"
                          placeholder="g"
                          className="w-full outline-none text-xs font-bold text-center md:text-right bg-transparent"
                          value={item.weightG}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOrderItems(
                              orderItems.map((oi) => {
                                if (oi.id === item.id) {
                                  let newStatus = oi.status;
                                  // L'auto-correction lors de la frappe
                                  if (parseFloat(val) > 0 && (!oi.status || oi.status === "En attente" || oi.status === "A commander")) {
                                    newStatus = "Reçu";
                                  } else if ((!val || parseFloat(val) === 0) && oi.status === "Reçu") {
                                    newStatus = "En attente";
                                  }
                                  return { ...oi, weightG: val, status: newStatus };
                                }
                                return oi;
                              })
                            );
                          }}
                        />
                      </div>
                      <div className="col-span-1 flex items-center gap-1 bg-white px-2 py-2 md:py-1.5 rounded-lg shadow-sm border border-gray-100 md:w-24">
                        <span className="text-[9px] font-bold text-gray-400 hidden lg:inline">
                          Achat(€)
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="€"
                          className="w-full outline-none text-xs font-bold text-center md:text-right bg-transparent"
                          value={item.priceAchatEuro}
                          onChange={(e) =>
                            setOrderItems(
                              orderItems.map((oi) =>
                                oi.id === item.id
                                  ? { ...oi, priceAchatEuro: e.target.value }
                                  : oi
                              )
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2 mt-1 md:mt-0">
                        <div className="flex items-center gap-1 bg-[#F3E8E2]/40 px-3 py-2.5 md:py-1.5 rounded-lg shadow-sm border border-[#E8D5C4]/60 flex-1">
                          <span className="text-[9px] font-bold text-[#D4B996] uppercase">
                            Vente DA
                          </span>
                          <input
                            type="number"
                            className="w-full outline-none text-sm md:text-xs font-black text-[#8D7B68] text-right bg-transparent"
                            value={item.priceVente}
                            onChange={(e) =>
                              setOrderItems(
                                orderItems.map((oi) =>
                                  oi.id === item.id
                                    ? { ...oi, priceVente: e.target.value }
                                    : oi
                                )
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setOrderItems(
                              orderItems.filter((oi) => oi.id !== item.id)
                            )
                          }
                          className="text-red-400 bg-red-50 hover:bg-red-100 p-2.5 md:p-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderItems([
                    ...orderItems,
                    {
                      id: Date.now(),
                      name: "",
                      category: "",
                      size: "",
                      color: "",
                      weightG: 0,
                      priceAchatEuro: 0,
                      priceVente: 0,
                      arrivageId: defaultArrivage,
                      status: "En attente",
                    },
                  ]);
                }}
                className="w-full mt-3 shrink-0 py-4 md:py-3 border border-dashed border-[#E8D5C4] text-[#8D7B68] hover:bg-[#FAF7F2] rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-white/50 shadow-sm"
              >
                <Plus size={16} /> Ajouter un article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
              <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-[#E8D5C4]/40 flex flex-col h-full shadow-sm">
                <h4 className="text-[10px] text-[#B8A99A] font-bold uppercase tracking-widest mb-3 border-b border-gray-50 pb-2">
                  Historique des Versements
                </h4>
                <div className="flex-1 overflow-y-auto space-y-2 mb-3 min-h-[80px] custom-scrollbar">
                  {orderPayments.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic text-center pt-4">
                      Aucun versement enregistré.
                    </p>
                  ) : (
                    orderPayments.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center bg-green-50/50 p-2 rounded-lg border border-green-100/50"
                      >
                        <span className="text-[10px] font-bold text-gray-500">
                          {p.date}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-green-600">
                            {formatDA(p.amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setOrderPayments(
                                orderPayments.filter((pay) => pay.id !== p.id)
                              )
                            }
                            className="text-red-300 hover:text-red-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <input
                    type="date"
                    value={newPaymentDate}
                    onChange={(e) => setNewPaymentDate(e.target.value)}
                    className="w-24 p-2 rounded-lg text-[10px] outline-none text-gray-600 font-bold border border-transparent focus:border-[#E8D5C4]"
                  />
                  <input
                    type="number"
                    placeholder="Montant DA"
                    value={newPaymentAmount}
                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                    className="flex-1 p-2 rounded-lg text-xs outline-none font-bold text-[#8D7B68] border border-transparent focus:border-[#E8D5C4]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPaymentAmount) {
                        setOrderPayments([
                          ...orderPayments,
                          {
                            id: Date.now(),
                            amount: parseFloat(newPaymentAmount),
                            date: newPaymentDate,
                          },
                        ]);
                        setNewPaymentAmount("");
                      }
                    }}
                    className="bg-green-500 text-white p-2 rounded-lg shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-[#FAF7F2]/60 p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-[#E8D5C4]/40 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3 md:mb-2">
                    <span className="text-[10px] text-[#B8A99A] font-bold uppercase tracking-widest">
                      Livraison
                    </span>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 bg-white px-3 md:px-2 py-1.5 md:py-1 rounded-lg border border-[#E8D5C4]/50 shadow-sm">
                        <span className="text-xs font-bold text-[#8D7B68]">
                          +
                        </span>
                        <input
                          type="number"
                          value={shippingNational}
                          onChange={(e) => setShippingNational(e.target.value)}
                          className="w-16 outline-none text-right font-bold text-sm md:text-xs text-[#8D7B68]"
                          placeholder="0.00"
                        />
                        <span className="text-[9px] font-bold text-[#D4B996]">
                          DA
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-1.5 mb-4 overflow-x-auto pb-1 custom-scrollbar">
                    {[0, 400, 600, 800, 1000].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setShippingNational(p)}
                        className="shrink-0 text-[10px] font-bold bg-white border border-[#E8D5C4]/60 px-3 md:px-2 py-1.5 md:py-1 rounded-lg text-[#8D7B68] shadow-sm"
                      >
                        {p === 0 ? "Gratuit" : p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-[11px] font-bold text-blue-600/80 bg-blue-50/50 p-2 rounded-lg border border-blue-100 mb-2">
                    <span>Montant des articles en Algérie :</span>
                    <span>{formatDA(montantEnAlgerie)}</span>
                  </div>

                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Total Panier + Liv :</span>
                    <span>{formatDA(totalVenteEtLivraison)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-green-600">
                    <span>Total Avances :</span>
                    <span>- {formatDA(totalAdvance)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#E8D5C4]/40 mt-2">
                    <span className="text-[11px] text-[#8D7B68] font-black uppercase tracking-widest">
                      Reste à Payer
                    </span>
                    <span
                      className={`text-2xl font-serif font-bold ${
                        resteToPay > 0 ? "text-[#8D7B68]" : "text-green-500"
                      }`}
                    >
                      {formatDA(resteToPay)}
                    </span>
                  </div>
                  {isFullyPaidStatus && (
                    <p className="text-[9px] text-green-500 font-bold text-right italic">
                      Mis à 0 automatiquement car statut Payée.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 pt-2 pb-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex justify-center items-center gap-3 py-4 rounded-xl md:rounded-[1.5rem] text-white font-serif text-lg md:text-xl bg-[#8D7B68] shadow-lg font-bold uppercase tracking-widest transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
            >
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
  const [selectedWilaya, setSelectedWilaya] = useState(
    editingCustomer?.wilaya || ""
  );
  const [communes, setCommunes] = useState(
    editingCustomer?.wilaya
      ? SUGGESTED_COMMUNES[editingCustomer.wilaya] || []
      : []
  );
  const [isCustomCommune, setIsCustomCommune] = useState(
    editingCustomer?.wilaya &&
      !SUGGESTED_COMMUNES[editingCustomer.wilaya]?.includes(
        editingCustomer.commune
      )
  );
  const [deliveryMode, setDeliveryMode] = useState(
    editingCustomer?.deliveryMode || "domicile"
  );

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden pt-10">
      <div className="bg-white w-full max-h-[90vh] md:max-h-[90vh] md:max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-4 flex flex-col">
        <ModalHeader
          title={editingCustomer ? "Modifier Cliente" : "Nouvelle Cliente"}
          onClose={onClose}
        />
        <form
          onSubmit={handleSaveCustomer}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pb-4 pr-1">
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-[#B8A99A] tracking-wider ml-1">
                Plateforme
              </label>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {["instagram", "facebook", "whatsapp", "direct"].map((plat) => (
                  <label
                    key={plat}
                    className="flex flex-col items-center p-3 rounded-xl md:rounded-2xl bg-[#FAF7F2]/50 border-2 border-transparent has-[:checked]:border-[#E8D5C4] has-[:checked]:bg-white cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      name="platform"
                      value={plat}
                      defaultChecked={
                        editingCustomer?.platform === plat ||
                        (!editingCustomer && plat === "instagram")
                      }
                      className="hidden"
                    />
                    <PlatformIcon type={plat} size={20} />
                    <span className="text-[8px] uppercase font-bold mt-2 text-[#8D7B68] truncate w-full text-center">
                      {plat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
                Nom complet
              </label>
              <input
                autoFocus
                name="name"
                defaultValue={editingCustomer?.name}
                required
                className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
                  Téléphone 1
                </label>
                <input
                  name="phone"
                  defaultValue={editingCustomer?.phone}
                  required
                  type="tel"
                  className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
                  Téléphone 2
                </label>
                <input
                  name="phone2"
                  defaultValue={editingCustomer?.phone2}
                  type="tel"
                  placeholder="Optionnel"
                  className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-medium text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
                  Wilaya
                </label>
                <select
                  name="wilaya"
                  required
                  value={selectedWilaya}
                  onChange={(e) => {
                    setSelectedWilaya(e.target.value);
                    const sugg = SUGGESTED_COMMUNES[e.target.value] || [];
                    setCommunes(sugg);
                    setIsCustomCommune(sugg.length === 0);
                  }}
                  className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]"
                >
                  <option value="">Sélectionner</option>
                  {WILAYAS_58.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
                  Commune
                </label>
                {communes.length > 0 && !isCustomCommune ? (
                  <div className="flex gap-2">
                    <select
                      name="commune"
                      required
                      defaultValue={editingCustomer?.commune}
                      onChange={(e) => {
                        if (e.target.value === "custom")
                          setIsCustomCommune(true);
                      }}
                      className="flex-1 p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none border border-transparent focus:border-[#E8D5C4]"
                    >
                      {communes.map((c, idx) => (
                        <option key={`${c}-${idx}`} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="custom">Autre...</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCustomCommune(true)}
                      className="p-3 text-[#D4B996] bg-gray-50 rounded-xl"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      name="commune"
                      placeholder="Saisir commune"
                      defaultValue={editingCustomer?.commune}
                      required
                      className="flex-1 p-3.5 rounded-xl bg-white border border-[#E8D5C4] text-sm font-bold text-[#8D7B68] outline-none"
                    />
                    {communes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsCustomCommune(false)}
                        className="p-3 text-gray-400 bg-gray-50 rounded-xl"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-[#B8A99A] tracking-wider ml-1">
                Livraison
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF7F2]/80 rounded-2xl border border-[#E8D5C4]/30">
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-[#8D7B68] text-[#B8A99A] text-xs font-bold border border-transparent has-[:checked]:border-[#E8D5C4]/50">
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="domicile"
                    defaultChecked={deliveryMode === "domicile"}
                    onChange={() => setDeliveryMode("domicile")}
                    className="hidden"
                  />
                  <Home size={14} /> Domicile
                </label>
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-[#8D7B68] text-[#B8A99A] text-xs font-bold border border-transparent has-[:checked]:border-[#E8D5C4]/50">
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="stopdesk"
                    defaultChecked={deliveryMode === "stopdesk"}
                    onChange={() => setDeliveryMode("stopdesk")}
                    className="hidden"
                  />
                  <Store size={14} /> Stopdesk
                </label>
              </div>
              {deliveryMode === "stopdesk" && (
                <div className="mt-3 animate-in slide-in-from-top-2">
                  <label className="text-[9px] uppercase font-bold text-[#D4B996] ml-1">
                    Bureau Stopdesk
                  </label>
                  <div className="relative mt-1">
                    <Building2
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4B996]"
                    />
                    <input
                      name="stopdeskName"
                      placeholder="Ex: Yalidine Kouba"
                      defaultValue={editingCustomer?.stopdeskName}
                      required
                      className="w-full p-3.5 pl-12 rounded-xl bg-white border border-[#E8D5C4] text-sm font-bold text-[#8D7B68] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0 pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-[#8D7B68] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg"
            >
              Enregistrer la cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ArrivageModal = ({
  editingArrivage,
  arrivageNumber,
  setArrivageNumber,
  arrivageDate,
  setArrivageDate,
  handleSaveArrivage,
  onClose,
}) => (
  <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
    <div className="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-4">
      <ModalHeader
        title={
          editingArrivage ? "Modifier Arrivage" : "Nouveau Dossier Arrivage"
        }
        onClose={onClose}
      />
      <form onSubmit={handleSaveArrivage} className="space-y-4 pb-4 md:pb-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
              N°
            </label>
            <input
              name="number"
              value={arrivageNumber}
              onChange={(e) => setArrivageNumber(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold outline-none border border-transparent focus:border-[#E8D5C4]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
              Date
            </label>
            <input
              name="date"
              type="date"
              value={arrivageDate}
              onChange={(e) => setArrivageDate(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-gray-50 text-sm outline-none border border-transparent focus:border-[#E8D5C4]"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
            Pays
          </label>
          <select
            name="country"
            className="w-full p-3.5 rounded-xl bg-gray-50 text-sm font-bold text-[#8D7B68] outline-none"
          >
            <option value="France">France</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
              Poids Facturé (Kg)
            </label>
            <input
              name="totalWeightKg"
              type="number"
              step="0.01"
              defaultValue={editingArrivage?.totalWeightKg || ""}
              required
              placeholder="Ex: 12.5"
              className="w-full p-3.5 rounded-xl bg-white border border-[#E8D5C4] text-sm font-black text-[#8D7B68] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">
              Frais Total (DA)
            </label>
            <input
              name="totalShippingFee"
              type="number"
              step="0.01"
              defaultValue={editingArrivage?.totalShippingFee}
              required
              placeholder="Ex: 15000"
              className="w-full p-3.5 rounded-xl bg-white border border-[#E8D5C4] text-sm font-black text-[#8D7B68] outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-4 mt-2 bg-[#8D7B68] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg"
        >
          Enregistrer
        </button>
      </form>
    </div>
  </div>
);

const ConfigModal = ({ config, saveConfig, setConfig, onClose }) => {
  const sections = [
    { k: "categories", l: "Catégories" },
    { k: "sizes", l: "Tailles" },
    { k: "colors", l: "Couleurs" },
  ];
  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full h-[85vh] md:h-auto md:max-h-[90vh] md:max-w-5xl rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl flex flex-col animate-in slide-in-from-bottom-4">
        <ModalHeader title="Options Boutique" onClose={onClose} />
        <div className="overflow-y-auto flex-1 pb-10 md:pb-4 custom-scrollbar pr-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sections.map((s) => (
              <div
                key={s.k}
                className="space-y-4 bg-[#FAF7F2]/50 p-5 rounded-[1.5rem] border border-[#E8D5C4]/30"
              >
                <h4 className="text-xs uppercase font-bold text-[#8D7B68]">
                  {s.l}
                </h4>
                <div className="flex gap-2">
                  <input
                    id={`input-${s.k}`}
                    className="flex-1 p-3 bg-white rounded-xl text-xs outline-none shadow-sm border border-transparent focus:border-[#D4B996]"
                    placeholder="Ajouter..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = document.getElementById(`input-${s.k}`).value;
                      if (val && !(config[s.k] || []).includes(val)) {
                        const nc = {
                          ...config,
                          [s.k]: [...(config[s.k] || []), val],
                        };
                        setConfig(nc);
                        saveConfig(nc);
                        document.getElementById(`input-${s.k}`).value = "";
                      }
                    }}
                    className="bg-[#8D7B68] text-white p-3 rounded-xl"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(config[s.k] || []).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white rounded-lg text-[10px] font-bold text-[#8D7B68] border border-[#E8D5C4]/50 flex items-center gap-2 shadow-sm"
                    >
                      {item}{" "}
                      <X
                        size={12}
                        className="cursor-pointer text-[#E8D5C4] hover:text-red-400"
                        onClick={() => {
                          const nc = {
                            ...config,
                            [s.k]: config[s.k].filter((_, i) => i !== idx),
                          };
                          setConfig(nc);
                          saveConfig(nc);
                        }}
                      />
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
  const { processed } = calculateTotals(
    order.items || [],
    order.shippingNational,
    order.date
  );
  const totals = processed.reduce(
    (acc, item) => {
      acc.euro += parseFloat(item.priceAchatEuro) || 0;
      acc.achatDA += parseFloat(item.itAchatDA) || 0;
      acc.logDA += parseFloat(item.itLogInt) || 0;
      acc.cout +=
        (parseFloat(item.itAchatDA) || 0) + (parseFloat(item.itLogInt) || 0);
      acc.vente += parseFloat(item.priceVente) || 0;
      acc.benefit += parseFloat(item.itBenefit) || 0;
      return acc;
    },
    { euro: 0, achatDA: 0, logDA: 0, cout: 0, vente: 0, benefit: 0 }
  );
  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1010] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-[#FAF7F2] w-full h-[85vh] md:h-auto md:max-h-[90vh] md:max-w-4xl rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-[#8D7B68] z-10"
        >
          <X size={18} />
        </button>
        <div className="p-6 md:p-8 pb-4 shrink-0">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[#8D7B68] tracking-widest mb-1">
            ANALYSE DES COÛTS
          </h2>
          <p className="text-[10px] md:text-xs font-bold text-[#4A3F35] uppercase">
            Commande #{order.orderNumber} • {order.customerName}
          </p>
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
                  <th className="p-4 text-right font-black text-[#8D7B68]">
                    Coût Total
                  </th>
                  <th className="p-4 text-right text-green-500">Marge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[11px]">
                {processed.map((item, idx) => {
                  const cout =
                    (parseFloat(item.itAchatDA) || 0) +
                    (parseFloat(item.itLogInt) || 0);
                  return (
                    <tr key={idx} className="hover:bg-[#FAF7F2]/30">
                      <td className="p-4 font-medium text-[#4A3F35] max-w-[150px] truncate">
                        {item.name || "Article"}
                      </td>
                      <td className="p-4 text-right">
                        {parseFloat(item.priceAchatEuro || 0).toFixed(2)} €
                      </td>
                      <td className="p-4 text-right text-gray-500">
                        {formatDA(item.itAchatDA)}
                      </td>
                      <td className="p-4 text-right text-orange-400 font-medium">
                        +{formatDA(item.itLogInt)}
                      </td>
                      <td className="p-4 text-right font-black text-[#8D7B68] bg-[#FAF7F2]/30">
                        {formatDA(cout)}
                      </td>
                      <td className="p-4 text-right font-bold text-green-500">
                        {formatDA(item.itBenefit)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-[#FAF7F2] border-t border-[#E8D5C4]/40 font-black">
                <tr>
                  <td className="p-4 text-[#8D7B68]">TOTAL</td>
                  <td className="p-4 text-right">{totals.euro.toFixed(2)} €</td>
                  <td className="p-4 text-right text-gray-500">
                    {formatDA(totals.achatDA)}
                  </td>
                  <td className="p-4 text-right text-orange-400">
                    +{formatDA(totals.logDA)}
                  </td>
                  <td className="p-4 text-right text-[#8D7B68] text-sm">
                    {formatDA(totals.cout)}
                  </td>
                  <td className="p-4 text-right text-green-500 text-sm">
                    {formatDA(totals.benefit)}
                  </td>
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
  // Récupération automatique du dernier taux de change enregistré
  const latestRate = currencyRates?.length
    ? [...currencyRates].sort((a, b) => new Date(b.date) - new Date(a.date))[0].rate
    : 250;

  const [priceEur, setPriceEur] = useState("");
  const [rate, setRate] = useState(latestRate);
  const [logMode, setLogMode] = useState("poids"); // 'poids' ou 'fixe'
  const [weightG, setWeightG] = useState("");
  const [fraisFixe, setFraisFixe] = useState("");

  const pEur = parseFloat(priceEur) || 0;
  const r = parseFloat(rate) || 0;
  const w = parseFloat(weightG) || 0;
  const f = parseFloat(fraisFixe) || 0;

  // Calcul du coefficient selon tes règles
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
          <h3 className="text-lg font-serif text-[#8D7B68] font-bold flex items-center gap-2 tracking-widest uppercase">
            <Calculator size={20} className="text-[#D4B996]" /> Simulateur
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Section Achat */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Prix Achat (€)</label>
                <input
                  type="number"
                  step="0.01"
                  autoFocus
                  value={priceEur}
                  onChange={(e) => setPriceEur(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white text-lg font-black text-[#8D7B68] outline-none shadow-sm border border-[#E8D5C4]/50 focus:border-[#D4B996] text-center"
                  placeholder="0.00"
                />
              </div>
              <div className="w-24 space-y-1">
                <label className="text-[9px] uppercase font-bold text-[#B8A99A] ml-1">Taux Actuel</label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-[#FAF7F2] text-sm font-bold text-gray-500 outline-none border border-transparent text-center"
                />
              </div>
            </div>
            
            {pEur > 0 && (
              <div className="flex justify-between items-center px-4 py-2 bg-white rounded-xl border border-gray-100 text-[11px] font-medium text-gray-500 shadow-sm">
                <span>Coeff. appliqué : <strong className="text-[#D4B996]">x{coeff}</strong></span>
                <span>= {formatDA(achatDA)} (Achat)</span>
              </div>
            )}
          </div>

          {/* Section Logistique */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8D5C4]/30 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase font-bold text-[#8D7B68] tracking-widest">
                Logistique Estimée
              </label>
              <div className="flex bg-[#FAF7F2] p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLogMode("poids")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${logMode === "poids" ? "bg-white text-[#8D7B68] shadow-sm" : "text-[#B8A99A]"}`}
                >
                  Au Poids
                </button>
                <button
                  type="button"
                  onClick={() => setLogMode("fixe")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${logMode === "fixe" ? "bg-white text-[#8D7B68] shadow-sm" : "text-[#B8A99A]"}`}
                >
                  Prix Fixe
                </button>
              </div>
            </div>

            {logMode === "poids" ? (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={weightG}
                  onChange={(e) => setWeightG(e.target.value)}
                  placeholder="Poids en grammes (ex: 250)"
                  className="flex-1 p-3 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none focus:bg-white focus:border-[#E8D5C4] border border-transparent"
                />
                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 p-3 rounded-xl">2200 DA/Kg</span>
              </div>
            ) : (
              <input
                type="number"
                value={fraisFixe}
                onChange={(e) => setFraisFixe(e.target.value)}
                placeholder="Montant fixe en DA"
                className="w-full p-3 rounded-xl bg-gray-50 text-sm font-bold text-[#4A3F35] outline-none focus:bg-white focus:border-[#E8D5C4] border border-transparent"
              />
            )}
          </div>

          {/* Résultat Final */}
          <div className="bg-[#8D7B68] p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Sparkles size={80} />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">
              Prix de vente conseillé
            </p>
            <p className="text-3xl font-serif font-black mb-3">
              {formatDA(finalPrice)}
            </p>
            <div className="flex justify-between items-center pt-3 border-t border-white/20">
              <span className="text-[11px] font-medium opacity-90">Bénéfice Net Estimé</span>
              <span className="text-sm font-black text-[#D4B996] bg-white/10 px-3 py-1 rounded-lg">
                {formatDA(benefit)}
              </span>
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
  const totalWeight =
    items.reduce((sum, item) => sum + (parseFloat(item.weightG) || 0), 0) /
    1000;
  const itemCount = items.length;
  const subtotal = items.reduce(
    (sum, i) => sum + (parseFloat(i.priceVente) || 0),
    0
  );
  const shipping = parseFloat(order.shippingNational) || 0;
  const advance = parseFloat(order.advancePayment) || 0;

  const isFullyPaidStatus =
    order.status === "Payée" || order.status === "Payée et livrée";
  const totalToPay = isFullyPaidStatus
    ? 0
    : Math.max(0, subtotal + shipping - advance);

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1010] flex items-center justify-center p-4 print:absolute print:inset-0 print:bg-white print:p-0 print:z-[9999] print:block print:h-auto">
      
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden print:w-full print:max-w-full print:max-h-none print:shadow-none print:rounded-none print:animate-none print:transform-none print:border-none print:h-auto print:overflow-visible">
        
        <div className="absolute top-4 right-4 flex gap-2 z-20 print:hidden">
          <button
            onClick={() => window.print()}
            className="p-2 bg-gray-50/90 backdrop-blur-md rounded-full hover:bg-[#8D7B68] hover:text-white text-[#8D7B68] transition-colors shadow-sm"
          >
            <Printer size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-gray-50/90 backdrop-blur-md rounded-full hover:bg-gray-200 text-gray-600 transition-colors shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 pb-8 print:overflow-visible print:pb-0 print:h-auto">
          <div className="bg-[#FAF7F2] p-8 pt-10 border-b border-[#E8D5C4]/40 text-center relative print:bg-white print:border-b-2 print:border-black print:p-4">
            <Truck size={32} className="mx-auto mb-3 text-[#8D7B68] print:text-black" />
            <h2 className="font-serif text-2xl font-bold text-[#8D7B68] tracking-widest mb-1 print:text-black">
              BORDEREAU
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#B8A99A] font-bold print:text-gray-800">
              Commande #{order.orderNumber}
            </p>
          </div>
          
          <div className="p-8 space-y-6 print:p-4 print:space-y-4">
            <div>
              <h4 className="text-[9px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100 pb-2 mb-3 print:text-gray-800 print:border-black">
                Destinataire
              </h4>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-[#4A3F35] text-base print:text-black">
                  {order.customerName}
                </p>
                <p className="text-[#8D7B68] font-medium flex items-center gap-2 print:text-black">
                  <Phone size={12} /> {customer?.phone}{" "}
                  {customer?.phone2 && `/ ${customer?.phone2}`}
                </p>
                <div className="bg-gray-50 p-3 rounded-xl mt-2 text-xs text-gray-600 border border-gray-100 print:bg-white print:border print:border-black print:text-black print:p-2">
                  <p className="font-bold text-[#4A3F35] mb-1 print:text-black">
                    {customer?.wilaya} - {customer?.commune}
                  </p>
                  <p className="flex items-center gap-1.5 font-bold">
                    <MapPin size={12} className="text-[#D4B996] print:text-black" />{" "}
                    {customer?.deliveryMode === "stopdesk"
                      ? `Stopdesk: ${customer?.stopdeskName}`
                      : "Livraison à Domicile"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[9px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100 pb-2 mb-3 print:text-gray-800 print:border-black">
                Détails du colis
              </h4>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#E8D5C4]/30 text-center print:bg-white print:border print:border-black print:p-2">
                  <p className="text-[10px] text-[#B8A99A] uppercase font-bold mb-1 print:text-gray-800">
                    Articles
                  </p>
                  <p className="font-black text-[#8D7B68] text-lg print:text-black">
                    {itemCount}
                  </p>
                </div>
                <div className="flex-1 bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#E8D5C4]/30 text-center print:bg-white print:border print:border-black print:p-2">
                  <p className="text-[10px] text-[#B8A99A] uppercase font-bold mb-1 print:text-gray-800">
                    Poids Total
                  </p>
                  <p className="font-black text-[#8D7B68] text-lg print:text-black">
                    {totalWeight.toFixed(2)} <span className="text-xs">Kg</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100 print:bg-white print:border print:border-black print:p-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col border-b border-gray-200/50 last:border-0 pb-2 last:pb-0 print:border-gray-300"
                  >
                    <div className="flex justify-between items-start text-xs">
                      <span className="text-[#4A3F35] font-bold pr-2 print:text-black">
                        • {item.name || "Article"}
                      </span>
                      <span className="text-gray-500 text-[10px] whitespace-nowrap font-bold print:text-black">
                        {item.size} / {item.color}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#B8A99A] ml-2.5 mt-0.5 font-bold uppercase tracking-wider print:text-gray-600">
                      {item.category || "Catégorie non spécifiée"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#8D7B68] p-5 rounded-2xl text-white text-center shadow-md relative overflow-hidden print:bg-white print:border-2 print:border-black print:text-black print:shadow-none print:p-3">
              <p className="text-[10px] uppercase tracking-widest font-bold mb-1 print:text-gray-800">
                Montant à encaisser à la livraison
              </p>
              <p className="text-3xl font-serif font-black print:text-black">
                {totalToPay > 0 ? formatDA(totalToPay) : "PAYÉ"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceiptModal = ({ order, onClose, formatDA }) => {
  const items = order.items || [];
  const subtotal = items.reduce(
    (sum, i) => sum + (parseFloat(i.priceVente) || 0),
    0
  );
  const shipping = parseFloat(order.shippingNational) || 0;
  const advance = parseFloat(order.advancePayment) || 0;

  const isFullyPaidStatus =
    order.status === "Payée" || order.status === "Payée et livrée";
  const total = isFullyPaidStatus
    ? 0
    : Math.max(0, subtotal + shipping - advance);

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1010] flex items-center justify-center p-4 print:absolute print:inset-0 print:bg-white print:p-0 print:z-[9999] print:block print:h-auto">
      
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden print:w-full print:max-w-full print:max-h-none print:shadow-none print:rounded-none print:animate-none print:transform-none print:border-none print:h-auto print:bg-white print:overflow-visible">
        
        <div className="absolute top-4 right-4 flex gap-2 z-20 print:hidden">
          <button
            onClick={() => window.print()}
            className="p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white text-[#8D7B68] transition-colors shadow-sm"
          >
            <Printer size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white text-[#8D7B68] transition-colors shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 md:p-10 pt-12 md:pt-12 text-center overflow-y-auto custom-scrollbar flex-1 print:overflow-visible print:p-4 print:h-auto print:pt-4">
          <div className="mb-6 md:mb-8">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#8D7B68] tracking-widest mb-1 print:text-black">
              YUNA'S SHOP
            </h2>
            <div className="h-px w-8 bg-[#D4B996] mx-auto mb-2 print:bg-black"></div>
            <p className="text-[8px] uppercase tracking-[0.4em] text-[#B8A99A] font-bold print:text-black">
              Bon de Commande
            </p>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E8D5C4]/30 text-left mb-6 md:mb-8 relative overflow-hidden shadow-sm print:bg-white print:border print:border-black print:shadow-none print:p-4">
            <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-[#FAF7F2] rounded-bl-full -mr-6 -mt-6 md:-mr-8 md:-mt-8 print:hidden"></div>
            <p className="text-xs font-bold text-[#8D7B68] mb-1 print:text-black">
              {order.customerName}
            </p>
            <p className="text-[9px] text-[#B8A99A] uppercase tracking-wider mb-3 md:mb-4 print:text-gray-800 font-bold">
              CMD #{order.orderNumber}
            </p>
            
            <div className="space-y-3 print:space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col border-b border-gray-100 last:border-0 pb-2 last:pb-0 print:border-gray-300"
                >
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-[#4A3F35] font-bold pr-2 print:text-black">
                      {item.name || "Article"}
                    </span>
                    <span className="font-black text-[#8D7B68] print:text-black whitespace-nowrap">
                      {formatDA(item.priceVente)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[10px]">
                    <span className="text-[#B8A99A] uppercase font-bold tracking-wider print:text-gray-600">
                      {item.category || "Catégorie"}
                    </span>
                    <span className="text-gray-400 font-medium print:text-gray-600">
                      {item.size} / {item.color}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:space-y-3 text-xs bg-white/50 p-4 md:p-5 rounded-2xl border border-[#E8D5C4]/20 print:bg-transparent print:border-none print:p-0">
            <div className="flex justify-between text-[#8D7B68]/70 font-bold print:text-black print:font-medium">
              <span>Sous-total</span>
              <span>{formatDA(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#8D7B68]/70 font-bold print:text-black print:font-medium">
              <span>Livraison</span>
              <span>{formatDA(shipping)}</span>
            </div>
            <div className="flex justify-between text-green-600/80 font-bold print:text-black">
              <span>Avance</span>
              <span>- {formatDA(advance)}</span>
            </div>
            
            <div className="h-px bg-[#E8D5C4] my-2 md:my-3 opacity-50 print:bg-black print:opacity-100 print:my-2"></div>
            
            <div className="flex justify-between font-serif font-bold text-lg md:text-xl text-[#8D7B68] print:text-black">
              <span>Reste à payer</span>
              <span>{total > 0 ? formatDA(total) : "0.00 DA"}</span>
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-[#E8D5C4]/30 print:border-black print:mt-4 print:pt-4">
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#D4B996] font-bold print:text-black">
              Merci pour votre confiance ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ deleteTarget, performDelete, onClose }) => (
  <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1050] flex items-end md:items-center justify-center p-0 md:p-4 pb-4">
    <div className="bg-white w-full md:max-w-xs rounded-[2rem] p-6 text-center shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95 pb-10 md:pb-6">
      <div className="w-12 h-12 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-lg font-serif text-[#4A3F35] mb-1">Supprimer ?</h3>
      <p className="text-[11px] text-[#B8A99A] mb-6">
        Effacer définitivement{" "}
        <span className="font-bold text-[#8D7B68]">{deleteTarget?.label}</span>{" "}
        ? Irréversible.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-[#FAF7F2] text-[#8D7B68] rounded-xl font-bold text-[10px] uppercase transition-colors shadow-sm"
        >
          Annuler
        </button>
        <button
          onClick={performDelete}
          className="flex-1 py-3 bg-red-400 text-white rounded-xl font-bold text-[10px] uppercase shadow-md"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

const CustomerHistoryModal = ({
  customer,
  orders,
  formatDA,
  onClose,
  onOpenOrder,
}) => {
  const history = orders
    .filter((o) => o.customerId === customer.id)
    .sort((a, b) => {
      const tA = a.date?.toMillis
        ? a.date.toMillis()
        : new Date(a.date || 0).getTime();
      const tB = b.date?.toMillis
        ? b.date.toMillis()
        : new Date(b.date || 0).getTime();
      return tB - tA;
    });
  return (
    <div className="fixed inset-0 bg-[#4A3F35]/50 backdrop-blur-sm z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 pb-4">
      <div className="bg-white w-full h-[85vh] md:h-auto md:max-h-[85vh] md:max-w-3xl rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4">
        <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-serif text-[#8D7B68] font-bold uppercase tracking-widest">
              Historique
            </h3>
            <p className="text-xs text-[#4A3F35] font-bold mt-1">
              {customer.name} • {history.length} commande(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-400"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-3">
          {history.length === 0 ? (
            <p className="text-center text-sm text-gray-400 font-medium py-10">
              Aucune commande pour cette cliente.
            </p>
          ) : (
            history.map((o) => {
              const d = o.date?.toDate
                ? o.date.toDate().toLocaleDateString("fr-FR")
                : new Date(o.date).toLocaleDateString("fr-FR");
              const reste = calculateReste(o);
              const total =
                (parseFloat(o.totalVente) || 0) +
                (parseFloat(o.shippingNational) || 0);
              return (
                <div
                  key={o.id}
                  className="bg-[#FAF7F2]/50 p-4 rounded-2xl border border-[#E8D5C4]/30 flex flex-col md:flex-row justify-between md:items-center gap-3 hover:bg-[#FAF7F2] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#8D7B68]">
                        {o.orderNumber}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-gray-100 text-gray-500 font-bold uppercase">
                        {o.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#B8A99A] font-bold uppercase">
                      {d}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-right justify-between w-full md:w-auto">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[9px] uppercase text-gray-400 font-bold mb-0.5">
                          Total
                        </p>
                        <p className="font-black text-[#8D7B68] text-sm">
                          {formatDA(total)}
                        </p>
                      </div>
                      <div className="pl-4 border-l border-[#E8D5C4]/40">
                        <p className="text-[9px] uppercase text-gray-400 font-bold mb-0.5">
                          Reste
                        </p>
                        <p
                          className={`font-black text-sm ${
                            reste > 0 ? "text-red-400" : "text-green-500"
                          }`}
                        >
                          {reste > 0 ? formatDA(reste) : "Payé"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenOrder(o)}
                      className="p-2.5 bg-white rounded-xl text-[#D4B996] shadow-sm hover:scale-105 transition-transform ml-2"
                    >
                      <Edit3 size={16} />
                    </button>
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
