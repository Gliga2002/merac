import getRequest from '../util/getRequest.js';
import Merac from './merac.js';

export default class Application {
  constructor() {}

  draw = async (ulElContainer) => {
    try {
      const allMerac = await getRequest(
        `https://localhost:5001/Merac/PreuzmiMerace`
      );

      allMerac.forEach((m) => {
        console.log(m);
        const merac = new Merac(
          m.id,
          m.naziv,
          m.max,
          m.min,
          m.dg,
          m.gg,
          m.boja,
          m.podeok,
          m.trenutna,
          m.srednja
        );

        merac.draw(ulElContainer);
      });
    } catch (err) {
      console.log(err.message, err.statusCode || 500);
    }
  };
}
