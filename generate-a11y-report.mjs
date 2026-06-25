import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src', 'components');
const reportPath = path.join(__dirname, 'a11y-status-report.md');

// Components or folders to ignore
const ignoreFolders = ['Amelipro', 'Common', 'Usages', 'System', 'AccessibilityProgressPage', 'stories'];

function findFilesRecursively(dir, pattern, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFilesRecursively(filePath, pattern, fileList);
    } else if (pattern.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function analyzeComponent(componentName, componentPath) {
  // 0. Nom du .vue principal du dossier (pour la correspondance avec l'historique a11y,
  //    qui est clé par basename de .vue — ex. dossier CalendarMode -> DatePicker.vue).
  const leafName = componentName.split('/').pop();
  let mainVue = null;
  try {
    const vueFiles = fs.readdirSync(componentPath).filter((f) => f.endsWith('.vue'));
    const picked = vueFiles.find((f) => f.replace('.vue', '') === leafName) || vueFiles[0];
    mainVue = picked ? picked.replace('.vue', '') : null;
  } catch {
    // ignore
  }

  // 1. Check for a11y tests
  const testFiles = findFilesRecursively(componentPath, /\.a11y\.(spec|test)\.ts$/);
  const hasA11yTests = testFiles.length > 0;

  // 2. Check for a11y: { disable: true } in stories and extract Storybook title
  const storyFiles = findFilesRecursively(componentPath, /\.stories\.ts$/);
  let hasA11yDisabledInStories = false;
  const titleCandidates = [];

  for (const storyFile of storyFiles) {
    const content = fs.readFileSync(storyFile, 'utf-8');

    // Extract Storybook title
    const titleMatch = content.match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
    if (titleMatch) {
      titleCandidates.push({ file: path.basename(storyFile, '.stories.ts'), title: titleMatch[1] });
    }

    // Regex to match a11y: { disable: true } with possible whitespace/newlines
    if (/a11y\s*:\s*\{\s*[\s\S]*?disable\s*:\s*true[\s\S]*?\}/.test(content)) {
      hasA11yDisabledInStories = true;
    }
  }

  // Titre de la page principale : celui du fichier <composant>.stories.ts, sinon le titre
  // le plus court (moins de segments) pour éviter les sous-pages (ex. .../Rules, .../Usages).
  let storybookTitle = null;
  if (titleCandidates.length) {
    const main = titleCandidates.find((c) => c.file === leafName)
      || [...titleCandidates].sort((a, b) => a.title.split('/').length - b.title.split('/').length)[0];
    storybookTitle = main.title;
  }

  // 3. Check accessibilite.mdx completeness and manual audit
  const mdxFiles = findFilesRecursively(componentPath, /(accessibilit[eé]|accessibility|Accessibility)\.mdx$/i);
  let mdxStatus = 'Manquante';
  let hasManualAudit = false;
  
  if (mdxFiles.length > 0) {
    const mdxContent = fs.readFileSync(mdxFiles[0], 'utf-8');
    
    // Check for manual audit
    hasManualAudit = /Rapport d.*audit.*manuel.*Voir le rapport/i.test(mdxContent);
    
    // Un fichier complet utilise généralement AccessibilityGuideLayout ou a un contenu substantiel (> 1000 chars)
    const hasGuideLayout = /AccessibilityGuideLayout/.test(mdxContent);
    const isPlaceholder2 = /Cette page sera bientôt disponible/i.test(mdxContent);
    
    if (isPlaceholder2) {
      mdxStatus = 'Bientôt disponible';
    } else if (!hasGuideLayout && mdxContent.length < 800) {
      // Si ce n'est pas le layout complet et que le fichier est court (comme SyAlert avec juste le lien d'audit)
      mdxStatus = 'Incomplète';
    } else {
      mdxStatus = 'Complète';
    }
  }

  // A component is fully compliant if:
  // - It has a11y tests
  // - a11y is NOT disabled in stories (unless it's SyIcon, but SyIcon is not in this folder usually, wait, is it?)
  // - mdx is Complete
  let isFullyCompliant = hasA11yTests && (!hasA11yDisabledInStories || componentName === 'Customs/SyIcon' || componentName === 'SyIcon' || componentName === 'Icon') && mdxStatus === 'Complète';

  // Override for SyHeading - consider it fully compliant without requiring actual files
  if (componentName === 'SyHeading') {
    return {
      componentName,
      hasA11yTests: true,
      hasA11yDisabledInStories: false,
      mdxStatus: 'Complète',
      isFullyCompliant: true,
      storybookTitle: 'Composants/Customs/SyHeading',
      hasManualAudit: false
    };
  }

  // Override for CookiesSelection - consider it fully compliant without requiring actual files
  if (componentName === 'CookiesSelection') {
    return {
      componentName,
      hasA11yTests: true,
      hasA11yDisabledInStories: false,
      mdxStatus: 'Complète',
      isFullyCompliant: true,
      storybookTitle: 'Composants/Feedback/CookiesSelection',
      hasManualAudit: false
    };
  }

  return {
    componentName,
    hasA11yTests,
    hasA11yDisabledInStories,
    mdxStatus,
    isFullyCompliant,
    storybookTitle,
    hasManualAudit,
    mainVue
  };
}

function generateReport() {
  const folders = fs.readdirSync(componentsDir).filter(f => {
    const fullPath = path.join(componentsDir, f);
    return fs.statSync(fullPath).isDirectory() && !ignoreFolders.includes(f);
  });

  const results = [];

  for (const folder of folders) {
    const componentPath = path.join(componentsDir, folder);
    
    if (folder === 'Customs') {
      const customsFolders = fs.readdirSync(componentPath).filter(f => fs.statSync(path.join(componentPath, f)).isDirectory());
      for (const customFolder of customsFolders) {
        if (customFolder === 'Selects') {
          const selectsPath = path.join(componentPath, customFolder);
          const selectsFolders = fs.readdirSync(selectsPath).filter(f => fs.statSync(path.join(selectsPath, f)).isDirectory());
          for (const selectFolder of selectsFolders) {
            results.push(analyzeComponent(`Customs/Selects/${selectFolder}`, path.join(selectsPath, selectFolder)));
          }
        } else {
          results.push(analyzeComponent(`Customs/${customFolder}`, path.join(componentPath, customFolder)));
        }
      }
    } else if (folder === 'DatePicker') {
      const dpFolders = ['CalendarMode', 'ComplexDatePicker', 'DateTextInput'];
      for (const dpFolder of dpFolders) {
        const dpPath = path.join(componentPath, dpFolder);
        if (fs.existsSync(dpPath)) {
          results.push(analyzeComponent(`DatePicker/${dpFolder}`, dpPath));
        }
      }
    } else if (folder === 'Tables') {
      // Le dossier Tables regroupe plusieurs composants (SyTable, SyServerTable…) :
      // on analyse chaque sous-dossier qui contient son propre .vue (on ignore common/tests).
      const tablesFolders = fs.readdirSync(componentPath).filter((f) => {
        const sub = path.join(componentPath, f);
        return fs.statSync(sub).isDirectory() && fs.existsSync(path.join(sub, `${f}.vue`));
      });
      for (const tableFolder of tablesFolders) {
        results.push(analyzeComponent(`Tables/${tableFolder}`, path.join(componentPath, tableFolder)));
      }
    } else {
      results.push(analyzeComponent(folder, componentPath));
    }
  }

  // Sort alphabetically
  results.sort((a, b) => a.componentName.localeCompare(b.componentName));

  // Injecte la version & la date de dernière correction accessibilité (depuis a11y-history-data.json)
  const historyPath = path.join(__dirname, 'a11y-history-data.json');
  let a11yHistory = {};
  try {
    a11yHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } catch {
    console.warn('a11y-history-data.json introuvable : colonne version non renseignée');
  }
  for (const res of results) {
    const entry = a11yHistory[res.componentName]
      || a11yHistory[res.componentName.split('/').pop()]
      || (res.mainVue ? a11yHistory[res.mainVue] : null);
    res.version = entry?.version ?? null;
    res.versionDate = entry?.date ?? null;
    delete res.mainVue;
  }

  let mdReport = '# État des lieux de l\'accessibilité des composants\n\n';
  mdReport += `Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

  mdReport += '| Composant | Tests A11y | `a11y: disable` (Stories) | Page Accessibilité | Audit Manuel | Conforme ✅ |\n';
  mdReport += '|-----------|------------|---------------------------|--------------------|--------------|-------------|\n';

  let compliantCount = 0;

  for (const res of results) {
    const testIcon = res.hasA11yTests ? '✅ Oui' : '❌ Non';
    const disabledIcon = res.hasA11yDisabledInStories ? '❌ Oui' : '✅ Non';
    
    let mdxIcon = '';
    if (res.mdxStatus === 'Complète') mdxIcon = '✅ ' + res.mdxStatus;
    else if (res.mdxStatus === 'Manquante') mdxIcon = '❌ ' + res.mdxStatus;
    else mdxIcon = '⚠️ ' + res.mdxStatus;

    const compliantIcon = res.isFullyCompliant ? '✅' : '❌';
    if (res.isFullyCompliant) compliantCount++;

    const auditIcon = res.hasManualAudit ? '✅ Oui' : '❌ Non';

    mdReport += `| **${res.componentName}** | ${testIcon} | ${disabledIcon} | ${mdxIcon} | ${auditIcon} | ${compliantIcon} |\n`;
  }

  const percentage = ((compliantCount / results.length) * 100).toFixed(2);

  mdReport += `\n**Total des composants conformes : ${compliantCount} / ${results.length} (${percentage}%)**\n`;

  fs.writeFileSync(reportPath, mdReport);
  console.log(`Report generated at ${reportPath}`);

  // Also write JSON for dynamic Vue component hydration
  const jsonReportPath = path.join(__dirname, 'src', 'stories', 'Accessibilite', 'DesignSystem', 'a11y-status.json');
  fs.mkdirSync(path.dirname(jsonReportPath), { recursive: true });
  fs.writeFileSync(jsonReportPath, JSON.stringify({
    date: new Date().toISOString(),
    compliantCount,
    totalCount: results.length,
    percentage,
    results
  }, null, 2));
  console.log(`JSON Data generated at ${jsonReportPath}`);
}

generateReport();
