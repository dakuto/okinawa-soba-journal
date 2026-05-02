/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ryukyu: {
          // ベース：生成り色（全体背景）
          washi: "#FDF8ED",

          // メイン：朱色・琉球レッド（ボタン、強調）
          coral: "#EE7800",
          "coral-dark": "#C06000",

          // アクセント：琉球ブルー（見出し、カツオ出汁関連）
          "deep-sea": "#005C82",
          "deep-sea-light": "#E0F0F8",

          // テキスト：温かみのあるグレー
          text: "#333333",
          "text-light": "#666666",

          // ボーダー/区切り線
          border: "#EAE0C9",
        },
      }, // ← ここが colors の閉じ
    },
  },
  plugins: [],
};
