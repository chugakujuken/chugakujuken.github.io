
import React, { useState, useEffect, useRef } from 'react';

const prefectureDetails = {
    '北海道': { capital: '札幌市', region: '北海道地方' }, '青森県': { capital: '青森市', region: '東北地方' },
    '岩手県': { capital: '盛岡市', region: '東北地方' }, '宮城県': { capital: '仙台市', region: '東北地方' },
    '秋田県': { capital: '秋田市', region: '東北地方' }, '山形県': { capital: '山形市', region: '東北地方' },
    '福島県': { capital: '福島市', region: '東北地方' }, '茨城県': { capital: '水戸市', region: '関東地方' },
    '栃木県': { capital: '宇都宮市', region: '関東地方' }, '群馬県': { capital: '前橋市', region: '関東地方' },
    '埼玉県': { capital: 'さいたま市', region: '関東地方' }, '千葉県': { capital: '千葉市', region: '関東地方' },
    '東京都': { capital: '新宿区', region: '関東地方' }, '神奈川県': { capital: '横浜市', region: '関東地方' },
    '新潟県': { capital: '新潟市', region: '中部地方' }, '富山県': { capital: '富山市', region: '中部地方' },
    '石川県': { capital: '金沢市', region: '中部地方' }, '福井県': { capital: '福井市', region: '中部地方' },
    '山梨県': { capital: '甲府市', region: '中部地方' }, '長野県': { capital: '長野市', region: '中部地方' },
    '岐阜県': { capital: '岐阜市', region: '中部地方' }, '静岡県': { capital: '静岡市', region: '中部地方' },
    '愛知県': { capital: '名古屋市', region: '中部地方' }, '三重県': { capital: '津市', region: '近畿地方' },
    '滋賀県': { capital: '大津市', region: '近畿地方' }, '京都府': { capital: '京都市', region: '近畿地方' },
    '大阪府': { capital: '大阪市', region: '近畿地方' }, '兵庫県': { capital: '神戸市', region: '近畿地方' },
    '奈良県': { capital: '奈良市', region: '近畿地方' }, '和歌山県': { capital: '和歌山市', region: '近畿地方' },
    '鳥取県': { capital: '鳥取市', region: '中国地方' }, '島根県': { capital: '松江市', region: '中国地方' },
    '岡山県': { capital: '岡山市', region: '中国地方' }, '広島県': { capital: '広島市', region: '中国地方' },
    '山口県': { capital: '山口市', region: '中国地方' }, '徳島県': { capital: '徳島市', region: '四国地方' },
    '香川県': { capital: '高松市', region: '四国地方' }, '愛媛県': { capital: '松山市', region: '四国地方' },
    '高知県': { capital: '高知市', region: '四国地方' }, '福岡県': { capital: '福岡市', region: '九州地方' },
    '佐賀県': { capital: '佐賀市', region: '九州地方' }, '長崎県': { capital: '長崎市', region: '九州地方' },
    '熊本県': { capital: '熊本市', region: '九州地方' }, '大分県': { capital: '大分市', region: '九州地方' },
    '宮崎県': { capital: '宮崎市', region: '九州地方' }, '鹿児島県': { capital: '鹿児島市', region: '九州地方' },
    '沖縄県': { capital: '那覇市', region: '九州地方' }
};

const prefectures = Object.keys(prefectureDetails);
const prefCodes = {};
prefectures.forEach((name, i) => { prefCodes[name] = i + 1; });

