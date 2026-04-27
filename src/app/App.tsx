import { useState, useEffect } from 'react';
import { MoneyButton } from './components/MoneyButton';
import { MoneyVisualizer } from './components/MoneyVisualizer';
import { useSpeech } from './components/useSpeech';
import confetti from 'canvas-confetti';
import img50 from '../imports/Banconota_Italia_50_euro_a.jpg';
import img20 from '../imports/Banconota_Italia_20_euro_a.jpg';
import img10 from '../imports/Banconota_Italia_10_euro_a.jpg';
import img5 from '../imports/Banconota_Italia_5_euro_a.jpg';
import img2 from '../imports/2euro_comune.png';
import img1 from '../imports/1euro_comune.png';
import img050 from '../imports/50cent_comune.png';
import img020 from '../imports/20cent_comune.png';
import img010 from '../imports/10cent_comune.png';
import img005 from '../imports/5cent_comune.png';
import img002 from '../imports/2cent_comune.png';
import img001 from '../imports/1cent_comune.png';

const EURO_NOTES = [
  { value: 50, color: 'bg-orange-100' },
  { value: 20, color: 'bg-blue-100' },
  { value: 10, color: 'bg-red-100' },
  { value: 5, color: 'bg-gray-100' },
];

const EURO_COINS = [
  { value: 2, color: 'bg-yellow-200' },
  { value: 1, color: 'bg-yellow-200' },
  { value: 0.50, color: 'bg-yellow-200' },
  { value: 0.20, color: 'bg-yellow-200' },
  { value: 0.10, color: 'bg-yellow-200' },
  { value: 0.05, color: 'bg-amber-200' },
  { value: 0.02, color: 'bg-amber-200' },
  { value: 0.01, color: 'bg-amber-200' },
];

// Immagini reali delle banconote e monete
const getMoneyImage = (value: number): string => {
  const images: Record<number, string> = {
    50: img50,
    20: img20,
    10: img10,
    5: img5,
    2: img2,
    1: img1,
    0.50: img050,
    0.20: img020,
    0.10: img010,
    0.05: img005,
    0.02: img002,
    0.01: img001,
  };
  return images[value] || img001;
};

