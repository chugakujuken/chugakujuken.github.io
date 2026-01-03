
import Layout from '../../components/Layout';
import JapanMap from '../../components/JapanMap';
import Head from 'next/head';

const ChiriPage = () => {
    return (
        <Layout>
            <Head>
                <script src="https://unpkg.com/japan-map-js@1.0.1/dist/jpmap.min.js"></script>
                <script src="https://cdn.jsdelivr.net/gh/ka215/svg-japan@main/dist/svg-japan.min.js"></script>
            </Head>
            <h2>都道府県マップ練習</h2>
            <p>Japan-Map-JSライブラリを使用したインタラクティブな地図で都道府県を学びましょう。</p>
            <JapanMap />
        </Layout>
    );
};

export default ChiriPage;
