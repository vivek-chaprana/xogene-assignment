import { BrowserRouter, Route, Routes } from "react-router";
import { DrugInfoPage } from "./pages/drugInfo";
import { SearchPage } from "./pages/search";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/:rxcui" element={<DrugInfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
