import fs from "node:fs";

const files = [
  ".output/package.json",
  ".output/server/package.json"
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`${file} は存在しません`);
    continue;
  }

  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));

  pkg.engines = {
    node: "22"
  };

  fs.writeFileSync(file, JSON.stringify(pkg, null, 2));

  console.log(`${file} を Node 22 に変更しました`);
}