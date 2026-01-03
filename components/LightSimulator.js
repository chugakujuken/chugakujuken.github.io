
import React, { useRef, useEffect, useState } from 'react';

const LightSimulator = () => {
    const reflectionCanvasRef = useRef(null);
    const refractionCanvasRef = useRef(null);

    const [reflectionAngle, setReflectionAngle] = useState(45);
    const [refractionAngle, setRefractionAngle] = useState(45);
    const [medium, setMedium] = useState('water');
    const [refractedAngleValue, setRefractedAngleValue] = useState(0);

    useEffect(() => {
        const canvas = reflectionCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const mirrorX = canvas.width / 2;
        const mirrorY = canvas.height / 2;
        const mirrorLength = 200;

        function drawMirror() {
            ctx.beginPath();
            ctx.moveTo(mirrorX - mirrorLength / 2, mirrorY);
            ctx.lineTo(mirrorX + mirrorLength / 2, mirrorY);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(mirrorX, mirrorY);
            ctx.lineTo(mirrorX, mirrorY - 40);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('垂線', mirrorX + 5, mirrorY - 25);
        }

        function drawLightRays(angle) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMirror();
            const radians = angle * Math.PI / 180;
            const rayLength = 100;
            const incidentStartX = mirrorX - rayLength * Math.sin(radians);
            const incidentStartY = mirrorY - rayLength * Math.cos(radians);
            ctx.beginPath();
            ctx.moveTo(incidentStartX, incidentStartY);
            ctx.lineTo(mirrorX, mirrorY);
            ctx.strokeStyle = '#FFD700'; // Yellow for incident ray
            ctx.lineWidth = 2;
            ctx.stroke();
            drawArrow(incidentStartX, incidentStartY, mirrorX, mirrorY, ctx.strokeStyle);
            ctx.beginPath();
            ctx.moveTo(mirrorX, mirrorY);
            ctx.lineTo(mirrorX + rayLength * Math.sin(radians), mirrorY - rayLength * Math.cos(radians));
            ctx.strokeStyle = '#FF6347'; // Red for reflected ray
            ctx.lineWidth = 2;
            ctx.stroke();
            drawArrow(mirrorX, mirrorY, mirrorX + rayLength * Math.sin(radians), mirrorY - rayLength * Math.cos(radians), ctx.strokeStyle);
            ctx.beginPath();
            ctx.arc(incidentStartX, incidentStartY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700';
            ctx.fill();
            ctx.strokeStyle = '#CCAA00';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('入射光', incidentStartX + 10, incidentStartY - 10);
            ctx.fillText('反射光', mirrorX + rayLength * Math.sin(radians) + 5, mirrorY - rayLength * Math.cos(radians) - 10);
            drawAngleArc(mirrorX, mirrorY, angle, 'incident');
            drawAngleArc(mirrorX, mirrorY, angle, 'reflected');
        }

        function drawArrow(fromX, fromY, toX, toY, color) {
            const headLength = 8;
            const dx = toX - fromX;
            const dy = toY - fromY;
            const angle = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.moveTo(toX, toY);
            ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        function drawAngleArc(centerX, centerY, angle, type) {
            const radius = 30;
            const startAngle = type === 'incident' ? Math.PI - (angle * Math.PI / 180) : Math.PI;
            const endAngle = type === 'incident' ? Math.PI : Math.PI + (angle * Math.PI / 180);
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle, type === 'reflected');
            ctx.strokeStyle = type === 'incident' ? '#FFD700' : '#FF6347';
            ctx.lineWidth = 1;
            ctx.stroke();
            if (type === 'incident') {
                ctx.fillStyle = '#FFD700';
                ctx.fillText(angle + '°', centerX - radius / 2 - 10, centerY - radius / 2);
            } else {
                ctx.fillStyle = '#FF6347';
                ctx.fillText(angle + '°', centerX + radius / 2 - 5, centerY - radius / 2);
            }
        }

        drawLightRays(reflectionAngle);

    }, [reflectionAngle]);

    useEffect(() => {
        const canvas = refractionCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const refractionIndices = { 'air': 1.00, 'water': 1.33, 'glass': 1.50, 'diamond': 2.42 };

        function drawRefraction() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const incidentAngle = refractionAngle;
            const selectedMedium = medium;
            const n1 = refractionIndices['air'];
            const n2 = refractionIndices[selectedMedium];
            const incidentAngleRad = incidentAngle * Math.PI / 180;
            const refractedAngleRad = Math.asin((n1 / n2) * Math.sin(incidentAngleRad));
            const refractedAngle = refractedAngleRad * 180 / Math.PI;
            setRefractedAngleValue(refractedAngle.toFixed(1));
            const interfaceY = canvas.height / 2;
            ctx.beginPath();
            ctx.moveTo(0, interfaceY);
            ctx.lineTo(canvas.width, interfaceY);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.fillText('空気', 20, 30);
            ctx.fillText(selectedMedium === 'water' ? '水' : selectedMedium === 'glass' ? 'ガラス' : 'ダイヤモンド', 20, canvas.height - 20);
            const normalX = canvas.width / 2;
            ctx.beginPath();
            ctx.moveTo(normalX, interfaceY - 50);
            ctx.lineTo(normalX, interfaceY + 50);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('垂線', normalX + 5, interfaceY - 35);
            const incidentStartX = normalX - 100 * Math.sin(incidentAngleRad);
            const incidentStartY = interfaceY - 100 * Math.cos(incidentAngleRad);
            ctx.beginPath();
            ctx.moveTo(incidentStartX, incidentStartY);
            ctx.lineTo(normalX, interfaceY);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
            drawArrowForRefraction(incidentStartX, incidentStartY, normalX, interfaceY, '#FFD700');
            ctx.beginPath();
            ctx.moveTo(normalX, interfaceY);
            ctx.lineTo(normalX + 100 * Math.sin(refractedAngleRad), interfaceY + 100 * Math.cos(refractedAngleRad));
            ctx.strokeStyle = '#1E90FF';
            ctx.lineWidth = 2;
            ctx.stroke();
            drawArrowForRefraction(normalX, interfaceY, normalX + 100 * Math.sin(refractedAngleRad), interfaceY + 100 * Math.cos(refractedAngleRad), '#1E90FF');
            ctx.beginPath();
            ctx.arc(incidentStartX, incidentStartY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700';
            ctx.fill();
            ctx.strokeStyle = '#CCAA00';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('入射光', incidentStartX - 30, incidentStartY - 10);
            ctx.fillText('屈折光', normalX + 100 * Math.sin(refractedAngleRad) + 5, interfaceY + 100 * Math.cos(refractedAngleRad) + 15);
            drawAngleArcForRefraction(normalX, interfaceY, incidentAngle, 'incident', '#FFD700');
            drawAngleArcForRefraction(normalX, interfaceY, Math.abs(refractedAngle), 'refracted', '#1E90FF');
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.fillText(`屈折率: ${n2}`, canvas.width - 100, 20);
        }

        function drawArrowForRefraction(fromX, fromY, toX, toY, color) {
            const headLength = 8;
            const dx = toX - fromX;
            const dy = toY - fromY;
            const angle = Math.atan2(dy, dx);
            const ctx = refractionCanvasRef.current.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(toX, toY);
            ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        function drawAngleArcForRefraction(centerX, centerY, angle, type, color) {
            const radius = 30;
            const ctx = refractionCanvasRef.current.getContext('2d');
            ctx.beginPath();

            if (type === 'incident') {
                const startAngle = Math.PI - (angle * Math.PI / 180);
                const endAngle = Math.PI;
                ctx.arc(centerX, centerY, radius, startAngle, endAngle, true);
            } else {
                const startAngle = Math.PI;
                const endAngle = Math.PI + (angle * Math.PI / 180);
                ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();

            if (type === 'incident') {
                ctx.fillStyle = color;
                ctx.fillText(angle + '°', centerX - radius / 2 - 10, centerY - radius / 2);
            } else {
                ctx.fillStyle = color;
                ctx.fillText(angle.toFixed(1) + '°', centerX + radius / 2 - 5, centerY + radius / 2 + 5);
            }
        }
        drawRefraction();

    }, [refractionAngle, medium]);

    return (
        <div>
            {/* Light Reflection Simulator */}
            <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                <h4>光の反射シミュレーター</h4>
                <p>以下のシミュレーターを使って、光の入射角と反射角の関係を確認してみましょう。</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <canvas ref={reflectionCanvasRef} width="400" height="300" style={{ border: '1px solid #ccc', backgroundColor: 'white', display: 'block', margin: '10px 0' }}></canvas>
                        <div style={{ margin: '10px 0' }}>
                            <label htmlFor="angleControl">入射角（度）: <span>{reflectionAngle}</span>°</label>
                            <input type="range" id="angleControl" min="10" max="80" value={reflectionAngle} step="1" style={{ width: '100%' }} onChange={e => setReflectionAngle(parseInt(e.target.value))} />
                        </div>
                        <button onClick={() => setReflectionAngle(45)} style={{ padding: '8px 15px', background: '#2185d0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>リセット</button>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h5>説明</h5>
                        <p>このシミュレーターでは、光源（黄色の点）からの光が鏡（灰色の線）に当たり、反射する様子を見ることができます。</p>
                        <p><strong>入射角 = 反射角</strong>の法則を確認してください。</p>
                        <ul>
                            <li>入射角（入ってくる角度）: <span>{reflectionAngle}</span>°</li>
                            <li>反射角（跳ね返る角度）: <span>{reflectionAngle}</span>°</li>
                        </ul>
                        <p>スライダーを動かして、入射角を変えてみてください。反射角が同じになることを確認しましょう。</p>
                    </div>
                </div>
            </div>

            {/* Light Refraction Simulator */}
            <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                <h4>光の屈折シミュレーター</h4>
                <p>以下のシミュレーターを使って、光が空気から水やガラスに入ったときの屈折の様子を確認してみましょう。</p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <canvas ref={refractionCanvasRef} width="400" height="300" style={{ border: '1px solid #ccc', backgroundColor: 'white', display: 'block', margin: '10px 0' }}></canvas>
                        <div style={{ margin: '10px 0' }}>
                            <label htmlFor="mediumSelect">媒質の選択:</label>
                            <select id="mediumSelect" style={{ padding: '5px', margin: '0 10px' }} value={medium} onChange={e => setMedium(e.target.value)}>
                                <option value="water">水</option>
                                <option value="glass">ガラス</option>
                                <option value="diamond">ダイヤモンド</option>
                            </select>
                            <label htmlFor="refractionAngleControl">入射角（度）: <span>{refractionAngle}</span>°</label>
                            <input type="range" id="refractionAngleControl" min="10" max="80" value={refractionAngle} step="1" style={{ width: '100%', marginTop: '5px' }} onChange={e => setRefractionAngle(parseInt(e.target.value))} />
                        </div>
                        <button onClick={() => { setRefractionAngle(45); setMedium('water'); }} style={{ marginTop: '10px', padding: '8px 15px', background: '#2185d0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>リセット</button>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h5>説明</h5>
                        <p>このシミュレーターでは、光が空気から別の媒質（水、ガラス、ダイヤモンド）に入るときの屈折を確認できます。</p>
                        <p><strong>屈折の法則：</strong>光は媒質の境界で進行方向を変えます。</p>
                        <ul>
                            <li>入射角（空気中）: <span>{refractionAngle}</span>°</li>
                            <li>屈折角（媒質中）: <span>{refractedAngleValue}</span>°</li>
                        </ul>
                        <p>スライダーを動かして入射角を変えたり、媒質を変えてみて、屈折の様子を確認しましょう。</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LightSimulator;
