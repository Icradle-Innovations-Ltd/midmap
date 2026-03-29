const VIEW_BOX = { width: 680, height: 520 };

const MOOD_COLORS = {
  crowded: "#ddb45f",
  heavy: "#c56f61",
  restless: "#3c8f90",
  disconnected: "#8b7f73"
};

function polarToCartesian(angle, radius, centerX, centerY) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  };
}

export default function MindMapCanvas({ mood, selections }) {
  const center = { x: VIEW_BOX.width / 2, y: VIEW_BOX.height / 2 };
  const accent = MOOD_COLORS[mood?.id] || "#c28a45";

  const nodes = selections.map((selection, index) => {
    const angle = -1.15 + index * 0.95;
    const radius = 125 + index * 45;
    const point = polarToCartesian(angle, radius, center.x, center.y);

    return {
      ...selection,
      ...point,
      parent:
        index === 0
          ? center
          : polarToCartesian(
              -1.15 + (index - 1) * 0.95,
              125 + (index - 1) * 45,
              center.x,
              center.y
            )
    };
  });

  return (
    <div className="map-shell">
      <svg
        className="mind-map"
        viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        role="img"
        aria-label="A visual map of the calming path the player has built"
      >
        <defs>
          <linearGradient id="rootGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#f5f0e7" />
          </linearGradient>
        </defs>

        <circle
          cx={center.x}
          cy={center.y}
          r="136"
          fill="rgba(255, 252, 245, 0.35)"
          stroke="rgba(255, 255, 255, 0.35)"
        />
        <circle
          cx={center.x}
          cy={center.y}
          r="82"
          fill="url(#rootGlow)"
          opacity="0.18"
        />

        {nodes.map((node, index) => (
          <g key={node.id}>
            <path
              d={`M ${node.parent.x} ${node.parent.y} C ${node.parent.x + 40} ${node.parent.y - 10}, ${node.x - 35} ${node.y + 10}, ${node.x} ${node.y}`}
              fill="none"
              stroke={accent}
              strokeOpacity={0.55 + index * 0.08}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="42"
              fill="rgba(255, 249, 238, 0.92)"
              stroke={accent}
              strokeWidth="3"
            />
            <text
              x={node.x}
              y={node.y - 3}
              textAnchor="middle"
              className="mind-map__tag"
            >
              {node.stage}
            </text>
            <text
              x={node.x}
              y={node.y + 15}
              textAnchor="middle"
              className="mind-map__label"
            >
              {node.shortLabel}
            </text>
          </g>
        ))}

        <g>
          <circle
            cx={center.x}
            cy={center.y}
            r="66"
            fill="rgba(255, 250, 242, 0.94)"
            stroke={accent}
            strokeWidth="4"
          />
          <text
            x={center.x}
            y={center.y - 6}
            textAnchor="middle"
            className="mind-map__root"
          >
            {mood?.label || "Mind Bloom"}
          </text>
          <text
            x={center.x}
            y={center.y + 18}
            textAnchor="middle"
            className="mind-map__root-caption"
          >
            calm path
          </text>
        </g>
      </svg>
    </div>
  );
}
