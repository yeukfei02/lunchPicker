import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

function Contact() {
  const classes = useStyles();

  const handleEmailIconClick = () => {
    window.open('mailto:yeukfei02@gmail.com');
  }

  const handleGithubIconClick = () => {
    window.open('https://github.com/yeukfei02');
  }

  return (
    <div>
      <div className="mt-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75 text-center`}>
          <h4>contact us via email or visit our github repo</h4>
          <Tooltip title="yeukfei02@gmail.com" placement="bottom">
            <EmailIcon style={{ cursor: 'pointer' }} className="mr-3" fontSize="large" onClick={handleEmailIconClick} />
          </Tooltip>
          <Tooltip title="yeukfei02" placement="bottom">
            <GitHubIcon style={{ cursor: 'pointer' }} fontSize="large" onClick={handleGithubIconClick} />
          </Tooltip>
        </Paper>
      </div>
      <div className="my-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75 text-center`}>
          <a
            className="dbox-donation-button"
            style={{ background: '#ff0000', color: '#fff', textDecoration: 'none', fontFamily: 'Verdana,sans-serif', display: 'inline-block', fontSize: '16px', padding: '13px 17px', borderRadius: '2px', boxShadow: '0 1px 0 0 #1f5a89', textShadow: '0 1px rgba(0, 0, 0, 0.3)' }}
            href="https://donorbox.org/donate-for-lunch-picker-better-features-and-development?default_interval=o">
            Donate
          </a>
        </Paper>
      </div>
    </div>
  )
}

export default Contact;
