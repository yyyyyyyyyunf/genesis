import { COMPONENT_LABELS } from '../src/widgets/component-map';
import { FullRegistry } from '../src/widgets/full-registry';
import { SchemaRegistry } from '../src/widgets/schemas';

// 颜色输出工具
const colors = {
  red: (msg: string) => `\x1b[31m${msg}\x1b[0m`,
  green: (msg: string) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg: string) => `\x1b[33m${msg}\x1b[0m`,
  blue: (msg: string) => `\x1b[34m${msg}\x1b[0m`,
};

console.log(colors.blue('🔍 开始检查组件注册表一致性...'));

const definedComponents = new Set(Object.keys(COMPONENT_LABELS));
const registeredComponents = new Set(Object.keys(FullRegistry));
const schemaComponents = new Set(Object.keys(SchemaRegistry));

let hasError = false;

// 1. 检查 COMPONENT_MAP vs FullRegistry (实现)
console.log('\n1. 检查 COMPONENT_MAP 与 代码实现 (FullRegistry) 的一致性...');
definedComponents.forEach(comp => {
  if (!registeredComponents.has(comp)) {
    console.error(colors.red(`❌ [错误] 组件 '${comp}' 在 COMPONENT_MAP 中定义了，但未在 FullRegistry (Server/Client Registry) 中实现。`));
    hasError = true;
  }
});

registeredComponents.forEach(comp => {
  if (!definedComponents.has(comp)) {
    console.error(colors.red(`❌ [错误] 组件 '${comp}' 在 FullRegistry 中实现了，但未在 COMPONENT_MAP 中定义。`));
    hasError = true;
  }
});

// 2. 检查 COMPONENT_MAP vs SchemaRegistry (属性定义)
console.log('\n2. 检查 COMPONENT_MAP 与 SchemaRegistry 的一致性...');
definedComponents.forEach(comp => {
  if (!schemaComponents.has(comp)) {
    console.error(colors.red(`❌ [错误] 组件 '${comp}' 在 COMPONENT_MAP 中定义了，但未在 SchemaRegistry 中定义 Schema。`));
    hasError = true;
  }
});

schemaComponents.forEach(comp => {
  if (!definedComponents.has(comp)) {
    console.error(colors.red(`❌ [错误] 组件 '${comp}' 在 SchemaRegistry 中定义了，但未在 COMPONENT_MAP 中定义。`));
    hasError = true;
  }
});

if (hasError) {
  console.error(colors.red('\n💥 发现一致性错误！请修复上述问题。'));
  process.exit(1);
} else {
  console.log(colors.green('\n✅ 所有检查通过！组件注册表一致。'));
}

