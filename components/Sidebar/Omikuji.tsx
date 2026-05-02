import React, { useState } from "react";
import Link from "next/link";

// おみくじの結果で使う色の定義
const COLORS = [
  { name: "赤", code: "#ef4444", text: "white" },
  { name: "青", code: "#3b82f6", text: "white" },
  { name: "黄", code: "#facc15", text: "#333" },
  { name: "緑", code: "#22c55e", text: "white" },
  { name: "白", code: "#ffffff", text: "#333" }, // 背景と同化しないよう工夫が必要
  { name: "黒", code: "#1a1a1a", text: "white" },
  { name: "金", code: "#d4af37", text: "white" },
  { name: "紫", code: "#a855f7", text: "white" },
];

interface OmikujiProps {
  posts: any[];
}

const Omikuji: React.FC<OmikujiProps> = ({ posts }) => {
  const [result, setResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const drawOmikuji = () => {
    if (!posts || posts.length === 0) return;

    setIsSpinning(true);

    // 演出のために少し遅延させる
    setTimeout(() => {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      const luckArray = ["大吉", "吉", "中吉", "小吉", "末吉", "凶"];
      const randomLuck =
        luckArray[Math.floor(Math.random() * luckArray.length)];
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      setResult({
        luck: randomLuck,
        color: randomColor,
        shopName: randomPost.title,
        slug: randomPost.slug, // リンク用にslugを追加
        area: randomPost.tags[0] || "沖縄県内",
      });
      setIsSpinning(false);
    }, 800);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-t-8 border-ryukyu-coral text-center relative overflow-hidden">
      <h3 className="font-bold border-b-2 border-ryukyu-deep-sea pb-2 mb-4 text-ryukyu-deep-sea flex items-center font-serif">
        <span className="mr-2">🥢</span> そばおみくじ
      </h3>

      <div className="min-h-[220px] flex flex-col justify-center">
        {isSpinning ? (
          <div className="py-8 text-ryukyu-coral animate-bounce font-bold font-serif">
            ちむどんどん中...
          </div>
        ) : result ? (
          <div className="animate-in fade-in zoom-in duration-500">
            {/* 結果カード：ラッキーカラーが背景になる部分 */}
            <div
              className="rounded-lg p-4 mb-4 shadow-md border border-ryukyu-border/50"
              style={{
                backgroundColor: result.color.code,
                color: result.color.text,
                // 白色の時に境界線が消えないよう、薄いグレーの枠線を強制
                boxShadow:
                  result.color.name === "白"
                    ? "inset 0 0 0 1px #e2e8f0"
                    : "none",
              }}
            >
              <div className="text-5xl font-black mb-1 font-serif">
                {result.luck}
              </div>
              <div className="text-xs mb-2 opacity-90">
                ラッキーカラー：{result.color.name}
              </div>
              <hr className="border-current opacity-30 my-2 border-dashed" />

              <div className="text-sm font-bold mb-1">今日のおすすめ店</div>

              {/* ✅ 店舗詳細へのリンク */}
              <Link href={`/posts/${result.slug}`} className="block group">
                <div className="text-xl font-bold leading-tight underline decoration-current/30 underline-offset-4 group-hover:opacity-80 transition-opacity">
                  {result.shopName}
                </div>
                <div className="text-xs mt-2 opacity-90">📍 {result.area}</div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-10">
            {/* 余白を活かしつつ、文字の存在感をアップ */}
            <p className="text-lg font-bold text-ryukyu-deep-sea font-serif leading-relaxed tracking-wider">
              今日の<span className="text-ryukyu-coral">運勢</span>と
              <br />
              おすすめの<span className="text-ryukyu-coral">一杯</span>を
              <br />
              占う
            </p>
          </div>
        )}
      </div>

      <button
        onClick={drawOmikuji}
        disabled={isSpinning}
        className={`w-full py-3 rounded-md font-bold shadow-md transition-all active:scale-95 ${
          isSpinning
            ? "bg-slate-300 cursor-not-allowed text-slate-500"
            : "bg-ryukyu-deep-sea text-white hover:bg-ryukyu-coral"
        }`}
      >
        {isSpinning ? "占っています..." : result ? "もう一度占う" : "占う"}
      </button>
    </div>
  );
};

export default Omikuji;
