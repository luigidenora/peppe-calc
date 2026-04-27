import { MoneyVisualizer } from './MoneyVisualizer';

interface DinoMascotProps {
  total: number;
  speak: (text: string) => void;
}

export function DinoMascot({ total, speak }: DinoMascotProps) {
  const handleClick = () => {
    const euros = Math.floor(total);
    const cents = Math.round((total - euros) * 100);

    if (total === 0) {
      speak('Zero euro');
    } else if (cents === 0) {
      speak(`${euros} euro`);
    } else {
      speak(`${euros} euro e ${cents} centesimi`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-white rounded-2xl shadow-lg active:scale-95 transition-transform touch-manipulation overflow-hidden"
    >
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50">
        <img
          src="https://images.unsplash.com/photo-1667753147067-87f4b81179c1?w=200&h=200&fit=crop"
          alt="Dino mascotte"
          className="w-16 h-16 object-cover rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <MoneyVisualizer amount={total} />
        </div>
      </div>
    </button>
  );
}
