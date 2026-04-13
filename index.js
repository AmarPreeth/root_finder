const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

function getFunction(eq) {
  return function (x) {
    const expr = eq.replace(/\bx\b/g, `(${x})`);
    return eval(expr);
  };
}

function bisection(f, a, b) {
  let mid;
  for (let i = 0; i < 50; i++) {
    mid = (a + b) / 2;
    if (f(a) * f(mid) < 0) b = mid;
    else a = mid;
  }
  return (a + b) / 2;
}

function secant(f, x0, x1) {
  for (let i = 0; i < 50; i++) {
    let x2 = x1 - f(x1) * (x1 - x0) / (f(x1) - f(x0));
    if (Math.abs(x2 - x1) < 0.0001) return x2;
    x0 = x1;
    x1 = x2;
  }
  return x1;
}

function newton(f, x0) {
  let x = x0;
  for (let i = 0; i < 100; i++) {
    let fx = f(x);
    let dfx = (f(x + 1e-7) - f(x - 1e-7)) / (2e-7);
    if (Math.abs(dfx) < 1e-12) break;
    let x1 = x - fx / dfx;
    if (Math.abs(x1 - x) < 1e-9) return x1;
    x = x1;
  }
  return x;
}

app.post('/solve', (req, res) => {
  const { method, equation, a, b, x0 } = req.body;
  console.log("Received:", req.body);
  try {
    const f = getFunction(equation);
    let root;
    if (method === "bisection") root = bisection(f, a, b);
    if (method === "secant") root = secant(f, a, b);
    if (method === "newton") root = newton(f, x0);
    console.log("Root:", root);
    res.json({ root });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.json({ root: null, error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});