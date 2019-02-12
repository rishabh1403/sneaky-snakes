import React, { Component } from 'react';
import io from 'socket.io-client';
import constants from '../../utils/constants';
import Snake from '../../utils/snake';

const socket = io('http://localhost:8000');

const initialState = {
  keyState: {},
  frames: 0,
  snakes: [
    { snake: new Snake(), keyState: {} },
    { snake: new Snake(), keyState: {} },
  ],
  firstScore: 0,
};

class GameEngine extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateGame = this.updateGame.bind(this);
    this.initializeSnake = this.initializeSnake.bind(this);
  }

  componentDidMount() {
    socket.on('ready', () => {
      this.initializeSnake();
      this.updateGame();
    });

    socket.on('keydown', (id, keyState) => {
      if (id === 1) {
        const { snakes } = this.state;
        const snakeObject = { ...snakes[id], keyState };
        snakes[id] = snakeObject;
        this.setState(() => ({ snakes }));
      }
    });

    socket.on('keyup', (id, keyState) => {
      if (id === 1) {
        const { snakes } = this.state;
        const snakeObject = { ...snakes[id], keyState };
        snakes[id] = snakeObject;
        this.setState(() => ({ snakes }));
      }
    });

    document.addEventListener('keydown', (event) => {
      const id = 0;
      this.setState((prevState) => {
        const { snakes } = prevState;
        const keyState = { ...prevState.keyState, [event.keyCode]: true };
        socket.emit('keydown', id, keyState);
        const snakeObject = { ...snakes[id], keyState };
        snakes[id] = snakeObject;
        return {
          snakes,
        };
      });
    });

    document.addEventListener('keyup', (event) => {
      const id = 0;
      this.setState((prevState) => {
        const { snakes } = prevState;
        const keyState = { ...prevState.keyState, [event.keyCode]: false };
        socket.emit('keydown', id, keyState);
        const snakeObject = { ...snakes[id], keyState };
        snakes[id] = snakeObject;
        return {
          snakes,
        };
      });
    });
  }

  updateGame() {
    this.setState(prevState => ({ frames: prevState.frames + 1 }));

    const {
      width, height, setCellType, getCellType, initGrid, setFood,
    } = this.props;
    let { firstScore } = this.state;
    const { frames } = this.state;
    // const { keyState } = this.state;
    const { snakes } = this.state;
    const interSnakes = snakes.reduce((acc, snakeObject) => {
      const { snake } = snakeObject;
      const { keyState } = snakeObject;
      if (keyState[constants.KEY_LEFT] && snake.direction !== constants.RIGHT) snake.direction = constants.LEFT;
      if (keyState[constants.KEY_UP] && snake.direction !== constants.DOWN) snake.direction = constants.UP;
      if (keyState[constants.KEY_RIGHT] && snake.direction !== constants.LEFT) snake.direction = constants.RIGHT;
      if (keyState[constants.KEY_DOWN] && snake.direction !== constants.UP) snake.direction = constants.DOWN;
      const newSnakeObject = { snake, keyState };
      return [...acc, newSnakeObject];
    }, []);

    const newSnakes = interSnakes;
    if (frames % 10 === 0) {
      for (let i = 0; i < interSnakes.length; i += 1) {
        const snakeObject = interSnakes[i];
        const { snake } = snakeObject;

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
          this.setState(() => initialState);
          this.initializeSnake();
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
        newSnakes[i] = { ...snakeObject, snake };
      }
    }
    this.setState(() => {
      window.requestAnimationFrame(this.updateGame);
      return {
        snakes: newSnakes,
        firstScore,
      };
    });
  }

  initializeSnake() {
    const {
      width, height, setCellType, setFood,
    } = this.props;

    // Initialize First Snake
    const { snakes } = this.state;
    const newSnakes = snakes.reduce((acc, snakeObject, index) => {
      const snakePosition = { x: width / 2 - 2 * index, y: height - 1 };
      snakeObject.snake.init('yo', constants.UP, snakePosition.x, snakePosition.y);
      setCellType(constants.SNAKE, snakePosition.x, snakePosition.y);
      return [...acc, snakeObject];
    }, []);
    setTimeout(setFood, 0);
    this.setState(() => ({ snakes: newSnakes }));
  }

  render() {
    return <React.Fragment />;
  }
}

export default GameEngine;
