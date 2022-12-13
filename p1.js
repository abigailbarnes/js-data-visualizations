// p1.js: p1 main code
// Copyright (C)  2022 University of Chicago. All rights reserved.
/*
This is only for students and instructors in the 2022 CMSC 23900 ("DataVis") class, for use in that
class. It is not licensed for open-source or any other kind of re-distribution. Do not allow this
file to be copied or downloaded by anyone outside the 2022 DataVis class.
*/
/*
This is the ONLY file you modify for p1, and it the only file for which you should svn commit
modifications.  Do not "svn add" and "svn commit" any other files for the coding portion of hw1.
This file keeps to 100 columns, except for long URLs.

Finish the implementation of all the functions below that start with a "TODO" comment, which
describes what your code should do.  Follow all instructions. You may add new functions to this
file if that helps you get the work done.  As with hw1, you should only be adding code inside
regions delimited by "begin student code" and "end student code". For xScaleGen and yScaleGen, this
means you will be assigning to the "ret" local variable that is returned outside the student code
block.  For the other functions, you don't have to return anything, because the action of the
function is to modify the given "svg" object.  Use arrow functions in your method chains, instead
of anonymous "function"s.

You should read through index.html to understand the top-level structure of the page being viewed
in the web browser, and to see the NOTEs about grading.  You're welcome to read through util.js to
understand how data generation happens.

A reference rendered solution is given in p1-soln.html (an entirely static file). The prose
description of what each function is (we hope) a sufficient specification for you to replicate the
structures in p1-soln.html.  Still, you should double-check your work to ensure that it matches, in
appearance as well as DOM structure (including elements and attributes), p1-soln.html.  In
particular, for the last "slopes" function, you're asked to transform a horizontal line, centered
at the origin, into the rotated lines at different positions.  There are various ways of setting up
the locations and transforms to get the same final appearance, but the requested method is the most
general and the most numerically accurate.  It is also set up this way to give you experience with
a two part "transform" attribute, and how the order of operations works with those.

We expect you to add brief descriptive comments within the code you write.  Your goal in writing
comments should be to answer this: what is the most concise thing I can say, so that someone else
in the class can understand what this code is doing?  Comments are also a great way to show that
YOU are the thoughtful author of this code.  Grading will NOT involve seeing if you added the same
number of lines of code as in the reference code.
*/
/*
NOTE: Document here (after the "begin student code" line)
// v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
https://github.com/d3/d3/blob/main/API.md
http://www.d3noob.org
// ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code
anyone or anything extra you used for this work.  Besides your instructor and TA (and project
partner, if you partnered with someone) who else did you work with?  What other code or web pages
helped you understand what to do and how to do it?  It is not a problem to seek more help to do
this work!  This is just to help the instructor know about other useful resources, and to help the
graders understand sources of code similarities.
*/

'use strict';
// unlike hw1 you do need a network connection to work on p1
import * as d3 from "https://cdn.skypack.dev/d3@7";

// small utility functions
// basic 3-argument lerp
const lerp3 = (min, max, a) => (1 - a) * min + a * max;
// clamp value to interval [min,max]
const clamp = (min, value, max) =>
(value <= min
  ? min
  : (value >= max
    ? max
    : value));
/* q8hex() quantizes v in domain [0,1] to integer-valued range 0...255 and then convert to
2-character hexadecimal.

You can see examples of what q8hex does in the JavaScript console:
let p1 = await import('./p1.js');
p1.q8hex(0)
p1.q8hex(15/256)
p1.q8hex(255/256)
*/
export const q8hex = function (v) {
  let v8 = clamp(0, Math.round(lerp3(-0.5, 255.5, clamp(0, v, 1))), 255);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  return v8.toString(16).padStart(2, '0');
}

/* Maybe new helper functions of your own?  (the reference code doesn't use any) Give some comments
to explain the added value of whatever new functions you add here. */
// v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
// ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (0L in ref)

/* (TODO) xScaleGen returns a d3 scaleBand https://observablehq.com/@d3/d3-scaleband
https://github.com/d3/d3-scale/blob/master/README.md#scaleBand The scale domain is an array of the
d.cat values for all the d in the given "data" array. The padding, in the sense of
https://github.com/d3/d3-scale/blob/master/README.md#band_padding (or search for "Lastly,
band.padding" at https://observablehq.com/@d3/d3-scaleband ) should be "padby". */
export const xScaleGen = function (data, width, padby) {
  let ret = null;
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  ret = d3.scaleBand()
        .domain(data.map(d => d.cat))
        .range([0, width])
        .padding(padby);
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (4L in ref)
  return ret;
}

