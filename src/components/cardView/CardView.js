import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import StarIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LinkIcon from '@material-ui/icons/Link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { red } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import _ from 'lodash';
import axios from 'axios';

const ROOT_URL = "https://lunch-picker-api.herokuapp.com/api";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function CardView(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const item = props.resultListItem;
  const id = item.id;
  const name = item.name;
  const avatarStr = name[0].toUpperCase();
  const categories = item.categories;
  const imageUrl = item.image_url;
  const url = item.url;
  const rating = item.rating;
  const location = item.location.display_address.join(', ');
  const displayPhone = item.display_phone;

  let subHeader = "";
  if (!_.isEmpty(categories)) {
    categories.forEach((item, i) => {
      if (i === 0)
        subHeader += item.title;
      else
        subHeader += ", " + item.title;
    });
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);

    getRestaurantsDetailsReviewById(id);
  };

  const getRestaurantsDetailsReviewById = () => {
    axios.get(
      `${ROOT_URL}/restaurant/get-restaurant-details-review/${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => {
        if (!_.isEmpty(response)) {
          console.log("response = ", response);

        }
      })
      .catch((error) => {
        if (!_.isEmpty(error)) {
          console.log("error = ", error);
        }
      });
  };

  const handleLinkIconClick = () => {
    window.open(url);
  }

  const renderStarIcon = () => {
    let starIconList = [];

    for (let i = 0; i < rating; i++) {
      starIconList.push(
        <StarIcon key={i} style={{ color: yellow[600] }} fontSize="small" />
      );
    }

    return starIconList;
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {avatarStr}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={subHeader}
      />
      <CardMedia
        className={classes.media}
        image={imageUrl}
        title={name}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Location: {location}
        </Typography>
        <div className="my-2"></div>
        <Typography variant="body2" color="textSecondary" component="p">
          Phone: {displayPhone}
        </Typography>
        <div className="my-2"></div>
        {renderStarIcon()}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon style={{ color: red[500] }} />
        </IconButton>
        <IconButton aria-label="link" onClick={handleLinkIconClick}>
          <LinkIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
            minutes.
            </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default CardView;
