import { formatBigNumber } from "@/lib/utils";

export default function Coins(props: {
  coins: number;
  income?: number;
  expenses?: number;
}) {
  const { coins, income, expenses } = props;
  let withSign = false;
  if (income !== undefined && expenses !== undefined) {
    withSign = true;
  }

  if (coins) {
    const p = Math.floor(coins / 1000000);
    const g = Math.floor((coins % 1000000) / 10000);
    const s = Math.floor((coins % 10000) / 100);
    const c = Math.floor(coins % 100);

    return (
      <span>
        {withSign && (
          <span
            className={expenses! > income! ? "text-red-600" : "text-green-600"}
          >
            {expenses! > income! ? "- " : "+ "}
          </span>
        )}
        {p ? (
          <span className="text-cyan-400">{formatBigNumber(p)}p </span>
        ) : null}
        {g ? <span className="text-amber-600">{g}g </span> : null}
        {s ? <span className="text-gray-400">{s}s </span> : null}
        {c ? <span className="text-yellow-800">{c}c</span> : null}
      </span>
    );
  } else {
    return <span className="text-yellow-800">0c</span>;
  }
}
