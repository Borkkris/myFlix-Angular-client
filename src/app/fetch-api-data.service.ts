import { Injectable } from '@angular/core';

import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
// So this .ts 
//Declaring the api url that will provide data for the client app
const apiUrl = 'https://app-my-flix.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
  *API call to register a new user
  * @service POST to an API endpoint to register a new user
  * @returns a new user object in json format
  * @function userRegistration
  */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API call to login a user
  * @service POST to an API endpoint to login a user
  * @param {any} userDetails
  * @returns a user object in json format
  * @function userLogin
  * @returns
  */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * This function gets all the movies from the database
  * @function getMovies
  * @returns void
  */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API Endpoint for getting Movie by Title
  * @service GET to an API endpoint to get a movie by title
  * @param {string} title
  * @returns a an array of movie objects in json format
  * @function getMovieByTitle
  */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}movies/${title}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API Endpoint for getting director info
  * @service GET to an API endpoint to get director info
  * @param {string} director
  * @returns a an array of movie objects in json format
  * @function getDirector
  */
  getDirector(director: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}movies/directors/${director}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API Endpoint for getting genre info
  * @service GET to an API endpoint to get genre info
  * @param {string} genre
  * @returns a an array of movie objects in json format
  * @function getGenre
  */
  getGenre(genre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}movies/genre/${genre}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API Endpoint to get specific user Info
  * @service GET to an API endpoint to get a specific user
  * @returns a user object in json format
  * @function getUser
  */
  getUser(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}users/${username}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // 
  /**
  * Get favourite movies for a user
  * @service GET to an API endpoint to get a movie from a user's favorites list
  * @returns a user object in json format
  * @function getFavoriteMovies
  */
  getFavoriteMovies(): Observable<any> {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}users/${user}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API Endpoint to add favorite movie to user's list
  * @service POST to an API endpoint to add a movie to a user's favorites list
  * @returns a user object in json format
  * @function addFavoriteMovie
  */
  addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .post(
        `${apiUrl}users/${user}/movies/${movieID}`,
        { FavoriteMovie: movieID },
        {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API Endpoint to update user Details
  * @service PUT to an API endpoint to update a user's details
  * @returns a user object in json format
  * @function editUser
  */
  editUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .put(`${apiUrl}users/${username}`, updatedUser, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * API Endpoint to delete a user
  * @service DELETE to an API endpoint to delete a user
  * @returns success message
  * @function deleteUser
  */
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(`${apiUrl}users/${username}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  /**
  * API Endpoint to remove favorite movie from user's list
  * @service DELETE to an API endpoint to remove a movie from a user's favorites list
  * @returns a user object in json format
  * @function addFavoriteMovie
  */
  removeFavoriteMovie(MovieID: string): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(`${apiUrl}users/${username}/movies/${MovieID}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
  * extracts response data from HTTP response
  * @param res
  * @returns response body or empty object
  */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
  * handles errors
  * @param error
  * @returns error message
  */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}