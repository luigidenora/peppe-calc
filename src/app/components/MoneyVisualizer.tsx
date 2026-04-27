interface MoneyVisualizerProps {
  amount: number;
}

import img50 from '../../imports/Banconota_Italia_50_euro_a.jpg';
import img20 from '../../imports/Banconota_Italia_20_euro_a.jpg';
import img10 from '../../imports/Banconota_Italia_10_euro_a.jpg';
import img5 from '../../imports/Banconota_Italia_5_euro_a.jpg';
import img2 from '../../imports/2euro_comune.png';
import img1 from '../../imports/1euro_comune.png';
import img050 from '../../imports/50cent_comune.png';

const MONEY_IMAGES: Record<number, string> = {
  50: img50,
  20: img20,
  10: img10,
  5: img5,
  2: img2,
  1: img1,
  0.50: img050,
};

function calculateMoneyBreakdown(amount: number): number[] {
  const breakdown: number[] = [];
  let remaining = Math.round(amount * 100) / 100;

  const denominations = [50, 20, 10, 5, 2, 1, 0.50];

  for (const denom of denominations) {
    while (remaining >= denom - 0.001) {
      breakdown.push(denom);
      remaining = Math.round((remaining - denom) * 100) / 100;
    }
  }

  return breakdown;
}

export function MoneyVisualizer({ amount }: MoneyVisualizerProps) {
  if (amount === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="text-7xl">✓</div>
        <p className="text-4xl font-bold text-gray-400">0.00€</p>
      </div>
    );
  }

  const breakdown = calculateMoneyBreakdown(amount);
  const displayCount = Math.min(breakdown.length, 6);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      {/* Immagini sovrapposte */}
      <div className="relative h-28 w-full flex items-center justify-center">
        {breakdown.slice(0, displayCount).map((value, index) => {
          const offsetX = 50 + (index - displayCount / 2) * 12;
          const rotation = (index - displayCount / 2) * 8;

          return (
            <img
              key={index}
              src={MONEY_IMAGES[value]}
              alt={`${value}€`}
              className="absolute h-20 w-auto object-contain shadow-xl rounded-sm"
              style={{
                left: `${offsetX}%`,
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                zIndex: displayCount - index,
              }}
            />
          );
        })}
      </div>

      {/* Valore numerico */}
      <p className="text-4xl font-bold text-green-600">{amount.toFixed(2)}€</p>
    </div>
  );
}