const JapanMap = () => {
    const mapRef = useRef(null);
    const [prompt, setPrompt] = useState('準備完了');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [quizMode, setQuizMode] = useState('learning');
    const [running, setRunning] = useState(false);
    const [order, setOrder] = useState(prefectures.slice());
    const [current, setCurrent] = useState(null);

    const shuffle = (a) => {
        const newArr = [...a];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const drawMap = (regions) => {
        if (mapRef.current) {
            mapRef.current.innerHTML = '';
            window.svgJapan({
                element: "#japan-map",
                regions: regions,
                on: {
                    click: function (prefecture) {
                        const selectedPrefecture = prefecture.name;
                        if (quizMode === 'learning') {
                            const details = prefectureDetails[selectedPrefecture];
                            setPrompt(<><strong>{selectedPrefecture}</strong><br />県庁所在地: {details.capital}<br />地方: {details.region}</>);
                            drawMap([{ code: prefCodes[selectedPrefecture], color: '#3498db' }]);
                            setTimeout(() => drawMap(), 1000);
                            return;
                        }
                        if (!running) {
                            setFeedback('クイズを開始してください。');
                            return;
                        }
                        handleQuizAnswer(selectedPrefecture);
                    }
                }
            });
        }
    };
    
    useEffect(() => {
        if(window.svgJapan) {
            drawMap();
        }
    }, []);

    const handleQuizAnswer = (selectedPrefecture) => {
        let isCorrect = false;
        let correctAnswer = '';

        if (quizMode === 'prefecture') {
            isCorrect = (selectedPrefecture === current);
            correctAnswer = current;
        } else if (quizMode === 'capital') {
            const correctCapital = prefectureDetails[current].capital;
            isCorrect = (prefectureDetails[selectedPrefecture].capital === correctCapital);
            correctAnswer = `${current} (県庁所在地: ${correctCapital})`;
        } else if (quizMode === 'region') {
            const correctRegion = prefectureDetails[current].region;
            isCorrect = (prefectureDetails[selectedPrefecture].region === correctRegion);
            correctAnswer = `${current} (地方: ${correctRegion})`;
        }

        if (isCorrect) {
            setFeedback('正解！');
            setScore(s => s + 1);
            drawMap([{ code: prefCodes[selectedPrefecture], color: '#2ecc71' }]);
        } else {
            setFeedback(`不正解！正解は: ${correctAnswer}`);
            drawMap([
                { code: prefCodes[selectedPrefecture], color: '#e74c3c' },
                { code: prefCodes[current], color: '#2ecc71' }
            ]);
        }
        setTotal(t => t + 1);
        setTimeout(() => {
            drawMap();
            setFeedback('');
            nextQuiz();
        }, 1500);
    };

    const nextQuiz = () => {
        if (order.length === 0) {
            setPrompt('クイズ完了！');
            setRunning(false);
            return;
        }
        const newOrder = [...order];
        const next = newOrder.shift();
        setOrder(newOrder);
        setCurrent(next);

        if (quizMode === 'prefecture') {
            setPrompt(`選択: ${next}`);
        } else if (quizMode === 'capital') {
            setPrompt(`${next} の県庁所在地はどこ？`);
        } else if (quizMode === 'region') {
            setPrompt(`${next} はどの地方？`);
        }
    };

    const startQuiz = (type) => {
        setRunning(true);
        setQuizMode(type);
        setScore(0);
        setTotal(0);
        const shuffledOrder = shuffle(prefectures.slice());
        setOrder(shuffledOrder);
        const first = shuffledOrder.shift();
        setOrder(shuffledOrder);
        setCurrent(first);
        if (type === 'prefecture') {
            setPrompt(`選択: ${first}`);
        } else if (type === 'capital') {
            setPrompt(`${first} の県庁所在地はどこ？`);
        } else if (type === 'region') {
            setPrompt(`${first} はどの地方？`);
        }
        drawMap();
    };

    return (
        <div>
            <div className="controls">
                <button onClick={() => startQuiz('prefecture')}>都道府県クイズ開始</button>
                <button onClick={() => startQuiz('capital')}>県庁所在地クイズ開始</button>
                <button onClick={() => startQuiz('region')}>地方クイズ開始</button>
                <button onClick={() => { setRunning(false); setQuizMode('learning'); setPrompt('学習モード: 都道府県をクリックして情報を表示'); }}>学習モード</button>
                <button onClick={() => { setRunning(false); setPrompt('停止中'); }}>停止</button>
                <button onClick={() => setOrder(shuffle(order))}>シャッフル</button>
                <button onClick={() => {
                    if (running && current) {
                        let answerText = '';
                        if (quizMode === 'prefecture') answerText = current;
                        else if (quizMode === 'capital') answerText = prefectureDetails[current].capital;
                        else if (quizMode === 'region') answerText = prefectureDetails[current].region;
                        setFeedback(`答え: ${answerText}`);
                        drawMap([{ code: prefCodes[current], color: '#2ecc71' }]);
                        setTimeout(() => drawMap(), 1500);
                    }
                }}>答えを見る</button>
            </div>
            <div className="map-and-panel">
                <div style={{ flex: 1 }}>
                    <div id="japan-map" ref={mapRef} className="japan-map-container"></div>
                </div>
                <div className="panel">
                    <div style={{ background: '#fafafa', border: '1px solid #eee', padding: '12px', borderRadius: '8px' }}>
                        <h3>{prompt}</h3>
                        <div style={{ height: '36px' }}>{feedback}</div>
                        <div className="hint">正答数: <span>{score}</span> / <span>{total}</span></div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                        {quizMode !== 'learning' && 'クイズ: 地図上の都道府県をクリックして答えてください。右下の一覧からも選べます。'}
                    </div>
                    <hr style={{ margin: '12px 0' }} />
                    <div style={{ maxHeight: '360px', overflow: 'auto' }}>
                        <div className="map-grid">
                            {prefectures.map(name => (
                                <button key={name} className="pref" onClick={() => {
                                    if(quizMode === 'learning') {
                                        const details = prefectureDetails[name];
                                        setPrompt(<><strong>{name}</strong><br />県庁所在地: {details.capital}<br />地方: {details.region}</>);
                                        drawMap([{ code: prefCodes[name], color: '#3498db' }]);
                                        setTimeout(() => drawMap(), 1000);
                                    } else {
                                        if (!running) {
                                            setFeedback('クイズを開始してください。');
                                            return;
                                        }
                                        handleQuizAnswer(name)
                                    }
                                }}>{name}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JapanMap;
