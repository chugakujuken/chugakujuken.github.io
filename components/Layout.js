
import Link from 'next/link';

const Layout = ({ children }) => {
    return (
        <>
            <header className="header">
                <div className="header-top">
                    <div className="logo">
                        <h1>中学受験</h1>
                    </div>
                </div>
                <nav className="main-nav">
                    <Link href="/">🏡　全般</Link>
                    <Link href="/sansu">算数</Link>
                    <Link href="/kokugo">国語</Link>
                    <Link href="/rika">理科</Link>
                    <Link href="/shakai">社会</Link>
                </nav>
            </header>
            <main className="main-content">{children}</main>
        </>
    );
};

export default Layout;
