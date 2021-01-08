import commonjs from '@rollup/plugin-commonjs'

import pkg from './package.json'

export default {
    input: './index.js',
    output: [
        {
            format: 'esm',
            file: pkg.module,
        },
        {
            format: 'cjs',
            file: pkg.main,
        },
    ],
    external: ['ethereum-input-data-decoder', 'ethereumjs-util', 'web3-utils'],
    plugins: [commonjs()],
}