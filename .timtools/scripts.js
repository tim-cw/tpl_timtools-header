import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";

const STACK_REPO = "git@github.com:tim-cw/timtools.git";
const TMP_DIR = path.resolve("tmp-stack");
const PACKAGE_JSON_PATH = path.resolve("package.json");

// Fonction utilitaire pour copier récursivement un dossier en ignorant .git
function copyRecursive(src, dest) {
  const stats = statSync(src);
  if (stats.isDirectory()) {
    const folderName = path.basename(src);
    if (folderName === ".git") return; // ignore .git
    mkdirSync(dest, { recursive: true });
    for (const file of readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    copyFileSync(src, dest);
  }
}

async function main() {
  console.log("Lecture de la version du devoir...");

  // Lire la version originale du package.json du devoir
  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error("package.json introuvable !");
    process.exit(1);
  }
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"));
  const tagVersion = pkg.version;
  if (!tagVersion) {
    console.error("Aucune version trouvée dans package.json !");
    process.exit(1);
  }

  console.log(
    `Version détectée : ${tagVersion}, clonage du stack correspondant...`
  );

  // Supprime TMP_DIR si existant
  if (fs.existsSync(TMP_DIR))
    fs.rmSync(TMP_DIR, { recursive: true, force: true });

  // Clone le repo sans checkout
  execSync(`git clone --depth 1 --no-checkout ${STACK_REPO} "${TMP_DIR}"`, {
    stdio: "inherit",
  });

  // Checkout sur le tag correspondant à la version du package.json
  execSync(`git -C "${TMP_DIR}" checkout tags/${tagVersion}`, {
    stdio: "inherit",
  });

  console.log("Copie du stack à la racine (en ignorant .git)...");
  copyRecursive(TMP_DIR, process.cwd());

  // Supprime le dossier temporaire
  fs.rmSync(TMP_DIR, { recursive: true, force: true });

  console.log(
    "Stack installé avec succès ! Le dépôt Git du devoir est intact."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
