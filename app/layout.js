import "./globals.css";
export const metadata={title:"Working Trade Co. | Business tools for people who do the work",description:"Practical business systems for owner-operators and working trades."};
export default function RootLayout({children}){return <html lang="en"><body>
<header><div className="wrap nav"><a className="brand" href="/">WORKING TRADE CO.</a><nav className="navlinks"><a href="/junk-removal">Junk Removal</a><a href="/whats-included">What's Included</a><a href="/faq">FAQ</a><a className="btn" className="btn" href="https://iroc46.gumroad.com/l/junk-removal-starter-kit">GET THE KIT — $29</a></nav></div></header>
{children}
<footer><div className="wrap"><b>WORKING TRADE CO.</b><br/>Business tools built for people who do the work.<p>© 2026 Working Trade Co. • <a href="/legal">Legal, Privacy & License</a></p></div></footer>
</body></html>}
