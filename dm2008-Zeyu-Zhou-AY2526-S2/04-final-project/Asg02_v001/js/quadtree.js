class Point {
  constructor(x, y, userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x; // center x
    this.y = y; // center y
    this.w = w; // half width
    this.h = h; // half height
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = r * r;
  }

  contains(point) {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return dx * dx + dy * dy <= this.rSquared;
  }

  intersects(rect) {
    const xDist = abs(rect.x - this.x);
    const yDist = abs(rect.y - this.y);

    const r = this.r;
    const w = rect.w;
    const h = rect.h;

    if (xDist > r + w || yDist > r + h) return false;
    if (xDist <= w || yDist <= h) return true;

    const dx = xDist - w;
    const dy = yDist - h;
    return dx * dx + dy * dy <= this.rSquared;
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.w / 2;
    const h = this.boundary.h / 2;

    this.northeast = new QuadTree(new Rectangle(x + w, y - h, w, h), this.capacity);
    this.northwest = new QuadTree(new Rectangle(x - w, y - h, w, h), this.capacity);
    this.southeast = new QuadTree(new Rectangle(x + w, y + h, w, h), this.capacity);
    this.southwest = new QuadTree(new Rectangle(x - w, y + h, w, h), this.capacity);

    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northeast.insert(point) ||
      this.northwest.insert(point) ||
      this.southeast.insert(point) ||
      this.southwest.insert(point)
    );
  }

  query(range, found = []) {
    if (!range.intersects(this.boundary)) {
      return found;
    }

    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }

    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }

    return found;
  }

  show() {
    stroke(120, 20, 40, 30);
    noFill();
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

    if (this.divided) {
      this.northeast.show();
      this.northwest.show();
      this.southeast.show();
      this.southwest.show();
    }
  }
}