import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableClientComponent } from '../../components/table/table.component';
import { GetUsersListUsecase } from '../../../../application/clients/list-client.usercase';
import { IClient, IClientRequest } from '../../../../domain/model/client.model';
import { RemoveClientService } from '../../../services/remove/remove-client.service';
import { RemoveClientUsecase } from '../../../../application/clients/delete-client.usercase';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { UpdateClientUsecase } from '../../../../application/clients/update-client.usercase';
import { CreateUserUsecase } from '../../../../application/clients/create-user.usecase';

@Component({
  selector: 'lib-list-client',
  imports: [TableClientComponent, AsyncPipe],
  templateUrl: './list-client.component.html',
})
export class ListClientComponent implements OnInit, OnDestroy {
  private readonly __useCase = inject(CreateUserUsecase);
  private readonly __useCaseList = inject(GetUsersListUsecase);
  private readonly __useCaseRemove = inject(RemoveClientUsecase);
  private readonly __useCaseUpdate = inject(UpdateClientUsecase);
  public clients$: Observable<IClient[]>;
  public clientFound$: Observable<IClient>;

  ngOnInit(): void {
    this.__useCase.initSubscriptions();
    this.__useCaseList.initSubscriptions();
    this.__useCaseRemove.initSubscriptions();
    this.__useCaseList.execute();
    this.clients$ = this.__useCaseList.clients$();
    this.clientFound$ = this.__useCaseUpdate.clientFound$();
    console.log(this.clients$);
  }
  removeClient(id: number) {
    this.__useCaseRemove.execute(id);
  }
  createClient(user: IClientRequest) {
    console.log(user);
    this.__useCase.execute(user);
  }
  ngOnDestroy(): void {
    this.__useCaseList.destroySubscriptions();
    this.__useCaseRemove.destroySubscriptions();
    this.__useCaseUpdate.destroySubscriptions();
    this.__useCase.destroySubscriptions();
  }
  handleSelectClient(id: number) {
    this.__useCaseUpdate.selectClient(id);
  }
  UpdateClient({ client, id }: { client: IClientRequest; id: number }) {
    this.__useCaseUpdate.execute(client, id);
  }
}
