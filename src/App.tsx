import { useEffect, useState } from 'react';
import style from './App.module.css';

const ELEVATION_VALUES = [5, 7, 8, 9, 11, 12, 14, 15, 16];
const WHITE = 'FFFFFF';
const INITIAL_BACKGROUND = '222222';

const calculateSingleColorValueAdjustment = (foregroundColor: number, backgroundColor: number, opacity: number) => {
    return Math.round(opacity * foregroundColor + (1 - opacity) * backgroundColor);
};

const calculateForegroundColorAdjustment = (foregroundColor: string, backgroundColor: string, opacity: number) => {
    if (foregroundColor.length != 6 || backgroundColor.length != 6) {
        return foregroundColor;
    }
    const redFg = parseInt(foregroundColor.slice(0, 2), 16);
    const redBg = parseInt(backgroundColor.slice(0, 2), 16);
    const adjustedRed = calculateSingleColorValueAdjustment(redFg, redBg, opacity).toString(16).padStart(2, '0');
    const greenFg = parseInt(foregroundColor.slice(2, 4), 16);
    const greenBg = parseInt(backgroundColor.slice(2, 4), 16);
    const adjustedGreen = calculateSingleColorValueAdjustment(greenFg, greenBg, opacity).toString(16).padStart(2, '0');
    const blueFg = parseInt(foregroundColor.slice(4, 6), 16);
    const blueBg = parseInt(backgroundColor.slice(4, 6), 16);
    const adjustedBlue = calculateSingleColorValueAdjustment(blueFg, blueBg, opacity).toString(16).padStart(2, '0');
    return `${adjustedRed}${adjustedGreen}${adjustedBlue}`;
};

interface ElevatedCardProps {
    elevation: number;
    backgroundColor: string;
}

const ElevatedCard = ({ elevation, backgroundColor }: ElevatedCardProps) => {
    const [cardColor, setCardColor] = useState(backgroundColor);

    useEffect(() => {
        const updatedCardColor = calculateForegroundColorAdjustment(backgroundColor, 'FFFFFF', (100 - elevation) / 100);
        setCardColor(updatedCardColor);
    }, [elevation, backgroundColor]);

    return (
        <div className={style.card} style={{ backgroundColor: '#' + cardColor }}>
            <span className={style.cardColorText}>{cardColor}</span>
        </div>
    );
};

function App() {
    const [backgroundColor, setBackgroundColor] = useState(INITIAL_BACKGROUND);
    const [normalizedBackgroundColor, setNormalizedBackgroundColor] = useState(backgroundColor);

    useEffect(() => {
        switch (backgroundColor.length) {
            case 1:
                setNormalizedBackgroundColor(backgroundColor.repeat(6));
                break;
            case 3:
                setNormalizedBackgroundColor(backgroundColor.repeat(2));
                break;
            case 6:
                setNormalizedBackgroundColor(backgroundColor);
                break;
            default:
                break;
        }
    }, [backgroundColor]);

    return (
        <main className={style.main} style={{ backgroundColor: '#' + normalizedBackgroundColor }}>
            <div className={style.centerContainer}>
                <label className={style.backgroundInputContainer}>
                    <h2 className={style.header}>Background color</h2>
                    <input
                        className={style.backgroundInput}
                        type="text"
                        value={backgroundColor}
                        onChange={e => setBackgroundColor(e.target.value)}
                        size={6}
                        maxLength={6}
                    />
                </label>
                <div className={style.recommendedCards}>
                    {ELEVATION_VALUES.map((value, index) => (
                        <ElevatedCard key={index} elevation={value} backgroundColor={normalizedBackgroundColor} />
                    ))}
                </div>
            </div>
        </main>
    );
}

export default App;
