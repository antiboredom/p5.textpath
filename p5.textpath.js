/*
Adapted by Sam Lavigne from Canvas-TextPath by Jean-Marc Viglino (https://github.com/SaKaRuMa/Canvas-TextPath)

MIT License

Copyright (c) 2016 Jean-Marc Viglino

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

p5.prototype.textPath = function (content, path, config = {}) {
  let textOverflow = config.textOverflow || "";
  let tAlign = config.textAlign || "left";
  let minWidth = config.minWidth || 0;
  let textJustify = config.justify || false;
  let verticalOffset = config.verticalOffset || 0;

  path = path.flat(1);

  /* Usefull function */
  const dist2D = function (x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper to get a point on the path, starting at dl
  // (return x, y and the angle on the path)
  let di,
    dpos = 0;
  let pos = 2;

  function pointAt(dl) {
    if (!di || dpos + di < dl) {
      for (; pos < path.length; ) {
        di = dist2D(path[pos - 2], path[pos - 1], path[pos], path[pos + 1]);
        if (dpos + di > dl) break;
        pos += 2;
        if (pos >= path.length) break;
        dpos += di;
      }
    }

    let x,
      y,
      dt = dl - dpos;
    if (pos >= path.length) {
      pos = path.length - 2;
    }

    if (!dt) {
      x = path[pos - 2];
      y = path[pos - 1];
    } else {
      x = path[pos - 2] + ((path[pos] - path[pos - 2]) * dt) / di;
      y = path[pos - 1] + ((path[pos + 1] - path[pos - 1]) * dt) / di;
    }
    return [
      x,
      y,
      Math.atan2(path[pos + 1] - path[pos - 1], path[pos] - path[pos - 2]),
    ];
  }

  let letterPadding = this.textWidth(" ") * 0.25;

  // Calculate length
  let d = 0;
  for (let i = 2; i < path.length; i += 2) {
    d += dist2D(path[i - 2], path[i - 1], path[i], path[i + 1]);
  }
  if (d < minWidth) return;
  let nbspace = content.split(" ").length - 1;

  // Remove char for overflow
  if (textOverflow != "visible") {
    if (
      d <
      this.textWidth(content) + (content.length - 1 + nbspace) * letterPadding
    ) {
      let overflow = textOverflow == "ellipsis" ? "\u2026" : textOverflow || "";
      let dt = overflow.length - 1;
      do {
        if (content[content.length - 1] === " ") nbspace--;
        content = content.slice(0, -1);
      } while (
        content &&
        d <
          this.textWidth(content + overflow) +
            (content.length + dt + nbspace) * letterPadding
      );
      content += overflow;
    }
  }

  // Calculate start point
  let start = 0;
  switch (textJustify || tAlign) {
    case true: // justify
    case "center":
    case "end":
    case "right": {
      // Justify
      if (textJustify) {
        start = 0;
        letterPadding =
          (d - this.textWidth(content)) / (content.length - 1 + nbspace);
      }
      // Text align
      else {
        start =
          d -
          this.textWidth(content) -
          (content.length + nbspace) * letterPadding;
        if (tAlign == "center") start /= 2;
      }
      break;
    }
    // left
    default:
      break;
  }

  // Do rendering
  for (let t = 0; t < content.length; t++) {
    let letter = content[t];
    let wl = this.textWidth(letter);

    let p = pointAt(start + wl / 2);

    this.push();
    this.textAlign(CENTER);
    this.translate(p[0], p[1]);
    this.rotate(p[2]);
    this.text(letter, 0, verticalOffset);
    this.pop();
    start += wl + letterPadding * (letter == " " ? 2 : 1);
  }
};
