
import React, { useState, useEffect } from 'react';

const exams = [
    { date: '2026-01-10', school: '栄東中学校', details: 'Ⅰ入試 (9:20-12:30)', applicationPeriod: '12/1-1/7' },
    { date: '2026-01-10', school: '大宮開成中学校', details: '第1回 (8:30-12:25 or 9:30-13:25)', note: '2025年情報', applicationPeriod: '12/1-1/8' },
    { date: '2026-01-11', school: '栄東中学校', details: 'Ⅱ入試 (9:20-12:30)', applicationPeriod: '12/1-1/7' },
    { date: '2026-01-12', school: '栄東中学校', details: '東大特待 (4科: 9:20-13:05 / 算数: 9:20-11:15)', applicationPeriod: '12/1-1/11' },
    { date: '2026-01-12', school: '大宮開成中学校', details: '特待生選抜 (8:30-12:25 or 9:30-13:25)', note: '2025年情報', applicationPeriod: '12/1-1/11' },
    { date: '2026-01-14', school: '大宮開成中学校', details: '第2回 (8:30-12:25 or 9:30-13:25)', note: '2025年情報', applicationPeriod: '12/1-1/13' },
    { date: '2026-01-16', school: '栄東中学校', details: 'Ⅲ入試 (9:20-12:30)', applicationPeriod: '12/1-1/15' },
    { date: '2026-02-01', school: '本郷中学校', details: '第1回 (8:20-12:20)', applicationPeriod: '1/10-1/31' },
    { date: '2026-02-01', school: '城北中学校', details: '第1回 (8:40-12:25)', note: '2025年情報', applicationPeriod: '1/10-1/30' },
    { date: '2026-02-02', school: '本郷中学校', details: '第2回 (8:20-12:20)', applicationPeriod: '1/10-2/1' },
    { date: '2026-02-02', school: '城北中学校', details: '第2回 (8:40-12:25)', note: '2025年情報', applicationPeriod: '1/10-2/1' },
    { date: '2026-02-04', school: '城北中学校', details: '第3回 (8:40-12:25)', note: '2025年情報', applicationPeriod: '1/10-2/3' },
    { date: '2026-02-05', school: '本郷中学校', details: '第3回 (8:20-12:20)', applicationPeriod: '1/10-2/4' },
];

const schools = [
    { name: '本郷中学校', deviation: '52-60', website: 'https://www.hongo.ed.jp/admission/exam/', location: '東京都豊島区駒込4-11-1' },
    { name: '城北中学校', deviation: '63', website: 'https://www.johoku.ac.jp/admission/exam_info_jhs/', location: '東京都板橋区東新町2-28-1' },
    { name: '栄東中学校', deviation: '51-59', website: 'https://www.sakaehigashi.ed.jp/exam/j_examination.html', location: '埼玉県さいたま市見沼区砂町2-77' },
    { name: '大宮開成中学校', deviation: '55', website: 'https://www.omiyakaisei.jp/jshs/entrance/', location: '埼玉県さいたま市大宮区堀の内町1-615' },
];

const ExamCalendar = () => {
    const [filteredExams, setFilteredExams] = useState(exams);
    const [sortedExamDates, setSortedExamDates] = useState([]);
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        const examDates = [...new Set(filteredExams.map(e => e.date))].sort();
        setSortedExamDates(examDates);
    }, [filteredExams]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortTable = () => {
        const sorted = [...sortedExamDates].sort((a, b) => {
            if (sortAsc) {
                return new Date(a) - new Date(b);
            } else {
                return new Date(b) - new Date(a);
            }
        });
        setSortedExamDates(sorted);
        setSortAsc(!sortAsc);
    };

    const filterTable = (e) => {
        const filterValue = e.target.value;
        if (filterValue === 'all') {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter(e => e.school === filterValue);
            setFilteredExams(filtered);
        }
    };

    const renderHead = () => (
        <tr>
            <th onClick={sortTable}>試験日</th>
            {schools.map(school => {
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(school.location)}&travelmode=transit&transit_mode=${encodeURIComponent('bus|rail')}`;
                const pinSvg = <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>;
                return (
                    <th key={school.name}>
                        <a href={school.website} target="_blank" rel="noopener noreferrer">{school.name}</a>{' '}
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="map-icon" title="経路を表示">{pinSvg}</a>
                    </th>
                );
            })}
        </tr>
    );

    const renderBody = () => {
        const datesToRender = [...new Set(filteredExams.map(e => e.date))].sort();
        return datesToRender.map(dateStr => {
            const date = new Date(dateStr);
            const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
            const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
            const isPast = date.getTime() < today.getTime();
            const isToday = date.getTime() === today.getTime();

            const diffTime = date - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(diffDays / 7);
            const days = diffDays % 7;
            const examCount = filteredExams.filter(e => e.date === dateStr).length;

            return (
                <tr key={dateStr} className={`${isWeekend ? 'weekend' : ''} ${isPast ? 'past' : ''} ${isToday ? 'today' : ''}`}>
                    <td>
                        {dateStr.replace('2026-', '')} ({dayOfWeek})
                        {!isPast && <><br /><span className="countdown">あと{weeks}週{days}日</span></>}
                        <br />
                        <span className="exam-count">{examCount}件</span>
                    </td>
                    {schools.map(school => {
                        const schoolExams = filteredExams.filter(e => e.date === dateStr && e.school === school.name);
                        return (
                            <td key={school.name}>
                                {schoolExams.length > 0 ? (
                                    schoolExams.map((e, i) => (
                                        <React.Fragment key={i}>
                                            {e.details}<br />出願:{e.applicationPeriod}
                                            {e.note && <><br /><span className="note">{e.note}</span></>}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    '-'
                                )}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    };

    return (
        <div>
            <h2 className="section-title">2026年 中学受験カレンダー</h2>
            <div className="filter-container">
                <label htmlFor="school-filter">学校で絞り込み:</label>
                <select id="school-filter" onChange={filterTable}>
                    <option value="all">すべての学校</option>
                    {schools.map(school => <option key={school.name} value={school.name}>{school.name}</option>)}
                </select>
            </div>
            <table className="calendar-table">
                <thead>{renderHead()}</thead>
                <tbody>{renderBody()}</tbody>
            </table>
        </div>
    );
};

export default ExamCalendar;
