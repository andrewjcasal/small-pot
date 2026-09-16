import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { toolGroups, sellerLabel, pricesReviewed, type Tool } from '../data/tools';
import './Tools.css';

function formatPrice(price: number) {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

function ToolCard({ tool }: { tool: Tool }) {
  const photo = tool.slug ? (
    <img
      className="tool-photo-img"
      src={`/tools/${tool.slug}.webp`}
      alt={tool.name}
      loading="lazy"
    />
  ) : (
    <span className="tool-photo-empty" aria-hidden="true">
      photo coming
    </span>
  );

  return (
    <div className="tool-card">
      {tool.url ? (
        <a
          className="tool-photo"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tool.name}
        >
          {photo}
        </a>
      ) : (
        <div className="tool-photo">{photo}</div>
      )}

      <h3 className="tool-name">{tool.name}</h3>

      {tool.subtitle && <p className="tool-subtitle">{tool.subtitle}</p>}

      {tool.variants?.map((v) => (
        <p key={v.label} className="tool-price">
          {v.label}, about {formatPrice(v.price)}
        </p>
      ))}

      {tool.price !== null && (
        <p className="tool-price">
          about {formatPrice(tool.price)}
          {tool.priceNote && <span className="tool-price-note">, {tool.priceNote}</span>}
        </p>
      )}

      {tool.note && <p className="tool-note">{tool.note}</p>}

      {tool.url && tool.seller ? (
        <a
          className="tool-link"
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{sellerLabel[tool.seller]}</span>
          <ExternalLink className="tool-link-icon" aria-hidden="true" />
        </a>
      ) : tool.seller ? (
        <p className="tool-seller">at {sellerLabel[tool.seller]}</p>
      ) : null}
    </div>
  );
}

export default function Tools() {
  return (
    <div className="tools-page">
      <div className="tools-container">
        <header className="tools-header">
          <Link to="/links" className="tools-back">
            <ArrowLeft className="tools-back-icon" />
            <span>back</span>
          </Link>
          <h1>tools &amp; materials</h1>
          <p className="tools-tagline">what i use, and where to get it</p>
        </header>

        {toolGroups.map((group) => (
          <section key={group.title} className="tools-section">
            <h2 className="tools-section-title">{group.title}</h2>
            <div className="tools-grid">
              {group.items.map((tool) => (
                <ToolCard key={tool.name + (tool.subtitle ?? '')} tool={tool} />
              ))}
            </div>
          </section>
        ))}

        <p className="tools-footnote">
          prices reviewed {pricesReviewed}. click the link to see current price.
        </p>
      </div>
    </div>
  );
}
