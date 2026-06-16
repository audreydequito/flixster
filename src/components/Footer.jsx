import './Footer.css';

function Footer() {
  return (
    <footer className="App-footer">
      <p className="footer-copyright">© 2026 Lumière</p>
      <p className="footer-links">
        Movie data provided by{' '}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Movie Database (TMDb)
        </a>
        {' · '}
        <a
          href="https://github.com/audreydequito/flixster"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}

export default Footer;
