
import Layout from '../../components/Layout';
import HistoryTimeline from '../../components/HistoryTimeline';

const RekishiPage = () => {
    return (
        <Layout>
            <h2>歴史 年表（暗記用）</h2>
            <p>主要な歴史イベントを年代順に並べ、学習モード（フラッシュカード）で暗記を支援します。</p>
            <HistoryTimeline />
        </Layout>
    );
};

export default RekishiPage;
