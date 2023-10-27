import { ModalOptions } from '@ionic/angular';
import { RefugePage } from '../refuge/refuge.page';
import { Refuge } from '../../schemas/refuge/refuge';

export function getModalConfigurationFrom(refuge: Refuge): ModalOptions {
  return {
    cssClass: 'example-modal',
    component: RefugePage,
    componentProps: {
      refuge: refuge,
    },
    keyboardClose: true,
    breakpoints: [0, 0.3, 1],
    initialBreakpoint: 0.3,
  };
}