export default function App() {
  const [mode, setMode] = useState<'count' | 'change'>('count');
  const [total, setTotal] = useState(0);
  const [itemPrice, setItemPrice] = useState<number | null>(null);
  const [moneyGiven, setMoneyGiven] = useState(0);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [changePhase, setChangePhase] = useState<'price' | 'payment' | 'verify'>('price');
  const { speak } = useSpeech();

  const changeToReceive = moneyGiven - (itemPrice || 0);

  useEffect(() => {
    if (mode === 'change' && changePhase === 'verify' && total === 0 && changeToReceive > 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      speak('Resto corretto! Bravo!');
    }
  }, [total, mode, changePhase, changeToReceive, speak]);

  const handleAddMoney = (value: number) => {
    if (mode === 'count') {
      setTotal(prev => prev + value);
    } else if (mode === 'change') {
      if (changePhase === 'payment') {
        setMoneyGiven(prev => prev + value);
      } else if (changePhase === 'verify') {
        setTotal(prev => Math.max(0, prev - value));
      }
    }
  };

  const handleReset = () => {
    setTotal(0);
    setItemPrice(null);
    setMoneyGiven(0);
    setShowPriceInput(false);
    setChangePhase('price');
    speak('Azzerato');
  };

  const handleModeChange = (newMode: 'count' | 'change') => {
    setMode(newMode);
    setTotal(0);
    setItemPrice(null);
    setMoneyGiven(0);
    setShowPriceInput(newMode === 'change');
    setChangePhase('price');
    speak(newMode === 'count' ? 'Modalità conta risparmi' : 'Modalità resto per acquisti');
  };

  const handleSetPrice = (price: number) => {
    setItemPrice(price);
    setShowPriceInput(false);
    setChangePhase('payment');
    speak(`Prezzo: ${price} euro. Ora aggiungi i soldi che dai`);
  };

  const handleConfirmPayment = () => {
    if (moneyGiven >= (itemPrice || 0)) {
      const change = moneyGiven - (itemPrice || 0);
      setTotal(change);
      setChangePhase('verify');
      speak(`Devi ricevere ${change.toFixed(2)} euro di resto. Verifica il resto ricevuto`);
    } else {
      speak('Aggiungi più soldi');
    }
  };

  return (
    <div className={`min-h-screen ${mode === 'count' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-green-400 to-green-600'} p-3`}>
      <div className="max-w-md mx-auto h-screen flex flex-col gap-3 py-3">
        {/* Header con modalità */}
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange('count')}
            className={`flex-1 py-6 rounded-xl transition-all touch-manipulation text-5xl ${
              mode === 'count'
                ? 'bg-white shadow-lg scale-105'
                : 'bg-blue-300'
            }`}
          >
            🏦
          </button>
          <button
            onClick={() => handleModeChange('change')}
            className={`flex-1 py-6 rounded-xl transition-all touch-manipulation text-5xl ${
              mode === 'change'
                ? 'bg-white shadow-lg scale-105'
                : 'bg-green-300'
            }`}
          >
            🛒
          </button>
        </div>

        {/* Input per prezzo articolo */}
        {showPriceInput && (
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="grid grid-cols-2 gap-3">
              {[2.50, 5, 7.50, 10, 12.50, 15, 20, 25].map(price => (
                <button
                  key={price}
                  onClick={() => handleSetPrice(price)}
                  className="py-6 bg-red-500 text-white font-bold text-3xl rounded-xl shadow-md active:scale-95 transition-transform touch-manipulation"
                >
                  {price}€
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info pagamento modalità resto */}
        {mode === 'change' && !showPriceInput && changePhase === 'payment' && (
          <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
            <div className="bg-red-50 rounded-xl p-3">
              <div className="text-3xl text-center mb-2">🏷️</div>
              <MoneyVisualizer amount={itemPrice || 0} />
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-3xl text-center mb-2">💵</div>
              <MoneyVisualizer amount={moneyGiven} />
            </div>
            <button
              onClick={handleConfirmPayment}
              className="w-full py-6 bg-green-500 text-white font-bold text-5xl rounded-xl shadow-md active:scale-95 transition-transform touch-manipulation disabled:bg-gray-300"
              disabled={moneyGiven < (itemPrice || 0)}
            >
              ✓
            </button>
          </div>
        )}

        {/* Totale */}
        {!showPriceInput && (mode === 'count' || changePhase === 'verify') && (
          <button
            onClick={() => {
              const euros = Math.floor(total);
              const cents = Math.round((total - euros) * 100);
              if (total === 0) {
                speak('Zero euro');
              } else if (cents === 0) {
                speak(`${euros} euro`);
              } else {
                speak(`${euros} euro e ${cents} centesimi`);
              }
            }}
            className="w-full bg-white rounded-2xl shadow-lg active:scale-95 transition-transform touch-manipulation p-6"
          >
            <MoneyVisualizer amount={total} />
          </button>
        )}

        {/* Area scrollabile con banconote e monete */}
        {!showPriceInput && <div className="flex-1 overflow-y-auto space-y-3 pb-2">
          {/* Banconote */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
            <div className="grid grid-cols-2 gap-3">
              {EURO_NOTES.map(({ value }) => (
                <MoneyButton
                  key={value}
                  value={value}
                  imageUrl={getMoneyImage(value)}
                  onSelect={handleAddMoney}
                  speak={speak}
                />
              ))}
            </div>
          </div>

          {/* Monete */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
            <div className="grid grid-cols-3 gap-3">
              {EURO_COINS.map(({ value }) => (
                <MoneyButton
                  key={value}
                  value={value}
                  imageUrl={getMoneyImage(value)}
                  onSelect={handleAddMoney}
                  speak={speak}
                  compact
                />
              ))}
            </div>
          </div>
        </div>}

        {/* Pulsante Reset */}
        <button
          onClick={handleReset}
          className="w-full py-5 bg-red-500 text-white font-bold text-5xl rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation"
        >
          🔄
        </button>
      </div>
    </div>
  );
}