import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, ButtonGroup } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { AppStateType } from '../../store/store';
import {
  gameActions,
  loadUserSaves,
  createUserSave,
} from '../../store/action-creators/game-ac';
import useStyles from './style';
import SavesW from './Saves';

// Import constants
import { gameWidth, gameHeight, initialGameData } from './constants';
import Game from './Game';
import { GameConstructor, GameInterface } from './interfaces';
import { get } from '../../helpers/storage';
import {
  setCurrentTotalScore,
  setCurrentLevelScore,
} from '../../store/action-creators/score-ac';

type MapStatePropsType = {
  isGameStarted: boolean;
  isAuth: boolean;
  gameObj: GameInterface | null;
};

type MapDispatchPropsType = {
  startGame: (isGameStarted: boolean) => void;
  loadUserSaves: (key: string) => void;
  createUserSave: (key: string, save: GameConstructor) => void;
  setGameObj: (gameObj: GameInterface | null) => void;
  setCurrentTotalScore: (totalScore: number) => void;
  setCurrentLevelScore: (level: number, score: number) => void;
};

type PropsType = MapStatePropsType & MapDispatchPropsType;

const Canvas: React.FC<PropsType> = (props): JSX.Element => {
  const { isGameStarted, startGame, isAuth, gameObj, setGameObj } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [isPause, setIsPause] = React.useState(false);
  const [sounds, setSounds] = React.useState(true);
  const authKey = get('authKey');

  const newGame = (
    gameSettings: GameConstructor,
    authStatus: boolean,
    setTotalScore: (score: number) => void,
    setLevelScore: (lvl: number, score: number) => void,
  ) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const game = new Game(
      gameSettings,
      canvas!,
      context!,
      authStatus,
      setTotalScore,
      setLevelScore,
    );
    game.start();
    setGameObj(game);
  };

  useEffect(() => {
    if (isGameStarted && !gameObj) {
      newGame(
        initialGameData,
        isAuth,
        props.setCurrentTotalScore,
        props.setCurrentLevelScore,
      );
    }
  });

  const gameLauncher = () => {
    startGame(true);
  };

  const handleOpenSaves = () => {
    setOpen(true);
    props.loadUserSaves(authKey);
  };

  const handleCloseSaves = () => {
    setOpen(false);
  };

  return (
    <main>
      <div className="container-inner">
        <div className={classes.gameContent}>
          <CSSTransition
            in={isGameStarted}
            timeout={500}
            classNames={classes.canvas}
            unmountOnExit
          >
            <div className={classes.canvasContainer}>
              <CSSTransition
                in={isPause}
                timeout={500}
                classNames={classes.paused}
                unmountOnExit
              >
                <div className={classes.pause}>
                  <p>
                    G<span className="ocean-letter">A</span>ME
                  </p>
                  <p>
                    P<span className="ocean-letter">A</span>USED
                  </p>
                </div>
              </CSSTransition>
              <canvas
                className={classes.canvasElement}
                ref={canvasRef}
                width={gameWidth}
                height={gameHeight}
              />
              <ButtonGroup
                variant="text"
                aria-label="button group"
                color="inherit"
                size="large"
                className={classes.buttons}
              >
                {isAuth && (
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={() => {
                      if (gameObj) {
                        const save = gameObj.getCurrentGameState();
                        props.createUserSave(authKey, save);
                      }
                    }}
                  >
                    Save
                  </Button>
                )}
                {isAuth && (
                  <Button
                    startIcon={<PublishIcon />}
                    onClick={() => {
                      handleOpenSaves();
                      if (!isPause && gameObj) {
                        setIsPause(true);
                        gameObj.setIsPause(true);
                      }
                    }}
                  >
                    Load
                  </Button>
                )}
                <Button
                  startIcon={isPause ? <PlayArrowIcon /> : <PauseIcon />}
                  style={{ width: '100px' }}
                  onClick={() => {
                    if (gameObj) {
                      setIsPause(!isPause);
                      gameObj.setIsPause(!isPause);
                    }
                  }}
                >
                  {isPause ? 'Play' : 'Pause'}
                </Button>
                <Button
                  startIcon={sounds ? <VolumeUpIcon /> : <VolumeOffIcon />}
                  style={{ width: '120px' }}
                  onClick={() => {
                    if (gameObj) {
                      setSounds(!sounds);
                      gameObj.setIsSound(!sounds);
                    }
                  }}
                >
                  {sounds ? 'Mute' : 'Unmute'}
                </Button>
                <Button
                  startIcon={<VideogameAssetIcon />}
                  onClick={() => {
                    if (gameObj) {
                      gameObj.stop();
                      newGame(
                        initialGameData,
                        isAuth,
                        props.setCurrentTotalScore,
                        props.setCurrentLevelScore,
                      );
                    }
                  }}
                >
                  New game
                </Button>
              </ButtonGroup>
            </div>
          </CSSTransition>
          {!isGameStarted && (
            <button
              className="start-button"
              type="button"
              onClick={gameLauncher}
            >
              Start game
            </button>
          )}
        </div>
      </div>
      {isAuth && (
        <SavesW
          gameObj={gameObj}
          open={open}
          handleClose={handleCloseSaves}
          isPause={isPause}
          setIsPause={setIsPause}
        />
      )}
    </main>
  );
};

const mapStateToProps = (state: AppStateType) => ({
  isGameStarted: state.gameData.isGameStarted,
  isAuth: state.authData.isAuth,
  gameObj: state.gameData.gameObj,
});

const CanvasW = connect(mapStateToProps, {
  ...gameActions,
  loadUserSaves,
  createUserSave,
  setCurrentTotalScore,
  setCurrentLevelScore,
})(Canvas);

export default CanvasW;
