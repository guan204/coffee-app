import { useState, useMemo } from 'react';
import {
  MapPin,
  Star,
  Navigation,
  Share2,
  Phone,
  Coffee,
  Zap,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  X,
  Search,
  Check,
  Heart
} from 'lucide-react';

// --- Types ---
interface Cafe {
  id: number;
  name: string;
  status: 'open' | 'closed';
  rating: number;
  price: string;
  tags: string[];
  images: string[];
  address: string;
  hours: string;
  phone: string;
  aiSummary: string;
  redFlags: string[];
  credibility: number;
  votes: {
    plugs: number;
    quiet: number;
    dessert: number;
  };
  coordinates: { x: number; y: number }; // Percentage coordinate for mock map
}

// --- Mock Data ---
const INITIAL_CAFES: Cafe[] = [
  {
    id: 1,
    name: "隅光咖啡 (Corner Light)",
    status: "open",
    rating: 4.8,
    price: "$$",
    tags: ["安靜", "插座多", "適合讀書"],
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市鼓山區美術東二路 10 號",
    hours: "10:00 - 18:00",
    phone: "07-555-1234",
    aiSummary: "空間極度安靜，採光佳，非常適合帶筆電工作或閱讀。多數真實評價推薦手沖單品與肉桂捲，店員服務友善不打擾。",
    redFlags: [
      "假日通常下午 2 點前就會客滿，限時 2 小時",
      "低消為一杯飲品（單點甜點不計入低消）"
    ],
    credibility: 95,
    votes: { plugs: 142, quiet: 128, dessert: 45 },
    coordinates: { x: 35, y: 42 }
  },
  {
    id: 2,
    name: "木色 Roastery",
    status: "closed",
    rating: 4.5,
    price: "$$$",
    tags: ["甜點強", "網美拍照", "景觀好"],
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市鹽埕區大勇路 20 號",
    hours: "12:00 - 20:00",
    phone: "07-521-9988",
    aiSummary: "老屋改建的日式復古風格，木質調裝潢細節極美，採光非常好適合拍照。招牌巴斯克乳酪蛋糕濃郁綿密。",
    redFlags: [
      "內部空間小，桌距近，客滿時聊天聲音較為吵雜",
      "店內完全沒有提供插座，不適合筆電族辦公"
    ],
    credibility: 89,
    votes: { plugs: 3, quiet: 21, dessert: 214 },
    coordinates: { x: 55, y: 68 }
  },
  {
    id: 3,
    name: "夜貓子 Midnight Cafe",
    status: "open",
    rating: 4.7,
    price: "$$",
    tags: ["深夜營業", "適合聊天", "寵物友善"],
    images: [
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市新興區文橫二路 5 號",
    hours: "18:00 - 02:00",
    phone: "07-281-7766",
    aiSummary: "少數營業到凌晨的放鬆空間，提供特色調酒與輕食，深受夜間創作者喜愛。",
    redFlags: [
      "室內光源偏暗，閱讀紙本書籍會比較傷眼睛",
      "晚上 9 點後人潮較多，建議先訂位"
    ],
    credibility: 91,
    votes: { plugs: 42, quiet: 15, dessert: 89 },
    coordinates: { x: 70, y: 30 }
  },
  {
    id: 4,
    name: "珈琲研究所 Lab Caffeine",
    status: "open",
    rating: 4.6,
    price: "$$",
    tags: ["工業風", "插座中等", "長桌"],
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1490885578174-acda4d5f50a4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市苓雅區中正一路 1 號",
    hours: "09:00 - 19:00",
    phone: "07-333-4444",
    aiSummary: "工業風長桌適合團體或長時間工作，插座分佈在桌面與吧台，甜點穩定。",
    redFlags: ["午餐時段座位緊張"],
    credibility: 87,
    votes: { plugs: 58, quiet: 33, dessert: 66 },
    coordinates: { x: 40, y: 20 }
  },
  {
    id: 5,
    name: "港邊小站 SeaSide Cafe",
    status: "closed",
    rating: 4.3,
    price: "$$",
    tags: ["景觀", "寵物友善", "戶外座位"],
    images: [
      "https://images.unsplash.com/photo-1505765057811-50f842c6f3c5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市前鎮區港邊路 88 號",
    hours: "11:00 - 22:00",
    phone: "07-777-8888",
    aiSummary: "臨海景觀放鬆，戶外座位多，適合傍晚看海。夏季風大與蚊蟲需注意。",
    redFlags: ["夏季蚊蟲較多"],
    credibility: 82,
    votes: { plugs: 5, quiet: 20, dessert: 120 },
    coordinates: { x: 80, y: 60 }
  },
  {
    id: 6,
    name: "小確幸 Sweet Spot",
    status: "open",
    rating: 4.9,
    price: "$$",
    tags: ["甜點強", "網美拍照", "下午茶"],
    images: [
      "https://images.unsplash.com/photo-1542317854-9e3f1f7b8c25?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市前金區中山路 100 號",
    hours: "09:30 - 18:30",
    phone: "07-999-1111",
    aiSummary: "甜點師傅手藝出眾，午後人氣旺，建議先預約以免等位。",
    redFlags: ["座位少需預約"],
    credibility: 93,
    votes: { plugs: 2, quiet: 10, dessert: 512 },
    coordinates: { x: 60, y: 50 }
  },
  {
    id: 7,
    name: "老街咖啡 Old Street",
    status: "open",
    rating: 4.2,
    price: "$",
    tags: ["在地人氣", "便宜", "手沖推薦"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市苓雅區青年一路 120 號",
    hours: "08:00 - 17:00",
    phone: "07-222-3333",
    aiSummary: "在地老店，手沖穩定，價格親民，氣氛樸實。",
    redFlags: ["餐點選擇較少"],
    credibility: 78,
    votes: { plugs: 12, quiet: 60, dessert: 10 },
    coordinates: { x: 20, y: 70 }
  },
  {
    id: 8,
    name: "綠意咖啡 Greenhouse",
    status: "open",
    rating: 4.6,
    price: "$$",
    tags: ["室內植栽", "安靜", "遠離喧囂"],
    images: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市鼓山區臨海路 5 號",
    hours: "10:00 - 19:00",
    phone: "07-444-5555",
    aiSummary: "以植栽為主題的寧靜空間，適合放空與閱讀，音樂音量低。",
    redFlags: ["週末停車較不方便"],
    credibility: 88,
    votes: { plugs: 24, quiet: 78, dessert: 44 },
    coordinates: { x: 50, y: 25 }
  },
  {
    id: 9,
    name: "站前 Espresso Bar",
    status: "closed",
    rating: 4.0,
    price: "$",
    tags: ["外帶快取", "商業區"],
    images: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80"
    ],
    address: "高雄市三民區站前路 9 號",
    hours: "07:00 - 20:00",
    phone: "07-111-2222",
    aiSummary: "上班族外帶店，出杯速度快，座位有限，適合趕時間時候喝一杯。",
    redFlags: ["下班高峰時段外帶排隊"],
    credibility: 76,
    votes: { plugs: 3, quiet: 5, dessert: 8 },
    coordinates: { x: 15, y: 35 }
  }
];

export default function CoffeeDiscoveryPlatform() {
  // --- States ---
  const [cafes, setCafes] = useState<Cafe[]>(INITIAL_CAFES);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('全部');
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // 3-Second Picker State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerStep, setPickerStep] = useState(1);
  const [answers, setAnswers] = useState({ purpose: '', plug: '' });
  const [pickerResult, setPickerResult] = useState<Cafe[] | null>(null);

  // --- Filtering Logic ---
  const filteredCafes = useMemo(() => {
    return cafes.filter(cafe => {
      // 1. Search filter
      const matchesSearch = cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            cafe.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Tab filter
      if (selectedFilter === '全部') return true;
      if (selectedFilter === '營業中') return cafe.status === 'open';
      if (selectedFilter === '插座多') return cafe.tags.includes('插座多') || cafe.votes.plugs > 30;
      if (selectedFilter === '安靜讀書') return cafe.tags.includes('安靜') || cafe.tags.includes('適合讀書');
      if (selectedFilter === '甜點強') return cafe.tags.includes('甜點強');
      if (selectedFilter === '我的收藏') return favorites.includes(cafe.id);

      return true;
    });
  }, [cafes, searchTerm, selectedFilter, favorites]);

  // --- Handlers ---
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleVote = (cafeId: number, type: 'plugs' | 'quiet' | 'dessert') => {
    setCafes(prev => prev.map(cafe => {
      if (cafe.id === cafeId) {
        const updatedVotes = { ...cafe.votes, [type]: cafe.votes[type] + 1 };
        // Sync selectedCafe if currently open in modal
        if (selectedCafe && selectedCafe.id === cafeId) {
          setSelectedCafe({ ...selectedCafe, votes: updatedVotes });
        }
        return { ...cafe, votes: updatedVotes };
      }
      return cafe;
    }));
  };

  // 3-Second Picker Quiz Flow
  const startPicker = () => {
    setAnswers({ purpose: '', plug: '' });
    setPickerStep(1);
    setPickerResult(null);
    setIsPickerOpen(true);
  };

  const handleSelectPurpose = (value: string) => {
    setAnswers(prev => ({ ...prev, purpose: value }));
    setPickerStep(2);
  };

  const handleSelectPlug = (value: string) => {
    const finalAnswers = { ...answers, plug: value };
    setAnswers(finalAnswers);
    
    // Simple Recommendation Algorithm
    let result: Cafe[] = [];
    if (finalAnswers.purpose === 'work' && finalAnswers.plug === 'yes') {
      result = cafes.filter(c => c.tags.includes('插座多') && c.tags.includes('安靜'));
    } else if (finalAnswers.purpose === 'photo') {
      result = cafes.filter(c => c.tags.includes('網美拍照') || c.tags.includes('甜點強'));
    } else {
      // Fallback: sort by rating
      result = [...cafes].sort((a, b) => b.rating - a.rating);
    }
    
    setPickerResult(result);
    setPickerStep(3);
  };

  const applyPickerSelection = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setIsPickerOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] font-sans antialiased text-[#4A3F35]">
      {/* --- Top Navigation Header --- */}
      <header className="bg-white border-b border-[#E8E3DB] px-4 md:px-8 py-4 shadow-sm z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#8C7A6B] p-2 rounded-md text-white">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#4A3F35]">咖啡廳探索平台</h1>
              <p className="text-xs text-[#A89F91]">比 Google Maps 更快、更真實的雷點指南</p>
            </div>
          </div>

          {/* Search bar inside header */}
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89F91]" />
              <input
                type="text"
                placeholder="搜尋店名或地區..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F2EC] pl-10 pr-4 py-2 rounded-md text-sm border border-transparent focus:border-[#8C7A6B] focus:bg-white focus:outline-none transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-[#4A3F35]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={startPicker}
              className="flex items-center gap-1.5 bg-[#8C7A6B] hover:bg-[#736356] text-white px-5 py-2 rounded-md text-sm font-semibold shadow-sm transition-all hover:shadow"
            >
              <Check className="w-4 h-4 text-amber-300" /> 3秒選店
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Interactive Viewport --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: Dynamic Micro Map (Visual Feedback) */}
        <div className="hidden lg:flex w-1/2 bg-[#EFEBE4] relative items-center justify-center border-r border-[#E8E3DB] p-8 select-none">
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A3F35 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="text-center z-10 pointer-events-none mb-24">
            <MapPin className="w-14 h-14 text-[#8C7A6B] mx-auto mb-3 opacity-60 animate-bounce" />
            <h3 className="font-bold text-[#8C7A6B]">微型探索地圖</h3>
            <p className="text-xs text-[#A89F91] mt-1">點擊右側卡片，地圖標記將與之連動</p>
          </div>

          {/* Map Coordinates Plotting */}
          {filteredCafes.map((cafe) => {
            const isSelected = selectedCafe?.id === cafe.id;
            return (
              <button
                key={cafe.id}
                onClick={() => setSelectedCafe(cafe)}
                style={{ left: `${cafe.coordinates.x}%`, top: `${cafe.coordinates.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 flex flex-col items-center z-20 ${
                  isSelected 
                    ? 'scale-125 z-30' 
                    : 'hover:scale-110'
                }`}
              >
                <div className={`p-2.5 rounded-full shadow-lg border-2 transition-all ${
                  isSelected 
                    ? 'bg-[#4A3F35] text-white border-white scale-110' 
                    : 'bg-white text-[#8C7A6B] border-[#E8E3DB]'
                }`}>
                  <Coffee className="w-4 h-4" />
                </div>
                <div className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm border whitespace-nowrap transition-all ${
                  isSelected 
                    ? 'bg-[#4A3F35] text-white border-transparent' 
                    : 'bg-white/90 text-[#4A3F35] border-[#E8E3DB]'
                }`}>
                  {cafe.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT PANEL: List & Filters */}
        <div className="w-full lg:w-1/2 overflow-y-auto p-4 md:p-6 bg-[#FDFBF7] flex flex-col gap-5">
          {/* Categorized Tab Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-shrink-0">
            {['全部', '營業中', '插座多', '安靜讀書', '甜點強', '我的收藏'].map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button 
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                    isActive 
                      ? 'bg-[#4A3F35] text-white border-[#4A3F35] shadow-sm' 
                      : 'bg-white text-[#8C7A6B] border-[#E8E3DB] hover:border-[#8C7A6B] hover:text-[#4A3F35]'
                  }`}
                >
                  {filter} {filter === '我的收藏' && favorites.length > 0 && `(${favorites.length})`}
                </button>
              );
            })}
          </div>

          {/* Cafe Cards Feed */}
          <div className="flex flex-col gap-4 flex-1">
            {filteredCafes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-dashed border-[#E8E3DB]">
                  <Coffee className="w-10 h-10 text-[#D3CBC1] mx-auto mb-3" />
                  <p className="text-[#8C7A6B] font-medium">沒有找到符合條件的咖啡廳</p>
                  <button onClick={() => { setSelectedFilter('全部'); setSearchTerm(''); }} className="text-sm text-[#4A3F35] underline mt-1 font-semibold">
                    重設篩選條件
                  </button>
                </div>
            ) : (
              filteredCafes.map((cafe) => {
                const isFav = favorites.includes(cafe.id);
                const isSelected = selectedCafe?.id === cafe.id;
                return (
                  <div 
                    key={cafe.id} 
                    onClick={() => setSelectedCafe(cafe)}
                    className={`bg-white rounded-lg p-4 flex gap-4 cursor-pointer hover:shadow-md border transition-all duration-300 group ${
                      isSelected ? 'border-[#8C7A6B] ring-1 ring-[#8C7A6B]' : 'border-[#E8E3DB]'
                    }`}
                  >
                    {/* Visual Cover */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden relative flex-shrink-0">
                      <img 
                        src={cafe.images[0]} 
                        alt={cafe.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${
                        cafe.status === 'open' ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}></div>
                    </div>

                    {/* Metadata Summary */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-bold text-[#4A3F35] text-base sm:text-lg leading-snug truncate group-hover:text-[#8C7A6B] transition-colors">
                            {cafe.name}
                          </h3>
                          {/* Bookmark Button */}
                          <button 
                            onClick={(e) => toggleFavorite(cafe.id, e)}
                            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                              isFav ? 'text-rose-500 hover:bg-rose-50' : 'text-[#D3CBC1] hover:text-rose-400 hover:bg-gray-50'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-xs mt-1 text-[#8C7A6B] font-medium">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 
                            {cafe.rating}
                          </span>
                          <span>•</span>
                          <span>{cafe.price}</span>
                          <span>•</span>
                          <span className={cafe.status === 'open' ? 'text-emerald-600' : 'text-[#A89F91]'}>
                            {cafe.status === 'open' ? '營業中' : '休息中'}
                          </span>
                        </div>
                      </div>

                      {/* Pill Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {cafe.tags.map(tag => (
                          <span key={tag} className="text-[10px] sm:text-xs px-2.5 py-0.5 bg-[#F5F2EC] text-[#6B5C50] rounded-md font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Go Indicator */}
                    <div className="flex items-center justify-center pl-1 text-[#D3CBC1] group-hover:text-[#8C7A6B] transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* --- Cafe Detail Side Sliding Modal (5-Second Rule Preview) --- */}
      {selectedCafe && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={() => setSelectedCafe(null)}></div>
          
          <div className="bg-[#FDFBF7] w-full max-w-xl h-full shadow-2xl relative flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-[#E8E3DB] flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-[#4A3F35] leading-tight">{selectedCafe.name}</h2>
                <p className="text-xs text-[#8C7A6B] mt-0.5 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${selectedCafe.status === 'open' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                  今日營業時間: {selectedCafe.hours}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCafe(null)} 
                className="p-2 hover:bg-[#F5F2EC] rounded-md transition-colors text-[#8C7A6B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Detail Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              
              {/* Photo Showcase Carousel */}
              <div>
                <p className="text-xs font-semibold text-[#8C7A6B] mb-2 uppercase tracking-wider">店家空間與餐點一覽</p>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
                  {selectedCafe.images.map((img, i) => (
                    <div key={i} className="min-w-[75%] h-48 snap-center relative rounded-md overflow-hidden shadow-sm flex-shrink-0">
                      <img src={img} alt="Cafe Showcase" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2.5 left-2.5 bg-black/65 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                        {i === 0 ? '門市外貌' : i === 1 ? '內部氛圍' : '經典菜單'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Utility Contact Bar */}
              <div className="grid grid-cols-3 gap-3">
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedCafe.name + ' ' + selectedCafe.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 bg-[#4A3F35] hover:bg-[#322A23] text-white rounded-md transition-all font-medium text-xs gap-1 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  地圖導航
                </a>
                <button 
                  onClick={() => alert(`撥打至 ${selectedCafe.name}: ${selectedCafe.phone}`)}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-[#E8E3DB] hover:bg-gray-50 text-[#8C7A6B] rounded-md transition-all text-xs font-medium gap-1"
                >
                  <Phone className="w-4 h-4" />
                  聯絡電話
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-[#E8E3DB] hover:bg-gray-50 text-[#8C7A6B] rounded-md transition-all text-xs font-medium gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  分享門市
                </button>
              </div>

              {/* AI Pure Summary (Highlights Filtered Real Reviews) */}
              <div className="bg-[#F2F6F3] border border-[#D1E2D6] rounded-lg p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="flex items-center gap-1.5 text-[#2D5A3C] font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 真實評論摘要
                  </h3>
                  <span className="text-[10px] bg-white text-[#2D5A3C] px-2 py-0.5 rounded-md border border-[#D1E2D6] font-bold">
                    可信度 {selectedCafe.credibility}%
                  </span>
                </div>
                <p className="text-[#3A5C46] text-sm leading-relaxed">{selectedCafe.aiSummary}</p>
                <div className="mt-2.5 text-[10px] text-[#2D5A3C] opacity-85 italic">
                  *已整理重點與常見評價。
                </div>
              </div>

              {/* Red Flags / Differentiator WARNINGS */}
              <div className="bg-[#FEF5F5] border border-[#FCD6D6] rounded-2xl p-4">
                <h3 className="flex items-center gap-1.5 text-[#C53030] font-bold text-xs sm:text-sm mb-2.5">
                  <AlertTriangle className="w-4 h-4" /> 貼心避雷提醒 (雷點預警)
                </h3>
                <ul className="space-y-2">
                  {selectedCafe.redFlags.map((flag, i) => (
                    <li key={i} className="text-[#9B2C2C] text-xs sm:text-sm flex items-start gap-2">
                      <span className="text-[#C53030] font-bold mt-0.5">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Crowdsourced Features */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">群眾票選特點 (點擊投票)</h3>
                  <span className="text-[10px] text-[#A89F91]">真實用戶匿名群體標籤</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2.5">
                  <button 
                      onClick={() => handleVote(selectedCafe.id, 'plugs')}
                      className="flex flex-col items-center p-3 bg-white border border-[#E8E3DB] hover:border-[#8C7A6B] active:bg-[#F5F2EC] rounded-md transition-all"
                    >
                    <Zap className="w-4 h-4 text-amber-500 mb-1" />
                    <span className="text-[10px] text-[#8C7A6B] font-medium">插座多</span>
                    <span className="text-base font-bold text-[#4A3F35] mt-0.5">{selectedCafe.votes.plugs}</span>
                  </button>
                  <button 
                    onClick={() => handleVote(selectedCafe.id, 'quiet')}
                    className="flex flex-col items-center p-3 bg-white border border-[#E8E3DB] hover:border-[#8C7A6B] active:bg-[#F5F2EC] rounded-md transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-500 mb-1" />
                    <span className="text-[10px] text-[#8C7A6B] font-medium">適合讀書</span>
                    <span className="text-base font-bold text-[#4A3F35] mt-0.5">{selectedCafe.votes.quiet}</span>
                  </button>
                  <button 
                    onClick={() => handleVote(selectedCafe.id, 'dessert')}
                    className="flex flex-col items-center p-3 bg-white border border-[#E8E3DB] hover:border-[#8C7A6B] active:bg-[#F5F2EC] rounded-md transition-all"
                  >
                    <Coffee className="w-4 h-4 text-rose-400 mb-1" />
                    <span className="text-[10px] text-[#8C7A6B] font-medium">甜點強</span>
                    <span className="text-base font-bold text-[#4A3F35] mt-0.5">{selectedCafe.votes.dessert}</span>
                  </button>
                </div>
              </div>

              {/* Location Detail */}
              <div className="border-t border-[#E8E3DB] pt-4 space-y-2">
                <p className="text-xs text-[#8C7A6B] font-semibold uppercase tracking-wider">位置與聯絡細節</p>
                <div className="text-sm text-[#4A3F35] space-y-1.5">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#8C7A6B]" /> {selectedCafe.address}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#8C7A6B]" /> {selectedCafe.phone}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- 3-Second Picker Quiz Modal --- */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-2xl animate-in slide-in-from-bottom-12 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#4A3F35] flex items-center gap-2">
                <Check className="w-5 h-5 text-amber-500" /> 3 秒快速選店
              </h2>
              <button 
                onClick={() => setIsPickerOpen(false)} 
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Step 1: Cafe Usage Purpose */}
            {pickerStep === 1 && (
              <div className="space-y-4">
                <p className="font-semibold text-sm text-[#8C7A6B] tracking-wider uppercase">Q1. 你今天到咖啡廳的目的是？</p>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => handleSelectPurpose('work')}
                    className="w-full text-left p-4 rounded-md border border-[#E8E3DB] hover:border-[#8C7A6B] hover:bg-[#FDFBF7] transition-all flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-[#4A3F35] text-sm">看書 / 用電腦辦公</p>
                      <p className="text-xs text-[#A89F91] mt-0.5">需要極高專注度與安靜空間</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7A6B]" />
                  </button>
                  <button 
                    onClick={() => handleSelectPurpose('photo')}
                    className="w-full text-left p-4 rounded-md border border-[#E8E3DB] hover:border-[#8C7A6B] hover:bg-[#FDFBF7] transition-all flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-[#4A3F35] text-sm">吃甜點拍照 / 與朋友聊天</p>
                      <p className="text-xs text-[#A89F91] mt-0.5">尋找有獨特美感或強大午茶的店家</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7A6B]" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Need Plugs? */}
            {pickerStep === 2 && (
              <div className="space-y-4">
                <p className="font-semibold text-sm text-[#8C7A6B] tracking-wider uppercase">Q2. 你手邊的 3C 產品需要充電插座嗎？</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleSelectPlug('yes')}
                    className="p-4 rounded-md border border-[#E8E3DB] hover:border-[#8C7A6B] text-center transition-all hover:bg-[#FDFBF7]"
                  >
                    <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                    <p className="font-bold text-sm text-[#4A3F35]">必須有插座</p>
                    <p className="text-[10px] text-[#A89F91] mt-0.5">沒插座會恐慌</p>
                  </button>
                  <button 
                    onClick={() => handleSelectPlug('no')}
                    className="p-4 rounded-md border border-[#E8E3DB] hover:border-[#8C7A6B] text-center transition-all hover:bg-[#FDFBF7]"
                  >
                    <Coffee className="w-6 h-6 mx-auto mb-2 text-[#8C7A6B]" />
                    <p className="font-bold text-sm text-[#4A3F35]">不需要</p>
                    <p className="text-[10px] text-[#A89F91] mt-0.5">純享受氛圍</p>
                  </button>
                </div>
                <button onClick={() => setPickerStep(1)} className="text-xs text-[#8C7A6B] underline mt-2 block mx-auto">回到上一題</button>
              </div>
            )}

            {/* Step 3: Match Result */}
            {pickerStep === 3 && pickerResult && (
              <div className="space-y-4">
                <p className="font-semibold text-sm text-[#8C7A6B] tracking-wider uppercase text-center">🎉 根據你的需求，最推薦以下店家：</p>
                
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {pickerResult.map(cafe => (
                    <div 
                      key={cafe.id}
                      onClick={() => applyPickerSelection(cafe)}
                      className="p-3 border border-[#E8E3DB] rounded-md hover:border-[#8C7A6B] hover:bg-[#FDFBF7] cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={cafe.images[0]} alt={cafe.name} className="w-12 h-12 object-cover rounded-md" />
                        <div>
                          <p className="font-bold text-sm text-[#4A3F35]">{cafe.name}</p>
                          <p className="text-xs text-[#8C7A6B] flex items-center gap-1">★ {cafe.rating} • {cafe.price}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8C7A6B]" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    onClick={() => setPickerStep(1)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    重新測驗
                  </button>
                  <button 
                    onClick={() => setIsPickerOpen(false)}
                    className="flex-1 py-2.5 bg-[#4A3F35] hover:bg-[#322A23] text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    關閉選店
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Embedded CSS rules for visual styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}