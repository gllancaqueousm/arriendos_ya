import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyRecord } from '../../models/property.model';

@Component({
  selector: 'app-property-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-detail-panel.component.html',
  styleUrl: './property-detail-panel.component.css'
})
export class PropertyDetailPanelComponent implements OnChanges {
  @Input() property: PropertyRecord | null = null;
  @Input() isSaving = false;
  @Input() errorMessage = '';

  @Output() readonly save = new EventEmitter<PropertyRecord>();

  editableProperty: PropertyRecord | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property']) {
      this.editableProperty = this.property ? { ...this.property } : null;
    }
  }

  saveChanges(): void {
    if (this.editableProperty) {
      this.save.emit({ ...this.editableProperty });
    }
  }
}
