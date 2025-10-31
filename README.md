# Time Curve
**node-red-contrib-time-curve**

This node takes timestamp input and outputs a percentage (float in the range 0.0 to 100.0 inclusive) based on the time of day of the timestamp.

This node functions as an analogoue time clock, e.g. a time-based dimmer. It is intentionally much simpler than TODO, since there are applications where more than a fade in and fade out per day is deried and where dependence on time of day is more important than dependence on the sun position. I specifically designed it to program the brightness of aquarium lamps. 

![Alt text](https://raw.githubusercontent.com/jcronq/node-red-contrib-spline-curve/master/images/ColorTemperature_practical.PNG)

You can move points directly in the graph by clicking and dragging, add new points by clicking anywhere on the graph where one does not already exist, and delete points by right clicking them.

Values between points are interpolated linearly, i.e. connected by a straight line. The last and first point are connected so that there is no jump at midnight.  

![Alt text](https://raw.githubusercontent.com/jcronq/node-red-contrib-spline-curve/master/images/sunsetCurve_edit.PNG)

