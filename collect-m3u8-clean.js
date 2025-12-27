let lines = $response.body.split('\n');

let out = [];
let buffer = [];
let buffering = false;
let bufferDuration = 0;

// 【关键参数】
// 小于等于这个时长的 DISCONTINUITY 段 → 判定为广告
// 非凡 / 量子 / FF 实测最稳区间：22–28
const AD_MAX_DURATION = 28;

function flushBuffer(keep) {
  if (keep) out.push(...buffer);
  buffer = [];
  bufferDuration = 0;
  buffering = false;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('#EXT-X-DISCONTINUITY')) {
    flushBuffer(true);
    buffering = true;
    buffer.push(line);
    continue;
  }

  if (buffering) {
    buffer.push(line);

    const m = line.match(/^#EXTINF:([\d.]+)/);
    if (m) bufferDuration += parseFloat(m[1]);

    // 到达一个完整分段
    if (
      bufferDuration > AD_MAX_DURATION ||
      lines[i + 1]?.startsWith('#EXT-X-DISCONTINUITY')
    ) {
      // 短段 → 广告 → 丢弃
      if (bufferDuration > AD_MAX_DURATION) {
        flushBuffer(true);
      } else {
        flushBuffer(false);
      }
    }
  } else {
    out.push(line);
  }
}

$done({ body: out.join('\n') });
