import React, { useState } from 'react';
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
  const [expanded, setExpanded] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);

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

    if (_.isEmpty(reviewsList))
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
          const reviewsList = response.data.restaurantDetailsReview.reviews;
          setReviewsList(reviewsList);
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

  const handleOpenUserProfileUrl = (userProfileUrl) => {
    window.open(userProfileUrl);
  }

  const renderReviewsList = () => {
    let formattedReviewsList = null;

    if (!_.isEmpty(reviewsList)) {
      formattedReviewsList = reviewsList.map((item, i) => {
        const text = item.text;
        const userName = item.user.name;
        const userProfileUrl = item.user.profile_url;
        const userImageUrl = item.user.image_url;
        return (
          <div key={i} className="my-3">
            <Avatar style={{ cursor: 'pointer' }} alt="user" src={userImageUrl} onClick={() => handleOpenUserProfileUrl(userProfileUrl)} />
            <Typography className="mt-2">
              <b>{userName}</b>: {text}
            </Typography>
          </div>
        )
      });
    }

    return (
      <div>
        <Typography paragraph>Review:</Typography>
        {formattedReviewsList}
      </div>
    );
  }

  const handleLocationClick = (e) => {
    const text = e.target.innerHTML;
    window.open(`https://www.google.com/maps/search/?api=1&query=${text}`);
  }

  const handleLocationOnMouseEnter = (e) => {
    e.target.setAttribute('style', 'cursor: pointer; text-decoration: underline; color: #ed1f30');
  }

  const handleLocationOnMouseLeave = (e) => {
    e.target.removeAttribute('style');
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
        <Typography
          variant="body2"
          color="textSecondary"
          component="p">
          Location: <span
            onClick={(e) => handleLocationClick(e)}
            onMouseEnter={(e) => handleLocationOnMouseEnter(e)}
            onMouseLeave={(e) => handleLocationOnMouseLeave(e)}>
            {location}
          </span>
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
          {renderReviewsList()}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default CardView;
