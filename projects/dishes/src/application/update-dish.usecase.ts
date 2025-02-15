import { inject, Injectable } from '@angular/core';
import { UpdateMenuService } from '../infrastructure/services/update/update-menu.service';

import { Observable, Subscription, tap } from 'rxjs';
import { IDish, IDishRequest, State } from '../public-api';

@Injectable({
  providedIn: 'root',
})
export class UpdateDishUsecase {
  private readonly _service = inject(UpdateMenuService);
  private readonly _state = inject(State);
  private subscriptions: Subscription = new Subscription();

  currentDish$(): Observable<IDish> {
    return this._state.dishes_list.dish.$();
  }

  initSubscriptions(): void {
    this.subscriptions = new Subscription();
  }

  execute(dish: IDishRequest, id: number): void {
    this.subscriptions.add(
      this._service
        .updateDish(dish, id)
        .pipe(
          tap((result) => {
            const dishes = this._state.dishes_list.dishes.snapshot();
            const updatedDishes = dishes.map((dish) =>
              dish.id === id ? result : dish
            );
            this._state.dishes_list.dishes.set(updatedDishes);
            this._state.dishes_list.dish.set(null);
          })
        )
        .subscribe()
    );
  }

  destroySubscriptions(): void {
    this.subscriptions.unsubscribe();
  }
  selectDish(id: number): void {
    const currentDish = this._state.dishes_list.dishes
      .snapshot()
      .find((dish) => dish.id === id);
    this._state.dishes_list.dish.set(currentDish);
  }
}
