
import Layout from '../../components/Layout';
import KouminCard from '../../components/KouminCard';

const KouminPage = () => {
    return (
        <Layout>
            <h2>公民：用語暗記</h2>
            <p>基本用語のカードで暗記します。学習モードでは用語を隠して定義だけを出題します。</p>
            <KouminCard />
        </Layout>
    );
};

export default KouminPage;
