const fs = require('fs').promises;
const path = require('path');
const semver = require('semver');
const packageJsonPath = path.resolve(__dirname, 'package.json');

async function bumpVersion() {
  try {
    // 读取 package.json 文件
    const data = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(data);

    // 获取当前版本号
    const version = packageJson.version;

    // 使用 semver 递增版本号的末尾部分（小版本号）
    const newVersion = semver.inc(version, 'patch');

    if (!newVersion) {
      throw new Error(`无法递增版本号: ${version}`);
    }

    // 更新 version 字段
    packageJson.version = newVersion;

    // 转换回 JSON 字符串，并保持原有格式
    const newContent = JSON.stringify(packageJson, null, 2) + '\n';

    // 写回 package.json 文件
    await fs.writeFile(packageJsonPath, newContent, 'utf8');

    console.log(`版本号已递增至: ${newVersion}`);
  } catch (error) {
    console.error('递增版本号时出错:', error);
  }
}

bumpVersion();