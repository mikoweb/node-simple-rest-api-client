//import nodeResolve from 'rollup-plugin-node-resolve';
import convertCJS from 'rollup-plugin-commonjs';
import rollup from 'rollup';
import watch from 'rollup-watch';

export default {
    entry: 'src/index.js',
    format: 'cjs',
    moduleName: 'simple-rest-api-client',
    plugins: [convertCJS(), watch(rollup, {
        dest: 'bundle.js'
    })],
    dest: 'bundle.js'
}
