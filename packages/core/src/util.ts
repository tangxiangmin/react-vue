export const flattenArray = function (arr: Array<any>) {
  let ans: any[] = []
  for (let i = 0; i < arr.length; ++i) {
    if (Array.isArray(arr[i])) {
      ans = ans.concat(flattenArray(arr[i]))
    } else if(!isNullOrUndef(arr[i])){
      ans.push(arr[i])
    }
  }
  return ans
}

export function isObject(val: unknown) {
  return val !== null && typeof val === 'object'
}

export function isNullOrUndef(o: any): o is undefined | null {
  return o === void 0 || o === null;
}
