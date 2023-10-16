import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefugePage } from './refuge.page';
import { async } from 'rxjs';

describe('RefugePage', () => {
  let component: RefugePage;
  let fixture: ComponentFixture<RefugePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RefugePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
