import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Story from './pages/Story';
import Final from './pages/Final';
import Gallery from './pages/Gallery';
import Game from './pages/Game';
import Reasons from './pages/Reasons';
import FloatingHearts from './components/FloatingHearts';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.opacity = '1';
  }, [location]);

  return (
    <>
      <FloatingHearts />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<Story />} />
        <Route path="/final" element={<Final />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/game" element={<Game />} />
        <Route path="/reasons" element={<Reasons />} />
      </Routes>
    </>
  );
};

export default App;
