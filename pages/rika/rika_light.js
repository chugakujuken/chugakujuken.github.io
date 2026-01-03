
import Layout from '../../components/Layout';

import LightSimulator from '../../components/LightSimulator';

import Link from 'next/link';



const RikaLightPage = () => {

    return (

        <Layout>

            <h2 className="section-title">光（ひかり）— 光の性質と反射・屈折</h2>

            <p>光は私たちの生活に欠かせないもので、物を見るために必要不可欠なものです。光にはさまざまな性質がありますが、ここでは「反射」と「屈折」について学びましょう。</p>



            <h3>光の基本的な性質</h3>

            <ul>

                <li>光は直進する（屈折や反射をしない場合）</li>

                <li>光は物体に当たると反射する</li>

                <li>光は透明な物体を通ることができる（一部は透過する）</li>

                <li>光は白色光は赤、橙、黄、緑、青、藍、紫の7色からできている</li>

            </ul>



            <h3>光の反射の法則</h3>

            <p>光が鏡などのような滑らかな面に当たって反射するとき、入射角と反射角が等しくなります。これは「反射の法則」と呼ばれます。</p>

            <ul>

                <li><strong>入射角：</strong>光が物体に当たる角度（垂直線に対する角度）</li>

                <li><strong>反射角：</strong>光が反射する角度（垂直線に対する角度）</li>

                <li><strong>反射の法則：</strong>入射角 = 反射角</li>

            </ul>



            <h3>光の反射の例</h3>

            <ul>

                <li>鏡に映る自分自身</li>

                <li>水面に写る空や木々</li>

                <li>ツルツルに磨かれた金属の表面に映るもの</li>

            </ul>



            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderLeft: '4px solid #2185d0' }}>

                <h4>身の回りの光の反射</h4>

                <p>平面鏡、凹面鏡、凸面鏡など、さまざまな形の鏡があります。それぞれの鏡では、光の反射によって異なる像が見えます。例えば、自動車のバックミラーは凸面鏡で、後方の広い範囲を見渡せるようにしています。</p>

            </div>



            <LightSimulator />



            <h3 style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>光の屈折</h3>

            <p>屈折とは、光が異なる媒質（例えば空気から水やガラスなど）に入るときに進行方向が変わる現象です。これは光の速度が媒質によって異なるため起こります。</p>



            <h4>屈折の法則（スネルの法則）</h4>

            <p>屈折の法則は、入射角と屈折角の間に成り立つ関係を表しています。空気から水などの媒質に入る場合、入射角が大きいほど屈折角も大きくなります。</p>

            <ul>

                <li><strong>入射角：</strong>光が境界面に入る角度（垂直線に対する角度）</li>

                <li><strong>屈折角：</strong>光が境界面内で進む角度（垂直線に対する角度）</li>

                <li><strong>屈折の法則：</strong>空気から水に光が入るとき、屈折角は入射角より小さくなる</li>

            </ul>



            <h4>光の屈折の例</h4>

            <ul>

                <li>水中に見えるストローが曲がって見える</li>

                <li>メガネや虫めがねでの像の拡大</li>

                <li>プリズムで光が色に分かれること</li>

                <li>虹の形成</li>

            </ul>



            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderLeft: '4px solid #2185d0' }}>

                <h4>身の回りの光の屈折</h4>

                <p>メガネ、カメラ、双眼鏡など、私たちの身の回りには屈折の原理を利用した道具がたくさんあります。また、水中で物が実際とは違う位置に見えるのも屈折によるものです。</p>

            </div>



            <div style={{ marginTop: '30px', textAlign: 'center' }}>

                <Link href="/rika"><a style={{ display: 'inline-block', padding: '10px 20px', background: '#2185d0', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>理科のページに戻る</a></Link>

            </div>

        </Layout>

    );

};



export default RikaLightPage;


