import React, { useEffect } from 'react';
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { AppStateType } from '../../store/store';
import {
  loginAndSetUserData,
  actions,
} from '../../store/action-creators/auth-ac';
import AuthPreloader from '../common/Auth-preloader/AuthPreloader';
import { useLoginStyles } from './style';

type MapStatePropsType = {
  email: string;
  password: string;
  isAuth: boolean;
  loginError: string;
  isLoading: boolean;
};

type MapDispatchPropsType = {
  loginAndSetUserData: (email: string, password: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setModal: (isModalOpen: boolean) => void;
};

type InputPropsType = {
  setModalType: (arg: 'login' | 'register' | 'restorePass') => void;
};

type PropsType = MapStatePropsType & MapDispatchPropsType & InputPropsType;

const Login: React.FC<PropsType> = (props): JSX.Element => {
  const classes = useLoginStyles();
  const {
    setModalType,
    email,
    password,
    setEmail,
    setPassword,
    setModal,
    isAuth,
    loginError,
    isLoading,
  } = props;

  useEffect(() => {
    if (isAuth) {
      setModal(false);
    }
  });

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.loginAndSetUserData(email, password);
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="on"
          value={email}
          onChange={emailHandler}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={passwordHandler}
          autoComplete="on"
        />
        {loginError && (
          <Typography component="p" variant="subtitle1" color="error">
            Incorrect email or password.
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={isLoading}
        >
          {isLoading ? <AuthPreloader /> : 'Go!'}
        </Button>
        <Grid container>
          <Grid item xs>
            <Button size="small" onClick={() => setModalType('restorePass')}>
              Forgot pass?
            </Button>
          </Grid>
          <Grid item>
            <Button size="small" onClick={() => setModalType('register')}>
              Dont have an account? Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

const mapStateToProps = (state: AppStateType) => {
  return {
    email: state.authData.email,
    password: state.authData.password,
    isAuth: state.authData.isAuth,
    loginError: state.authData.loginError,
    isLoading: state.authData.isLoading,
    isModalOpen: state.authData.isModalOpen,
  };
};

const LoginW = connect(mapStateToProps, { loginAndSetUserData, ...actions })(
  Login,
);

export default LoginW;
