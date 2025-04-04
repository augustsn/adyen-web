import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import { dts } from 'rollup-plugin-dts';
import { defineRollupSwcOption, swc } from 'rollup-plugin-swc3';
import generateEnvironmentVariables from './environment-variables.js';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const resolveExtensions = () => resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] });

export const loadCommonjsPackage = () => commonjs();

export const lint = () =>
    eslint({
        include: ['./src/**'],
        exclude: ['./src/**/*.json', './src/**/*.scss']
    });

export const replaceValues = ({ bundleType = undefined, buildType } = {}) => {
    if (!bundleType || !buildType) {
        throw Error('Rollup plugins: replaceValues: missing one of the parameters');
    }

    return replace({
        values: generateEnvironmentVariables(buildType, bundleType),
        preventAssignment: true
    });
};

export const convertJsonToESM = () => json({ namedExports: false, compact: true, preferConst: true });

export const compileCSS = ({ extract = 'bubp.css' } = {}) =>
    postcss({
        use: { sass: { includePaths: [pathResolve(__dirname, '../src')] } },
        config: {
            path: 'postcss.config.cjs'
        },
        sourceMap: true,
        inject: false,
        extract: extract
    });

export const compileJavascript = ({ target, sourceMaps = false } = {}) => {
    if (!target) {
        throw Error('Rollup plugins: compileJavascript task - "target" is missing');
    }

    return swc(
        defineRollupSwcOption({
            tsconfig: '../tsconfig.json',
            jsc: {
                target: target,
                parser: {
                    syntax: 'typescript'
                },
                transform: {
                    react: {
                        pragma: 'h',
                        pragmaFrag: 'Fragment'
                    }
                }
            },
            module: {
                type: 'es6'
            },
            sourceMaps: sourceMaps,
            inlineSourcesContent: false
        })
    );
};

export const minify = ({ isESM } = { isESM: true }) => terser({ module: isESM });

export const generateTypes = () => dts();
