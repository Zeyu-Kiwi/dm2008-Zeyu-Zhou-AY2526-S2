let qtree;
let showQuadTree = false;
let quadTreeButton;

const flock = [];

let boidCount = 300;

let alignSlider, cohesionSlider, separationSlider;
let maxForceSlider, maxSpeedSlider, radiusSlider;
let boidCountSlider, heightSlider, widthSlider, sizeSlider;

let edgeModeButton;
let colorModeButton;
let resetButton;

let controlPanel;

let h, w, size;

let edgeMode = "teleport"; // "teleport" or "wrap"
let colorModeState = "solid";   // "solid" or "heading"

let isPanelCollapsed = false;

let bgm;// background music

function preload(){
  bgm = loadSound("assets/bgm02.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 0, 100);

  playBGM();

  createControlPanel();
  setBoidsInitialValue();

  for (let i = 0; i < boidCount; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  background(0, 0, 0, 18);

  updateBoidCountFromSlider();
  updateSharedBoidSettings();

  const boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  qtree = new QuadTree(boundary, 4);

  for (let boid of flock) {
    const point = new Point(boid.position.x, boid.position.y, boid);
    qtree.insert(point);
  }

  for (let boid of flock) {
    boid.flock(qtree);
    boid.edges();
    boid.update();
    boid.show(h, w, size);
  }

  if (showQuadTree) {
    qtree.show();
  }
}

function playBGM(){
  bgm.play();
  bgm.loop();
  bgm.setVolume(0.3);
  userStartAudio();
}

function setBoidsInitialValue() {
  h = 7;
  w = 5;
  size = 1.2;
}

function updateSharedBoidSettings() {
  h = heightSlider.value();
  w = widthSlider.value();
  size = sizeSlider.value();

  for (let boid of flock) {
    boid.maxForce = maxForceSlider.value();
    boid.maxSpeed = maxSpeedSlider.value();
    boid.perceptionRadius = radiusSlider.value();
  }
}

function togglePanel(button) {
  isPanelCollapsed = !isPanelCollapsed;

  if (isPanelCollapsed) {
    controlPanel.content.hide();
    button.html("+");
  } else {
    controlPanel.content.show();
    button.html("–");
  }
}

function updateBoidCountFromSlider() {
  const targetCount = boidCountSlider.value();

  if (targetCount > flock.length) {
    const amountToAdd = targetCount - flock.length;
    for (let i = 0; i < amountToAdd; i++) {
      flock.push(new Boid());
    }
  } else if (targetCount < flock.length) {
    flock.splice(targetCount);
  }

  boidCount = flock.length;
}

function createControlPanel() {
  controlPanel = createDiv();
  controlPanel.class("control-panel");
  controlPanel.position(16, 16);

  // HEADER (title + minimize button)
  const header = createDiv();
  header.class("panel-header");
  header.parent(controlPanel);

  const title = createElement("h2", "Boids Control");
  title.parent(header);

  const toggleBtn = createButton("–");
  toggleBtn.class("minimize-btn");
  toggleBtn.parent(header);

  // CONTENT WRAPPER (everything goes inside this)
  const content = createDiv();
  content.class("panel-content");
  content.parent(controlPanel);

  // store reference so we can toggle it
  controlPanel.content = content;

  toggleBtn.mousePressed(() => togglePanel(toggleBtn));

  createSliderRow("Boid Count", 10, 1000, boidCount, 1, (s) => boidCountSlider = s, content);
  createSliderRow("Alignment", 0, 3, 0.5, 0.1, (s) => alignSlider = s, content);
  createSliderRow("Cohesion", 0, 3, 0.5, 0.1, (s) => cohesionSlider = s, content);
  createSliderRow("Separation", 0, 3, 0.8, 0.1, (s) => separationSlider = s, content);
  createSliderRow("Max Force", 0.01, 1, 0.15, 0.01, (s) => maxForceSlider = s, content);
  createSliderRow("Max Speed", 0.5, 8, 3, 0.1, (s) => maxSpeedSlider = s, content);
  createSliderRow("Perception Radius", 10, 200, 50, 1, (s) => radiusSlider = s, content);

  createSliderRow("Boid Height", 2, 20, h ?? 7, 1, (s) => heightSlider = s, content);
  createSliderRow("Boid Width", 2, 20, w ?? 5, 1, (s) => widthSlider = s, content);
  createSliderRow("Boid Scale", 0.5, 3, size ?? 1.2, 0.1, (s) => sizeSlider = s, content);

  const buttonGroup = createDiv();
  buttonGroup.class("button-group");
  buttonGroup.parent(content);

  edgeModeButton = createButton(`Edge Mode: ${capitalize(edgeMode)}`);
  edgeModeButton.parent(buttonGroup);
  edgeModeButton.mousePressed(toggleEdgeMode);

  colorModeButton = createButton(`Color Mode: ${capitalize(colorModeState)}`);
  colorModeButton.parent(buttonGroup);
  colorModeButton.mousePressed(toggleColorMode);

  quadTreeButton = createButton("Show QuadTree: Off");
  quadTreeButton.parent(buttonGroup);
  quadTreeButton.mousePressed(toggleQuadTree);

  resetButton = createButton("Reset Boids");
  resetButton.parent(buttonGroup);
  resetButton.mousePressed(resetBoids);
}

function toggleQuadTree() {
  showQuadTree = !showQuadTree;
  quadTreeButton.html(`Show QuadTree: ${showQuadTree ? "On" : "Off"}`);
}

function createSliderRow(labelText, min, max, value, step, assignSlider, parent) {
  const row = createDiv();
  row.class("control-row");
  row.parent(parent);

  const labelWrap = createDiv();
  labelWrap.class("label-wrap");
  labelWrap.parent(row);

  const label = createSpan(labelText);
  label.class("control-label");
  label.parent(labelWrap);

  const valueText = createSpan(value);
  valueText.class("control-value");
  valueText.parent(labelWrap);

  const slider = createSlider(min, max, value, step);
  slider.parent(row);

  slider.input(() => {
    valueText.html(slider.value());
  });

  assignSlider(slider);
}

function toggleEdgeMode() {
  edgeMode = edgeMode === "teleport" ? "avoid" : "teleport";
  edgeModeButton.html(`Edge Mode: ${capitalize(edgeMode)}`);
}

function toggleColorMode() {
  colorModeState = colorModeState === "solid" ? "heading" : "solid";
  colorModeButton.html(`Color Mode: ${capitalize(colorModeState)}`);
}

function resetBoids() {
  flock.length = 0;
  for (let i = 0; i < boidCountSlider.value(); i++) {
    flock.push(new Boid());
  }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}