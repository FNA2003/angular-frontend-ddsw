import { Component, OnInit } from '@angular/core';
import { NavbarService, LinkI } from '../../services/navbar';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  navLinks:LinkI[] = [];

  constructor(private navbarService: NavbarService) {}

  ngOnInit() {
    this.navLinks = this.navbarService.getLinks();
  }
}