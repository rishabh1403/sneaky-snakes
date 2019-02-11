import React, { Component } from 'react';
import constants from '../../utils/constants';
import Snake from '../../utils/snake';

class GameEngine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyState: {},
      frames: 0,
      firstSnake: new Snake(),
      firstScore: 0,
    };
    this.updateGame = this.updateGame.bind(this);
  }

  componentDidMount() {
    const {
      width, height, setCellType, setFood,
    } = this.props;

    // Initialize First Snake
    const firstSnakePosition = { x: Math.floor(width / 2), y: height - 1 };
    const { firstSnake } = this.state;
    firstSnake.init('yo', constants.UP, firstSnakePosition.x, firstSnakePosition.y);
    setCellType(constants.SNAKE, firstSnakePosition.x, firstSnakePosition.y);
    setTimeout(setFood, 0);
    this.setState(() => ({ firstSnake }));

    document.addEventListener('keydown', (event) => {
      this.setState((prevState) => {
        const newKeyState = { ...prevState.keyState, [event.keyCode]: true };
        return {
          keyState: newKeyState,
        };
      });
    });

    document.addEventListener('keyup', (event) => {
      this.setState((prevState) => {
        const newKeyState = { ...prevState.keyState, [event.keyCode]: false };
        return {
          keyState: newKeyState,
        };
      });
    });

    this.updateGame();
  }

  updateGame() {
    this.setState(prevState => ({ frames: prevState.frames + 1 }));

    const {
      width, height, setCellType, getCellType, initGrid, setFood,
    } = this.props;
    let { firstScore } = this.state;
    const { frames } = this.state;
    const { keyState } = this.state;
    const snake = this.state.firstSnake;
    if (keyState[constants.KEY_LEFT] && snake.direction !== constants.RIGHT) snake.direction = constants.LEFT;
    if (keyState[constants.KEY_UP] && snake.direction !== constants.DOWN) snake.direction = constants.UP;
    if (keyState[constants.KEY_RIGHT] && snake.direction !== constants.LEFT) snake.direction = constants.RIGHT;
    if (keyState[constants.KEY_DOWN] && snake.direction !== constants.UP) snake.direction = constants.DOWN;

    if (frames % 10 === 0) {
      let nextX = snake.last.xCoordinate;
      let nextY = snake.last.yCoordinate;

      switch (snake.direction) {
        case constants.LEFT:
          nextX -= 1;
          break;
        case constants.UP:
          nextY -= 1;
          break;
        case constants.RIGHT:
          nextX += 1;
          break;
        case constants.DOWN:
          nextY += 1;
          break;
        default:
      }

      if (
        nextX < 0
        || nextX > width - 1
        || nextY < 0
        || nextY > height - 1
        || getCellType(nextX, nextY) === constants.SNAKE
      ) {
        initGrid();
        return this.updateGame();
      }
      let tail = null;
      if (getCellType(nextX, nextY) === constants.FOOD) {
        firstScore += 1;
        tail = { xCoordinate: nextX, yCoordinate: nextY };
        setFood();
      } else {
        tail = snake.remove();
        setCellType(constants.EMPTY, tail.xCoordinate, tail.yCoordinate);
        tail.xCoordinate = nextX;
        tail.yCoordinate = nextY;
      }

      setCellType(constants.SNAKE, tail.xCoordinate, tail.yCoordinate);
      snake.insert(tail.xCoordinate, tail.yCoordinate);
    }

    this.setState(() => {
      window.requestAnimationFrame(this.updateGame);
      return {
        firstSnake: snake,
        firstScore,
      };
    });
  }

  render() {
    return <React.Fragment />;
  }
}

export default GameEngine;
