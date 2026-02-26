import { useState, useRef, useCallback } from "react";
import {
  Bell,
  Sprout,
  Leaf,
  Upload,
  MessageCircle,
  X,
  Send,
  Cloud,
  TrendingUp,
  ShieldCheck,
  Thermometer,
  Droplets,
  CloudRain,
  Menu,
  ChevronDown,
  Bot,
  User,
  Microscope,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Language = "EN" | "HI" | "BN";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
}

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  EN: {
    greeting: "Namaste, Farmer! 🌾",
    dashboard: "Dashboard",
    myFarm: "My Farm",
    weather: "Weather",
    market: "Market",
    reports: "Reports",
    cropRec: "Crop Recommendation",
    cropRecSub: "Get AI-powered crop suggestions based on your soil & weather",
    disease: "Plant Disease Detection",
    diseaseSub: "Upload a leaf photo for instant AI disease diagnosis",
    getRec: "Get Recommendation",
    analyze: "Analyze Disease",
    uploadText: "Drag & drop leaf image or click to browse",
    supported: "Supported: JPG, PNG, WEBP",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    temperature: "Temperature (°C)",
    humidity: "Humidity (%)",
    rainfall: "Rainfall (mm)",
    ph: "pH Level",
    soilHealth: "Soil Health Score",
    activeCrops: "Active Crops",
    weatherAlert: "Weather Alert",
    forecastTitle: "7-Day Forecast",
    marketTitle: "Market Prices",
    chatTitle: "Kisan AI Assistant",
    chatPlaceholder: "Ask anything about farming...",
    kisanAI: "Kisan AI",
  },
  HI: {
    greeting: "नमस्ते, किसान! 🌾",
    dashboard: "डैशबोर्ड",
    myFarm: "मेरा खेत",
    weather: "मौसम",
    market: "बाज़ार",
    reports: "रिपोर्ट",
    cropRec: "फसल सुझाव",
    cropRecSub: "मिट्टी और मौसम के आधार पर AI फसल सुझाव पाएं",
    disease: "पौधे रोग पहचान",
    diseaseSub: "त्वरित AI रोग निदान के लिए पत्ती की फोटो अपलोड करें",
    getRec: "सुझाव पाएं",
    analyze: "रोग विश्लेषण करें",
    uploadText: "पत्ती की फोटो यहाँ खींचें या क्लिक करें",
    supported: "समर्थित: JPG, PNG, WEBP",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फास्फोरस (P)",
    potassium: "पोटेशियम (K)",
    temperature: "तापमान (°C)",
    humidity: "आर्द्रता (%)",
    rainfall: "वर्षा (mm)",
    ph: "pH स्तर",
    soilHealth: "मिट्टी स्वास्थ्य स्कोर",
    activeCrops: "सक्रिय फसलें",
    weatherAlert: "मौसम चेतावनी",
    forecastTitle: "7-दिन पूर्वानुमान",
    marketTitle: "बाजार मूल्य",
    chatTitle: "किसान AI सहायक",
    chatPlaceholder: "खेती के बारे में कुछ भी पूछें...",
    kisanAI: "किसान AI",
  },
  BN: {
    greeting: "নমস্কার, কৃষক! 🌾",
    dashboard: "ড্যাশবোর্ড",
    myFarm: "আমার খামার",
    weather: "আবহাওয়া",
    market: "বাজার",
    reports: "রিপোর্ট",
    cropRec: "ফসল সুপারিশ",
    cropRecSub: "মাটি ও আবহাওয়ার উপর ভিত্তি করে AI ফসল পরামর্শ পান",
    disease: "উদ্ভিদ রোগ শনাক্তকরণ",
    diseaseSub: "তাৎক্ষণিক AI রোগ নির্ণয়ের জন্য পাতার ছবি আপলোড করুন",
    getRec: "সুপারিশ পান",
    analyze: "রোগ বিশ্লেষণ করুন",
    uploadText: "পাতার ছবি টেনে আনুন বা ক্লিক করুন",
    supported: "সমর্থিত: JPG, PNG, WEBP",
    nitrogen: "নাইট্রোজেন (N)",
    phosphorus: "ফসফরাস (P)",
    potassium: "পটাশিয়াম (K)",
    temperature: "তাপমাত্রা (°C)",
    humidity: "আর্দ্রতা (%)",
    rainfall: "বৃষ্টিপাত (mm)",
    ph: "pH মাত্রা",
    soilHealth: "মাটির স্বাস্থ্য স্কোর",
    activeCrops: "সক্রিয় ফসল",
    weatherAlert: "আবহাওয়া সতর্কতা",
    forecastTitle: "৭-দিনের পূর্বাভাস",
    marketTitle: "বাজার মূল্য",
    chatTitle: "কিষান AI সহায়ক",
    chatPlaceholder: "চাষাবাদ সম্পর্কে যেকোনো প্রশ্ন করুন...",
    kisanAI: "কিষান AI",
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const WEATHER_DATA = [
  { day: "Mon", icon: "☀️", high: 32, low: 22, desc: "Sunny" },
  { day: "Tue", icon: "⛅", high: 29, low: 20, desc: "Partly Cloudy" },
  { day: "Wed", icon: "🌧️", high: 26, low: 18, desc: "Rainy" },
  { day: "Thu", icon: "🌩️", high: 24, low: 17, desc: "Thunderstorm" },
  { day: "Fri", icon: "⛅", high: 28, low: 19, desc: "Cloudy" },
  { day: "Sat", icon: "☀️", high: 33, low: 23, desc: "Sunny" },
  { day: "Sun", icon: "☀️", high: 34, low: 24, desc: "Hot & Sunny" },
];

const MARKET_DATA = [
  { crop: "Wheat", emoji: "🌾", price: "₹2,150", change: "+2.3%", up: true },
  { crop: "Rice", emoji: "🌾", price: "₹1,890", change: "+0.8%", up: true },
  { crop: "Tomato", emoji: "🍅", price: "₹3,240", change: "-1.2%", up: false },
  { crop: "Onion", emoji: "🧅", price: "₹2,890", change: "+4.1%", up: true },
  { crop: "Cotton", emoji: "☁️", price: "₹6,540", change: "+1.5%", up: true },
  { crop: "Soybean", emoji: "🫘", price: "₹4,120", change: "-0.5%", up: false },
];

const CROP_EMOJIS = ["🌾", "🌽", "🍅", "🧅", "🫘", "☁️", "🌿"];

const INITIAL_CHAT: ChatMessage[] = [
  { id: "init-1", from: "bot", text: "Hello! I am Kisan AI. How can I help with your farm today?" },
  { id: "init-2", from: "user", text: "What fertilizer should I use for wheat?" },
  {
    id: "init-3",
    from: "bot",
    text: "For wheat, I recommend a balanced NPK fertilizer (20-20-0) during sowing, followed by urea top-dressing at tillering stage.",
  },
];

// ─── NavBar ────────────────────────────────────────────────────────────────────
function NavBar({
  language,
  onLanguageChange,
  t,
}: {
  language: Language;
  onLanguageChange: () => void;
  t: (typeof translations)["EN"];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [t.dashboard, t.myFarm, t.weather, t.market, t.reports];
  const activeLink = t.dashboard;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
          >
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-primary leading-none">
            Kishan Sathi
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                link === activeLink
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onLanguageChange}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {language}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {/* Bell */}
          <button
            type="button"
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white" />
          </button>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
          >
            K
          </div>

          {/* Hamburger */}
          <button
            type="button"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((p) => !p)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                link === activeLink
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onLanguageChange();
              setMobileOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-muted"
          >
            Language: {language}
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ t }: { t: (typeof translations)["EN"] }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 45%, #52B788 100%)" }}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-4 -right-4 text-[180px] leading-none">🌾</div>
        <div className="absolute bottom-0 left-8 text-[120px] leading-none">🌿</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[220px] leading-none opacity-30">
          🌱
        </div>
      </div>

      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Greeting */}
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              {t.greeting}
            </h1>
            <p className="mt-2 text-white/70 text-sm sm:text-base font-medium">
              Thursday, 26 February 2026 &bull; ☀️ Sunny, 28°C
            </p>
            <p className="mt-3 text-white/60 text-sm max-w-md">
              Your smart farming companion — AI insights, weather forecasts, and market prices in
              one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:min-w-[460px]">
            {/* Soil Health */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-xs font-medium uppercase tracking-wide">
                  {t.soilHealth}
                </span>
                <Sprout className="w-4 h-4 text-white/60" aria-hidden="true" />
              </div>
              <div className="text-white font-display font-bold text-2xl">82/100</div>
              <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: "82%", background: "#52B788" }}
                />
              </div>
            </div>

            {/* Active Crops */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-xs font-medium uppercase tracking-wide">
                  {t.activeCrops}
                </span>
                <Leaf className="w-4 h-4 text-white/60" aria-hidden="true" />
              </div>
              <div className="text-white font-display font-bold text-2xl">7 Crops</div>
              <div className="mt-2 flex gap-1">
                {CROP_EMOJIS.map((emoji) => (
                  <span key={emoji} className="text-sm" aria-hidden="true">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Weather Alert */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-xs font-medium uppercase tracking-wide">
                  {t.weatherAlert}
                </span>
                <ShieldCheck className="w-4 h-4 text-white/60" aria-hidden="true" />
              </div>
              <div className="font-display font-bold text-2xl" style={{ color: "#F4A261" }}>
                Low Risk
              </div>
              <div className="mt-1.5 text-white/60 text-xs">No severe weather expected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Slider Row ────────────────────────────────────────────────────────────────
function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  inputId,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  inputId: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          {value}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

// ─── Input Row ─────────────────────────────────────────────────────────────────
function InputRow({
  label,
  value,
  min,
  max,
  step = 1,
  inputId,
  icon,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  inputId: string;
  icon: React.ReactNode;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
        <input
          id={inputId}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>
    </div>
  );
}

// ─── Crop Recommendation Card ──────────────────────────────────────────────────
function CropRecommendationCard({ t }: { t: (typeof translations)["EN"] }) {
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(40);
  const [potassium, setPotassium] = useState(30);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(60);
  const [rainfall, setRainfall] = useState(120);
  const [ph, setPh] = useState(6.5);
  const [showCropResult, setShowCropResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowCropResult(true);
    }, 1200);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sprout className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">{t.cropRec}</h2>
          <p className="text-muted-foreground text-xs mt-0.5">{t.cropRecSub}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Sliders */}
        <SliderRow
          label={t.nitrogen}
          value={nitrogen}
          min={0}
          max={140}
          inputId="slider-nitrogen"
          onChange={setNitrogen}
        />
        <SliderRow
          label={t.phosphorus}
          value={phosphorus}
          min={0}
          max={145}
          inputId="slider-phosphorus"
          onChange={setPhosphorus}
        />
        <SliderRow
          label={t.potassium}
          value={potassium}
          min={0}
          max={205}
          inputId="slider-potassium"
          onChange={setPotassium}
        />
        <SliderRow
          label={t.ph}
          value={ph}
          min={0}
          max={14}
          step={0.1}
          inputId="slider-ph"
          onChange={setPh}
        />

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <InputRow
            label={t.temperature}
            value={temperature}
            min={0}
            max={50}
            inputId="input-temperature"
            icon={<Thermometer className="w-4 h-4" />}
            onChange={setTemperature}
          />
          <InputRow
            label={t.humidity}
            value={humidity}
            min={0}
            max={100}
            inputId="input-humidity"
            icon={<Droplets className="w-4 h-4" />}
            onChange={setHumidity}
          />
          <InputRow
            label={t.rainfall}
            value={rainfall}
            min={0}
            max={300}
            inputId="input-rainfall"
            icon={<CloudRain className="w-4 h-4" />}
            onChange={setRainfall}
          />
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleGetRecommendation}
        disabled={isLoading}
        className="w-full mt-5 py-3 rounded-xl text-white font-display font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          t.getRec
        )}
      </button>

      {/* Result */}
      {showCropResult && (
        <div className="mt-4 animate-fade-in-up">
          <div className="bg-primary/8 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl" aria-hidden="true">
                🌾
              </span>
              <div>
                <div className="font-display font-bold text-xl text-primary">Wheat</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Best match for your conditions
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm font-semibold text-foreground">Confidence</div>
                <div className="font-display font-bold text-lg text-primary">94%</div>
              </div>
            </div>
            <div className="w-full bg-border rounded-full h-2 mb-3">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: "94%", background: "linear-gradient(90deg, #2D6A4F, #52B788)" }}
              />
            </div>
            <p className="text-xs text-muted-foreground italic">
              Recommended for sandy loam soil with current conditions. Also consider: Maize 🌽
              (87%), Barley (79%).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Disease Detection Card ────────────────────────────────────────────────────
