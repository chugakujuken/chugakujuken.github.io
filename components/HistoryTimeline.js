
import React, { useState, useEffect } from 'react';

const initialEvents = [
    {label:'縄文', sub:'縄文時代 (~300 BC)', desc:'土器・狩猟採集・竪穴住居'},
    {label:'弥生', sub:'弥生時代 (~3世紀)', desc:'稲作伝来・金属器の使用開始'},
    {label:'古墳', sub:'古墳時代 (3~7世紀)', desc:'大規模古墳・ヤマト政権の成立'},
    {label:'飛鳥/奈良', sub:'飛鳥〜奈良 (7~8世紀)', desc:'律令国家の整備・仏教の広がり'},
    {label:'平安', sub:'平安時代 (9~12世紀)', desc:'国風文化の成熟'},
    {label:'鎌倉', sub:'鎌倉時代 (12~14世紀)', desc:'武士政権の成立'},
    {label:'室町/戦国', sub:'室町〜戦国 (14~16世紀)', desc:'戦国大名の台頭'},
    {label:'安土桃山', sub:'安土桃山 (16世紀)', desc:'織豊政権・天下統一の動き'},
    {label:'江戸', sub:'江戸時代 (17~19世紀)', desc:'鎖国・武士の支配・元禄文化'},
    {label:'明治', sub:'明治維新 (1868〜)', desc:'近代化・中央集権化・富国強兵'},
    {label:'大正/昭和', sub:'大正〜昭和前期', desc:'大正デモクラシー・戦争と変動'},
    {label:'現代', sub:'昭和後期〜平成〜令和', desc:'高度経済成長と現代社会の形成'}
];

const HistoryTimeline = () => {
    const [events, setEvents] = useState(initialEvents);
    const [learningMode, setLearningMode] = useState(false);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        setEvents(newArray);
    };

    const toggleCard = (e) => {
        const card = e.currentTarget;
        const back = card.querySelector('.card-back');
        back.style.display = back.style.display === 'none' ? 'block' : 'none';
    };

    return (
        <div>
            <div className="controls">
                <button onClick={() => setLearningMode(!learningMode)} style={{ background: '#2176d2', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    学習モード: {learningMode ? 'オン' : 'オフ'}
                </button>
                <button onClick={() => shuffleArray(events)} style={{ background: '#eee', border: '1px solid #ddd', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                    シャッフル
                </button>
            </div>

            <div className="timeline-wrap">
                <div id="timeline" className="timeline">
                    <ul id="timeline-list" className="timeline-list">
                        {events.map((ev, index) => (
                            <li key={index}>
                                <div className="label">{ev.label}</div>
                                <div className="sub">{ev.sub}</div>
                            </li>
                        ))}
                    </ul>
                    <div id="timeline-cards" className="timeline-cards">
                        {events.map((ev, index) => (
                            <div key={index} className="tl-card" onClick={learningMode ? toggleCard : undefined} style={learningMode ? { cursor: 'pointer' } : {}}>
                                {learningMode ? (
                                    <>
                                        <strong className="card-front">{ev.label}</strong>
                                        <div className="card-back" style={{ display: 'none', marginTop: '6px', fontSize: '13px', color: '#444' }}>
                                            {ev.sub}<br />{ev.desc}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <strong>{ev.label} — {ev.sub}</strong>
                                        <div style={{ fontSize: '13px', marginTop: '6px', color: '#444' }}>{ev.desc}</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>編集: ページ内の <code>events</code> 配列を更新してください。</div>
            </div>
        </div>
    );
};

export default HistoryTimeline;
