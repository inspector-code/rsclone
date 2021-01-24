import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    color: '#565656',
    marginBottom: '35px',
  },
  large: {
    width: '250px',
    height: '250px',
    margin: '0 auto 15px',
  },
  score: {
    marginBottom: '15px',
    fontSize: '1rem',
  },
  table: {
    minWidth: 650,
    '& th': {
      fontSize: '1.3rem',
    },
    '& td': {
      fontSize: '1.1rem',
    },
  },
});

export default useStyles;
