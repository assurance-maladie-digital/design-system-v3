import { promises as fs } from 'fs';
import path from 'path';


const readJsonFile = async (filePath) => {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
};

const resolveTokenValue = (tokenValue, primitives, semantic) => {
    if (typeof tokenValue === 'string' && tokenValue.startsWith('{') && tokenValue.endsWith('}')) {
        const pathArray = tokenValue.slice(1, -1).split('.');
        let value = { ...primitives, ...semantic };
        for (const key of pathArray) {
            value = value[key];
            if (!value) break;
        }
        return value ? value.value : tokenValue;
    }
    return tokenValue;
};

const resolveNestedTokens = (tokens, primitives, semantic) => {
    const resolvedTokens = {};
    for (const [key, value] of Object.entries(tokens)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
            resolvedTokens[key] = resolveNestedTokens(value, primitives, semantic);
        } else {
            resolvedTokens[key] = resolveTokenValue(value, primitives, semantic);
        }
    }
    return resolvedTokens;
};

const generateScss = (primitives, semantic, contextualTokens) => {
    let scssContent = '';

    // Add primitive colors
    scssContent += '// Primitives\n';
    for (const [colorName, shades] of Object.entries(primitives.colors)) {
        for (const [shade, valueObj] of Object.entries(shades)) {
            scssContent += `$${colorName}-${shade}: ${valueObj.value};\n`;
        }
    }

    // Add semantic tokens
    scssContent += '\n// Semantic Tokens\n';
    const resolvedSemanticTokens = resolveNestedTokens(semantic, primitives, semantic);
    for (const [category, tokens] of Object.entries(resolvedSemanticTokens)) {
        for (const [tokenName, tokenValue] of Object.entries(tokens)) {
            scssContent += `$${category}-${tokenName}: ${tokenValue};\n`;
        }
    }

    // Add contextual tokens
    scssContent += '\n// Contextual Tokens\n';
    const resolvedContextualTokens = resolveNestedTokens(contextualTokens, primitives, semantic);
    for (const [category, tokens] of Object.entries(resolvedContextualTokens)) {
        for (const [tokenName, tokenValue] of Object.entries(tokens)) {
            scssContent += `$${category}-${tokenName}: ${tokenValue};\n`;
        }
    }

    return scssContent;
};

const main = async () => {
    const primitives = await readJsonFile(path.resolve('../tokens/primitives.json'));
    const semantic = await readJsonFile(path.resolve('../tokens/semantic.json'));
    const contextualTokens = await readJsonFile(path.resolve('../tokens/contextual-tokens.json'));

    const scssContent = generateScss(primitives, semantic, contextualTokens);

    await fs.writeFile(path.resolve('output.scss'), scssContent);

    console.log('Fichier SCSS généré avec succès: output.scss');
};

main().catch(console.error);
