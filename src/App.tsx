import { useState, useEffect } from 'react';

interface Score {
  birdies: number;
  eagles: number;
}

function App() {
  const [scores, setScores] = useState<Score>({ birdies: 0, eagles: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('https://www.europeantour.com/api/sportdata/HoleByHole/Event/2025134/Round/1');
        const data = await response.json();
        
        let birdieCount = 0;
        let eagleCount = 0;

        // Count birdies and eagles across all players and holes
        data.Players.forEach((player: any) => {
          player.Holes.forEach((hole: any) => {
            if (hole.ScoreClass === 'bi') birdieCount++;
            if (hole.ScoreClass === 'ea') eagleCount++;
          });
        });

        setScores({ birdies: birdieCount, eagles: eagleCount });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch scores');
        setIsLoading(false);
      }
    };

    fetchScores();
  }, []);

  // Function to split number into array of digits
  const getDigitArray = (num: number): number[] => {
    return num.toString().padStart(3, '0').split('').map(Number);
  };

  const birdieDigits = getDigitArray(scores.birdies);
  const eagleDigits = getDigitArray(scores.eagles);
  const totalDeployed = scores.birdies + (scores.eagles * 2);
  const totalDigits = getDigitArray(totalDeployed);

  return (
    <div className="min-h-screen bg-[#5B68A4] flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="flex flex-relative justify-center mb-4 sm:mb-8">
          <svg className="w-20 h-16 sm:w-32 sm:h-24" viewBox="0 0 150 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 20C75 20 85 15 95 25C105 35 95 50 85 50C75 50 75 50 75 50" stroke="#E94560" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M75 50C75 50 65 45 55 55C45 65 55 75 65 75C75 75 75 75 75 75" stroke="#4ECDC4" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M75 50C75 50 85 55 95 55C105 55 105 65 95 70C85 75 75 75 75 75" stroke="#95E1D3" strokeWidth="8" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        <h1 className="text-white text-center text-3xl sm:text-6xl font-black tracking-wider mb-8 sm:mb-16" style={{ fontFamily: 'Arial Black, sans-serif' }}>
          DP WORLD
        </h1>

        <h2 className="text-white text-center text-2xl sm:text-5xl font-black tracking-wide mb-4 sm:mb-6" style={{ fontFamily: 'Arial Black, sans-serif' }}>
          BALLS FOR BIRDIES
        </h2>

        <p className="text-white text-center text-base sm:text-xl leading-relaxed mb-8 sm:mb-12 max-w-3xl mx-auto px-2" style={{ fontFamily: 'Arial, sans-serif' }}>
          DP World has pledged to donate golf balls, linked to the number of birdies and eagles shot on the DP World Tour.
        </p>

        <div className="border-t-2 border-b-2 border-white/30 py-8 sm:py-12 mb-8 sm:mb-12">
          <h3 className="text-white text-center text-xl sm:text-4xl font-black tracking-wide mb-6 sm:mb-8" style={{ fontFamily: 'Arial Black, sans-serif' }}>
            DP WORLD<br/>INDIA CHAMPIONSHIP<br/>COUNT:
          </h3>

          <div className="grid grid-cols-3 gap-2 sm:gap-8 max-w-3xl mx-auto px-2">
            <div className="flex flex-col items-center">
              <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-4">
                {birdieDigits.map((digit, index) => (
                  <div key={`birdie-${index}`} className="bg-white rounded-lg w-8 h-12 sm:w-14 sm:h-20 flex items-center justify-center">
                    <span className="text-2xl sm:text-5xl font-black text-gray-800" style={{ fontFamily: 'Arial Black, sans-serif' }}>{digit}</span>
                  </div>
                ))}
              </div>
              <span className="text-[#FF4466] text-sm sm:text-2xl font-black tracking-wider" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                {isLoading ? 'LOADING...' : error ? 'ERROR' : 'BIRDIES'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-4">
                {eagleDigits.map((digit, index) => (
                  <div key={`eagle-${index}`} className="bg-white rounded-lg w-8 h-12 sm:w-14 sm:h-20 flex items-center justify-center">
                    <span className="text-2xl sm:text-5xl font-black text-gray-800" style={{ fontFamily: 'Arial Black, sans-serif' }}>{digit}</span>
                  </div>
                ))}
              </div>
              <span className="text-[#44DD88] text-sm sm:text-2xl font-black tracking-wider" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                {isLoading ? 'LOADING...' : error ? 'ERROR' : 'EAGLES'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-4">
                {totalDigits.map((digit, index) => (
                  <div key={`total-${index}`} className="bg-white rounded-lg w-8 h-12 sm:w-14 sm:h-20 flex items-center justify-center">
                    <span className="text-2xl sm:text-5xl font-black text-gray-800" style={{ fontFamily: 'Arial Black, sans-serif' }}>{digit}</span>
                  </div>
                ))}
              </div>
              <span className="text-white text-sm sm:text-2xl font-black tracking-wider text-center leading-tight" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                {isLoading ? 'LOADING...' : error ? 'ERROR' : 'TOTAL\nDEPLOYED'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8 px-2">
          <p className="text-white text-sm sm:text-xl leading-relaxed mb-4 sm:mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
            This week DP World is supporting both<br className="hidden sm:inline"/>
            <span className="sm:hidden"> </span>The Golf Foundation and the Indian Golf Union on<br className="hidden sm:inline"/>
            <span className="sm:hidden"> </span>a mission to nurture grassroots golf in India.
          </p>
          <p className="text-white text-lg sm:text-2xl font-normal" style={{ fontFamily: 'Arial, sans-serif' }}>
            #SmartLogisticsToATee
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-6 sm:gap-12 mt-8 sm:mt-16">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-12 sm:w-20 sm:h-16 mb-2" viewBox="0 0 150 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M75 20C75 20 85 15 95 25C105 35 95 50 85 50C75 50 75 50 75 50" stroke="#E94560" strokeWidth="8" strokeLinecap="round" fill="none"/>
              <path d="M75 50C75 50 65 45 55 55C45 65 55 75 65 75C75 75 75 75 75 75" stroke="#4ECDC4" strokeWidth="8" strokeLinecap="round" fill="none"/>
              <path d="M75 50C75 50 85 55 95 55C105 55 105 65 95 70C85 75 75 75 75 75" stroke="#95E1D3" strokeWidth="8" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="text-white text-center">
              <div className="text-base sm:text-xl font-black tracking-wide" style={{ fontFamily: 'Arial Black, sans-serif' }}>DP WORLD</div>
              <div className="text-2xl sm:text-3xl font-black tracking-wider" style={{ fontFamily: 'Arial Black, sans-serif' }}>TOUR</div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 p-3 sm:p-4">
            <div className="text-center">
              <div className="text-[#4ECDC4] text-xs font-black" style={{ fontFamily: 'Arial Black, sans-serif' }}>tgf</div>
              <div className="text-[#E94560] text-[8px] font-bold leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>THE GOLF FOUNDATION</div>
              <div className="text-[#5B68A4] text-[7px] font-normal" style={{ fontFamily: 'Arial, sans-serif' }}>Building Indian Golf</div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-white rounded-lg w-20 h-20 sm:w-24 sm:h-24 p-3">
            <div className="text-center">
              <div className="text-green-700 text-xl sm:text-2xl font-black mb-1">⛳</div>
              <div className="text-[8px] font-bold text-gray-800 leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>The Indian Golf Union</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
