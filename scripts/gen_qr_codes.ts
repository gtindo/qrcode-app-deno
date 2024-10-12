import * as path from "@std/path";
import * as fs from "@std/fs";

import { generateQrCode } from "../services/qr_code.ts";

const CONTENT_TO_GENERATE = [
  { name: "lib.svg", text: "A library" },
  { name: "website.svg", text: "https://gtindo.dev" },
  { name: "acronym.svg", text: "G_T_Y" },
  { name: "one_piece.svg", text: "One piece" },
  { name: "naruto.svg", text: "Naruto" },
];

async function saveFile(path: string, content: string) {
  const encoder = new TextEncoder();
  await Deno.writeFile(path, encoder.encode(content), { create: true });
}

async function main() {
  const OUTPUT_DIR_NAME = "outputs";

  // The posix file url representation of the current dir
  const currentDirUrl = path.dirname(import.meta.url);
  const outputDirUrl = `${currentDirUrl}/${OUTPUT_DIR_NAME}`;

  // create the directory if it does not exists
  await fs.ensureDir(path.fromFileUrl(outputDirUrl));

  for (const content of CONTENT_TO_GENERATE) {
    console.info(`Generating qrcode for ${content.name}`);

    const svgContent = generateQrCode(content.text);

    // Actual path on the file system of running os
    const outputPath = path.fromFileUrl(`${outputDirUrl}/${content.name}`);

    await saveFile(outputPath, svgContent);
  }

  console.info("All Done!");
}

await main();
