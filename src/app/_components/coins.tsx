export default function Coins(props: { coins: number }) {
  const { coins } = props;

  if (coins) {
    const p = Math.floor(coins / 1000000);
    const g = Math.floor((coins % 1000000) / 10000);
    const s = Math.floor((coins % 10000) / 100);
    const c = Math.floor(coins % 100);

    return (
      <span>
        {p ? <span className="text-cyan-400">{p}p </span> : null}
        {g ? <span className="text-amber-600">{g}g </span> : null}
        {s ? <span className="text-gray-400">{s}s </span> : null}
        {c ? <span className="text-yellow-800">{c}c</span> : null}
      </span>
    );
  } else {
    return <span className="text-yellow-800">0c</span>;
  }
}
