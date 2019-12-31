import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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
          <EmailIcon style={{ cursor: 'pointer' }} className="mr-3" fontSize="large" onClick={handleEmailIconClick} />
          <GitHubIcon style={{ cursor: 'pointer' }} fontSize="large" onClick={handleGithubIconClick} />
        </Paper>
      </div>
      <div className="my-5 d-flex justify-content-center">
        <Paper className={`${classes.root} mx-4 w-75 text-center`}>
          <iframe
            title="donorbox"
            allowpaymentrequest=""
            frameBorder="0"
            height="900px"
            name="donorbox"
            scrolling="no"
            seamless="seamless"
            src="https://donorbox.org/embed/donate-for-lunch-picker-better-features-and-development?default_interval=o"
            style={{ maxWidth: '500px', minWidth: '310px', maxHeight: 'none !important', minHeight: window.innerHeight, padding: '1em 2.8em' }}
            width="100%">
          </iframe>
        </Paper>
      </div>
    </div>
  )
}

export default Contact;
