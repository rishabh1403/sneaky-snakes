import React, { Component } from 'react';
import constants from '../../utils/constants';
import GameCanvas from '../GameCanvas';
import GameEngine from '../GameEngine';

class Grid extends Component {
  constructor(props) {
    super(props);
    const { width, height } = this.props;
    const newGrid = [];
    for (let x = 0; x < width; x += 1) {
      newGrid.push([]);
      for (let y = 0; y < height; y += 1) {
        newGrid[x].push(constants.EMPTY); // All cells are empty at beginning
      }
    }
    this.state = {
      grid: newGrid,
    };
    this.initGrid = this.initGrid.bind(this);
    this.setFood = this.setFood.bind(this);
    this.getCellType = this.getCellType.bind(this);
    this.setCellType = this.setCellType.bind(this);
  }

  componentDidMount() {
    this.initGrid();
  }

  setCellType(cellType, xCoordinate, yCoordinate) {
    this.setState((prevState) => {
      const currentGrid = prevState.grid;
      console.log(cellType, xCoordinate, yCoordinate);
      currentGrid[xCoordinate][yCoordinate] = cellType;
      return {
        grid: currentGrid,
      };
    });
  }

  getCellType(xCoordinate, yCoordinate) {
    const { grid } = this.state;
    return grid[xCoordinate][yCoordinate];
  }

  setFood() {
    const { width, height } = this.props;
    const empty = [];

    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        if (this.getCellType(x, y) === constants.EMPTY) {
          empty.push({ x, y });
        }
      }
    }

    const randPos = empty[Math.floor(Math.random() * empty.length)];
    this.setCellType(constants.FOOD, randPos.x, randPos.y);
  }

  initGrid() {
    const { width, height } = this.props;
    const newGrid = [];
    for (let x = 0; x < width; x += 1) {
      newGrid.push([]);
      for (let y = 0; y < height; y += 1) {
        newGrid[x].push(constants.EMPTY); // All cells are empty at beginning
      }
    }
    this.setState(() => ({
      grid: newGrid,
    }));
  }

  render() {
    const { width, height } = this.props;
    return (
      <React.Fragment>
        <GameCanvas height={height} width={width} getCellType={this.getCellType} />
        <GameEngine
          height={height}
          width={width}
          getCellType={this.getCellType}
          setCellType={this.setCellType}
          initGrid={this.initGrid}
          setFood={this.setFood}
        />
      </React.Fragment>
    );
  }
}

export default Grid;
