import {pathToRegexp} from "path-to-regexp";

export interface RouteLocation {
  path: string,
  params: Record<string, any>,
  query: Record<string, any>,
}

// 将a=1&b=2&c=3形式的search参数解析为{a:1,b:2,c:3}形式的query对象
export function parseQuery(search: string): Object {
  let pattern = new RegExp('([\\w\\d\\_\\-]+)=([^\\s\\&]+)', 'ig')
  let query: Record<string, string> = {};
  search && search.replace(pattern, (a, b, c) => {
    query[b] = c
    return a
  });
  return query;
}

// 解析链接上/id/:id类型的参数为{id:xxx}
function parseParam(url: string, path: string): Object {
  const keys: any[] = []
  const params: Record<string, any> = {}
  if (path) {
    const regexp = pathToRegexp(path, keys, {endsWith: "?"})
    if (regexp.test(url)) {
      url.replace(regexp, (...args) => {
        let idx = 1
        keys.forEach(key => {
          params[key.name] = args[idx++]
        })
        return ''
      })
    }
  }

  return params
}

export function createLocation(url: string, path?: string): RouteLocation {
  let arr = url.split('?')
  let pathName = arr[0]
  return {
    path: pathName,
    params: path ? parseParam(pathName, path) : {},
    query: parseQuery(arr[1] || '')
  }
}
