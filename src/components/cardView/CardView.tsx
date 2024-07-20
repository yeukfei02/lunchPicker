import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
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
import FavoriteIcon from '@material-ui/icons/Favorite';
import LinkIcon from '@material-ui/icons/Link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { red } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import axios from 'axios';
import Snackbar from '../snackBar/SnackBar';
import { getRootUrl } from '../../helpers/helpers';

import yelpFavicon from '../../images/yelp-favicon.png';
import yelpLogo from '../../images/yelp-logo.png';
import star0 from '../../images/star/star-0.png';
import starHalf from '../../images/star/star-half.png';
import star1Half from '../../images/star/star-1-half.png';
import star2 from '../../images/star/star-2.png';
import star2Half from '../../images/star/star-2-half.png';
import star3 from '../../images/star/star-3.png';
import star3Half from '../../images/star/star-3-half.png';
import star4 from '../../images/star/star-4.png';
import star4Half from '../../images/star/star-4-half.png';
import star5 from '../../images/star/star-5.png';

const rootUrl = getRootUrl();

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

function CardView(props: any): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const [addToFavoritesClicked, setAddToFavoritesClicked] = useState<boolean>(false);

  const [openSuccessAlert, setOpenSuccessAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (openSuccessAlert) {
      setOpenSuccessAlert(false);
    }
    if (!_.isEmpty(message)) {
      setMessage('');
    }
  }, [openSuccessAlert, message]);

  // card data
  const item = props.inFavouritesView === undefined ? props.resultListItem : props.resultListItem.item;
  const _id = props.inFavouritesView !== undefined ? props.resultListItem._id : '';

  let id = '';
  let name = '';
  let categories: any[] = [];
  let imageUrl = '';
  let url = '';
  let rating = 0;
  let reviewCount = 0;
  let location = '';
  let displayPhone = '';
  if (!_.isEmpty(item)) {
    id = item.id;
    name = item.name;
    categories = item.categories;
    imageUrl = item.image_url;
    url = item.url;
    rating = item.rating;
    reviewCount = item.review_count;
    location = item.location.display_address.join(', ');
    displayPhone = item.display_phone;
  }

  let subHeader = '';
  if (!_.isEmpty(categories)) {
    categories.forEach((item: any, i: number) => {
      if (!_.isEmpty(item.title))
        if (i === 0) subHeader += item.title;
        else subHeader += ', ' + item.title;
    });
  }

  const handleExpandClick = async () => {
    setExpanded(!expanded);

    if (!expanded) {
      await getRestaurantsDetailsReviewById(id);
    }
  };

  const getRestaurantsDetailsReviewById = async (id: string) => {
    const response = await axios.get(`${rootUrl}/restaurant/get-restaurant-details-review/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      const reviewsList = response.data.restaurantDetailsReview.reviews;
      setReviewsList(reviewsList);
    }
  };

  const handleOpenUrl = () => {
    window.open(url);
  };

  const renderStarIcon = (rating: number) => {
    let starIcon;

    if (rating === 0) {
      starIcon = <img className="img-fluid" src={star0} alt="star0" width="50%" height="50%" />;
    }

    if (rating > 0 && rating <= 0.5) {
      starIcon = <img className="img-fluid" src={starHalf} alt="starHalf" width="50%" height="50%" />;
    }

    if (rating > 0.5 && rating < 1) {
      starIcon = <img className="img-fluid" src={star1Half} alt="star1Half" width="50%" height="50%" />;
    }

    if (rating >= 1.5 && rating < 2) {
      starIcon = <img className="img-fluid" src={star1Half} alt="star1Half" width="50%" height="50%" />;
    }

    if (rating >= 2 && rating < 2.5) {
      starIcon = <img className="img-fluid" src={star2} alt="star2" width="50%" height="50%" />;
    }

    if (rating >= 2.5 && rating < 3) {
      starIcon = <img className="img-fluid" src={star2Half} alt="star2Half" width="50%" height="50%" />;
    }

    if (rating >= 3 && rating < 3.5) {
      starIcon = <img className="img-fluid" src={star3} alt="star3" width="50%" height="50%" />;
    }

    if (rating >= 3.5 && rating < 4) {
      starIcon = <img className="img-fluid" src={star3Half} alt="star3Half" width="50%" height="50%" />;
    }

    if (rating >= 4 && rating < 4.5) {
      starIcon = <img className="img-fluid" src={star4} alt="star4" width="50%" height="50%" />;
    }

    if (rating >= 4.5 && rating < 5) {
      starIcon = <img className="img-fluid" src={star4Half} alt="star4Half" width="50%" height="50%" />;
    }

    if (rating === 5) {
      starIcon = <img className="img-fluid" src={star5} alt="star5" width="50%" height="50%" />;
    }

    return starIcon;
  };

  const renderFavouriteIcon = () => {
    let favouriteIcon: any = null;

    if (props.inFavouritesView === undefined) {
      favouriteIcon = (
        <IconButton aria-label="add to favorites" onClick={() => handleAddToFavorites()}>
          <FavoriteIcon style={{ color: !addToFavoritesClicked ? red[200] : red[500] }} />
        </IconButton>
      );
    } else {
      favouriteIcon = (
        <IconButton aria-label="add to favorites">
          <FavoriteIcon style={{ color: red[500] }} />
        </IconButton>
      );
    }

    return favouriteIcon;
  };

  const handleOpenUserProfileUrl = (userProfileUrl: string) => {
    window.open(userProfileUrl);
  };

  const renderReviewsList = () => {
    let formattedReviewsList: any = null;

    if (!_.isEmpty(reviewsList)) {
      formattedReviewsList = reviewsList.map((item: any, i: number) => {
        const text = item.text;
        const userName = item.user.name;
        const userProfileUrl = item.user.profile_url;
        const userImageUrl = item.user.image_url;
        return (
          <div key={i} className="my-3">
            <Avatar
              style={{ cursor: 'pointer' }}
              alt="user"
              src={userImageUrl}
              onClick={() => handleOpenUserProfileUrl(userProfileUrl)}
            />
            <Typography className="mt-2">
              <b>{userName}</b>: {text}
            </Typography>
          </div>
        );
      });
    }

    return (
      <div>
        <Typography paragraph>{t('review')}</Typography>
        {formattedReviewsList}
      </div>
    );
  };

  const handleLocationClick = (e: any) => {
    const text = e.target.innerHTML;
    window.open(`https://www.google.com/maps/search/?api=1&query=${text}`);
  };

  const handleOnMouseEnterTextStyle = (e: any) => {
    e.target.setAttribute('style', 'cursor: pointer; text-decoration: underline; color: #ed1f30');
  };

  const handleOnMouseLeaveTextStyle = (e: any) => {
    e.target.removeAttribute('style');
  };

  const handleOpenRestaurantDetailsById = (id: string) => {
    history.push(`/restaurant-details/${id}`);
  };

  const handleAddToFavorites = async () => {
    setAddToFavoritesClicked(true);

    const response = await axios.post(
      `${rootUrl}/favourites/add-to-favourites`,
      {
        item: item,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setOpenSuccessAlert(true);
      setMessage('Add to favourites success!');
    }
  };

  const renderDeleteButton = () => {
    let deleteButton: any = null;

    if (props.inFavouritesView === undefined) {
      deleteButton = (
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      );
    } else {
      deleteButton = (
        <HighlightOffIcon
          fontSize="large"
          style={{ cursor: 'pointer' }}
          onClick={() => handleDeleteFavouritesById(_id)}
        />
      );
    }

    return deleteButton;
  };

  const handleDeleteFavouritesById = async (_id: string) => {
    const response = await axios.delete(`${rootUrl}/favourites/delete-favourites/${_id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
      setOpenSuccessAlert(true);
      setMessage('Delete favourites by id success!');
      setTimeout(() => {
        props.reloadFavourites();
      }, 500);
    }
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              style={{ cursor: 'pointer' }}
              src={yelpFavicon}
              onClick={() => handleOpenRestaurantDetailsById(id)}
            />
          }
          action={renderDeleteButton()}
          title={
            <div
              onClick={() => handleOpenRestaurantDetailsById(id)}
              onMouseEnter={e => handleOnMouseEnterTextStyle(e)}
              onMouseLeave={e => handleOnMouseLeaveTextStyle(e)}
            >
              {name}
            </div>
          }
          subheader={subHeader}
        />
        <CardMedia
          style={{ cursor: 'pointer' }}
          className={classes.media}
          image={imageUrl}
          title={name}
          onClick={handleOpenUrl}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {t('location')}{' '}
            <span
              onClick={e => handleLocationClick(e)}
              onMouseEnter={e => handleOnMouseEnterTextStyle(e)}
              onMouseLeave={e => handleOnMouseLeaveTextStyle(e)}
            >
              {location}
            </span>
          </Typography>
          <div className="my-2">
            <Typography variant="body2" color="textSecondary" component="p">
              {!_.isEmpty(displayPhone) ? `${t('phone')} ${displayPhone}` : ''}
            </Typography>
          </div>
          <div className="d-inline-flex my-2">{renderStarIcon(rating)}</div>
          <div className="my-2">
            <span>
              <b>{rating}</b>
            </span>{' '}
            <span>{`(${reviewCount} reviews)`}</span>
          </div>
          <div className="mt-3">
            <img
              className="img-fluid"
              style={{ cursor: 'pointer' }}
              src={yelpLogo}
              alt="yelpLogo"
              width={100}
              height={30}
              onClick={() => handleOpenUrl()}
            />
          </div>
        </CardContent>
        <CardActions disableSpacing>
          {renderFavouriteIcon()}
          <IconButton aria-label="link" onClick={handleOpenUrl}>
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
          <CardContent>{renderReviewsList()}</CardContent>
        </Collapse>
      </Card>
      <Snackbar openSuccessAlert={openSuccessAlert} message={message} />
    </div>
  );
}

export default CardView;
