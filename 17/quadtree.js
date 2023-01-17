// A square quadtree class
// by Rick Sidwell

// Class variables
//  x,y: Center of the quadtree
//  size: Size of each side of the square
//  leaf: True if this node is a leaf, False if not
//  kids[0-3]: If not a leaf, contains the four children of this node
//      (in no particular order, but order is defined by the subdivide() method)
//  userdata: If node is a leaf, contains user-defined data

class QuadTree {
    // Initially constructed quadtree contains only one node, which is a leaf
    constructor(x, y, size, userdata) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.leaf = true;
      this.kids = [null, null, null, null];
      this.parent = null;
      this.userdata = userdata;
    }
  
    // Subdivide the node into four quadtrees (but only if it is a leaf)
    subdivide(data1, data2, data3, data4) {
      if (this.leaf) {
        let newSize = this.size / 2.0; // size of child quadtrees
        let offset = newSize / 2.0; // used to compute child quadtree centers
        this.leaf = false;
        this.kids[0] = new QuadTree(
          this.x - offset,
          this.y - offset,
          newSize,
          data1
        );
        this.kids[0].parent = this;
        this.kids[1] = new QuadTree(
          this.x + offset,
          this.y - offset,
          newSize,
          data2
        );
        this.kids[1].parent = this;
        this.kids[2] = new QuadTree(
          this.x + offset,
          this.y + offset,
          newSize,
          data3
        );
        this.kids[2].parent = this;
        this.kids[3] = new QuadTree(
          this.x - offset,
          this.y + offset,
          newSize,
          data4
        );
        this.kids[3].parent = this;
      }
    }
    
    // Combine a node and its siblings into one node (make its parent a leaf)
    combine() {
      if (this.parent != null) {
        this.parent.leaf = true;
      }
    }
  
    // Test if quadtree contains a point (returns true or false)
    contains(x, y) {
      return (
        x >= this.x - this.size / 2.0 &&
        x < this.x + this.size / 2.0 &&
        y >= this.y - this.size / 2.0 &&
        y < this.y + this.size / 2.0
      );
    }
  
    // Return the leaf quadtree containing a point (or null if none)
    find(x, y) {
      if (this.leaf) {
        if (this.contains(x, y)) {
          return this;
        } else {
          return null;
        }
      } else {
        for (let i = 0; i < 4; i++) {
          if (this.kids[i].contains(x, y)) {
            return this.kids[i].find(x, y);
          }
        }
        return null;
      }
    }
  
    // Call a function for each leaf in a quadtree
    // Breadth first traversal
    traverse(fn) {
      let queue = [this];
      while (queue.length > 0) {
        let node = queue.shift();
        if (node.leaf) {
          fn(node);
        } else {
          for (let i = 0; i < 4; i++) {
            queue.push(node.kids[i]);
          }
        }
      }
    }
  }
  