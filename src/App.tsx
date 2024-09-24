/** @format */

import LEDControl from "./pages/index";
import { Analytics } from "@vercel/analytics/react";
function App() {
  return (
    <>
      <LEDControl />
      <Analytics />
    </>
  );
}

export default App;
