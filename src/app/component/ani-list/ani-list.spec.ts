import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AniList } from './ani-list';

describe('AniList', () => {
  let component: AniList;
  let fixture: ComponentFixture<AniList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AniList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AniList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
