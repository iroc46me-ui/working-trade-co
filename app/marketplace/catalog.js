// Step 3: The catalog consists of our own product and explicitly approved
// partner listings imported through scripts/import-approved-products.mjs.
// NEVER add paid third-party files here; Gumroad remains the checkout host.
import approvedProducts from "./approved-products.json";

const ownProducts = [
  {
    id: "junk-removal-starter-kit",
    title: "Junk Removal Starter Operator Kit",
    seller: "Working Trade Co.",
    category: "Junk Removal",
    audience: "Owner-operators and small hauling businesses",
    description:
      "An office-in-a-box bundle with printable forms, editable documents, pricing tools, expense tracking, and customer message scripts.",
    price: 29,
    currency: "USD",
    formats: ["PDF", "Editable files"],
    tags: ["junk hauling", "estimates", "job costing", "invoices", "business forms"],
    detailUrl: "/junk-removal",
    purchaseUrl: "https://iroc46.gumroad.com/l/junk-removal-starter-kit",
    affiliate: false,
    featured: true,
  },
];

// The importer requires admin-entered approval flags and checks link format.
// Those flags DO NOT independently verify rights, consent, or affiliate status.
// This guard also keeps drafts out of the public catalog if JSON is edited.
export const catalog = [
  ...ownProducts,
  ...approvedProducts.filter((item) => item.status === "approved" && item.reviewed === true && item.affiliateVerified === true && item.descriptionAuthorized === true),
];

export const plannedCategories = [
  "Construction & Contracting",
  "Woodworking & DIY",
  "Welding & Fabrication",
  "Trucking & Transport",
  "Automotive & Equipment",
  "Landscaping",
  "Cleaning & Maintenance",
  "Small Business",
];
