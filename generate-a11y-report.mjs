import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src', 'components');
const reportPath = path.join(__dirname, 'a11y-status-report.md');

// Components or folders to ignore
const ignoreFolders = ['Amelipro', 'Common', 'Usages'];

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
  // 1. Check for a11y tests
  const testFiles = findFilesRecursively(componentPath, /\.a11y\.(spec|test)\.ts$/);
  const hasA11yTests = testFiles.length > 0;

  // 2. Check for a11y: { disable: true } in stories
  const storyFiles = findFilesRecursively(componentPath, /\.stories\.ts$/);
  let hasA11yDisabledInStories = false;
  for (const storyFile of storyFiles) {
    const content = fs.readFileSync(storyFile, 'utf-8');
    // Regex to match a11y: { disable: true } with possible whitespace/newlines
    if (/a11y\s*:\s*\{\s*disable\s*:\s*true\s*\}/.test(content)) {
      hasA11yDisabledInStories = true;
      break;
    }
  }

  // 3. Check accessibilite.mdx completeness
  const mdxFiles = findFilesRecursively(componentPath, /(accessibilit[eé]|accessibility)\.mdx$/i);
  let mdxStatus = 'Manquante';
  
  if (mdxFiles.length > 0) {
    const mdxContent = fs.readFileSync(mdxFiles[0], 'utf-8');
    
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

  if (componentName === 'CookiesSelection') {
    isFullyCompliant = hasA11yTests;
  }

  return {
    componentName,
    hasA11yTests,
    hasA11yDisabledInStories,
    mdxStatus,
    isFullyCompliant
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
    } else {
      results.push(analyzeComponent(folder, componentPath));
    }
  }

  // Sort alphabetically
  results.sort((a, b) => a.componentName.localeCompare(b.componentName));

  let mdReport = '# État des lieux de l\'accessibilité des composants (hors AmeliPro)\n\n';
  mdReport += `Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

  mdReport += '| Composant | Tests A11y | `a11y: disable` (Stories) | Page Accessibilité | Conforme ✅ |\n';
  mdReport += '|-----------|------------|---------------------------|--------------------|-------------|\n';

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

    mdReport += `| **${res.componentName}** | ${testIcon} | ${disabledIcon} | ${mdxIcon} | ${compliantIcon} |\n`;
  }

  const percentage = ((compliantCount / results.length) * 100).toFixed(2);

  mdReport += `\n**Total des composants conformes : ${compliantCount} / ${results.length} (${percentage}%)**\n`;

  fs.writeFileSync(reportPath, mdReport);
  console.log(`Report generated at ${reportPath}`);
}

generateReport();
