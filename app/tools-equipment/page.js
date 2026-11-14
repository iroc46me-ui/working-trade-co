

import Script from "next/script";
import products from "./approved-products.json";


export const metadata = {
  title: "Tools & Equipment | Working Trade Co.",
  description:
    "Reviewed tools, equipment, and supplies for working trades.",
};

export default function ToolsEquipmentPage() {
  const approvedProducts = products.filter(
    (product) => product.status === "approved"
  );

  return (
    <main className="wrap page">
      <div className="eyebrow">WORKING TRADE CO. MARKETPLACE</div>

      <h1>Tools &amp; Equipment</h1>

      <p className="catalog-intro">
        Practical tools, equipment, and supplies for
        contractors, tradespeople, and owner-operators.
      </p>
      
      <nav aria-label="Shop by trade" className="catalog-section">
        <h2>Shop by Trade</h2>
        <p>Select a category to jump directly to its equipment listings.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {[
            ["Welding", "welding"],
            ["Automotive", "automotive"],
            ["Construction", "construction"],
            ["Carpentry & Woodworking", "woodworking"],
            ["Electrical", "electrical"],
            ["Plumbing", "plumbing"],
            ["Shop Tools", "shop-tools"],
            ["Mining & Prospecting", "prospecting"],
            ["All Equipment", "all-equipment"],
          ].map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              style={{
                display: "inline-block",
                padding: "10px 16px",
                border: "1px solid #999",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>


<section id="welding" className="catalog-section">
  <h2>Shop Welding Equipment</h2>
  <p>
    Explore welding machines, helmets, and accessories
    available from sellers on eBay.
  </p>

  <div style={{ maxWidth: "100%", overflowX: "auto" }}>
    <ins
      className="epn-placement"
      data-config-id="fff67f67eb198c627b8f811a"
    />
  </div>

  <Script
    src="https://epnt.ebay.com/static/epn-smart-tools.js"
    strategy="afterInteractive"
  />
</section>
      <section id="automotive" className="catalog">
        <h2>Shop Automotive Tools &amp; Diagnostics</h2>
        <p>
          Explore automotive diagnostic scanners, impact wrenches,
          and professional garage equipment available on eBay.
        </p>

        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ins
            className="epn-placement"
            data-config-id="fff681daeb198c627b8f811b"
          />
        </div>
              </section>
      {/* Construction & Power Tools */}
      <section id="construction" className="catalog">
        <h2>Shop Construction &amp; Power Tools</h2>
        <p>Explore cordless drills, saws, and construction tools available on eBay.</p>
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ins
            className="epn-placement"
            data-config-id="fff6851843b306020a11e09b"
          />
        </div>
      </section>
      {/* Carpentry & Woodworking Tools */}
      <section id="woodworking" className="catalog">
        <h2>Shop Carpentry &amp; Woodworking Tools</h2>
        <p>
          Explore table saws, routers, planers, jointers,
          and woodworking equipment available on eBay.
        </p>

        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ins
            className="epn-placement"
            data-config-id="fff6a0e843b306020a11e09c"
          />
        </div>
      </section>
      {/* Electrical Tools & Testing */}
      <section id="electrical" className="catalog">
        <h2>Shop Electrical Tools &amp; Testing</h2>
        <p>Explore multimeters and electrical testing equipment available on eBay.</p>
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ins
            className="epn-placement"
            data-config-id="fff685be2cd63c66f9f1d7c2"
          />
        </div>
      </section>

      {/* Plumbing Tools & Equipment */}
      <section id="plumbing" className="catalog">
        <h2>Shop Plumbing Tools &amp; Equipment</h2>
        <p>Explore pipe threaders and professional plumbing tools available on eBay.</p>
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ins
            className="epn-placement"
            data-config-id="fff68665eb198c627b8f811c"
          />
        </div>
      </section>

      {/* Heavy Equipment & Shop Tools */}
      <section id="shop-tools" className="catalog">
        <h2>Shop Heavy Equipment &amp; Shop Tools</h2>
        <p>Explore hydraulic shop presses and workshop equipment available on eBay.</p>
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ins
            className="epn-placement"
            data-config-id="fff686cb0efb3159606cb5fe"
          />
        </div>
      </section>

      {/* Mining & Prospecting Equipment */}
      <section id="prospecting" className="catalog">
        <h2>Shop Mining &amp; Prospecting Equipment</h2>
        <p>Explore gold metal detectors and prospecting equipment available on eBay.</p>
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ins
            className="epn-placement"
            data-config-id="fff6874e289aa126f8cfda20"
          />
        </div>
      </section>

      
      <section id="all-equipment" className="catalog">
        <h2>Equipment Marketplace</h2>
        <p>
          Browse {approvedProducts.length} approved equipment listings.
          Purchases are completed directly on eBay.
        </p>

        {approvedProducts.length === 0 ? (
          <p>New equipment listings are coming soon.</p>
        ) : (
          <div className="catalog-grid">
            {approvedProducts.map((product) => (
              
<article className="catalog-card" key={product.id}>
  {product.imageUrl && (
    <div className="equipment-image">
      <img
        src={product.imageUrl}
        alt={product.title}
        loading="lazy"
        style={{
          width: "100%",
          height: "220px",
          objectFit: "contain",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      />
    </div>
  )}

  <p className="eyebrow">{product.category}</p>


                <h3>{product.title}</h3>

                <p>By {product.seller}</p>

                <p>{product.description}</p>

                <p>
                  <strong>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: product.currency || "USD",
                    }).format(product.price)}
                  </strong>
                </p>

                <a
                  href={product.purchaseUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  View on eBay ↗
                </a>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="notice catalog-disclosure">
        <strong>Affiliate disclosure:</strong>{" "}
        Working Trade Co. may earn commissions from qualifying purchases
        made through affiliate links. Purchases are completed on the
        seller&apos;s website.
      </div>
    </main>
  );
}
