import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import StandaloneCalculator from "./pages/StandaloneCalculator";
import StandaloneTypeformCalculator from "./pages/StandaloneTypeformCalculator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StandaloneCalculator />} />
        <Route path="/apply" element={<StandaloneTypeformCalculator />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;