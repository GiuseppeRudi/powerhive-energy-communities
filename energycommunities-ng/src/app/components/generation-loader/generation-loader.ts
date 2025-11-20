import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-generation-loader',
  imports: [],
  templateUrl: './generation-loader.html',
  styleUrl: './generation-loader.css',
  standalone: true
})
export class GenerationLoader {
  @Input() status: string = "Generating...";
}
