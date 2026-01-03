
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
                    <Link href="/"><a>🏡　全般</a></Link>
                    <Link href="/sansu"><a>算数</a></Link>
                    <Link href="/kokugo"><a>国語</a></Link>
                    <Link href="/rika"><a>理科</a></Link>
                    <Link href="/shakai"><a>社会</a></Link>
                </nav>
            </header>
            <main className="main-content">{children}</main>
        </>
    );
};

export default Layout;
