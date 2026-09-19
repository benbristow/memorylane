using System;
using System.Linq;
using System.Threading.Tasks;
using MemoryLane.Api.Services;
using MemoryLane.Api.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace MemoryLane.Api.Functions;

public class GetYear
{
    private readonly IYearService _yearService;

    public GetYear(IYearService yearService)
    {
        _yearService = yearService;
    }

    [Function(nameof(GetYear))]
    public async Task<IActionResult> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get")]
        HttpRequest req)
    {
        if (
            !req.Query.TryGetValue("year", out var yearQuery) ||
            !int.TryParse(yearQuery.FirstOrDefault(), out var year) ||
            year < 1925 || year > DateTime.Now.Year)
        {
            return new BadRequestResult();
        }

        req.HttpContext.Response.Headers["Cache-Control"] = "public, max-age=86400, s-maxage=86400";

        return new OkObjectResult(
            new YearViewModel(await _yearService.GetYear(year)));
    }
}