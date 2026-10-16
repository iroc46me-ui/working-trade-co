import CatalogClient from "./CatalogClient";

export const metadata = {
  title: "PDF Marketplace | Working Trade Co.",
  description: "Search approved digital downloads, job forms, guides and business tools for working trades."
};

export default function Marketplace() {
  return (
    <main className="wrap page catalog-page">
      <div className="eyebrow">WORKING TRADE CO. MARKETPLACE</div>
      <h1>PDFs &amp; Digital Tools for Working People</h1>
      <p className="catalog-intro">
        Practical job forms, guides, templates and project resources—all in one place.
        Our own Junk Removal Starter Kit is available now; independent creators' products
        will join the library as their listings and affiliate links are approved.
      </p>
      <CatalogClient />
      <div className="notice catalog-disclosure">
        <strong>Purchases and affiliate disclosure:</strong> Product purchases are completed at the seller's checkout.
        If we feature an affiliate product, we'll identify it and may receive a commission from qualifying purchases.
        Working Trade Co. does not deliver other creators' paid files.
      </div>
    </main>
  );
}
