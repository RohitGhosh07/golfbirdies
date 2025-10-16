// App.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import logo1 from "./assets/logo1.png";
import DP_World_tour from "./assets/DP World tour.png";
import indian_golf_union from "./assets/indian golf union.png";
import tgf from "./assets/tgf.png";

/**
 * Exact-look replica of the DP WORLD poster:
 * - Gradient, spacing, and type scale tuned to match the artwork
 * - Number tiles with hinge ticks
 * - Mobile-first; bottom logos always 3-in-a-row
 * - Uses Google fonts (Archivo Black + Inter) injected locally via <style>
 */

type Score = { birdies: number; eagles: number };

export default function App() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event");
  const roundId = searchParams.get("round");
  const eagleParam = searchParams.get("ea");
  const birdieParam = searchParams.get("bi");
  
  const [scores, setScores] = useState<Score>({ birdies: 0, eagles: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch API data
    const fetchApiData = async () => {
      try {
        if (!eventId || !roundId) return null;
        
        const res = await fetch(
          `https://www.europeantour.com/api/sportdata/HoleByHole/Event/${eventId}/Round/${roundId}`
        );
        const data = await res.json();

        let birdie = 0;
        let eagle = 0;

        // Count across all players/holes
        data?.Players?.forEach((p: any) => {
          p?.Holes?.forEach((h: any) => {
            if (h?.ScoreClass === "bi") birdie++;
            if (h?.ScoreClass === "ea") eagle++;
          });
        });

        return { birdies: birdie, eagles: eagle };
      } catch {
        setError("Failed to fetch scores");
        return null;
      }
    };

    // Function to update scores based on parameters and API data
    const updateScores = async () => {
      // Parse ea and bi parameters
      const eagleValue = eagleParam ? parseInt(eagleParam, 10) : 0;
      const birdieValue = birdieParam ? parseInt(birdieParam, 10) : 0;

      // Case 1: Only ea/bi parameters provided
      if (eagleParam !== null && birdieParam !== null && !eventId && !roundId) {
        setScores({ eagles: eagleValue, birdies: birdieValue });
        return;
      }

      // Case 2: Fetch API data (with or without ea/bi parameters)
      const apiData = await fetchApiData();
      
      if (apiData) {
        // If ea/bi parameters exist, add them to API values
        setScores({
          eagles: (eagleParam !== null ? eagleValue : 0) + apiData.eagles,
          birdies: (birdieParam !== null ? birdieValue : 0) + apiData.birdies
        });
      } else if (eagleParam !== null && birdieParam !== null) {
        // Fallback to ea/bi parameters if API fetch fails
        setScores({ eagles: eagleValue, birdies: birdieValue });
      }
    };

    // Initial update
    updateScores();

    // Set up polling if API fetch is needed
    let interval: NodeJS.Timeout | null = null;
    if (eventId && roundId) {
      interval = setInterval(updateScores, 60000);
    }

    // Cleanup
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [eventId, roundId, eagleParam, birdieParam]);

  const totalDeployed = useMemo(
    () => scores.birdies + scores.eagles * 2,
    [scores]
  );

  const digits = (n: number) =>
    n.toString().padStart(3, "0").split("").map(Number);

  const Label = ({
    children,
    colorClass,
  }: {
    children: React.ReactNode;
    colorClass?: string;
  }) => (
    <div
      className={`tracking-wider text-[11px] sm:text-4xl font-black ${colorClass ?? "text-white"} text-center`}
      style={{ fontFamily: "'Archivo Black', system-ui, sans-serif" }}
    >
      {children}
    </div>
  );

  const Tiles = ({ value }: { value: number }) => (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* left hinge */}
      <div className="w-3 sm:w-4 h-14 sm:h-24 rounded bg-orange-600 relative overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/25" />
      </div>
      {digits(value).map((d, i) => (
        <div
          key={i}
          className="w-12 h-16 sm:w-24 sm:h-32 rounded-md bg-white shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.08)] grid place-items-center"
        >
          <span
            className="text-5xl sm:text-9xl leading-none text-zinc-800"
            style={{ fontFamily: "'Archivo Black', system-ui, sans-serif" }}
          >
            {d}
          </span>
        </div>
      ))}
      {/* right hinge */}
      <div className="w-3 sm:w-4 h-14 sm:h-24 rounded bg-orange-600 relative overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/25" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:py-1 relative overflow-hidden">
      {/* Fonts + precise color tokens */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;700&display=swap');
        :root{
          --dp-start:#6F79D5;   /* top blue-violet */
          --dp-end:#1E0A36;     /* deep purple bottom */
          --dp-rose:#FFEA00;    /* BIRDIES label */
          --dp-green:#22C56D;   /* EAGLES label */
        }
      `}</style>

      {/* Gradient backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--dp-start) 0%, #4B41B6 35%, #2C1453 70%, var(--dp-end) 100%)",
        }}
      />

      <div className="w-full max-w-[1120px]">
        <div className="flex flex-row items-center justify-center gap-4">
          {/* DP World mark */}
          {/* <div className="flex-shrink-0">
            <img
              src={logo1}
              alt="DP World Logo"
              className="w-40 h-60 sm:w-80 sm:h-60 object-contain"
            />
          </div> */}

          {/* Title */}
          <h2
            className="text-white mb-2 sm:mb-3"
            style={{
              fontFamily: "'Archivo Black', system-ui, sans-serif",
              letterSpacing: "0.02em",
              fontSize: "clamp(20px, 5.5vw, 48px)",
            }}
          >
            BALLS FOR BIRDIES
          </h2>
        </div>

        {/* <p
          className="text-center text-white/95  mx-auto mb-8 sm:mb-12 px-2"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(12px, 2.8vw, 18px)",
            lineHeight: 1.5,
          }}
        >
          DP World has pledged to donate golf balls, linked to the number of
          birdies and eagles shot on the DP World Tour.
        </p> */}

        {/* Divider */}
        {/* <div className="h-px w-full bg-white" /> */}

        {/* Count block */}
        <section className="">
          <h3
            className="text-center text-white mb-6 sm:mb-10 leading-tight"
            style={{
              fontFamily: "'Archivo Black', system-ui, sans-serif",
              letterSpacing: "0.015em",
              fontSize: "clamp(16px, 4.8vw, 40px)",
            }}
          >
            DP WORLD
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            INDIA CHAMPIONSHIP
            COUNT:
          </h3>

          <div className="grid grid-cols-3 gap-4 sm:gap-16 max-w-[1200px] mx-auto">
            {/* Birdies */}
            <div className="flex flex-col items-center">
              <Tiles value={error ? 0 : scores.birdies} />
              <div className="mt-4 sm:mt-6">
                <Label colorClass="text-[var(--dp-rose)] [text-shadow:_0_0_10px_rgba(0,0,0,0)]">
                  {error ? "ERROR" : "BIRDIES"}
                </Label>
              </div>
            </div>

            {/* Eagles */}
            <div className="flex flex-col items-center">
              <Tiles value={error ? 0 : scores.eagles} />
              <div className="mt-4 sm:mt-6">
                <Label colorClass="text-[var(--dp-green)] [text-shadow:_0_0_10px_rgba(0,0,0,0)]">
                  {error ? "ERROR" : "EAGLES"}
                </Label>
              </div>
            </div>

            {/* Total Deployed */}
            <div className="flex flex-col items-center">
              <Tiles value={error ? 0 : totalDeployed} />
              <div className="mt-4 sm:mt-6 leading-tight">
                <Label>
                  {error ? "ERROR" : "TOTAL "}
                  {error ? "" : "DEPLOYED"}
                </Label>
              </div>
            </div>
          </div>
        </section>
        {/* Divider */}
        {/* <div className="h-px w-full bg-white" /> */}
        {/* Bottom logos – ALWAYS 3 in a row */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 place-items-center">
          <img
            src={DP_World_tour}
            alt="DP World Tour"
            className="w-40 h-40 sm:w-80 sm:h-60 object-contain"
          />
          <img
            src={tgf}
            alt="The Golf Foundation"
            className="w-100 h-40 sm:w-100 sm:h-60 object-contain"
          />
          <img
            src={indian_golf_union}
            alt="Indian Golf Union"
            className="w-40 h-40 sm:w-80 sm:h-60 object-contain"
          />
        </div>


        {/* Support copy */}
        <div className="text-center  px-2">
          <p
            className="text-white/95 "
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(12px, 2.8vw, 18px)",
              lineHeight: 1.5,
            }}
          >
            This week DP World is supporting both The Golf Foundation and the
            Indian Golf Union on a mission to nurture grassroots golf in India.
          </p>
          <p
            className="text-white"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(14px, 3.4vw, 22px)",
            }}
          >
            #SmartLogisticsToATee
          </p>
        </div>


      </div>
    </div>
  );
}
