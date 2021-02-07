import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GameInterface } from '../../interfaces/game.interface';
import { GamesService } from '../../services/games.service';

@Component({
  selector: 'app-games-card-component',
  templateUrl: './games-card.component.html',
  styleUrls: ['./games-card.component.scss']
})
export class GamesCardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private gamesSubscription: Subscription;
  private timeout: any;
  public displayedColumns: string[] = ['name', 'description', 'creationDate'];
  public games: GameInterface[] = [];
  public dataSource: MatTableDataSource<GameInterface>;
  public isLoading: boolean;
  public hasError: boolean;
  public errorMessageCode = 'GAMES_ERROR_MESSAGE';

  constructor(private gamesService: GamesService) {}

  ngOnInit() {
    this.isLoading = true;

    this.gamesSubscription = this.gamesService
      .getGames()
      .pipe(
        tap((games) => {
          this.games = games;
          this.dataSource = new MatTableDataSource(this.games);
          this.isLoading = false;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 0);
        }),
        catchError(() => {
          this.hasError = true;
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.gamesSubscription) {
      this.gamesSubscription.unsubscribe();
    }
  }

  public applyFilter(event: Event) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      const filterValue = (event.target as HTMLInputElement).value;

      this.dataSource.filter = filterValue.trim().toLowerCase();
    }, 600);
  }
}
