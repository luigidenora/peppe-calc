import { ImageWithFallback } from './figma/ImageWithFallback';

interface MoneyButtonProps {
  value: number;
  imageUrl: string;
  onSelect: (value: number) => void;
  speak: (text: string) => void;
  compact?: boolean;
}

export function MoneyButton({ value, imageUrl, onSelect, speak, compact = false }: MoneyButtonProps) {
  const handleClick = () => {
    onSelect(value);
    const text = value >= 1
      ? `${value} euro`
      : `${Math.round(value * 100)} centesimi`;
    speak(text);
  };

  const displayValue = value >= 1
    ? `${value}€`
    : `${Math.round(value * 100)}¢`;

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="m-auto active:scale-95 transition-transform touch-manipulation"
      >
        <ImageWithFallback
          src={imageUrl}
          alt={displayValue}
          className="w-auto h-22 object-contain rounded-full"
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="active:scale-95 transition-transform touch-manipulation"
    >
      <ImageWithFallback
        src={imageUrl}
        alt={displayValue}
        className="w-full h-22"
      />
    </button>
  );
}
