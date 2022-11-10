import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiURL = 'YOUR_HOSTED_API_URL_HERE/';
// Injectavle tells Angular that this service will be available everywhere ( a way of scoping services)
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) { // tells Angular to inject an HttpClient into this class

  }
   // Making the api call for the user registration endpoint
   // ( the userRegistration method takes an argument of type any that's the userDetails to post to the API endpoint 
   // (apiUrl + 'users', similar to apiUrl/${users} in React). Using this.http, it posts it to the API endpoint and returns the API's response.)
   // API call for User registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    // The .pipe() function is from RxJS, a reactive programming library for JavaScript, and is used to combine multiple functions into a single function. 
    // The pipe() function takes the functions you want to combine (in this case, there's one method, catchError) as its arguments and will return a new function that, 
    // when executed, runs the composed functions in sequence.
    return this.http
      .post(apiURL + 'users', userDetails)
      .pipe(catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occured:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  // API call for User login
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
    .post(apiURL + 'login', userDetails)
    .pipe(catchError(this.handleError)
    );
  }

  // API call for Get all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiURL + 'movies', {headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )}).pipe(map(this.extractResponseData),catchError(this.handleError));
    }

  // API call for Get one movie
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`apiURLmovies/¢{title}`, {
      headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token
      }
    )}).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // API call for Get director info
  getDirector(director: string): Observable<any>  {
    const token = localStorage.getItem('token');
    return this.http
    .get(`${apiURL}movies/Director/${director}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )}).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // API call for Get genre
  getGenre(genre: string): Observable<any>  {
    const token = localStorage.getItem('token');
    return this.http
    .get(`${apiURL}movies/Genre/${genre}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )}).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // API call for Get user
  getUser(): Observable<any>  {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
    .get(`${apiURL}users/${user}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )}).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // API call for Get favourite movies for a user
  getFavoriteMovie(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
    .get(`${apiURL}users/${user}/movies`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
      }
      )}).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // API call for Add a movie to favourite Movies
  addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
    .put(`${apiURL}users/${user}/movies/${movieID}`,
    { FavoriteMovie: movieID }, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )}).pipe(map(this.extractResponseData))
    }

  // API call for Edit user
  editUser(updateDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .put(`${apiURL}users/${user}`, updateDetails, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // API call for Delete user and
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .delete(`${apiURL}users/${user}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // API call for Delete a movie from the favorite movies
  removeFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .delete(`${apiURL}users/${user}/movies/${movieID}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
    private extractResponseData(res: Response): any {
      const body = res;
      return body || { };
    }
    
}