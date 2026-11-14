export default function sitemap() {
  const baseUrl = "https://www.workingtradeco.com";

  const pages = [
    "",
    "/about",
    "/faq",
    "/free-tools",
    "/how-it-works",
    "/junk-removal",
    "/legal",
    "/marketplace",
    "/tools-equipment",
    "/whats-included",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    changeFrequency: "weekly",
    priority: page === "" ? 1 : 0.8,
  }));
}
