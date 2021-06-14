using System;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using MemoryLane.Api.Services;
using MemoryLane.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;

namespace MemoryLane.Api.Functions
{
    public class GetYear
    {
        private readonly IYearService _yearService;

        public GetYear(IYearService yearService)
        {
            _yearService = yearService;
        }

        [FunctionName(nameof(GetYear))]
        public async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")]
            HttpRequest req)
        {
            if (
                !req.Query.TryGetValue("year", out var yearQuery) ||
                !int.TryParse(yearQuery.Single(), out var year) ||
                year < 1925 || year > DateTime.Now.Year)
            {
                return new BadRequestResult();
            }

            return new OkObjectResult(
                new YearViewModel(await _yearService.GetYear(year)));
        }
    }
}