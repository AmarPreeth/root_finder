import { useState } from "react";

const methodConfig = {
  bisection: { label: "Bisection Method", inputs: ["a", "b"] },
  secant: { label: "Secant Method", inputs: ["a", "b"] },
  newton: { label: "Newton-Raphson", inputs: ["x0"] },
};

export default function App() {
  const [method, setMethod] = useState("bisection");
  const [equation, setEquation] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [x0, setX0] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setEquation("");
    setA(""); setB(""); setX0("");
    setResult(null); setError(null);
  };

  const handleMethodChange = (m) => {
    setMethod(m);
    setA(""); setB(""); setX0("");
    setResult(null); setError(null);
  };

  const solve = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("https://rootfinder-production.up.railway.app/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method, equation,
          a: parseFloat(a), b: parseFloat(b), x0: parseFloat(x0)
        })
      });
      const data = await res.json();
      if (data.root !== undefined && !isNaN(data.root)) {
        setResult(data.root);
      } else {
        setError("Could not find root. Check inputs.");
      }
    } catch {
      setError("Server error. Is backend running?");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0f;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
        }

        .bg {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 50%),
            #0a0a0f;
          padding: 20px;
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 80px rgba(99,102,241,0.1), 0 20px 60px rgba(0,0,0,0.5);
        }

        .header {
          margin-bottom: 32px;
        }

        .tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          color: #6366f1;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        h1 {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
        }

        h1 span { color: #6366f1; }

        .methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }

        .method-btn {
          padding: 10px 6px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .method-btn:hover {
          border-color: rgba(99,102,241,0.4);
          color: rgba(255,255,255,0.7);
        }

        .method-btn.active {
          background: rgba(99,102,241,0.2);
          border-color: #6366f1;
          color: #fff;
        }

        .label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
          font-family: 'Space Mono', monospace;
        }

        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          margin-bottom: 16px;
        }

        .input:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.06);
        }

        .input::placeholder { color: rgba(255,255,255,0.2); }

        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .row .input { margin-bottom: 0; }
        .row-wrap { margin-bottom: 16px; }

        .actions { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-top: 8px; }

        .solve-btn {
          padding: 14px;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }

        .solve-btn:hover { background: #4f46e5; transform: translateY(-1px); }
        .solve-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .reset-btn {
          padding: 14px 16px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }

        .result-box {
          margin-top: 20px;
          padding: 18px 20px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 12px;
          text-align: center;
        }

        .result-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: #6366f1;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .result-value {
          font-family: 'Space Mono', monospace;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
        }

        .error-box {
          margin-top: 20px;
          padding: 14px 16px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          color: #f87171;
          font-size: 13px;
          font-family: 'Space Mono', monospace;
          text-align: center;
        }
      `}</style>

      <div className="bg">
        <div className="card">
          <div className="header">
            <div className="tag">Numerical Methods</div>
            <h1>Root <span>Finder</span></h1>
          </div>

          <div className="methods">
            {Object.entries(methodConfig).map(([key, val]) => (
              <button
                key={key}
                className={`method-btn ${method === key ? "active" : ""}`}
                onClick={() => handleMethodChange(key)}
              >
                {val.label}
              </button>
            ))}
          </div>

          <div className="label">Equation f(x)</div>
          <input
            className="input"
            placeholder="e.g. x*x - 4"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
          />

          {method !== "newton" ? (
            <>
              <div className="label">Initial Values</div>
              <div className="row row-wrap">
                <input className="input" placeholder="a" value={a} onChange={(e) => setA(e.target.value)} />
                <input className="input" placeholder="b" value={b} onChange={(e) => setB(e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <div className="label">Initial Guess</div>
              <input
                className="input"
                placeholder="x0"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
              />
            </>
          )}

          <div className="actions">
            <button className="solve-btn" onClick={solve} disabled={loading}>
              {loading ? "Solving..." : "Solve"}
            </button>
            <button className="reset-btn" onClick={reset}>Reset</button>
          </div>

          {result !== null && (
            <div className="result-box">
              <div className="result-label">Root Found</div>
              <div className="result-value">{result.toFixed(6)}</div>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}
        </div>
      </div>
    </>
  );
}