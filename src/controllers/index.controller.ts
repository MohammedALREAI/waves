import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {

  // console.log("dcjakldjhasdklhsdklhskdjlhsjk")
    try {
      res.status(200).send({
        "message":"test application  for  the  app"
      });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
