/*
 * QX M3U8 广告清洗脚本（模块版）
 * hostname 已在模块中声明
 */

if (!$response || !$response.body) {
  $done({});
}

const url = $request.url;
const host = url.match(/^https?:\/\/([^/]+)/)?.[1] || "";
let body = $response.body;

// ===== 规则库（节选示例，可继续补）=====
const ruleSets = [
  {
    name: "暴风",
    hosts: ["bfzy", "bfbfvip", "bfengbf"],
    regex: [
      "#EXTINF.*?\\s+.*?adjump.*?\\.ts"
    ]
  },
  {
    name: "量子",
    hosts: ["vip.lz", "hd.lz", ".cdnlz"],
    regex: [
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF.*?66667,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXTINF.*?\\s+.*?08646.*?\\.ts",
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF.*?6\\.667,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF.*?7\\.067,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXTINF.*?\\s+.*?48234.*?\\.ts",
      "17.19",
      "19.12",
      "19.63"
    ]
  },
  {
    name: "非凡",
    hosts: ["vip.ffzy", "hd.ffzy", "super.ffzy", "cachem3u8.2s0"],
    regex: [
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6\\.400000,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF.*?66667,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:2\\.433333,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXTINF.*?\\s+.*?1171(057).*?\\.ts",
      "#EXTINF.*?\\s+.*?6d7b(077).*?\\.ts",
      "#EXTINF.*?\\s+.*?6718a(403).*?\\.ts",
      "17.99",
      "14.45"
    ]
  },
  {
    name: "索尼",
    hosts: ["suonizy"],
    regex: [
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:1\\.000000,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXTINF.*?\\s+.*?p1ayer.*?\\.ts",
      "#EXTINF.*?\\s+.*?\\/video\\/original.*?\\.ts"
    ]
  },
  {
    name: "快看",
    hosts: ["kuaikan"],
    regex: [
      "#EXT-X-KEY:METHOD=NONE\\r*\\n*#EXTINF:5,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXT-X-KEY:METHOD=NONE\\r*\\n*#EXTINF:2\\.4,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXT-X-KEY:METHOD=NONE\\r*\\n*#EXTINF:1\\.467,[\\s\\S]*?#EXT-X-DISCONTINUITY"
    ]
  },
  {
    name: "黑木耳",
    hosts: ["hmrvideo"],
    regex: [
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF.*?66667,[\\s\\S]*?#EXT-X-DISCONTINUITY"
    ]
  },
  {
    name: "ryplay",
    hosts: ["cdn.ryplay"],
    regex: [
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6\\.633333,[\\s\\S]*?#EXT-X-DISCONTINUITY",
      "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:8\\.333333,[\\s\\S].*?\\.ts",
      "#EXTINF:2\\.933333,[\\s\\S].*?\\.ts"
    ]
  },
  {
    name: "海外看",
    hosts: ["haiwaikan"],
    regex: [
      "10.0099",
      "10.3333",
      "16.0599",
      "8.1748",
      "10.85"
    ]
  }
];

// ===== 是否命中资源站 =====
const hitRules = ruleSets.filter(r =>
  r.hosts.some(h => host.includes(h))
);

if (!hitRules.length) {
  $done({});
}

// ===== 清洗 =====
hitRules.forEach(rule => {
  rule.regex.forEach(r => {
    try {
      body = body.replace(new RegExp(r, "g"), "");
    } catch (e) {}
  });
});

// 防炸处理
body = body
  .replace(/\n{3,}/g, "\n\n")
  .replace(/#EXT-X-DISCONTINUITY\s*\n#EXT-X-DISCONTINUITY/g, "#EXT-X-DISCONTINUITY");

$done({ body });
