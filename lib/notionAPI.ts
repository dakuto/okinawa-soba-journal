import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { POSTS_PER_PAGE } from "../constants/constants";
// Notion SDKから必要な型をインポート
import {
    PageObjectResponse,
    BlockObjectResponse,
    QueryDatabaseResponse
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const n2m = new NotionToMarkdown({
    notionClient: notion,
    config: {
        nestedList: true,
    },
});

/**
 * CloudinaryのURLに最適化パラメータを挿入する関数
 */
const optimizeCloudinaryUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    // URLの /upload/ の直後に f_auto (形式最適化), q_auto (画質最適化) を挿入
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
};

/**
 * ページオブジェクトからメタデータを安全に抽出する内部関数
 */
const getPageMetaData = (post: PageObjectResponse) => {
    const props = post.properties;

    // 各プロパティをNotionの型に合わせて安全にキャスト
    const titleProp = props.Name as { type: "title"; title: Array<{ plain_text: string }> };
    const descProp = props.Description as { type: "rich_text"; rich_text: Array<{ plain_text: string }> };
    const dateProp = props.Date as { type: "date"; date: { start: string } | null };
    const slugProp = props.Slug as { type: "rich_text"; rich_text: Array<{ plain_text: string }> };
    const tagsProp = props.Tags as { type: "multi_select"; multi_select: Array<{ name: string }> };

    // --- 追加・修正箇所 ---
    const externalThumbProp = props.ExternalThumbnail as { type: "url"; url: string | null };
    const thumbProp = props.Thumbnail as any;

    // サムネイルURLの抽出（Cloudinaryを最優先）
    let thumbnailUrl = "/images/no-image.png";

    if (externalThumbProp?.url) {
        // 1. ExternalThumbnail列にURLがあれば、それを最適化して使用
        thumbnailUrl = optimizeCloudinaryUrl(externalThumbProp.url);
    } else if (thumbProp?.files?.length > 0) {
        // 2. なければ、従来のThumbnail列（Notion内部）を使用
        const fileData = thumbProp.files[0];
        const url = fileData.file?.url || fileData.external?.url;
        if (url) thumbnailUrl = url;
    }
    // -----------------------

    return {
        id: post.id,
        title: titleProp?.title[0]?.plain_text || "無題",
        description: descProp?.rich_text[0]?.plain_text || "",
        date: dateProp?.date?.start || "",
        slug: slugProp?.rich_text[0]?.plain_text || "",
        tags: tagsProp?.multi_select.map((tag) => tag.name) || [],
        thumbnail: thumbnailUrl,
    };
};

/**
 * 全記事取得（公開済みのみ）
 */
export const getAllPosts = async () => {
    if (!process.env.NOTION_DATABASE_ID) return [];

    const response: QueryDatabaseResponse = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        page_size: 100,
        filter: {
            property: "Published",
            checkbox: { equals: true },
        },
        sorts: [{ property: "Date", direction: "descending" }],
    });

    return (response.results as PageObjectResponse[]).map(getPageMetaData);
};

/**
 * 個別記事取得（Slug指定）
 */
export const getSinglePost = async (slug: string) => {
    if (!process.env.NOTION_DATABASE_ID) return null;

    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            property: "Slug",
            rich_text: { equals: slug },
        },
    });

    const page = response.results[0] as PageObjectResponse;
    if (!page) return null;

    const metadata = getPageMetaData(page);
    const blocks = await getPageBlocks(page.id);
    const mdBlocks = await n2m.blocksToMarkdown(blocks);
    let mdString = n2m.toMarkdownString(mdBlocks).parent || "";

    // --- ここを追加：本文中のCloudinary URLを最適化 ---
    // 文中の "https://res.cloudinary.com/.../upload/..." を探して 
    // "/upload/f_auto,q_auto/" に書き換えます
    mdString = mdString.replace(
        /https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\//g,
        (match) => match + "f_auto,q_auto/"
    );
    // ----------------------------------------------
    return {
        metadata,
        markdown: mdString,
    };
};

/**
 * ページ内の全ブロック取得（子要素も再帰的に取得）
 */
export const getPageBlocks = async (pageId: string): Promise<BlockObjectResponse[]> => {
    const response = await notion.blocks.children.list({ block_id: pageId });
    const blocks = response.results as BlockObjectResponse[];

    return await Promise.all(
        blocks.map(async (block: any) => {
            if (block.has_children) {
                const children = await getPageBlocks(block.id);
                const type = block.type;
                if (block[type]) {
                    block[type].children = children;
                }
            }
            return block;
        })
    );
};

/**
 * トップページ用（最新4件）
 */
export const getPostForTopPage = async (pagesize = 4) => {
    const allPosts = await getAllPosts();
    return allPosts.slice(0, pagesize);
};

/**
 * ページ番号指定による取得（ページネーション用）
 */
export const getPostsByPage = async (page: number) => {
    const allPosts = await getAllPosts();
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
};

/**
 * 総ページ数の算出
 */
export const getNumberOfPages = async () => {
    const allPosts = await getAllPosts();
    return Math.ceil(allPosts.length / POSTS_PER_PAGE);
};

/**
 * タグ・ページ指定による取得（地名検索などに利用）
 */
export const getPostsByTagAndPage = async (tagName: string, page: number) => {
    const allPosts = await getAllPosts();
    const filteredPosts = allPosts.filter((post) => post.tags.includes(tagName));
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
};

/**
 * 特定タグの総ページ数算出
 */
export const getNumberOfPagesByTag = async (tagName: string) => {
    const allPosts = await getAllPosts();
    const count = allPosts.filter((post) => post.tags.includes(tagName)).length;
    return Math.ceil(count / POSTS_PER_PAGE);
};

/**
 * 全タグ一覧の取得（重複排除）
 */
export const getAllTags = async () => {
    const allPosts = await getAllPosts();
    const allTags = allPosts.flatMap((post) => post.tags);
    return Array.from(new Set(allTags));
};