import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'lib/main.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'es'
    },
    plugins: [
        resolve(),
        commonjs(),
        json(),
        scss(),
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: 'ESNext'
                }
            }
        })
    ]
};