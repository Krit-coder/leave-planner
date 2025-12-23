import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePlannerComponent } from './leave-planner.component';

describe('LeavePlannerComponent', () => {
  let component: LeavePlannerComponent;
  let fixture: ComponentFixture<LeavePlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavePlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
