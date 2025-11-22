
import { PageConfig, Floor } from '@genesis/hercules/types';

/**
 * 递归在配置树中通过 ID 查找楼层节点。
 * 如果找到则返回节点，否则返回 null。
 * 目前仅用于查找，也可以扩展为返回路径或父节点。
 */
export function findFloorNode(floors: PageConfig, targetId: string): Floor | null {
  for (const floor of floors) {
    if (floor.id === targetId) {
      return floor;
    }
    // 检查 Tab 中的嵌套子项 (data.items[].children)
    if (floor.data?.items && Array.isArray(floor.data.items)) {
      for (const item of floor.data.items) {
        if (item.children && Array.isArray(item.children)) {
          const found = findFloorNode(item.children, targetId);
          if (found) return found;
        }
      }
    }
    // 通用子项检查（如果我们以后采用标准的 children 属性）
    if (floor.data?.children && Array.isArray(floor.data.children)) {
       const found = findFloorNode(floor.data.children, targetId);
       if (found) return found;
    }
  }
  return null;
}

/**
 * 递归通过 ID 更新楼层节点。
 * 返回一个新的配置数组（不可变更新）。
 */
export function updateFloorNode(floors: PageConfig, targetId: string, updates: { data?: any, alias?: string }): PageConfig {
  return floors.map(floor => {
    // 找到匹配项
    if (floor.id === targetId) {
      return {
        ...floor,
        ...(updates.data ? { data: { ...floor.data, ...updates.data } } : {}),
        ...(updates.alias !== undefined ? { alias: updates.alias } : {}),
      };
    }

    // 在 Tab 项中递归查找并更新
    if (floor.data?.items && Array.isArray(floor.data.items)) {
      const newItems = floor.data.items.map((item: any) => {
        if (item.children && Array.isArray(item.children)) {
          // 检查是否有子项需要更新
          const newChildren = updateFloorNode(item.children, targetId, updates);
          if (newChildren !== item.children) {
             return { ...item, children: newChildren };
          }
        }
        return item;
      });
      
      // 如果 items 发生了变化，返回新的 floor 对象
      // 检查引用相等性在没有深度比较或特定标志的情况下很难，
      // 但由于 map 总是返回新数组，我们检查内容是否概念上发生了变化？
      // 实际上，updateFloorNode 总是返回一个新数组。
      // 我们应该检查 *内部是否有任何东西* 发生了变化。
      // 为了简单起见：直接赋值 newItems。
      // 优化：检查 newItems 是否与旧 items 不同（JSON.stringify 或专门检查）。
      // 对于 React 状态，只要不无限循环，急切创建新对象是可以的。
      // 更好做法：仅当 `newItems` 确实不同时才创建新的 `floor` 对象。
      
      // 让我们依赖这样一个事实：如果 updateFloorNode 没有找到任何东西，它会返回相同的数组引用（如果我们优化它）
      // 或者我们就返回新结构。鉴于页面大小很小，完全重建是可以接受的。
      return {
          ...floor,
          data: { ...floor.data, items: newItems }
      };
    }

    return floor;
  });
}

/**
 * 递归通过 ID 删除楼层节点。
 */
export function removeFloorNode(floors: PageConfig, targetId: string): PageConfig {
  // 过滤当前层级
  const filtered = floors.filter(f => f.id !== targetId);
  if (filtered.length !== floors.length) {
      return filtered; // 在此层级找到并移除
  }

  // 递归
  return floors.map(floor => {
    if (floor.data?.items && Array.isArray(floor.data.items)) {
       const newItems = floor.data.items.map((item: any) => {
         if (item.children && Array.isArray(item.children)) {
           const newChildren = removeFloorNode(item.children, targetId);
           return { ...item, children: newChildren };
         }
         return item;
       });
       return { ...floor, data: { ...floor.data, items: newItems } };
    }
    return floor;
  });
}

