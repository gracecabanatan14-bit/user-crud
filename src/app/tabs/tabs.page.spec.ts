import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  cubeOutline,
  informationCircleOutline,
} from 'ionicons/icons';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    addIcons({
      'add-circle-outline': addCircleOutline,
      'cube-outline': cubeOutline,
      'information-circle-outline': informationCircleOutline,
    });

    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should label the third tab About', () => {
    const tabLabel = fixture.nativeElement.querySelector(
      'ion-tab-button[tab="about"] ion-label',
    );

    expect(tabLabel.textContent.trim()).toBe('About');
  });
});
