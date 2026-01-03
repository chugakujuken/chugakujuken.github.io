
import React, { useState, useEffect } from 'react';

const initialData = [
    {term:'主権',def:'国の政治上の最高の権力。国民が主権を持つ。'},
    {term:'代議制',def:'国民が選んだ代表者が政治を行う制度。'},
    {term:'三権分立',def:'立法・行政・司法が互いに抑制と均衡を保つ仕組み。'},
    {term:'基本的人権',def:'すべての人に保障される基本的な権利。'}
];

const KouminCard = () => {
    const [cards, setCards] = useState(initialData);
    const [mode, setMode] = useState('normal'); // normal, study, quiz
    const [quizIndex, setQuizIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const shuffle = (a) => {
        const newArr = [...a];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const startQuiz = () => {
        setMode('quiz');
        setCards(shuffle(initialData));
        setQuizIndex(0);
        setShowAnswer(false);
    };

    const nextQuiz = () => {
        if (quizIndex < cards.length - 1) {
            setQuizIndex(quizIndex + 1);
            setShowAnswer(false);
        } else {
            setMode('normal');
        }
    };
    
    const renderCards = () => {
        switch (mode) {
            case 'study':
                return cards.map((item, i) => (
                    <div className="card" key={i}>
                        <div className="term">{item.term}</div>
                        <button style={{ marginTop: '8px' }} onClick={(e) => {
                            const nextEl = e.target.nextElementSibling;
                            nextEl.style.display = nextEl.style.display === 'none' ? 'block' : 'none';
                        }}>定義を表示</button>
                        <div className='def' style={{ display: 'none', marginTop: '8px' }}>{item.def}</div>
                    </div>
                ));
            case 'quiz':
                const currentCard = cards[quizIndex];
                return (
                    <div className='card'>
                        <div style={{ fontWeight: 700 }}>{currentCard.def}</div>
                        {showAnswer && <div style={{ marginTop: '10px' }}>{currentCard.term}</div>}
                        <div style={{ marginTop: '8px' }}>
                            <button onClick={() => setShowAnswer(true)}>答えを見る</button>
                            <button onClick={nextQuiz} style={{ marginLeft: '8px' }}>次へ</button>
                        </div>
                    </div>
                );
            default:
                return cards.map((item, i) => (
                    <div className="card" key={i}>
                        <div className="term">{item.term}</div>
                        <div className="def">{item.def}</div>
                    </div>
                ));
        }
    };

    return (
        <div>
            <div className="controls">
                <button onClick={() => setMode('study')}>学習モード</button>
                <button onClick={startQuiz}>クイズ（ランダム）</button>
                <button onClick={() => setCards(shuffle(cards))}>シャッフル</button>
            </div>
            <div id="cards">
                {renderCards()}
            </div>
        </div>
    );
};

export default KouminCard;
