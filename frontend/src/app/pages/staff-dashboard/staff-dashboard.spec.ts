import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDashboardComponent } from './staff-dashboard';

describe('StaffDashboardComponent', () => {
  let component: StaffDashboardComponent;
  let fixture: ComponentFixture<StaffDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
