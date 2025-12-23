import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiExperienceComponent } from './ai-experience.component';

describe('AiExperienceComponent', () => {
  let component: AiExperienceComponent;
  let fixture: ComponentFixture<AiExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiExperienceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
