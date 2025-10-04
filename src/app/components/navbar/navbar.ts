import { Component, OnInit } from '@angular/core';
import { NavbarService, LinkI } from '../../services/navbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  navLinks:LinkI[] = [];
  
  constructor(private navbarService: NavbarService) {}

  ngOnInit() {
    this.navbarService.links$.subscribe(links => {
      this.navLinks = links;
    });
  }
}