/* (TODO) yScaleGen returns a d3 scaleLinear https://observablehq.com/@d3/d3-scalelinear
https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear The scale domain is "dataRange",
and the scale range is between 0 and "height", but you have to account for how SVG coordinates have
y increasing downward, but conventions of data graphing have higher values going upward. */
export const yScaleGen = function (dataRange, height) {
  let ret = null;
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  ret = d3.scaleLinear()
        .domain(dataRange)
        .range([height, 0]);
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (3L in ref)
  return ret;
}

/* This is the one visualization that is done for you (feel free to copy whatever parts of it are
useful below). bars() adds (to the "svg" output of util.svgAppend) a bar chart visualizing the
given "data", made of svg "rect"s in class "bar".  The bar width is layout.xScale.bandwidth() and
the height is determined by layout.yScale. In SVG, the "x" and "y" attributes of a rect give its
upper-left corner, even though for this bar chart you might think it was more logical to think in
terms of the lower-left corner. */
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect
// https://observablehq.com/@d3/lets-make-a-bar-chart
// https://observablehq.com/@d3/lets-make-a-bar-chart/2?collection=@d3/lets-make-a-bar-chart
// https://observablehq.com/@d3/lets-make-a-bar-chart/3?collection=@d3/lets-make-a-bar-chart
// https://observablehq.com/@d3/lets-make-a-bar-chart/4?collection=@d3/lets-make-a-bar-chart
export const bars = function (svg, data, layout) {
  svg.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => layout.xScale(d.cat))
    .attr("width", layout.xScale.bandwidth())
    .attr("y", d => layout.yScale(d.val))
    .attr("height", d => layout.height - layout.yScale(d.val));
}

/* (TODO) dots makes a chart that visualizes "data" with svg "circle"s in class "dot", located at
the same place as the tops of the rectangles in the bar chart (above). The radius of the circles is
"radius" */
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle
export const dots = function (svg, data, layout, radius) {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  svg.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d=>layout.xScale(d.cat) + (layout.xScale.bandwidth()/2))
        .attr("cy", d=>layout.yScale(d.val))
        .attr("r", radius);
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (7L in ref)
}

/* (TODO) sticks visualizes "data" with svg "line"s in class "stick". The lines are horizontally
located at the centers of the bars in the bar chart, and have the same vertical extent as the bars.
*/
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line
export const sticks = function (svg, data, layout) {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  svg.selectAll(".stick")
        .data(data)
        .join("line")
        .attr("class", "stick")
        .attr("x1", d=>layout.xScale(d.cat)+(layout.xScale.bandwidth()/2))
        .attr("y1", layout.height)
        .attr("x2", d=>layout.xScale(d.cat)+(layout.xScale.bandwidth()/2))
        .attr("y2", d=>layout.yScale(d.val));
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (8L in ref)
}

/* (TODO) outlineCircles visualizes "data" with svg "circle"s in class "outlineCircle", with
constant radius but varying stroke thickness. The circles are horizontally located the same as all
the previous marks, at vertical position y = layout.xScale.bandwidth()/2. As the data values go
from dataRange[0] to dataRange[1] the circle goes from having zero stroke width (via the
"stroke-width" attribute), to becoming a complete circle of radius layout.xScale.bandwidth()/2
(because the stroke became so fat that it completely covered the interior of the circle). Use a
(local) const d3.scaleLinear to parameterize the stroke width. */
export const outlineCircles = function (svg, data, dataRange, layout) {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  const outline = d3.scaleLinear()
        .domain([dataRange[0], dataRange[1]])
        .range([0, layout.xScale.bandwidth()/2]);
  svg.selectAll(".outlineCircle")
        .data(data)
        .join("circle")
        .attr("class", "outlineCircle")
        .attr("cx", d=>layout.xScale(d.cat)+(layout.xScale.bandwidth()/2))
        .attr("cy", layout.xScale.bandwidth()/2)
        .attr("r", layout.xScale.bandwidth()/4)
        .attr("stroke-width", d => outline(d.val));
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (12L in ref)
}

/* (TODO) sizedCircles visualizes "data" with svg "circle"s in class "sizedCircle". The circles are
located at the same place as in outlineCircles. As the data values go from dataRange[0] to
dataRange[1] the circle goes from having radius 0 to having radius layout.xScale.bandwidth()/2].
Use a (local) const d3.scaleLinear to parameterize the radius. */
export const sizedCircles = function (svg, data, dataRange, layout) {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  const circumfrance = d3.scaleLinear()
        .domain([dataRange[0], dataRange[1]])
        .range([0, layout.xScale.bandwidth()/2]);
    svg.selectAll(".sizedCircle")
        .data(data)
        .join("circle")
        .attr("class", "sizedCircle")
        .attr("cx", d=>layout.xScale(d.cat)+(layout.xScale.bandwidth()/2))
        .attr("cy", layout.xScale.bandwidth() / 2)
        .attr("r", d=>circumfrance(d.val));
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (11L in ref)
}

