import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUser()
    this.getFavoriteMovies()
  }

  /**
  * Gets user data from api call and sets the user variable to returned JSON file
  * @returns object holding user information
  * @function getUser
  */
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      console.log("from profile", this.user);
      return this.user;
    })
  }

  /**
  * Gets favorite movies from api call and sets the favorite movies variable to return JSON file
  * @returns an array holding user's favorite movies
  * @function getFavoriteMovies
  */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      const favoriteMovieIds = resp.FavoriteMovies;
      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.favoriteMovies = resp.filter((m: any) => favoriteMovieIds.includes(m._id));
        console.log("Filter fav movies", this.favoriteMovies)
        return this.favoriteMovies;
      });
    });
  }

  /**
  * opens the edit profile dialog from EditProfileComponent to allow user to edit their details
  */
  openEditProfileDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '300px',
    });
  }

  /**
  * deletes the user profile, redirects to welcome screen
  * @function deleteUser
  */
  deleteProfile(): void {
    if ( 
      confirm(
        `Are you sure xou want to delete your account? This can't be undone`
      )
    ) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You seccessfully deleted your account!',
          'OK', {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}
