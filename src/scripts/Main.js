import Carousel from './components/Carousel';
import Icons from './utils/Icons';

class Main {
  constructor() {
    this.init();
  }

  init() {
    document.documentElement.classList.add('has-js');
    Icons.load();

    const components = document.querySelectorAll('[data-component]');
    for (let i = 0; i < components.length; i++) {
      const element = components[i];
      const componentName = element.dataset.component;

      if (componentName == 'Carousel') {
        new Carousel(element);
      } else {
        console.log(`La composante ${componentName} n'existe pas`);
      }
    }
  }
}
new Main();
