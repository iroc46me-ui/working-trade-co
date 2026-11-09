
export const metadata = {
  title: "Tools & Equipment | Working Trade Co.",
  description:
    "Reviewed tools, equipment, and supplies for working trades.",
};

export default function ToolsEquipmentPage() {
  return (
    <main className="wrap page">
      <div className="eyebrow">
        WORKING TRADE CO. MARKETPLACE
      </div>

      <h1>Tools &amp; Equipment</h1>

      <p className="catalog-intro">
        Practical tools, equipment, and supplies for
        contractors, tradespeople, and owner-operators.
      </p>

      <section className="catalog-section">
        <h2>Equipment Marketplace</h2>

        <p>
          We are preparing a selection of reviewed
          equipment and supplies from independent sellers.
        </p>

        <p>
          Products will be added after checking seller
          information, listing availability, and
          affiliate eligibility.
        </p>
      </section>

      <div className="notice catalog-disclosure">
        <strong>Affiliate disclosure:</strong>{" "}
        Working Trade Co. may earn commissions from
        qualifying purchases made through affiliate links.
        Purchases are completed on the seller's website.
      </div>
    </main>
  );
}
