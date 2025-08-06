export default {
  plugins: {
    cssnano: {
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
          minifyFontValues: {
            removeQuotes: false,
          },
          colormin: true,
          reduceIdents: false,
          mergeIdents: false,
        },
      ],
    },
  },
};
