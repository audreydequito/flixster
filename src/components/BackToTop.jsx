import { useState, useEffect } from 'react';
import './BackToTop.css';
import { ChevronUpIcon } from './icons';

// Floating button that scrolls the page back to the top. Hidden until the
// user has scrolled down past a threshold.
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state in case the page is already scrolled
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top${isVisible ? ' is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUpIcon size={24} />
    </button>
  );
}

export default BackToTop;
