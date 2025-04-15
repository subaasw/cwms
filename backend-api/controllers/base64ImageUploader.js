import fs from "fs/promises";
import path from "path";

export const saveBase64Image = async (base64String) => {
  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return {
        success: false,
        error: "Invalid image data",
      };
    }

    const fileType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${
      fileType.split("/")[1]
    }`;

    const uploadPath = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadPath, { recursive: true });
    await fs.writeFile(path.join(uploadPath, filename), buffer);

    return {
      success: true,
      filename,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save image",
    };
  }
};