function DiseaseDetectionCard({ t }: { t: (typeof translations)["EN"] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setShowResult(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const triggerFileInput = () => fileRef.current?.click();

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 1400);
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Microscope className="w-5 h-5 text-accent-foreground" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">{t.disease}</h2>
          <p className="text-muted-foreground text-xs mt-0.5">{t.diseaseSub}</p>
        </div>
      </div>

      {/* Upload Zone — use a button wrapper to satisfy interactive element requirements */}
      <button
        type="button"
        aria-label="Upload leaf image for disease detection"
        className={`mt-5 w-full relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden text-left ${
          isDragging
            ? "border-secondary bg-secondary/10"
            : "border-border bg-muted/30 hover:border-secondary/50 hover:bg-muted/50"
        }`}
        style={{ minHeight: "200px" }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {uploadedImage ? (
          <div className="relative w-full h-[200px]">
            <img
              src={uploadedImage}
              alt="Uploaded leaf for analysis"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                Click to change
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 gap-3 h-full min-h-[200px]">
            <div
              className={`transition-transform duration-200 ${isDragging ? "scale-110" : ""}`}
              aria-hidden="true"
            >
              <Upload className="w-10 h-10 text-secondary" />
            </div>
            <p className="text-sm font-medium text-foreground text-center">{t.uploadText}</p>
            <p className="text-xs text-muted-foreground">{t.supported}</p>
          </div>
        )}
      </button>

      {/* Analyze Button */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!uploadedImage || isAnalyzing}
        className="w-full mt-4 py-3 rounded-xl text-white font-display font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        style={{ background: "linear-gradient(135deg, #6B4226, #A0522D)" }}
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          t.analyze
        )}
      </button>

      {/* Result */}
      {showResult && (
        <div className="mt-4 animate-fade-in-up">
          <div className="bg-destructive/8 border border-destructive/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-destructive/15 text-destructive text-xs font-bold px-2.5 py-1 rounded-full border border-destructive/20">
                ⚠ Apple Scab
              </span>
              <span className="ml-auto text-xs font-semibold text-foreground">87% match</span>
            </div>
            <div className="w-full bg-border rounded-full h-2 mb-3">
              <div
                className="h-2 rounded-full"
                style={{
                  width: "87%",
                  background: "linear-gradient(90deg, #A0522D, #E07040)",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              🌿{" "}
              <strong className="text-foreground">Treatment:</strong> Apply copper-based
              fungicides. Remove infected leaves immediately and dispose properly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Weather Strip ─────────────────────────────────────────────────────────────
function WeatherStrip({ t }: { t: (typeof translations)["EN"] }) {
  return (
    <div className="bg-card rounded-2xl shadow-md border border-border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-5">
        <Cloud className="w-5 h-5 text-primary" aria-hidden="true" />
        <h2 className="font-display font-semibold text-lg text-foreground">{t.forecastTitle}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {WEATHER_DATA.map((day, i) => (
          <div
            key={day.day}
            className={`flex flex-col items-center gap-2 rounded-xl px-4 py-3 min-w-[84px] shrink-0 transition-all duration-200 ${
              i === 0 ? "text-primary-foreground shadow-md" : "bg-muted/50 text-foreground hover:bg-muted"
            }`}
            style={i === 0 ? { background: "linear-gradient(135deg, #2D6A4F, #52B788)" } : {}}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${
                i === 0 ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {day.day}
            </span>
            <span className="text-2xl" aria-hidden="true">
              {day.icon}
            </span>
            <div className="text-center">
              <div
                className={`text-sm font-bold ${i === 0 ? "text-white" : "text-foreground"}`}
              >
                {day.high}°
              </div>
              <div
                className={`text-xs ${i === 0 ? "text-white/60" : "text-muted-foreground"}`}
              >
                {day.low}°
              </div>
            </div>
            <span
              className={`text-[10px] text-center leading-tight ${
                i === 0 ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {day.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Market Prices ─────────────────────────────────────────────────────────────
function MarketPrices({ t }: { t: (typeof translations)["EN"] }) {
  return (
    <div className="bg-card rounded-2xl shadow-md border border-border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-5">
        <TrendingUp className="w-5 h-5 text-primary" aria-hidden="true" />
        <h2 className="font-display font-semibold text-lg text-foreground">{t.marketTitle}</h2>
        <div className="flex items-center gap-1.5 ml-2 bg-primary/10 px-2.5 py-1 rounded-full">
          <span
            className="w-2 h-2 rounded-full bg-secondary animate-blink"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-primary">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {MARKET_DATA.map((item) => (
          <div
            key={item.crop}
            className="bg-muted/40 hover:bg-muted rounded-xl p-3.5 border border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default"
          >
            <div className="text-2xl mb-1.5" aria-hidden="true">
              {item.emoji}
            </div>
            <div className="text-xs font-semibold text-muted-foreground mb-1">{item.crop}</div>
            <div className="font-display font-bold text-sm text-foreground">{item.price}</div>
            <div
              className={`text-xs font-semibold mt-1 ${
                item.up ? "text-secondary" : "text-destructive"
              }`}
            >
              {item.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chat Widget ───────────────────────────────────────────────────────────────
function ChatWidget({ t }: { t: (typeof translations)["EN"] }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const ts = Date.now().toString();
    const userMsg: ChatMessage = { id: `user-${ts}`, from: "user", text };
    const botMsg: ChatMessage = {
      id: `bot-${ts}`,
      from: "bot",
      text: "Thank you for your question! I'm processing your query about farming. For detailed advice, please consult your local agricultural extension officer as well.",
    };
    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput("");
    setTimeout(scrollToBottom, 100);
  }, [chatInput, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Chat Window */}
      {chatOpen && (
        <div className="w-80 h-[420px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-fade-in-up">
          {/* Chat Header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 shrink-0"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="text-white font-display font-semibold text-sm">{t.chatTitle}</div>
              <div className="text-white/60 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-blink" aria-hidden="true" />
                Online
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.from === "bot" ? "bg-primary/15" : "text-white"
                  }`}
                  style={
                    msg.from === "user"
                      ? { background: "linear-gradient(135deg, #2D6A4F, #52B788)" }
                      : {}
                  }
                  aria-hidden="true"
                >
                  {msg.from === "bot" ? (
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[200px] text-xs rounded-xl px-3 py-2 leading-relaxed ${
                    msg.from === "bot"
                      ? "bg-muted text-foreground rounded-tl-none"
                      : "text-white rounded-tr-none"
                  }`}
                  style={
                    msg.from === "user"
                      ? { background: "linear-gradient(135deg, #2D6A4F, #52B788)" }
                      : {}
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatPlaceholder}
              aria-label={t.chatPlaceholder}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!chatInput.trim()}
              aria-label="Send message"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-40 shrink-0"
              style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex flex-col items-center gap-1.5">
        {!chatOpen && (
          <div
            className="text-white text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
          >
            {t.kisanAI}
          </div>
        )}
        <button
          type="button"
          onClick={() => setChatOpen((p) => !p)}
          aria-label={chatOpen ? "Close AI chat" : "Open AI chat"}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
            !chatOpen ? "animate-pulse-ring" : ""
          }`}
          style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
        >
          {chatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="mt-10 border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
          >
            <Leaf className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </div>
          <span className="font-display font-bold text-sm text-primary">Kishan Sathi</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © 2026. Built with <span className="text-destructive">♥</span> using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>🌾 Empowering Indian Farmers</span>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [language, setLanguage] = useState<Language>("EN");

  const t = translations[language];
  const languages: Language[] = ["EN", "HI", "BN"];

  const cycleLanguage = () => {
    setLanguage((prev) => {
      const idx = languages.indexOf(prev);
      return languages[(idx + 1) % languages.length];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar language={language} onLanguageChange={cycleLanguage} t={t} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
        {/* Hero */}
        <HeroSection t={t} />

        {/* Main Cards */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CropRecommendationCard t={t} />
          <DiseaseDetectionCard t={t} />
        </div>

        {/* Weather */}
        <div className="mt-6">
          <WeatherStrip t={t} />
        </div>

        {/* Market Prices */}
        <div className="mt-6">
          <MarketPrices t={t} />
        </div>
      </main>

      <Footer />

      {/* Chatbot */}
      <ChatWidget t={t} />
    </div>
  );
}
