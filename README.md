San Francisco Homelessness Crisis
=========================

A custom d3 chart was created to visualize homelessness in San Francisco using data from the city's Point-In-Time counts taken every two years between 2005 and 2017. The visualization's key story is the relationship between these Point-In-Time counts and three other economic factors of interest: 

1. House Price Index (a measure of the overall increase/decrease in an area's housing prices)
2. Estimated Percentage of the Population in Poverty 
3. Unemployment Rate

![staticvis](https://github.com/cchinchristopherj/SF-Homeless/blob/master/d3_homelessness_viz.png)

The visualization demonstrates that poverty percentage and unemployment rate began at 12.2% and 5.5% respectively in 2005, and reached 12-year lows of 10.1% and 3.4% in 2017. The midpoint of the study, 2011, was an especially pivotal year - both factors reached peak values of 13.8% and 8.9% in this year, but afterwards consistently decreased until their respective minima in 2017. Based on these two counts alone, one could draw the conclusion that an improving economy post-2008 financial criss was bringing more people out of poverty, more people out of unemployment, and (optimistically) more people out of homelessness as well.

In reality, however, homelessness reached all-time highs in recent years, increasing by over 1000 people from a count of 6248 in 2005 to nearly 7500 in 2017 with the last factor of interest - house price index - being a possible explanation for this unexpected upward trend. Beginning at 172.15 in 2005, the San Francisco house price index followed the opposite trajectory of poverty percentage and unemployment rate, reaching a 12-year low of 147.77 in the pivotal year of 2011 and subsequently increasing to a maximum of 257.85 in 2017. Homelessness interestingly followed a very similar pattern, remaining in the low-to-mid 6000s pre-2011 and jumping to the low-to-mid 7000s in ensuing years as house price index increased. Therefore, despite an improving job market and fewer people below the poverty line, housing in San Francisco has become an increasingly unattainable commodity for a larger and larger proportion of the population due to the city’s unwavering escalation in housing prices.

A Point-In-Time count scheduled for 2019 will hopefully reveal a decrease in the homeless population since 2017. However, prospects are not promising - in prior years, nearly half of San Francisco’s budget for the homelessness crisis has already been devoted to supporting the city’s sheltered homeless. For the unsheltered, nonprofits and city agencies have also been in place to provide aid, but they have (ironically) been slowly driven away by the same problem of rising rent caused by the city's tech boom and growing income inequality. If the 2019 data does not cite improvement, it remains to be seen what new solutions the city will propose, but hopefully a combination of regulation and increased protections for lower-income communities will improve the homelessness crisis in years to come.

Data
=========================

The data itself consisted of publicly available .csv files drawn from four different sources:

- Point-In-Time homelessness count data was taken from the chart of [City Performance Scorecards - Homeless Population](https://sfgov.org/scorecards/safety-net/homeless-population). 
- Unemployment rate data was taken from the chart of [Unemployment Rate in San Francisco County/City, CA](https://fred.stlouisfed.org/series/CASANF0URN)
- House Price Index data was taken from the chart of [All-Transactions House Price Index for San Francisco County/City, CA](https://fred.stlouisfed.org/series/ATNHPIUS06075A)
- Poverty percentage data was taken from the chart of [Estimated Percent of People of All Ages in Poverty for San Francisco County/City, CA](https://fred.stlouisfed.org/series/PPAACA06075A156NCEN)

Due to there only being homelessness count data for every other year between 2005 and 2017 (i.e. for 2005, 2007, 2009, 2011, 2013, 2015, 2017), corresponding data for only these years was taken from the .csv files for the other three variables of interest. One final .csv file, "SFHomeless.csv" was compiled for all four variables' data. 

Visualization
=========================

The visualization, created using the d3.js library, represents data for the variables of interest in four different ways: 

- House Price Index: The outer radial chart contains 7 red arcs corresponding to the 7 years in the dataset. The size/height of each arc corresponds to the value of the house price index for that year, with semicircular line axes providing a reference for the exact values being represented. 
- Unemployment/Employment Rate: Each arc in the outer radial chart contains a grid of 100 squares. The percentage of squares that are yellow indicates the employment rate, while the percentage of squares that are black indicates the unemployment rate. (For example, if all 100 squares are yellow, there is 100% employment rate. If 90 squares are yellow and 10 squares are black, there is 90% employment rate and 10% unemployment rate). The grid of squares in each arc is colored differently to reflect the changing unemployment/employment rate year to year. 
- Poverty Percentage: The inner radial chart contains 7 grey arcs corresponding to the 7 years in the dataset. The size/height of each arc corresponds to the value of the poverty percentage for that year, with semicircular line axes providing a reference for the exact values being represented.
- Homelesness Counts: Each arc in the inner radial chart contains a sequence of (blue) symbols of people, with each symbol representing ~800 homeless. Therefore, the total number of symbols displayed in an arc indicates the total number of homeless counted in San Francisco that year. 

For clarity, a tooltip also appears when the user hovers over the outer radial chart to display the exact values for year, house price index, and unemployment rate for each arc. A tooltip also appears when the user hovers over the inner radial chart to display the exact values for year, poverty percentage, and homelessness counts for each arc. 
