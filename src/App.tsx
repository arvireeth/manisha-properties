import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import { About } from "./pages/About";
import { Videos } from "./pages/Videos";

function App() {
  return (
    <>
      <Helmet>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0B88R2EHR4"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0B88R2EHR4');
            `,
          }}
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/videos" element={<Videos />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;