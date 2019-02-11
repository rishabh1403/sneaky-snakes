import React, { Component } from 'react';
import constants from '../../utils/constants';
import './style.css';

class GameCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.paint = this.paint.bind(this);
  }

  componentDidUpdate() {
    this.paint();
  }

  paint() {
    const { width, height, getCellType } = this.props;
    const context = this.canvasRef.current.getContext('2d');
    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        switch (getCellType(x, y)) {
          case constants.EMPTY:
            context.fillStyle = '#fff';
            break;
          case constants.SNAKE:
            context.fillStyle = '#0ff';
            break;
          case constants.FOOD:
            context.fillStyle = '#f00';
            break;
          default:
            context.fillStyle = '#f00';
        }
        context.fillRect(
          x * constants.CELL_DIMENSION,
          y * constants.CELL_DIMENSION,
          constants.CELL_DIMENSION,
          constants.CELL_DIMENSION,
        );
        context.fillStyle = '#000';
      }
    }
  }

  render() {
    const { height, width } = this.props;
    return (
      <canvas
        ref={this.canvasRef}
        height={height * constants.CELL_DIMENSION}
        width={width * constants.CELL_DIMENSION}
        className="canvas-body"
      />
    );
  }
}

export default GameCanvas;
