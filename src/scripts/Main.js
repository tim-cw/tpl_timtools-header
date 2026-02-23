import Icons from "./utils/Icons.js";

class Main {
  constructor() {
    this.init();
  }

  init() {
    // On ajoute une classe sur le html
    // pour qu'on puisse savoir si le JavaScript est
    // supporté dans notre css
    document.documentElement.classList.add("has-js");

    // Pssst, ton ComponentFactory va ici

    //Icons.load();
  }
}
new Main();
