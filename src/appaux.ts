import _ from "lodash";

interface Path {
  path: string;
  session: boolean;
  redirect: string;
  guildPermission: boolean;
  hidden: boolean;
}

const parseConfigURLs = (paths: Object) => {
  let urls: Path[] = [];
  _.toPairs(paths).forEach((entry: any) => {
    const [id, path] = entry;
    if (path.hasOwnProperty("path")) {
      urls.push(path);
    } else if (path instanceof Object) {
      urls = [...urls, ...parseConfigURLs(path)];
    }
    return [id, path];
  });
  return urls;
};

const parseConfigParam: any = (paths: Object, param: String, value: String) => {
  const parsedPaths = _.cloneDeep(paths);
  return _.fromPairs(
    _.toPairs(parsedPaths).map((entry: any) => {
      let [id, path] = entry;
      if (path.hasOwnProperty("path")) {
        path.url = path.url.replace(`:${param}`, value);
      } else if (path instanceof Object) {
        path = parseConfigParam(path, param, value);
      }
      return [id, path];
    })
  );
};

const objectChanges = (before: {}, after: {}) => {
  return _.toPairs(after).reduce((result, [key, value]) => {
    if (before[key] !== value) {
      result[key] = value instanceof Object && before[key] instanceof Object ? objectChanges(value, before[key]) : value;
    }
    return result;
  }, {});
};

const backslash = (text: string) => {
  let output = '';
  for(var i = 0; i < text.length; i++) {
    output += `${text.charAt(i).match(/[A-Z0-9]/gi) ? '' : '\\'}${text.charAt(i)}`;
  }
  return output;
};

const parseTimeZoneISO = (timezone: number) => {
  const tz = Math.abs(timezone);
  const hours = Math.floor(tz);
  const minutes = (tz - hours) * 60;
  const zeroPad = (n: any, width: number, z = "0"): string => {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  };
  return zeroPad(hours, 2) + zeroPad(minutes, 2);
};

export default {
  parseConfigURLs: parseConfigURLs,
  parseConfigParam: parseConfigParam,
  parseTimeZoneISO: parseTimeZoneISO,
  objectChanges: objectChanges,
  fromEntries: _.fromPairs,
  backslash: backslash
};
