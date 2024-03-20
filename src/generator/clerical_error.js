

import * as fs from "fs";
import { patchDocument, PatchType, TextRun } from "docx";

export async function generate() {

    patchDocument(fs.readFileSync("D:\\Electron Vite\\LCRO\\src\\generator\\demo\\assets\\simple-template-2.docx"), {
        outputType: "nodebuffer",
        patches: {
            name: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun("Ralph")],
            },
        },
    }).then((doc) => {
        fs.writeFileSync("output.docx", doc);
    });

}
