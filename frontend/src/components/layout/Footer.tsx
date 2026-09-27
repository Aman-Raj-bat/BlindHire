import React from 'react';
import { Code2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="world-footer">
      <div className="world-container">
        <div className="world-footer-grid">
          <div>
            <Link to="/" className="cosmic-brand" aria-label="BlindHire home">
              <span className="cosmic-brand-mark" aria-hidden="true">
                <img src="/logo.svg" alt="" />
              </span>
              <span className="cosmic-brand-name">BlindHire</span>
            </Link>
            <p>
              Privacy-preserving hiring on Midnight. Candidates prove they are qualified before deciding when their identity enters the room.
            </p>
          </div>

          <div>
            <h3>Navigate the world</h3>
            <ul>
              <li><Link to="/jobs">Explore roles</Link></li>
              <li><Link to="/candidate">Candidate vault</Link></li>
              <li><Link to="/recruiter">For teams</Link></li>
              <li><Link to="/how-it-works">The protocol</Link></li>
            </ul>
          </div>

          <div>
            <h3>Open network</h3>
            <ul>
              <li>
                <a href="https://preprod.midnightexplorer.com" target="_blank" rel="noopener noreferrer">
                  Midnight explorer <ExternalLink size={12} className="ml-1 inline" aria-hidden="true" />
                </a>
              </li>
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/admin">Contract deployer</Link></li>
              <li>
                <a href="https://github.com/Aman-Raj-bat/BlindHire" target="_blank" rel="noopener noreferrer">
                  Source on GitHub <Code2 size={12} className="ml-1 inline" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="world-footer-bottom">
          <span>© 2026 BlindHire / Qualified before identified.</span>
          <span>Compact 0.5.2 · Midnight preprod</span>
        </div>
      </div>
    </footer>
  );
};
