document.addEventListener("DOMContentLoaded", function () {
    // Define the vertices of the triangle
    const base = 8;
    const height = 6;

    const vertices = [
        { x: 0, y: 0, name: 'A' },
        { x: base, y: 0, name: 'B' },
        { x: base / 2, y: height, name: 'C' }
    ];

    // Create a trace for the triangle's outline
    const triangleTrace = {
        x: [vertices[0].x, vertices[1].x, vertices[2].x, vertices[0].x],
        y: [vertices[0].y, vertices[1].y, vertices[2].y, vertices[0].y],
        mode: 'lines+markers+text',
        name: 'Triangle',
        line: {
            color: 'blue',
            width: 2
        },
        marker: {
            size: 8,
            color: 'red'
        },
        text: [vertices[0].name, vertices[1].name, vertices[2].name, ''],
        textposition: 'top center',
        textfont: {
            family: 'sans-serif',
            size: 14,
            color: 'red'
        }
    };

    // Create a trace for the base line
    const baseLineTrace = {
        x: [0, base],
        y: [0, 0],
        mode: 'lines',
        name: 'Base',
        line: {
            color: 'green',
            width: 3
        },
        showlegend: false
    };

    // Create a trace for the height line (dashed)
    const heightLineTrace = {
        x: [base / 2, base / 2],
        y: [0, height],
        mode: 'lines',
        name: 'Height',
        line: {
            color: 'purple',
            width: 2,
            dash: 'dash'
        },
        showlegend: false
    };

    const data = [triangleTrace, baseLineTrace, heightLineTrace];

    const layout = {
        title: '三角形の面積の可視化 (底辺: ' + base + ', 高さ: ' + height + ')',
        xaxis: {
            range: [-1, base + 1],
            zeroline: true,
            showgrid: true
        },
        yaxis: {
            range: [-1, height + 1],
            zeroline: true,
            showgrid: true,
            scaleanchor: "x",
            scaleratio: 1,
        },
        annotations: [
            {
                x: base / 2,
                y: height / 2,
                xref: 'x',
                yref: 'y',
                text: '面積: ' + (0.5 * base * height),
                showarrow: false,
                font: {
                    size: 16,
                    color: 'darkgreen'
                }
            }
        ]
    };

    Plotly.newPlot('geometryPlot', data, layout);
});
