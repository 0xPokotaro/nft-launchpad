import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <div>
        <h1>NFT Launchpad</h1>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/launchpad">Launchpad</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
