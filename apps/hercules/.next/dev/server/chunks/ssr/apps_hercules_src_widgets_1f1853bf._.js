module.exports = [
"[project]/apps/hercules/src/widgets/Tab/index.tsx [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/apps/hercules/src/widgets/Tab/index.tsx [app-ssr] (ecmascript)");
    });
});
}),
"[project]/apps/hercules/src/widgets/Shelf/index.tsx [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/apps_hercules_src_widgets_Shelf_index_tsx_944f47ff._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/apps/hercules/src/widgets/Shelf/index.tsx [app-ssr] (ecmascript)");
    });
});
}),
];