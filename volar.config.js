module.exports = {
  plugins: [
    require("@volar-plugins/prettier")({
      languages: ["html", "css", "scss", "typescript", "javascript"],
      html: {
        breakContentsFromTags: true,
      },
    }),
  ],
}
