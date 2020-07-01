import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from 'react-reveal/Fade';
import _ from 'lodash';

import CardView from '../cardView/CardView';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    flexGrow: 1,
  },
}));

function DisplayResult(props: any) {
  const classes = useStyles();

  const renderDisplayResult = () => {
    let cardViewResultList = null;

    if (!_.isEmpty(props.resultList)) {
      cardViewResultList = props.resultList.map((item: any, i: number) => {
        return (
          <Grid key={i} item xs={12} sm={4}>
            <Fade bottom>
              <div className="d-flex justify-content-center">
                <CardView resultListItem={item} />
              </div>
            </Fade>
          </Grid>
        );
      });
    }

    return cardViewResultList;
  };

  const renderDiv = () => {
    let renderDiv: any = null;

    if (!_.isEmpty(props.resultList)) {
      renderDiv = (
        <div className={classes.root} style={{ overflow: 'hidden' }}>
          <Grid container spacing={3}>
            {renderDisplayResult()}
          </Grid>
        </div>
      );
    }

    return renderDiv;
  };

  return renderDiv();
}

export default DisplayResult;
