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

// --- キャッシュ用変数 ---
let cachedAllPosts: any[] | null = null;

/** 
 * 全記事取得（公開済みのみ）
 * キャッシュを使って Notion API の呼び出しを減らす
 */
export const getAllPosts = async () => {
    // すでにキャッシュがあればそれを返す
    if (cachedAllPosts) {
        return cachedAllPosts;
    }

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

    // メタデータに変換
    const posts = (response.results as PageObjectResponse[]).map(getPageMetaData);

    // キャッシュに保存
    cachedAllPosts = posts;

    return posts;
};

// --- slug ごとのキャッシュ ---
const cachedSinglePosts: Record<string, any> = {};

/**
 * 個別記事取得（Slug指定）
 * キャッシュを使って Notion API の呼び出しを減らす
 */
export const getSinglePost = async (slug: string) => {
    // キャッシュがあれば返す
    if (cachedSinglePosts[slug]) {
        return cachedSinglePosts[slug];
    }

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

    // ISR のため、本文は取得しない
    const result = { metadata };

    cachedSinglePosts[slug] = result;
    return result;
};

/**
 * ページ内の全ブロック取得（子要素も再帰的に取得）
 * 深さ制限を入れて API 呼び出し爆発を防ぐ
 */
export const getPageBlocks = async (
    blockId: string,
    depth: number = 0,
    maxDepth: number = 3
): Promise<BlockObjectResponse[]> => {
    // 深さ制限に達したら子を取得しない
    if (depth > maxDepth) {
        return [];
    }

    const response = await notion.blocks.children.list({
        block_id: blockId,
    });

    const blocks = response.results as BlockObjectResponse[];

    return await Promise.all(
        blocks.map(async (block: any) => {
            if (block.has_children) {
                const type = block.type;

                // 次の階層を取得（深さ +1）
                const children = await getPageBlocks(block.id, depth + 1, maxDepth);

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
    const allPosts = await getAllPosts(); // キャッシュ済み
    return allPosts.slice(0, pagesize);
};

/**
 * ページ番号指定による取得（ページネーション用）
 */
export const getPostsByPage = async (page: number) => {
    const allPosts = await getAllPosts(); // キャッシュ済み
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
};

/**
 * 総ページ数の算出
 */
export const getNumberOfPages = async () => {
    const allPosts = await getAllPosts(); // キャッシュ済み
    return Math.ceil(allPosts.length / POSTS_PER_PAGE);
};

/**
 * タグ・ページ指定による取得（地名検索などに利用）
 */
export const getPostsByTagAndPage = async (tagName: string, page: number) => {
    const allPosts = await getAllPosts(); // キャッシュ済み
    const filteredPosts = allPosts.filter((post) =>
        post.tags.includes(tagName)
    );

    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
};

/**
 * 特定タグの総ページ数算出
 */
export const getNumberOfPagesByTag = async (tagName: string) => {
    const allPosts = await getAllPosts(); // キャッシュ済み
    const count = allPosts.filter((post) => post.tags.includes(tagName)).length;
    return Math.ceil(count / POSTS_PER_PAGE);
};

/**
 * 全タグ一覧の取得（重複排除）
 */
export const getAllTags = async () => {
    const allPosts = await getAllPosts(); // キャッシュ済み
    const allTags = allPosts.flatMap((post) => post.tags);
    return Array.from(new Set(allTags));
};
