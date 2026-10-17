import type { NextApiRequest, NextApiResponse } from "next";
import { getPageBlocks } from "../../lib/notionAPI";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid id" });
    }

    try {
        const blocks = await getPageBlocks(id);
        return res.status(200).json({ blocks });
    } catch (error) {
        console.error("Error fetching page blocks:", error);
        return res.status(500).json({ error: "Failed to fetch blocks" });
    }
}
