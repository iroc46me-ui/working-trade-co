
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

      <section className="catalog-section">
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
