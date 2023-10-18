import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule}  from '@angular/material/chips';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTooltipModule
  ]

})
export class MaterialModule { }