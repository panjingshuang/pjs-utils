import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const data =  {
  mode: 'production', // 设置为生产环境模式
  optimization: {
    usedExports: true, // 开启 tree shaking 功能
  },
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  }
};

export default data