"use client";

import { useMemo, useState } from "react";
import { catalog } from "./catalog";

const money = (amount, currency) => {
  if (amount === null || amount === undefined) return "See seller's price";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: currency || "USD", maximumFractionDigits: 2,
  }).format(amount);
};

export default function CatalogClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All trades");
  const [sort, setSort] = useState("featured");

  const categories = useMemo(
    () => ["All trades", ...new Set(catalog.map((item) => item.category))],
    []
  );

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = catalog.filter((item) => {
      const matchesCategory = category === "All trades" || category === item.category;
      const searchable = [
        item.title, item.seller, item.category, item.audience, item.description,
        ...(item.tags || []), ...(item.formats || []),
      ].join(" ").toLowerCase();
      return matchesCategory && (!q || searchable.includes(q));
    });
    return filtered.sort((a, b) => {
      const amount = (item) => typeof item.price === "number" ? item.price : Infinity;
      if (sort === "price-low") return amount(a) - amount(b);
      if (sort === "price-high") return (typeof b.price === "number" ? b.price : -1) - (typeof a.price === "number" ? a.price : -1);
      if (sort === "title") return a.title.localeCompare(b.title);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [search, category, sort]);

  const visibleResults = !search.trim() && category === "All trades" ? results.slice(0, 6) : results;

  const clearFilters = () => {
    setSearch(""); setCategory("All trades"); setSort("featured");
  };

  return (
    <>
      <section className="catalog-section" aria-labelledby="browse-heading">
        <div className="eyebrow">BROWSE DOWNLOADS</div>
        <h2 id="browse-heading">Find the right resource</h2>
        <p className="catalog-subtitle">
          Search approved downloads or narrow results by trade. We review products and referral links before publishing them.
        </p>
        <div className="catalog-controls">
          <label className="catalog-field catalog-search">
            <span>Search products</span>
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Try: estimates, invoices, junk removal…" aria-label="Search products" />
          </label>
          <label className="catalog-field">
            <span>Trade</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by trade">
              {categories.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="catalog-field">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="title">Title: A–Z</option>
            </select>
          </label>
        </div>
        <div className="catalog-count" role="status" aria-live="polite">
          Showing {visibleResults.length} of {catalog.length} available {catalog.length === 1 ? "resource" : "resources"}
        </div>
        {results.length > 0 ? (
          <div className="catalog-grid">
            {visibleResults.map((product) => (
              <article className="card catalog-product" key={product.id}>
                <div className="catalog-product-top">
                  <span className="eyebrow">{product.category}</span>
                  {product.featured && <span className="catalog-pill">Featured</span>}
                </div>
                <h3>{product.title}</h3>
                <p className="catalog-seller">By {product.seller}</p>
                <p>{product.description}</p>
                <div className="catalog-tags">
                  {(product.formats || []).map((format) => <span key={format}>{format}</span>)}
                </div>
                <div className="catalog-product-bottom">
                  <strong>{money(product.price, product.currency)}</strong>
                  <span className="small">Digital download</span>
                </div>
                <div className="catalog-actions">
                  {product.detailUrl && <a className="ghost" href={product.detailUrl}>View details</a>}
                  <a className="btn" href={product.purchaseUrl} target="_blank"
                    rel={product.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}>
                    {product.affiliate ? "View on Gumroad ↗" : "Buy from seller ↗"}
                  </a>
                </div>
                {product.affiliate && (
                  <p className="small">
                    Affiliate link: Working Trade Co. may earn a commission on qualifying purchases.
                    {product.lastVerified && ` Product details checked ${product.lastVerified}; confirm price at checkout.`}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h3>No matching resources yet</h3>
            <p>Try a different search, or check back as more approved products are added.</p>
            <button type="button" onClick={clearFilters} className="catalog-clear">Clear filters</button>
          </div>
        )}
      </section>
      <section className="catalog-section" aria-labelledby="future-heading">
        <div className="eyebrow">BROWSE BY TRADE</div>
        <h2 id="future-heading">Explore Our Categories</h2>
        <p className="catalog-subtitle">
          Choose a category to browse its available products.
        </p>
        <div className="catalog-category-list">
          {categories.filter((name) => name !== "All trades").map((name) => (
            <a
              key={name}
              className="catalog-category"
              href="#browse-heading"
              style={{ textDecoration: "none" }}
              onClick={() => { setCategory(name); setSearch(""); }}
            >
              {name}
              <small>{catalog.filter((item) => item.category === name).length} products</small>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
