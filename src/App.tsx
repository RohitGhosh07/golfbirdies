// App.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import logo1 from "./assets/logo1.png";
import bottom from "./assets/bottom.png";
import bottom1 from "./assets/bottom1.png";
import bottom2 from "./assets/bottom2.png";

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
  const eventId = searchParams.get("event") || "2025134";
  const roundId = searchParams.get("round") || "1";
  const [scores, setScores] = useState<Score>({ birdies: 0, eagles: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
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

        setScores({ birdies: birdie, eagles: eagle });
      } catch {
        setError("Failed to fetch scores");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
      className={`tracking-wider text-[11px] sm:text-xl font-black ${colorClass ?? "text-white"} text-center`}
      style={{ fontFamily: "'Archivo Black', system-ui, sans-serif" }}
    >
      {children}
    </div>
  );

  const Tiles = ({ value }: { value: number }) => (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* left hinge */}
      <div className="w-2 sm:w-3 h-10 sm:h-16 rounded bg-white/15 relative overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/25" />
      </div>
      {digits(value).map((d, i) => (
        <div
          key={i}
          className="w-8 h-12 sm:w-14 sm:h-20 rounded-md bg-white shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.08)] grid place-items-center"
        >
          <span
            className="text-2xl sm:text-5xl leading-none text-zinc-800"
            style={{ fontFamily: "'Archivo Black', system-ui, sans-serif" }}
          >
            {d}
          </span>
        </div>
      ))}
      {/* right hinge */}
      <div className="w-2 sm:w-3 h-10 sm:h-16 rounded bg-white/15 relative overflow-hidden">
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
          --dp-rose:#FF4466;    /* BIRDIES label */
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

      <div className="w-full max-w-[1120px] ">
        {/* DP World mark */}
        <div className="flex justify-center  ">
          <img
            src={logo1}
            alt="DP World Logo"
            className="w-40 h-40 sm:w-80 sm:h-80 object-contain"
          />
        </div>



        {/* Title */}
        <h2
          className="text-white text-center mb-2 sm:mb-3"
          style={{
            fontFamily: "'Archivo Black', system-ui, sans-serif",
            letterSpacing: "0.02em",
            fontSize: "clamp(20px, 5.5vw, 48px)",
          }}
        >
          BALLS FOR BIRDIES
        </h2>

        <p
          className="text-center text-white/95  mx-auto mb-8 sm:mb-12 px-2"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "clamp(12px, 2.8vw, 18px)",
            lineHeight: 1.5,
          }}
        >
          DP World has pledged to donate golf balls, linked to the number of
          birdies and eagles shot on the DP World Tour.
        </p>

        {/* Divider */}
        {/* <div className="h-px w-full bg-white" /> */}

        {/* Count block */}
        <section className="py-8 sm:py-12">
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

          <div className="grid grid-cols-3 gap-2 sm:gap-10 max-w-[820px] mx-auto">
            {/* Birdies */}
            <div className="flex flex-col items-center">
              <Tiles value={isLoading || error ? 0 : scores.birdies} />
              <div className="mt-2 sm:mt-4">
                <Label colorClass="text-[var(--dp-rose)]">
                  {isLoading ? "LOADING..." : error ? "ERROR" : "BIRDIES"}
                </Label>
              </div>
            </div>

            {/* Eagles */}
            <div className="flex flex-col items-center">
              <Tiles value={isLoading || error ? 0 : scores.eagles} />
              <div className="mt-2 sm:mt-4">
                <Label colorClass="text-[var(--dp-green)]">
                  {isLoading ? "LOADING..." : error ? "ERROR" : "EAGLES"}
                </Label>
              </div>
            </div>

            {/* Total Deployed */}
            <div className="flex flex-col items-center">
              <Tiles value={isLoading || error ? 0 : totalDeployed} />
              <div className="mt-2 sm:mt-4 leading-tight">
                <Label>
                  {isLoading ? "LOADING..." : error ? "ERROR" : "TOTAL "}
                  {isLoading || error ? "" : "DEPLOYED"}
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
            src={bottom}
            alt="DP World Tour"
            className="w-40 h-40 sm:w-80 sm:h-60 object-contain"
          />
          <img
            src={bottom1}
            alt="The Golf Foundation"
            className="w-40 h-40 sm:w-80 sm:h-60 object-contain"
          />
          <img
            src={bottom2}
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
