Basic implementation of drawing text along a set of X,Y coordinates.

To use:

Include the script in your html file:

```html
<script src="https://cdn.jsdelivr.net/gh/antiboredom/p5.textpath/p5.textpath.js"></script>
```

Then:

```javascript
textPath(
  "This is a test of text writing along a path.",
  [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
    [0, 0],
  ],
  {
    textAlign: "center",
    justify: false,
    verticalOffset: 0,
  },
);
```

Fuller example:

```javascript
let coords = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  fill(0);
  textFont("Times New Roman", 20);

  textPath("This is a test of text writing along a path.", coords, {
    textAlign: "center",
    justify: false,
    verticalOffset: 0,
  });

  noFill();
  beginShape();
  for (let c of coords) {
    vertex(c[0], c[1]);
  }
  endShape();

  if (mouseIsPressed) {
    coords.push([mouseX, mouseY]);
  }
}
```
