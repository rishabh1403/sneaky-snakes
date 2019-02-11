class Snake {
  init(id, direction, xCoordinate, yCoordinate) {
    this.id = id;
    this.direction = direction;
    this.queue = [];
    this.insert(xCoordinate, yCoordinate);
  }

  insert(xCoordinate, yCoordinate) {
    this.queue.unshift({ xCoordinate, yCoordinate });
    [this.last] = this.queue;
  }

  remove() {
    return this.queue.pop();
  }
}

export default Snake;
