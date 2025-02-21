import fs from "node:fs/promises";
import { z } from "zod";

const ListSchema = z.array(
  z.object({
    description: z.string(),
    logoURL: z.string().url(),
    longName: z.string(),
    name: z.string(),
    repo: z.string().url(),
    website: z.string().url(),
  })
);

const headerFileContent = await fs.readFile("header.md", "utf-8");
const list = await fs
  .readFile("list.json", "utf-8")
  .then(JSON.parse)
  .then(ListSchema.parse);

let finalContent = `
${headerFileContent}
`;

for (const item of list) {
  finalContent += `
<!-- ${item.name} -->
   <section>
      <a href="${item.website}">
         <img src="${item.logoURL}" alt="${item.name}" width="32" height="32" />
      </a>
      <div>
         <span>${item.longName} (<a href="${item.website}">${item.website}</a>)</span>
         <p>
         ${item.description}
         </p>
      </div>
   </section>
   <br/>
   `;
}

fs.writeFile("README.md", finalContent);

console.log("Done.");
