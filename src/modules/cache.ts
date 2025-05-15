export function MemoizeWithKey<T extends (...args: any[]) => any>(
  keyFn: (...args: Parameters<T>) => string
) {
  const cache = new Map<string, ReturnType<T>>();
  return function (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as T;

    function wrapped(this: any, ...args: Parameters<T>): ReturnType<T> {
      const key = keyFn(...args);
      if (cache.has(key)) return cache.get(key)!;
      const result = originalMethod.apply(this, args);
      cache.set(key, result);
      return result;
    }

    wrapped.clearCache = () => {
      cache.clear();
    };

    descriptor.value = wrapped;
  };
}