/* (TODO) roundRects visualizes "data" with svg "rect"s (rectangles) in class "roundRect", with the
corners rounded. The "width" and "height" attributes of the rectangles should be equal (to make
squares), and equal to layout.xScale.bandwidth().  The squares should (like other marks in other
parts of this p1) be centered over the horizontal tickmarks. As the data values go from their min
to their max value, the corner rounding should create a range of shapes, from a circle (with the
"rx" and "ry" attributes of "rect" equal to layout.xScale.bandwidth()/2) to a square (with "rx" ==
"ry" == 0). Use a (local) const d3.scaleLinear to parameterize the rounding. */
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect
export const roundRects = function (svg, data, dataRange, layout) {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  const rounding = d3.scaleLinear()
        .domain([dataRange[0], dataRange[1]])
        .range([layout.xScale.bandwidth()/2, 0]);
  svg.selectAll(".roundRect")
        .data(data)
        .join("rect")
        .attr("class", "roundRect")
        .attr("x", d=>layout.xScale(d.cat))
        .attr("y", d=>layout.yScale(d.cat))
        .attr("width", layout.xScale.bandwidth())
        .attr("height", layout.xScale.bandwidth())
        .attr("rx", d => rounding(d.val));
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (14L in ref)
}

/* (TODO) coloredCircles visualizes "data" with svg "circle"s in class "coloredCircle". The circles
   are located at the same place as in outlineCircles, and all have radius
   layout.xScale.bandwidth()/2. As the data values go from dataRange[0] to dataRange[1], the fill
   color of the circle should go from #00ff00 (green) to #ff00ff (a magenta, with red and blue all
   the way on, green off).  These hexadecimal #RRGGBB strings are the most basic kind of color
   specification in HTML.

   A d3.scaleLinear is a powerful enough multi-purpose function that you can give it #RRGGBB colors
   in its .domain(), and it will interpolate between them to produce other #RRGGBB colors. Just for
   this assignment, however, in order to highlight this convenience, you are asked to do the color
   interpolation yourself. Thus, you should use the given d3.scaleLinear "ramp" to map from
   dataRange to [0,1], that is the ONLY d3.scaleLinear your code should use. So, as d.val varies
   within dataRange, ramp(d.dval) varies within [0,1], and the floating point R, G, B values should
   also vary within [0,1] (or [1,0]?), and q8hex (see its definition above) will produce
   two-character hex strings from "00" to "ff". You get a "#RRGGBB" hex color by concatenating "#"
   with three (q8hex-generated) 2-character hex codes (such as with a template literal).
   */
export const coloredCircles = function (svg, data, dataRange, layout) {
  const ramp = d3.scaleLinear()
    .range([0, 1])
    .domain(dataRange);
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  const color_change = d3.scaleLinear()
        .domain([dataRange[0], dataRange[1]])
        .range([0, 1]);
    svg.selectAll(".coloredCircle")
        .data(data)
        .join("circle")
        .attr("class", "coloredCircle")
        .attr("cx", d=>layout.xScale(d.cat)+(layout.xScale.bandwidth()/2))
        .attr("cy", layout.xScale.bandwidth()/2)
        .attr("r", d=>layout.xScale.bandwidth()/2)
        .attr("fill", d=>"#"
            +q8hex(color_change(d.val))
            +q8hex(1-color_change(d.val))
            +q8hex(color_change(d.val)));
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (9L in ref)
}

/* (TODO) slopes visualizes "data" with svg "g"s in class "slope", which in turn contains an svg
   "line" that is rotated. As the data values go from dataRange[0] to dataRange[1], the line is
   rotated counter-clockwise from 0 to 90 degrees.  The lines are centered at the same centers as
   the circles above. Use d3 to change the "transform" attribute of the "g" (hint: translate, then
   rotate) in order to make this data-driven; the _untransformed_ line should just be a horizontal
   line, length layout.xScale.bandwidth(), centered on the origin.
   https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g
   https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
   https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate
   https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#rotate
   */
export const slopes = function (svg, data, dataRange, layout) {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code
  const tilt = d3.scaleLinear()
        .domain([dataRange[0], dataRange[1]])
        .range([0, 90]);
    svg.selectAll(".slope")
        .data(data)
        .join("g")
        .attr('class', 'slope')
        .attr("transform", d=> 
        "translate("+(layout.xScale(d.cat)+(layout.xScale.bandwidth()/2))+","+(layout.xScale.bandwidth()/2)+") " 
        + "rotate("+-1*tilt(d.val)+")")
        .call(g => g.append("line")
        .attr("x1", d=>-(layout.xScale.bandwidth()/2))
        .attr("y1", 0)
        .attr("x2", d=>(layout.xScale.bandwidth()/2))
        .attr("y2", 0)
        );
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (15L in ref)
}
