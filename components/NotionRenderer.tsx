import React from "react";

export const NotionRenderer = ({ blocks }: any) => {
  // --- 1. テキスト装飾（改行・太字・リンクなど）の処理 ---
  const renderRichText = (richText: any) => {
    if (!richText) return null;

    return richText.map((text: any, idx: number) => {
      const { annotations, plain_text, text: textContent } = text;
      const href = textContent?.link?.url;

      const classes = [
        annotations?.bold ? "font-bold" : "",
        annotations?.italic ? "italic" : "",
        annotations?.code
          ? "bg-gray-100 rounded px-1 font-mono text-sm text-red-500"
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      const style: React.CSSProperties = {};
      if (annotations?.color !== "default") {
        style.color = annotations.color;
      }

      const decorations = [];
      if (annotations?.strikethrough) decorations.push("line-through");
      if (annotations?.underline) decorations.push("underline");

      if (decorations.length > 0) {
        style.textDecoration = decorations.join(" ");
        style.display = "inline-block";
      }

      // --- 改行文字 (\n) を <br /> に変換して表示 ---
      const content = (
        <span key={idx} className={classes} style={style}>
          {plain_text.split("\n").map((line: string, i: number) => (
            <React.Fragment key={i}>
              {line}
              {i !== plain_text.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );

      if (href) {
        return (
          <a
            key={idx}
            href={href}
            className={`text-blue-600 underline hover:opacity-70 ${classes}`}
            style={style}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content} {/* aタグの中も改行対応したcontentを入れる */}
          </a>
        );
      }

      return content;
    });
  };

  // --- 2. ブロックごとの描画処理 ---
  const renderBlock = (block: any): any => {
    switch (block.type) {
      case "heading_1":
        return (
          <h1 key={block.id} className="notion-h1">
            {renderRichText(block.heading_1.rich_text)}
          </h1>
        );
      case "heading_2":
        return (
          <h2 key={block.id} className="notion-h2">
            {renderRichText(block.heading_2.rich_text)}
          </h2>
        );
      case "heading_3":
        return (
          <h3 key={block.id} className="notion-h3">
            {renderRichText(block.heading_3.rich_text)}
          </h3>
        );

      case "paragraph":
        const texts = block.paragraph.rich_text;
        return (
          <p key={block.id} className={texts.length === 0 ? "my-0" : "mb-4"}>
            {texts.length === 0 ? "\u00A0" : renderRichText(texts)}
          </p>
        );

      case "bulleted_list_item":
        return (
          <ul key={block.id} className="list-disc list-inside my-2 ml-4">
            <li>{renderRichText(block.bulleted_list_item.rich_text)}</li>
          </ul>
        );

      case "numbered_list_item":
        return (
          <ol key={block.id} className="list-decimal list-inside my-2 ml-4">
            <li>{renderRichText(block.numbered_list_item.rich_text)}</li>
          </ol>
        );

      case "callout": {
        const { icon, rich_text } = block.callout;
        return (
          <div
            key={block.id}
            className="flex gap-4 p-4 my-6 bg-[#f1f1ef] rounded-lg items-start"
          >
            {icon && (
              <div className="text-xl flex-shrink-0 leading-none">
                {icon.type === "emoji" ? (
                  icon.emoji
                ) : icon.external?.url || icon.file?.url ? (
                  <img
                    src={icon.external?.url || icon.file?.url}
                    alt=""
                    className="w-6 h-6"
                  />
                ) : null}
              </div>
            )}
            <div className="flex-1 leading-relaxed text-gray-800">
              {renderRichText(rich_text)}
            </div>
          </div>
        );
      }

      case "image":
        const src =
          block.image.type === "external"
            ? block.image.external.url
            : block.image.file.url;
        return (
          <div key={block.id} className="my-6">
            <img
              src={src}
              alt=""
              className="w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        );

      case "embed":
        const embedUrl = block.embed?.url;
        if (!embedUrl) return null;
        return (
          <div
            key={block.id}
            className="my-6 w-full overflow-hidden rounded-lg shadow-sm"
            style={{ aspectRatio: "16 / 9" }}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        );

      case "divider":
        return <hr key={block.id} className="my-8 border-t border-gray-200" />;

      case "column_list":
        return (
          <div
            key={block.id}
            className="flex flex-col md:flex-row gap-4 my-6 w-full"
          >
            {block.column_list.children?.map((child: any) =>
              renderBlock(child),
            )}
          </div>
        );

      case "column":
        return (
          <div key={block.id} className="flex-1 w-full">
            {block.column.children?.map((child: any) => renderBlock(child))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="notion-content">
      {blocks.map((block: any) => renderBlock(block))}
    </div>
  );
};
