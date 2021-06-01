import React from "react";
import {fetchRetry} from './fetchRetry';

export const CINEMAWORLD_URL = "https://challenge.lexicondigital.com.au/api/v2/cinemaworld/movies";

export const FILMWORLD_URL = "https://challenge.lexicondigital.com.au/api/v2/filmworld/movies";

export const APIKEY = "Yr2636E6BTD3UCdleMkf7UEdqKnd9n361TQL9An7";

export function mergeArray(itemsFilm,itemsCinema) {
  const filmWorldArray = [];
  const cinemaWorldArray = [];
  const unionArray = [];
  const NOT_AVAILABLE = "Not Available";

  itemsFilm.map((itemFilm) => filmWorldArray.push(itemFilm.Title));
  itemsCinema.map((itemCinema) => cinemaWorldArray.push(itemCinema.Title));

  var indexInTheOtherArray, interimMovie;

  for (let i = 0; i <= filmWorldArray.length - 1; i++) {
    indexInTheOtherArray = cinemaWorldArray.indexOf(filmWorldArray[i]);
    interimMovie = {};
    interimMovie.title = itemsFilm[i].Title;
    interimMovie.image = itemsFilm[i].Poster;
    interimMovie.filmPrice = itemsFilm[i].Price;

    if (indexInTheOtherArray > -1) {
      interimMovie.cinemaPrice = itemsCinema[indexInTheOtherArray].Price;
    } else interimMovie.cinemaPrice = NOT_AVAILABLE;

    unionArray.push(interimMovie);
  }

  for (let i = 0; i <= cinemaWorldArray.length - 1; i++) {
    indexInTheOtherArray = filmWorldArray.indexOf(cinemaWorldArray[i]);
    interimMovie = {};

    if (indexInTheOtherArray === -1) {
      interimMovie.title = itemsCinema[i].Title;
      interimMovie.image = itemsCinema[i].Poster;
      interimMovie.cinemaPrice = itemsCinema[i].Price;
      interimMovie.filmPrice = NOT_AVAILABLE;
      unionArray.push(interimMovie);
    }
  }
  return unionArray;
}

class FilmState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      itemsFilm: [],
      itemsCinema: [],
    };
  }

  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", APIKEY);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetchRetry(
      FILMWORLD_URL,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            itemsFilm: result.Movies,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

    fetchRetry(
      CINEMAWORLD_URL,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            itemsCinema: result.Movies,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

  }


  render() {
    const { error, isLoaded, itemsFilm, itemsCinema } = this.state;
    var unionArray = mergeArray(itemsFilm,itemsCinema);
    if (error) {
      return <h3>Data is not currently available. <br/>
        Please be patient while we re-load... {window.location.reload(false)} </h3>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {unionArray.map((item) => (
            <li>
              <div className="container">
                <p>
                  <img alt="poster" src={item.image} />
                </p>
                <h3>{item.title}</h3>
                <p>Cinemaworld: {item.cinemaPrice}</p>
                <p>Filmworld: {item.filmPrice}</p>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  }
}
export default FilmState;
