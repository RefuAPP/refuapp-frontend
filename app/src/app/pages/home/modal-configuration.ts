import {RefugePage} from "../refuge/refuge.page";
import {ModalOptions} from "@ionic/angular";

export const ModalConfiguration: ModalOptions = {
  cssClass: 'example-modal',
  component: RefugePage,
  breakpoints: [0, 0.3, 1],
  initialBreakpoint: 0.3,
}
