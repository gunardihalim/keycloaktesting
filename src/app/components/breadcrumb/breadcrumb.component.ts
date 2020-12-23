import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Location, DatePipe } from '@angular/common'

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() url: any;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) { 
    
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.activatedRoute.params.subscribe(result => {
        var newUrl = this.location.prepareExternalUrl(this.location.path())
        var link = newUrl.split('/')
        // console.log(newUrl);
        // console.log(link);
      })
    })
    // this.activatedRoute.params.subscribe(result => {
    //   var newUrl = this.location.prepareExternalUrl(this.location.path())
    //   var link = newUrl.split('/')
    //   console.log(newUrl);
    //   console.log(link);

    // })
  }

}
