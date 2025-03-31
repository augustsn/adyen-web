module.exports = [
    /**
     * UMD
     */
    {
        name: 'UMD',
        path: 'dist/umd/bubp.js',
        limit: '120 KB',
        running: false
    },
    /**
     * 'auto' bundle with all Components included, excluding Languages
     */
    {
        name: 'Auto',
        path: 'auto/auto.js',
        import: '{ BubpCheckout, Dropin }',
        limit: '120 KB',
        running: false
    },
    /**
     * ES modules (tree-shake)
     */
    {
        name: 'ESM - Core',
        path: 'dist/es/index.js',
        import: '{ BubpCheckout }',
        limit: '30 KB',
        running: false
    },
    {
        name: 'ESM - Core + Card',
        path: 'dist/es/index.js',
        import: '{ BubpCheckout, Card }',
        limit: '65 KB',
        running: false
    },
    {
        name: 'ESM - Core + Dropin with Card',
        path: 'dist/es/index.js',
        import: '{ BubpCheckout, Dropin, Card }',
        limit: '70 KB',
        running: false
    }
];
