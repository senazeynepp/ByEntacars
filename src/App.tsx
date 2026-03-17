import { useState, ReactNode, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GoogleGenAI } from "@google/genai";

// Fix for default marker icon
// @ts-ignore
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import { 
  Car as CarIcon, 
  MapPin, 
  Battery, 
  Zap, 
  ShieldCheck, 
  Phone, 
  Menu, 
  X, 
  ChevronRight, 
  Clock,
  Briefcase,
  Users,
  Search,
  Navigation,
  MessageSquare,
  Send,
  User,
  Bot,
  Mail,
  Building2,
  Sun,
  Moon
} from 'lucide-react';
import { CARS, CHARGING_STATIONS, RENTAL_CONDITIONS, OFFICES } from './constants';
import { Car, Office } from './types';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activePage, setActivePage] = useState<'home' | 'cars' | 'map' | 'offices' | 'about' | 'conditions'>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showQuickQuote, setShowQuickQuote] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-500 selection:text-black transition-colors duration-300 bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-900 dark:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActivePage('home')}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Zap className="text-black fill-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter">BY ENTACARS</h1>
              <p className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase">Elektrikli Araç Kiralama</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink active={activePage === 'home'} theme={theme} onClick={() => setActivePage('home')}>Ana Sayfa</NavLink>
            <NavLink active={activePage === 'cars'} theme={theme} onClick={() => setActivePage('cars')}>Araç Filosu</NavLink>
            <NavLink active={activePage === 'map'} theme={theme} onClick={() => setActivePage('map')}>Şarj Haritası</NavLink>
            <NavLink active={activePage === 'offices'} theme={theme} onClick={() => setActivePage('offices')}>Kiralama Ofisleri</NavLink>
            
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
              title={theme === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button 
              onClick={() => setShowQuickQuote(true)}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-black transition-colors"
            >
              Hızlı Teklif Al
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full bg-zinc-100 dark:bg-white/5"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <button onClick={() => { setActivePage('home'); setIsMenuOpen(false); }}>Ana Sayfa</button>
              <button onClick={() => { setActivePage('cars'); setIsMenuOpen(false); }}>Araç Filosu</button>
              <button onClick={() => { setActivePage('map'); setIsMenuOpen(false); }}>Şarj Haritası</button>
              <button onClick={() => { setActivePage('offices'); setIsMenuOpen(false); }}>Kiralama Ofisleri</button>
              <button onClick={() => { setActivePage('about'); setIsMenuOpen(false); }}>Hakkımızda</button>
              <button onClick={() => { setActivePage('conditions'); setIsMenuOpen(false); }}>Kiralama Koşulları</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20">
        {activePage === 'home' && <HomePage onExplore={() => setActivePage('cars')} />}
        {activePage === 'cars' && <CarsPage onSelectCar={setSelectedCar} />}
        {activePage === 'map' && <MapPage theme={theme} />}
        {activePage === 'offices' && <OfficesPage theme={theme} />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'conditions' && <ConditionsPage />}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 py-20 px-6 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-emerald-500" size={32} />
              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white">BY ENTACARS</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
              Geleceğin mobilitesini bugünden deneyimleyin. Türkiye'nin en geniş elektrikli araç filosuyla sürdürülebilir bir yolculuğa çıkın.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-zinc-900 dark:text-white">Hızlı Linkler</h3>
            <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <li><button onClick={() => setActivePage('cars')} className="hover:text-emerald-500 transition-colors">Araçlar</button></li>
              <li><button onClick={() => setActivePage('map')} className="hover:text-emerald-500 transition-colors">Şarj İstasyonları</button></li>
              <li><button onClick={() => setActivePage('offices')} className="hover:text-emerald-500 transition-colors">Kiralama Ofisleri</button></li>
              <li><button onClick={() => setActivePage('conditions')} className="hover:text-emerald-500 transition-colors">Kiralama Koşulları</button></li>
              <li><button onClick={() => setActivePage('about')} className="hover:text-emerald-500 transition-colors">Hakkımızda</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-zinc-900 dark:text-white">İletişim</h3>
            <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2"><Phone size={16} className="text-emerald-500" /> +90 538 973 15 00</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-200 dark:border-white/5 text-center text-zinc-500 text-sm">
          © 2026 By Entacars. Tüm hakları saklıdır.
        </div>
      </footer>

      {/* Car Details Modal */}
      <AnimatePresence>
        {selectedCar && (
          <CarDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} />
        )}
      </AnimatePresence>

      {/* Quick Quote Modal */}
      <AnimatePresence>
        {showQuickQuote && (
          <QuickQuoteModal 
            onClose={() => setShowQuickQuote(false)} 
            onOpenChat={() => {
              setShowQuickQuote(false);
              setShowChat(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <AnimatePresence>
        {showChat && <Chatbot onClose={() => setShowChat(false)} />}
      </AnimatePresence>

      {/* Floating Chat Button */}
      {!showChat && !showQuickQuote && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-emerald-500 text-black rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-400 transition-all group"
        >
          <MessageSquare size={24} />
          <span className="absolute right-full mr-4 bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none uppercase tracking-widest">
            Canlı Destek
          </span>
        </motion.button>
      )}
    </div>
  );
}

function NavLink({ children, active, theme, onClick }: { children: ReactNode, active: boolean, theme: 'light' | 'dark', onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative py-2 text-sm font-medium transition-colors ${active ? (theme === 'dark' ? 'text-white' : 'text-zinc-900') : (theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900')}`}
    >
      {children}
      {active && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500"
        />
      )}
    </button>
  );
}

function HomePage({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0A0A0A] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover opacity-40 dark:opacity-40 scale-105"
            alt="Hero"
          />
        </div>
        
        <div className="relative z-20 max-w-4xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-full text-xs font-mono tracking-widest uppercase mb-6 border border-emerald-500/20">
              Sürdürülebilir Gelecek
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-zinc-900 dark:text-white">
              ELEKTRİKLİ <br /> <span className="text-emerald-500">ÖZGÜRLÜK.</span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              By Entacars ile sessiz, güçlü ve çevreci bir sürüş deneyimine hazır mısınız? Türkiye'nin en modern elektrikli araç kiralama platformu.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onExplore}
              className="w-full md:w-auto bg-emerald-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group"
            >
              Araçları Keşfet <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full md:w-auto bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-100 dark:hover:bg-white/10 transition-all text-zinc-900 dark:text-white">
              Nasıl Çalışır?
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="text-emerald-500" />}
            title="Hızlı Şarj"
            description="Tüm araçlarımız %100 şarj ile teslim edilir ve geniş şarj ağımıza erişim sağlar."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-500" />}
            title="Tam Güvence"
            description="Kapsamlı kasko ve 7/24 yol yardım hizmeti ile yolculuğunuz güvende."
          />
          <FeatureCard 
            icon={<Clock className="text-emerald-500" />}
            title="7/24 Destek"
            description="Her türlü sorunuz için uzman ekibimiz bir telefon uzağınızda."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <div className="p-10 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl hover:border-emerald-500/30 transition-colors group">
      <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function CarsPage({ onSelectCar }: { onSelectCar: (car: Car) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4 text-zinc-900 dark:text-white">ARAÇ FİLOSU</h2>
          <p className="text-zinc-600 dark:text-zinc-400">İhtiyacınıza en uygun elektrikli aracı seçin.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 px-6 py-3 rounded-full border border-zinc-200 dark:border-white/5">
          <Search size={20} className="text-zinc-500" />
          <input 
            type="text" 
            placeholder="Araç ara..." 
            className="bg-transparent border-none outline-none text-sm w-48 text-zinc-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {CARS.map((car) => (
          <motion.div 
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-[40px] overflow-hidden hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-[400px] lg:h-auto overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-8 left-8 flex gap-2">
                  <span className="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest">
                    {car.type}
                  </span>
                  <span className="px-4 py-1.5 bg-emerald-500 text-black rounded-full text-xs font-bold uppercase tracking-widest">
                    Elektrikli
                  </span>
                </div>
              </div>
              
              <div className="p-12 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-1">{car.brand}</h3>
                      <h4 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">{car.model}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-500 text-sm mb-1">Günlük</p>
                      <p className="text-3xl font-bold text-emerald-500">₺{car.pricePerDay}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <CarSpec icon={<Zap size={18} />} label="Menzil" value={`${car.range} km`} />
                    <CarSpec icon={<Battery size={18} />} label="Batarya" value={`${car.battery} kWh`} />
                    <CarSpec icon={<Users size={18} />} label="Kapasite" value={car.passengers} />
                    <CarSpec icon={<Briefcase size={18} />} label="Bagaj" value={car.luggage} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => onSelectCar(car)}
                    className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-emerald-500 transition-colors"
                  >
                    Hemen Kirala
                  </button>
                  <button 
                    onClick={() => onSelectCar(car)}
                    className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors"
                  >
                    Detayları Gör
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CarSpec({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
      </div>
      <p className="text-lg font-bold text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}

function OfficesPage({ theme }: { theme: 'light' | 'dark' }) {
  const handleGo = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h2 className="text-5xl font-bold tracking-tighter mb-4 uppercase text-zinc-900 dark:text-white">Kiralama Ofisleri</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Size en yakın By Entacars ofisini bulun.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 bg-zinc-100 dark:bg-zinc-900 rounded-[40px] h-[500px] relative overflow-hidden border border-zinc-200 dark:border-white/5">
          <MapContainer 
            center={[39.9334, 32.8597]} 
            zoom={6} 
            style={{ height: '100%', width: '100%', background: theme === 'dark' ? '#0A0A0A' : '#f4f4f5' }}
            zoomControl={false}
          >
            <TileLayer
              url={theme === 'dark' 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {OFFICES.map((office) => (
              <Marker 
                key={office.id} 
                position={[office.lat, office.lng]}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-lg mb-1 text-zinc-900 dark:text-white">{office.name}</h4>
                    <p className="text-xs text-zinc-500 mb-3">{office.address}</p>
                    <button 
                      onClick={() => handleGo(office.lat, office.lng)}
                      className="w-full flex items-center justify-center gap-1 bg-emerald-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors"
                    >
                      <Navigation size={12} /> Yol Tarifi
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] p-10 flex flex-col justify-center">
          <Building2 className="text-emerald-500 mb-6" size={48} />
          <h3 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Yaygın Hizmet Ağı</h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Türkiye'nin en önemli noktalarında, havalimanlarında ve şehir merkezlerinde yanınızdayız. 
            Elektrikli araç deneyimini her yerde yaşamanız için ofis sayımızı her geçen gün artırıyoruz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {OFFICES.map((office) => (
          <motion.div 
            key={office.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-[32px] p-8 hover:border-emerald-500/30 transition-all group shadow-sm dark:shadow-none"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">{office.name}</h3>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">{office.city}</span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin size={18} className="shrink-0 text-emerald-500" />
                <p>{office.address}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Phone size={18} className="shrink-0 text-emerald-500" />
                <p>{office.phone}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail size={18} className="shrink-0 text-emerald-500" />
                <p>{office.email}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Clock size={18} className="shrink-0 text-emerald-500" />
                <p>{office.workingHours}</p>
              </div>
            </div>

            <button 
              onClick={() => handleGo(office.lat, office.lng)}
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 py-4 rounded-2xl font-bold text-sm hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 text-zinc-900 dark:text-white"
            >
              <Navigation size={16} /> Yol Tarifi Al
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-5xl font-bold tracking-tighter mb-12 uppercase text-zinc-900 dark:text-white">Hakkımızda</h2>
      <div className="space-y-8 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <p>
          By Entacars, Türkiye'nin sürdürülebilir mobilite vizyonuna katkıda bulunmak amacıyla kurulmuş, 
          tamamı elektrikli araçlardan oluşan ilk araç kiralama platformudur.
        </p>
        <p>
          Geleceğin ulaşım teknolojilerini bugünden herkes için erişilebilir kılmayı hedefliyoruz. 
          Sadece araç kiralamıyor, aynı zamanda karbon ayak izimizi azaltarak daha temiz bir dünya için çalışıyoruz.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
          <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Vizyonumuz</h3>
            <p className="text-sm">Türkiye'nin her noktasında %100 elektrikli ve akıllı ulaşım çözümleri sunan lider platform olmak.</p>
          </div>
          <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Misyonumuz</h3>
            <p className="text-sm">Müşterilerimize en modern elektrikli araçlarla, sessiz, konforlu ve çevreci bir sürüş deneyimi yaşatmak.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-5xl font-bold tracking-tighter mb-12 uppercase text-zinc-900 dark:text-white">Kiralama Koşulları</h2>
      <div className="space-y-12">
        <section>
          <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Genel Koşullar</h3>
          <ul className="space-y-4">
            {RENTAL_CONDITIONS.map((condition, i) => (
              <li key={i} className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                <div className="mt-2 w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                {condition}
              </li>
            ))}
          </ul>
        </section>
        
        <section className="p-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5">
          <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Önemli Not</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Elektrikli araçlarımızın batarya sağlığı ve güvenliğiniz için şarj seviyesinin %20'nin altına düşürülmemesi önemle rica olunur. 
            Şarj ihtiyacınız için "Şarj Haritası" sayfamızdan size en yakın istasyonu bulabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
}

function MapPage({ theme }: { theme: 'light' | 'dark' }) {
  const [selectedStation, setSelectedStation] = useState<any>(null);

  const handleGo = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h2 className="text-5xl font-bold tracking-tighter mb-4 text-zinc-900 dark:text-white uppercase">Şarj Haritası</h2>
        <p className="text-zinc-600 dark:text-zinc-400">İstanbul başta olmak üzere Türkiye genelindeki yaygın şarj ağımız.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-zinc-100 dark:bg-zinc-900 rounded-[40px] h-[600px] relative overflow-hidden border border-zinc-200 dark:border-white/5">
          <MapContainer 
            center={[39.9334, 32.8597]} 
            zoom={6} 
            style={{ height: '100%', width: '100%', background: theme === 'dark' ? '#0A0A0A' : '#f4f4f5' }}
            zoomControl={false}
          >
            <TileLayer
              url={theme === 'dark' 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {CHARGING_STATIONS.map((station) => (
              <Marker 
                key={station.id} 
                position={[station.lat, station.lng]}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-lg mb-1 text-zinc-900">{station.name}</h4>
                    <p className="text-xs text-zinc-500 mb-3">{station.address}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${station.type === 'DC' ? 'bg-emerald-500 text-black' : 'bg-zinc-200 text-zinc-600'}`}>
                        {station.type} Hızlı Şarj
                      </span>
                      <button 
                        onClick={() => handleGo(station.lat, station.lng)}
                        className="flex items-center gap-1 bg-emerald-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors"
                      >
                        <Navigation size={12} /> Git
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          <div className="absolute bottom-8 left-8 right-8 z-[1000] bg-white/80 dark:bg-black/50 backdrop-blur-md p-6 rounded-3xl border border-zinc-200 dark:border-white/10 flex justify-between items-center pointer-events-none">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">DC Hızlı Şarj</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-400 dark:bg-zinc-500 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">AC Standart</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Toplam {CHARGING_STATIONS.length} İstasyon</p>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          <h3 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white">İstasyon Listesi</h3>
          {CHARGING_STATIONS.map((station) => (
            <div 
              key={station.id} 
              className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl hover:border-emerald-500/30 transition-colors cursor-pointer group shadow-sm dark:shadow-none"
              onClick={() => handleGo(station.lat, station.lng)}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">{station.name}</h4>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${station.type === 'DC' ? 'bg-emerald-500 text-black' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                  {station.type}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mb-4">
                <MapPin size={14} className="text-emerald-500" /> {station.address}
              </p>
              <button className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 py-2 rounded-xl text-xs font-bold text-zinc-900 dark:text-white hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2">
                <Navigation size={14} /> Navigasyonu Başlat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CarDetailsModal({ car, onClose }: { car: Car, onClose: () => void }) {
  const [days, setDays] = useState(3);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 dark:bg-black/90 backdrop-blur-xl overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[48px] overflow-hidden my-auto shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-zinc-900 dark:text-white"
        >
          <X />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 lg:p-20 space-y-12">
            <div>
              <span className="text-emerald-600 dark:text-emerald-500 font-mono text-sm uppercase tracking-widest mb-4 block">{car.brand}</span>
              <h2 className="text-6xl font-bold tracking-tighter mb-8 text-zinc-900 dark:text-white">{car.model}</h2>
              
              <div className="grid grid-cols-2 gap-8">
                <CarSpec icon={<Zap size={20} className="text-emerald-500" />} label="Menzil" value={`${car.range} km`} />
                <CarSpec icon={<Clock size={20} className="text-emerald-500" />} label="Şarj Süresi" value={car.chargingTime} />
                <CarSpec icon={<Battery size={20} className="text-emerald-500" />} label="Batarya" value={`${car.battery} kWh`} />
                <CarSpec icon={<ShieldCheck size={20} className="text-emerald-500" />} label="Vites" value={car.transmission} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Öne Çıkan Özellikler</h3>
              <div className="flex flex-wrap gap-3">
                {car.features.map((f, i) => (
                  <span key={i} className="px-4 py-2 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm text-zinc-600 dark:text-zinc-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Kiralama Koşulları</h3>
              <ul className="space-y-3">
                {RENTAL_CONDITIONS.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 p-12 lg:p-20 flex flex-col justify-center border-l border-zinc-200 dark:border-white/5">
            {!showQuoteForm ? (
              <div className="space-y-12">
                <div className="bg-white dark:bg-black p-10 rounded-[32px] border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <p className="text-zinc-500 text-sm mb-2">Günlük Ücret</p>
                      <p className="text-5xl font-bold text-zinc-900 dark:text-white">₺{car.pricePerDay}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-500 text-sm mb-2">Toplam ({days} Gün)</p>
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">₺{car.pricePerDay * days}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Kiralama Süresi (Gün)</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={days} 
                      onChange={(e) => setDays(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-xs font-mono text-zinc-500">
                      <span>1 Gün</span>
                      <span>30 Gün</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-emerald-500 text-black py-6 rounded-2xl font-bold text-xl hover:bg-emerald-400 transition-all">
                    Hemen Kirala
                  </button>
                  <button 
                    onClick={() => setShowQuoteForm(true)}
                    className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 py-6 rounded-2xl font-bold text-xl text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
                  >
                    Özel Teklif Al
                  </button>
                </div>
                
                <p className="text-center text-zinc-500 text-sm">
                  Uzun süreli kiralamalar için (30+ gün) lütfen teklif isteyin.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setShowQuoteForm(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <ChevronRight className="rotate-180" />
                  </button>
                  <h3 className="text-3xl font-bold tracking-tighter text-zinc-900 dark:text-white">TEKLİF İSTE</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ad Soyad</label>
                    <input type="text" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-posta</label>
                    <input type="email" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Mesajınız (Süre, Lokasyon vb.)</label>
                    <textarea className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors h-32 text-zinc-900 dark:text-white" placeholder="Daha uzun süreli kiralama için teklif almak istiyorum..."></textarea>
                  </div>
                  <button className="w-full bg-emerald-500 text-black py-6 rounded-2xl font-bold text-xl hover:bg-emerald-400 transition-all">
                    Teklifi Gönder
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Chatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Merhaba! By Entacars Canlı Destek hattına hoş geldiniz. Size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "Sen By Entacars isimli elektrikli araç kiralama şirketinin canlı destek asistanısın. Müşterilere araç kiralama, şarj istasyonları, fiyatlar ve kiralama koşulları hakkında yardımcı oluyorsun. Nazik, profesyonel ve çözüm odaklı olmalısın. Şirket adı: By Entacars. Araçlar: Opel Frontera, Citroen e-C4 X, Peugeot e-2008, Opel Corsa-e, Renault Zoe, Dacia Spring. Lokasyonlar: İstanbul Havalimanı, Sabiha Gökçen, Çekmeköy Merkez, Ankara, Bodrum, İzmir.",
        }
      });

      const botText = response.text || "Üzgünüm, şu an yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Bir hata oluştu. Lütfen tekrar deneyin." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[100] w-full max-w-[400px] h-[600px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="p-6 bg-emerald-500 text-black flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="font-bold leading-none">Canlı Destek</h4>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Çevrimiçi</span>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-black/10 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white dark:bg-zinc-950">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-500 text-black rounded-tr-none shadow-sm' 
                : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-tl-none border border-zinc-200 dark:border-white/5 shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-4 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-white/5 flex gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-white/5 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..." 
          className="flex-1 bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white"
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="w-12 h-12 bg-emerald-500 text-black rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
}

function QuickQuoteModal({ onClose, onOpenChat }: { onClose: () => void, onOpenChat: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/80 dark:bg-black/90 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[40px] p-8 md:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-10 h-10 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-zinc-900 dark:text-white"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div className="space-y-8">
            <div>
              <h3 className="text-4xl font-bold tracking-tighter mb-2 uppercase text-zinc-900 dark:text-white">Hızlı Teklif</h3>
              <p className="text-zinc-500">En kısa sürede size geri dönüş yapacağız.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ad Soyad</label>
                  <input required type="text" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-posta</label>
                  <input required type="email" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="john@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Telefon</label>
                  <input required type="tel" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="+90 5xx xxx xx xx" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Bölge</label>
                  <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors appearance-none text-zinc-900 dark:text-white">
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>İzmir</option>
                    <option>Bodrum</option>
                    <option>Antalya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Gün Sayısı</label>
                  <input required type="number" min="1" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="7" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Araç Sayısı</label>
                  <input required type="number" min="1" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="1" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Adres / Teslimat Noktası</label>
                <input required type="text" className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors text-zinc-900 dark:text-white" placeholder="Havalimanı veya Ofis adresi..." />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Araç Tercihi</label>
                <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors appearance-none text-zinc-900 dark:text-white">
                  <option>Fark etmez</option>
                  {CARS.map(car => (
                    <option key={car.id}>{car.brand} {car.model}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Mesajınız</label>
                <textarea className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-4 outline-none focus:border-emerald-500 transition-colors h-24 text-zinc-900 dark:text-white" placeholder="Eklemek istediğiniz notlar..."></textarea>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all">
                Teklif İsteğini Gönder
              </button>
            </form>

            <div className="pt-8 border-t border-zinc-200 dark:border-white/5 text-center">
              <button 
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <MessageSquare size={16} /> Canlı Destek ile Görüş
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <Zap className="text-emerald-500" size={40} />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tighter mb-2 text-zinc-900 dark:text-white">TEŞEKKÜRLER!</h3>
              <p className="text-zinc-500 leading-relaxed">
                Teklif isteğiniz başarıyla alındı. <br /> Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
