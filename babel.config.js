const presets = [
  [
    "@babel/env",
    {
      targets: {
        // edge: "17",
        // firefox: "60",
        chrome: "67",
        android: "60"
        // safari: "11.1",
      },
      // useBuiltIns: "usage",
    },
  ]
];
const plugins = [
  [
    "@babel/plugin-transform-react-jsx",
    {
      "pragma": "h" // default pragma is React.createElement
    }
  ]
]

module.exports = {presets, plugins};
