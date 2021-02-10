import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslocoService } from '@ngneat/transloco';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DialogDataInterface } from 'src/app/shared/interfaces/dialog-data.interface';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { GamesService } from 'src/app/shared/services/games.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('tablePaginator') paginator: MatPaginator;
  @ViewChild('deleteGameDialog') deleteGameDialog: DialogComponent;
  private gamesSubscription: Subscription;
  private timeout: any;
  private gameToDeleteId: string;
  public displayedColumns: string[] = ['name', 'description', 'creationDate', 'options'];
  public games: GameInterface[] = [];
  public dataSource: MatTableDataSource<GameInterface>;
  public isLoading: boolean;
  public hasError: boolean;
  public cardTitleCode = 'SAVED_GAMES';
  public errorMessageCode = 'GAMES_ERROR_MESSAGE';

  constructor(private gamesService: GamesService, private router: Router, private translocoService: TranslocoService) {}

  ngOnInit() {
    this.isLoading = true;

    this.gamesSubscription = this.gamesService
      .getGames()
      .pipe(
        tap((games) => {
          this.hasError = false;
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

  public async handleRowClick(event: Event, game: GameInterface) {
    const elementTag = (event.target as HTMLElement).tagName;

    if (elementTag !== 'BUTTON' && elementTag !== 'MAT-ICON') {
      const gameId = game.id;

      await this.router.navigate([`/play-game/${gameId}`]);
    }
  }

  // TODO: Finish implementation
  public handleRowEditClick(game: GameInterface) {
    const gameId = game.id;
  }

  public handleRowDeleteClick(game: GameInterface) {
    this.gameToDeleteId = game.id;
    const gameName = game.name;

    const deleteGameDialogData: DialogDataInterface = {
      title: this.translocoService.translate('DELETE_GAME_TITLE', { gameName }),
      content: this.translocoService.translate('DELETE_GAME_CONTENT', { gameName }),
      confirmButtonText: this.translocoService.translate('DELETE'),
      confirmButtonColor: 'warn'
    };

    this.deleteGameDialog.data = deleteGameDialogData;

    this.deleteGameDialog.openDialog();
  }

  public handleDeleteConfirmation() {
    this.isLoading = true;

    this.gamesService.deleteGame(this.gameToDeleteId);
  }
}
