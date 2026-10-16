/**
 * Import explicitly reviewed Gumroad affiliate listings from a creator/approved
 * data feed. Not a Gumroad crawler or a network integration. Node 18+.
 * Usage: node scripts/import-approved-products.mjs templates/approved-products.csv
 * Writes app/marketplace/approved-products.json only after validating all rows.
 */
import fs from "node:fs";
import path from "node:path";

const outPath = path.join(process.cwd(), "app", "marketplace", "approved-products.json");
const requiredFields = [
  "id", "title", "seller", "category", "description", "purchase_url",
  "status", "reviewed", "affiliate_verified", "description_authorized",
];
const allowedStatuses = new Set(["approved", "pending", "withdrawn"]);
const isYes = (v) => ["true", "yes", "1"].includes((v ?? "").trim().toLowerCase());
const str = (v, limit = 500) => (v || "").trim().slice(0, limit);

function parseCsv(src) {
  const rows = []; let row = []; let field = ""; let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') {
      if (field) throw new Error("Unexpected quote in CSV field");
      quoted = true;
    } else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (quoted) throw new Error("Unterminated quoted CSV field");
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim()));
}

function validateAffiliateUrl(text) {
  let url;
  try { url = new URL(text); } catch { throw new Error("Invalid purchase_url"); }
  if (url.protocol !== "https:") throw new Error("Only HTTPS Gumroad affiliate links are permitted");
  const host = url.hostname.toLowerCase();
  if (host !== "gumroad.com" && !host.endsWith(".gumroad.com")) {
    throw new Error("purchase_url must be on Gumroad (direct seller domains need separate review)");
  }
  const hasAffiliatePath = /^\/a\/[^/]+/.test(url.pathname);
  // Gumroad's current Discover affiliate-link generator uses ?a=<numeric ID>.
  // Gumroad also documents sticky affiliate URLs with ?affiliate_id=...
  // and older /a/<numeric ID> links. A valid-looking link does not itself
  // establish that the seller/product is commission-eligible.
  const hasStickyAffiliateId = /^\d+$/.test(url.searchParams.get("affiliate_id") || "");
  const hasDiscoverAffiliateId = /^\d+$/.test(url.searchParams.get("a") || "")
    && /^\/(?:l|discover)(?:\/|$)/.test(url.pathname);
  if (!hasAffiliatePath && !hasStickyAffiliateId && !hasDiscoverAffiliateId) {
    throw new Error("Not a recognized Gumroad affiliate link");
  }
  if (url.username || url.password) throw new Error("Credentials are not allowed in purchase_url");
  return url.toString();
}

function processRow(r, n) {
  const status = str(r.status).toLowerCase();
  if (!allowedStatuses.has(status)) throw new Error(`Row ${n}: status must be approved, pending, or withdrawn`);
  const id = str(r.id, 120);
  if (!/^[a-z0-9][a-z0-9-_]*$/.test(id) || id === "junk-removal-starter-kit") {
    throw new Error(`Row ${n}: invalid or reserved id`);
  }
  if (status !== "approved") return { status, id };
  const requiredFlags = ["reviewed", "affiliate_verified", "description_authorized"];
  if (!requiredFlags.every((f) => isYes(r[f]))) {
    throw new Error(`Row ${n}: approval flags are required for published products`);
  }
  for (const field of ["title", "seller", "category", "description"]) {
    if (!str(r[field])) throw new Error(`Row ${n}: missing ${field}`);
  }
  const price = str(r.price) === "" ? null : Number(r.price);
  if (price !== null && (!Number.isFinite(price) || price < 0 || price > 1000000)) {
    throw new Error(`Row ${n}: invalid price`);
  }
  const currency = str(r.currency || "USD", 3).toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error(`Row ${n}: invalid currency`);
  const date = str(r.last_verified, 10);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Row ${n}: last_verified must be YYYY-MM-DD`);
  return {
    id,
    title: str(r.title, 160),
    seller: str(r.seller, 100),
    category: str(r.category, 90),
    audience: str(r.audience, 180),
    description: str(r.description, 600),
    price,
    currency,
    formats: str(r.formats, 200).split("|").map((s) => s.trim()).filter(Boolean),
    tags: str(r.tags, 300).split("|").map((s) => s.trim()).filter(Boolean),
    purchaseUrl: validateAffiliateUrl(r.purchase_url),
    affiliate: true,
    status: "approved",
    reviewed: true,
    affiliateVerified: true,
    descriptionAuthorized: true,
    featured: isYes(r.featured),
    source: str(r.source || "gumroad", 40),
    lastVerified: date,
  };
}

function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Provide a path to a reviewed CSV file");
  const stat = fs.statSync(file);
  if (stat.size > 5 * 1024 * 1024) throw new Error("CSV exceeds 5 MB; split into batches");
  const rows = parseCsv(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  if (!rows.length) throw new Error("CSV file is empty");
  const headers = rows.shift().map((v) => v.trim());
  if (new Set(headers).size !== headers.length) throw new Error("Duplicate CSV columns");
  for (const field of requiredFields) if (!headers.includes(field)) throw new Error(`Missing CSV column: ${field}`);
  if (rows.length > 10000) throw new Error("Too many rows per import");
  const prior = JSON.parse(fs.readFileSync(outPath, "utf8"));
  if (!Array.isArray(prior)) throw new Error("Approved-products file must be an array");
  const items = new Map(prior.map((p) => [p.id, p]));
  const seen = new Set(); let added = 0; let removed = 0; let pending = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length !== headers.length) throw new Error(`Row ${i + 2}: wrong number of CSV columns`);
    const data = Object.fromEntries(headers.map((h, k) => [h, rows[i][k]]));
    const item = processRow(data, i + 2);
    if (seen.has(item.id)) throw new Error(`Row ${i + 2}: duplicate id in this import`);
    seen.add(item.id);
    if (item.status === "pending") { if (items.delete(item.id)) removed++; pending++; continue; }
    if (item.status === "withdrawn") { if (items.delete(item.id)) removed++; continue; }
    items.set(item.id, item); added++;
  }
  // Write atomically; original output remains unchanged on validation failures.
  const temp = outPath + ".tmp";
  fs.writeFileSync(temp, JSON.stringify([...items.values()], null, 2) + "\n", "utf8");
  fs.renameSync(temp, outPath);
  process.stdout.write(`Imported/updated: ${added}; withdrawn: ${removed}; pending skipped: ${pending}. Approved external listings now: ${items.size}.\n`);
}
try { main(); } catch (err) { process.stderr.write(`Import failed: ${err.message}\n`); process.exitCode = 1; }
