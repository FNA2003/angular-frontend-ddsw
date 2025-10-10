import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ProjectEnum } from '../../models/project.model';

@Directive({
  selector: '[appProjectsStylesDirectives]'
})
export class ProjectsStylesDirectives {
  @Input() projectType:ProjectEnum = ProjectEnum.PERSONAL;

  constructor(private element: ElementRef, private renderer:Renderer2) { }

  ngOnInit() {
    /*switch(this.projectType) {
      case ProjectEnum.ORGANIZATIONAL:

      case ProjectEnum.PERSONAL:
    }*/
  }
}
