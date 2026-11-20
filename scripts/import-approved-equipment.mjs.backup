
import fs from "node:fs";
import path from "node:path";

const output = path.join(
  process.cwd(),
  "app",
  "tools-equipment",
  "approved-products.json"
);

const required = [
  "id", "title", "seller", "category",
  "description", "purchase_url", "status",
  "reviewed", "affiliate_verified",
  "description_authorized"
];

const yes = (v) =>
  ["yes", "true", "1"].includes(
    String(v ?? "").trim().toLowerCase()
  );

function parseCsv(source) {
  const rows = [];
  let row = [], field = "", quoted = false;

  for (let i = 0; i < source.length; i++) {
    const c = source[i];

    if (quoted) {
      if (c === '"' && source[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') {
      if (field) throw Error("Invalid CSV quote");
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }

  if (quoted) throw Error("Unclosed CSV quote");
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter(r => r.some(v => v.trim()));
}

function validateUrl(value) {
  const url = new URL(value);

  if (url.protocol !== "https:")
    throw Error("HTTPS required");

  if (url.username || url.password)
    throw Error("URL credentials not permitted");

  const host = url.hostname.toLowerCase();

  const allowed =
    host === "ebay.com" ||
    host.endsWith(".ebay.com") ||
    host === "ebay.us" ||
    host === "www.ebay.us";

  if (!allowed)
    throw Error("Only eBay links permitted");

  return url.toString();
}

function main() {
  const file = process.argv[2];
  if (!file) throw Error("Provide an approved CSV path");

  if (fs.statSync(file).size > 5 * 1024 * 1024)
    throw Error("CSV exceeds 5 MB");

  const rows = parseCsv(
    fs.readFileSync(file, "utf8")
      .replace(/^\uFEFF/, "")
  );

  if (!rows.length) throw Error("Empty CSV");

  const headers = rows.shift().map(v => v.trim());

  if (new Set(headers).size !== headers.length)
    throw Error("Duplicate CSV headers");

  for (const field of required)
    if (!headers.includes(field))
      throw Error(`Missing column: ${field}`);

  const prior = JSON.parse(fs.readFileSync(output, "utf8"));

  if (!Array.isArray(prior))
    throw Error("Catalog must be an array");

  const products = new Map(prior.map(p => [p.id, p]));
  const seen = new Set();

  let updated = 0, withdrawn = 0, pending = 0;

  for (const [index, row] of rows.entries()) {
    if (row.length !== headers.length)
      throw Error(`Row ${index + 2}: invalid column count`);

    const r = Object.fromEntries(
      headers.map((h, i) => [h, row[i].trim()])
    );

    const id = r.id;
    const status = r.status.toLowerCase();

    if (!/^[a-z0-9][a-z0-9_-]*$/.test(id))
      throw Error(`Row ${index + 2}: invalid ID`);

    if (seen.has(id))
      throw Error(`Duplicate ID: ${id}`);

    seen.add(id);

    if (!["approved", "pending", "withdrawn"].includes(status))
      throw Error(`Invalid status: ${status}`);

    if (status === "withdrawn") {
      if (products.delete(id)) withdrawn++;
      continue;
    }

    if (status === "pending") {
      if (products.delete(id)) withdrawn++;
      pending++;
      continue;
    }

    if (
      !yes(r.reviewed) ||
      !yes(r.affiliate_verified) ||
      !yes(r.description_authorized)
    ) throw Error(`Approval missing: ${id}`);

    for (const field of [
      "title", "seller", "category", "description"
    ]) {
      if (!r[field])
        throw Error(`Missing ${field}: ${id}`);
    }

    const purchaseUrl = validateUrl(r.purchase_url);

    const price = r.price ? Number(r.price) : null;

    if (
      price !== null &&
      (!Number.isFinite(price) || price < 0 || price > 1000000)
    ) throw Error(`Invalid price: ${id}`);

    products.set(id, {
      id,
      title: r.title,
      seller: r.seller,
      category: r.category,
      description: r.description,
      price,
      currency: r.currency || "USD",
      purchaseUrl,
      affiliate: true,
      source: "ebay",
      status: "approved",
      reviewed: true,
      affiliateVerified: true,
      descriptionAuthorized: true,
      lastVerified: r.last_verified || ""
    });

    updated++;
  }

  const temp = output + ".tmp";

  fs.writeFileSync(
    temp,
    JSON.stringify([...products.values()], null, 2) + "\n",
    "utf8"
  );

  fs.renameSync(temp, output);

  console.log(
    `Imported/updated: ${updated}; withdrawn: ${withdrawn}; pending: ${pending}; total: ${products.size}`
  );
}

try {
  main();
} catch (error) {
  console.error("Equipment import failed:", error.message);
  process.exitCode = 1;
}
