export const REPOSITORY_GRIDVIEW_TEMPLATE = `
<div>
    <div class="row" style="position:relative;">
        <div class="toolbar">
            <div class="row flex-items-xs-right option-right rightPos">
                <div class="flex-xs-middle">
                    <hbr-push-image-button style="display: inline-block;" [registryUrl]="registryUrl" [projectName]="projectName"></hbr-push-image-button>
                    <hbr-filter [withDivider]="true" filterPlaceholder="{{'REPOSITORY.FILTER_FOR_REPOSITORIES' | translate}}" (filter)="doSearchRepoNames($event)" [currentValue]="lastFilteredRepoName"></hbr-filter>
                    <span class="card-btn" (click)="showCard(true)" (mouseenter) ="mouseEnter('card') "  (mouseleave) ="mouseLeave('card')">
                        <clr-icon [ngClass]="{'is-highlight': isCardView || isHovering('card') }" shape="view-cards"></clr-icon>
                    </span>
                    <span class="list-btn" (click)="showCard(false)" (mouseenter) ="mouseEnter('list') "  (mouseleave) ="mouseLeave('list')">
                        <clr-icon [ngClass]="{'is-highlight': !isCardView || isHovering('list') }"shape="view-list"></clr-icon>
                    </span>
                    <span class="filter-divider"></span>
                    <span class="refresh-btn" (click)="refresh()"><clr-icon shape="refresh"></clr-icon></span>
                </div>
            </div>
        </div>
    </div>
    <div *ngIf="!isCardView" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <clr-datagrid (clrDgRefresh)="clrLoad($event)" [clrDgLoading]="loading"  [(clrDgSelected)]="selectedRow" (clrDgSelectedChange)="selectedChange()">
        <clr-dg-action-bar>
          <button *ngIf="withAdmiral" type="button" class="btn btn-sm btn-secondary" (click)="provisionItemEvent($event, selectedRow[0])" [disabled]="!(selectedRow.length===1 && hasProjectAdminRole)"><clr-icon shape="times" size="16"></clr-icon>&nbsp;{{'REPOSITORY.DEPLOY' | translate}}</button>
          <button *ngIf="withAdmiral" type="button" class="btn btn-sm btn-secondary" (click)="itemAddInfoEvent($event, selectedRow[0])" [disabled]="!(selectedRow.length===1 && hasProjectAdminRole)"><clr-icon shape="times" size="16"></clr-icon>&nbsp;{{'REPOSITORY.ADDITIONAL_INFO' | translate}}</button>
          <button type="button" class="btn btn-sm btn-secondary" (click)="deleteRepos(selectedRow)" [disabled]="!(selectedRow.length && hasProjectAdminRole)"><clr-icon shape="times" size="16"></clr-icon>&nbsp;{{'REPOSITORY.DELETE' | translate}}</button>
        </clr-dg-action-bar>
        <clr-dg-column [clrDgField]="'name'">{{'REPOSITORY.NAME' | translate}}</clr-dg-column>
        <clr-dg-column [clrDgSortBy]="tagsCountComparator">{{'REPOSITORY.TAGS_COUNT' | translate}}</clr-dg-column>
        <clr-dg-column [clrDgSortBy]="pullCountComparator">{{'REPOSITORY.PULL_COUNT' | translate}}</clr-dg-column>
        <clr-dg-placeholder>{{'REPOSITORY.PLACEHOLDER' | translate }}</clr-dg-placeholder>
        <clr-dg-row *ngFor="let r of repositories"  [clrDgItem]="r">
          <clr-dg-cell><a href="javascript:void(0)" (click)="watchRepoClickEvt(r)"><span *ngIf="withAdmiral" class="list-img"><img [src]="getImgLink(r)"/></span>{{r.name}}</a></clr-dg-cell>
          <clr-dg-cell>{{r.tags_count}}</clr-dg-cell>
          <clr-dg-cell>{{r.pull_count}}</clr-dg-cell>
        </clr-dg-row>
        <clr-dg-footer>
          <span *ngIf="showDBStatusWarning" class="db-status-warning">
            <clr-icon shape="warning" class="is-warning" size="24"></clr-icon>
            {{'CONFIG.SCANNING.DB_NOT_READY' | translate }}
          </span>
          <span *ngIf="pagination.totalItems">{{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} {{'REPOSITORY.OF' | translate}}</span>
          {{pagination.totalItems}} {{'REPOSITORY.ITEMS' | translate}}
          <clr-dg-pagination #pagination [(clrDgPage)]="currentPage" [clrDgPageSize]="pageSize" [clrDgTotalItems]="totalCount"></clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>
    </div>
    <hbr-gridview *ngIf="isCardView" #gridView style="position:relative;" [items]="repositories" [loading]="loading" [pageSize]="pageSize"
        [currentPage]="currentPage" [totalCount]="totalCount" [expectScrollPercent]="90" [withAdmiral]="withAdmiral" (loadNextPageEvent)="loadNextPage()">
        <ng-template let-item="item">
            <a class="card clickable" (click)="watchRepoClickEvt(item)">
                <div class="card-header">
                    <div [ngClass]="{'card-media-block': true, 'wrap': !withAdmiral }">
                        <img *ngIf="withAdmiral" [src]="getImgLink(item)"/>
                        <div class="card-media-description">
                            <span class="card-media-title">{{item.name}}</span>
                            <p class="card-media-text">{{registryUrl}}</p>
                        </div>
                    </div>
                </div>
                <div class="card-block">
                    <div class="card-text">
                        {{getRepoDescrition(item)}}
                    </div>
                    <div class="form-group">
                        <label>{{'REPOSITORY.TAGS_COUNT' | translate}}</label>
                        <div>{{item.tags_count}}</div>
                    </div>
                    <div class="form-group">
                        <label>{{'REPOSITORY.PULL_COUNT' | translate}}</label>
                        <div>{{item.pull_count}}</div>
                    </div>
                </div>
                <div class="card-footer">
                    <clr-dropdown [clrCloseMenuOnItemClick]="false">
                        <button *ngIf="withAdmiral" type="button" class="btn btn-link" (click)="provisionItemEvent($event, item)" [disabled]="!hasProjectAdminRole">{{'REPOSITORY.DEPLOY' | translate}}</button>
                        <button type="button" class="btn btn-link" (click)="$event.stopPropagation()" [disabled]="!hasProjectAdminRole" clrDropdownTrigger>
                            {{'REPOSITORY.ACTION' | translate}}
                            <clr-icon shape="caret down"></clr-icon>
                        </button>
                        <clr-dropdown-menu clrPosition="top-left" *clrIfOpen>
                            <button *ngIf="withAdmiral" type="button" class="btn btn-link" clrDropdownItem (click)="itemAddInfoEvent($event, item)" [disabled]="!hasProjectAdminRole">
                                {{'REPOSITORY.ADDITIONAL_INFO' | translate}}
                            </button>
                            <button type="button" class="btn btn-link" clrDropdownItem (click)="deleteItemEvent($event, item)" [disabled]="!hasProjectAdminRole">
                                {{'REPOSITORY.DELETE' | translate}}
                            </button>
                        </clr-dropdown-menu>
                    </clr-dropdown>
                </div>
            </a>
        </ng-template>
    </hbr-gridview>
  <confirmation-dialog #confirmationDialog [batchInfors]="batchDelectionInfos" (confirmAction)="confirmDeletion($event)"></confirmation-dialog>
</div>
`;