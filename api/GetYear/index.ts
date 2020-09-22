import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { equal } from "assert";

import { YearService } from "../src/services/yearService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const yearString = req.query.year;
  if (!/^\d+$/.test(yearString)) {
    throw "Year is not a number";
  }

  const yearResponse = await YearService.GetYear(+req.query.year);
  
  context.res = {
    body: yearResponse
  };
};

export default httpTrigger;